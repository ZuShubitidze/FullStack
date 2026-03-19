export interface Notification {
  createdAt: string;
  id: number;
  isRead: boolean;
  message: string;
  postId: number;
  type: string;
  userId: number;
}
