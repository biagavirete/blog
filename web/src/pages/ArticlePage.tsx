import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddCommentForm from "../components/AddCommentForm";
import CommentsList from "../components/CommentsList";
import { ArticleInformation } from "../types/types";
import articles from "./article-content";
import NotFoundPage from "./NotFoundPage";

const ArticlePage = () => {
  const [articleInfo, setArticleInfo] = useState<ArticleInformation>({ upvotes: 0, comments: [] });
  const { articleId } = useParams();

  console.log({ articleInfo });
  useEffect(() => {
    const getArticleInfo = async () => {
      try {
        const response = await axios.get(`/api/articles/${articleId}`);
        const articleInfo = response.data;
        setArticleInfo(articleInfo);
      } catch (err) {
        console.log(err);
      }
    };

    getArticleInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const article = articles.find(article => article.name === articleId);

  const addUpvote = async () => {
    const response = await axios.put(`/api/articles/${articleId}/upvote`);
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
        <button onClick={addUpvote}>Upvote</button>
        <p>This articles has {articleInfo.upvotes} upvotes.</p>
      </div>
      {article?.content.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      <AddCommentForm articleName={article.name} onArticleUpdated={setArticleInfo} />
      <CommentsList comments={articleInfo.comments} />
    </>
  );
};

export default ArticlePage;