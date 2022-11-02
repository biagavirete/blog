import axios from "axios";
import React, { FormEvent, useState } from "react";
import { useUser } from "../hooks/useUser";
import { ArticleInformation } from "../types/types";

interface Props {
  articleName: string;
  onArticleUpdated: React.Dispatch<React.SetStateAction<ArticleInformation>>;
}

const AddCommentForm = ({ articleName, onArticleUpdated }: Props) => {
  const [name, setName] = useState('');
  const [commentText, setCommentText] = useState('');

  const { user } = useUser();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const token = user && await user.getIdToken();
    const headers = token ? { authToken: token } : {};
    const response = await axios.post(`/api/articles/${articleName}/comments`, {
      postedBy: name,
      text: commentText,
    }, { headers });
    const updatedArticle = response.data;
    onArticleUpdated(updatedArticle);
    setName('');
    setCommentText('');
  };


  return (
    <div id="add-comment-form">
      <h3>Add a comment</h3>
      {user && <p>You are posting as {user.email}</p>}
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        name="comment"
        cols={50}
        rows={4} />
      <button onClick={handleSubmit} type="submit">Add comment</button>
    </div>
  );
};

export default AddCommentForm;