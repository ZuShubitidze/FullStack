import type { Request, Response } from "express";
declare global {
    namespace Express {
        interface Request {
            user: {
                id: number;
            };
        }
    }
}
declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const logout: (req: Request, res: Response) => Promise<void>;
declare const getMe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const refresh: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const updateProfilePicture: (req: Request, res: Response) => Promise<void>;
export { register, login, logout, getMe, refresh, updateProfilePicture };
//# sourceMappingURL=authControllers.d.ts.map