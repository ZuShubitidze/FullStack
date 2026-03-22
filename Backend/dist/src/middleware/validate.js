import { z } from "zod";
export const validate = (schema) => async (req, res, next) => {
    try {
        // Only validate the body here to keep it simple
        const validatedBody = await schema.parseAsync(req.body);
        req.body = validatedBody;
        next();
    }
    catch (error) {
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
//# sourceMappingURL=validate.js.map