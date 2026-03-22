import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validate =
  (schema: z.ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // Only validate the body here to keep it simple
    const validatedBody = await schema.parseAsync(req.body);
    req.body = validatedBody;
    next();
  };

export const validateQuery =
  (schema: z.ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = await schema.parseAsync(req.query);
    Object.assign(req.query, validatedData);

    next();
  };

export const validateParams =
  (schema: z.ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // Convert "123" into 123
    req.params = (await schema.parseAsync(req.params)) as any;
    next();
  };
