import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export const validate =
  (schema: z.ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Only validate the body here to keep it simple
      const validatedBody = await schema.parseAsync(req.body);
      req.body = validatedBody;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.flatten().fieldErrors });
      }
      next(error);
    }

    // const result = schema.safeParse(req.body);
    // if (!result.success) {
    //   return res
    //     .status(400)
    //     .json({ errors: result.error.flatten().fieldErrors });
    // }
    // req.body = result.data; // Pass the cleaned/formatted data to the next step
    // next();
  };

export const validateQuery =
  (schema: z.ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate and transform req.query
      req.query = (await schema.parseAsync(req.query)) as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.flatten().fieldErrors });
      }
      next(error);
    }
  };

export const validateParams =
  (schema: z.ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Convert "123" into 123
      req.params = (await schema.parseAsync(req.params)) as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.flatten().fieldErrors });
      }
      next(error);
    }
  };
