import fs from 'fs';
import admin from 'firebase-admin';
import express, { Request, Response } from 'express';
import { connectToDb, db } from './db';


interface Comment {
  postedBy: string;
  text: string;
}

interface Article {
  name: string;
  upvotes: number;
  comments: Comment[];
  upvoteIds: string[];
  canUpvote: boolean;
}

export interface UserRequest extends Request {
  user?: any;
}

const credentials = JSON.parse(
  fs.readFileSync('./credentials.json', 'utf-8')
);

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const app = express();
app.use(express.json());

app.use(async (request: UserRequest, response, next) => {
  const { authToken } = request.headers;

  if (authToken) {
    try {
      request.user = await admin.auth().verifyIdToken(String(authToken));
    } catch {
      return response.sendStatus(400);
    }
  }

  request.user = request.user || {};

  next();
});

app.get('/api/articles/:name', async (request: UserRequest, response: Response) => {
  const { name } = request.params;
  const { uid } = request.user;

  const article = await db.collection('articles').findOne({ name }) as unknown as Article;

  if (article) {
    const upvoteIds = article.upvoteIds || [];
    article.canUpvote = uid && !upvoteIds.includes(uid);
    response.json(article);
  } else {
    response.sendStatus(404);
  }
});

app.use((request: UserRequest, response, next) => {
  if (request.user) {
    next();
  } else {
    response.sendStatus(401);
  }
});

app.put('/api/articles/:name/upvote', async (request: UserRequest, response: Response) => {
  const { name } = request.params;
  const { uid } = request.user;

  const article: Article = await db.collection('articles').findOne({ name }) as unknown as Article;

  if (article) {
    const upvoteIds = article.upvoteIds || [];
    const canUpvote = uid && !upvoteIds.includes(uid);

    if (canUpvote) {
      await db.collection('articles').updateOne({ name }, {
        $inc: { upvotes: 1 },
        $push: { upvoteIds: uid }
      });
    }
    const updatedArticle: Article = await db.collection('articles').findOne({ name }) as unknown as Article;
    response.json(updatedArticle);
  } else {
    response.send('That article does not exist.');
  }
});

app.post('/api/articles/:name/comments', async (request: UserRequest, response: Response) => {
  const { name } = request.params;
  const { text } = request.body;
  const { email } = request.user;

  await db.collection('articles').updateOne({ name }, {
    $push: { comments: { postedBy: email, text } },
  });

  const article = await db.collection('articles').findOne({ name });
  if (article) {
    response.json(article);
  } else {
    response.send('That article doesn\'t exist.');
  };
});

connectToDb(() => {
  console.log('Successfully connected to database');
  app.listen(8000, () => {
    console.log('Server is listening on port 8000');
  });
});
