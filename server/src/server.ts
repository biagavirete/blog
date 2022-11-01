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
}

const app = express();
app.use(express.json());

app.get('/api/articles', async (request: Request, response: Response) => {

  const articles = await db.collection('articles').find() as unknown as Article[];

  if (articles.length > 0) {
    response.json(articles);
  } else {
    response.send('No articles found');
  }
});

app.get('/api/articles/:name', async (request: Request, response: Response) => {
  const { name } = request.params;

  const article = await db.collection('articles').findOne({ name }) as unknown as Article;

  if (article) {
    response.json(article);
  } else {
    response.sendStatus(404);
  }
});

app.put('/api/articles/:name/upvote', async (request: Request, response: Response) => {
  const { name } = request.params;

  await db.collection('articles').updateOne({ name }, {
    $inc: { upvotes: 1 },
  });

  const article = await db.collection('articles').findOne({ name });

  if (article) {
    response.json(article);
  } else {
    response.send('That article does not exist.');
  }
});

app.post('/api/articles/:name/comments', async (request: Request, response: Response) => {
  const { name } = request.params;
  const { postedBy, text } = request.body;

  await db.collection('articles').updateOne({ name }, {
    $push: { comments: { postedBy, text } },
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
