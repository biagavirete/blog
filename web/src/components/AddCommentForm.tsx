import axios from "axios";
import React, { FormEvent, useState } from "react";
import { ArticleInformation } from "../types/types";

interface Props {
  articleName: string;
  onArticleUpdated: React.Dispatch<React.SetStateAction<ArticleInformation>>;
}

const AddCommentForm = ({ articleName, onArticleUpdated }: Props) => {
  const [name, setName] = useState('');
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const response = await axios.post(`/api/articles/${articleName}/comments`, {
      postedBy: name,
      text: commentText,
    });
    const updatedArticle = response.data;
    onArticleUpdated(updatedArticle);
    setName('');
    setCommentText('');
  };


  return (
    <div id="add-comment-form">
      <h3>Add a comment</h3>
      <label htmlFor="name">Name:</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
        name="name"
      />
      <label htmlFor="comment">Comment:</label>
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