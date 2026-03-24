import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Must be at least 2 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please provide a valid email")
    .toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please provide a valid email")
    .toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const UpdateProfileSchema = z.object({
  userId: z.string().min(1),
  imageUrl: z.string().url().startsWith("https://").optional().nullable(),
});

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please provide a valid email")
    .toLowerCase(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

// 2. Wrap them for your middleware (which expects { body, query, params })
// export const registerSchema = z.object({
//   body: registerBody,
// });

// export const loginSchema = z.object({
//   body: loginBody,
// });

// 3. Export Types for use in your Controllers

// export { registerSchema, loginSchema };
