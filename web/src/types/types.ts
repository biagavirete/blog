export interface Comment {
  postedBy: string;
  text: string;
}

export interface ArticleInformation {
  upvotes: number;
  comments: Comment[];
  canUpvote: boolean;
}

export interface Article {
  name: string;
  title: string;
  content: string[];
}
