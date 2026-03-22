import { z } from "zod";
import type { Request, Response, NextFunction } from "express";
export declare const validate: (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=validate.d.ts.map