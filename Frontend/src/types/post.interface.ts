import type { User } from "./user.interface";

export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
  author: User;
  comments: Comment[];
  Image?: string;
}

export interface Comment {
  id: number;
  comment: string;
  authorId: number;
  parentId?: number | null;
  postId: number;
  author: User;
  replies?: Comment[];
}
