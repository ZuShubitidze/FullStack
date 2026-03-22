import type { Request, Response } from "express";
declare const createPost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const fetchPosts: (req: Request, res: Response) => Promise<void>;
declare const getInfinitePosts: (req: Request, res: Response) => Promise<void>;
declare const updatePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const fetchPost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const deletePost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export { createPost, fetchPosts, updatePost, fetchPost, getInfinitePosts, deletePost, };
//# sourceMappingURL=postController.d.ts.map