import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddCommentForm from "../components/AddCommentForm";
import CommentsList from "../components/CommentsList";
import { useUser } from "../hooks/useUser";
import { ArticleInformation } from "../types/types";
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";

const ArticlePage = () => {
  const [articleInfo, setArticleInfo] = useState<ArticleInformation>({
    upvotes: 0,
    comments: [],
    canUpvote: false
  });
  const { articleId } = useParams();

  const { isLoading, user } = useUser();

  useEffect(() => {
    const getArticleInfo = async () => {
      const token = user && await user.getIdToken();
      const headers = token ? { authToken: token } : {};
      try {
        const response = await axios.get(`/api/articles/${articleId}`, {
          headers
        });
        const articleInfo = response.data;
        setArticleInfo(articleInfo);
      } catch (err) {
        console.log(err);
      }
    };

    if (!isLoading) {
      getArticleInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading]);

  const article = articles.find(article => article.name === articleId);

  const addUpvote = async () => {
    const token = user && await user.getIdToken();
    const headers = token ? { authToken: token } : {};
    const response = await axios.put(`/api/articles/${articleId}/upvote`, null, { headers });
    const updatedArticle = response.data;
    setArticleInfo(updatedArticle);
  };

  if (!article) {
    return <NotFoundPage />;
  }

  return (
    <>
      <h1>{article?.title}</h1>
      <div className="upvotes-section">
        {user
          ?
          <button onClick={addUpvote}>
            {articleInfo.canUpvote ? 'Upvote' : 'Already upvoted'}
          </button>
          : <button>Login to upvote</button>}
        <p>This articles has {articleInfo.upvotes} upvotes.</p>
      </div>
      {article?.content.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      {user ? <AddCommentForm articleName={article.name} onArticleUpdated={setArticleInfo} /> : <button>Login to add a comment</button>}
      <CommentsList comments={articleInfo.comments} />
    </>
  );
};

export default ArticlePage;