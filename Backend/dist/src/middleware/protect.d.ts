import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
declare global {
    namespace Express {
        interface Request {
            user: {
                id: number;
            };
        }
    }
}
export declare const protect: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=protect.d.ts.map