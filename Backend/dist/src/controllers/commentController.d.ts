import type { Request, Response } from "express";
declare const createComment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const updateComment: (req: Request, res: Response) => Promise<void>;
export { createComment, updateComment };
//# sourceMappingURL=commentController.d.ts.map