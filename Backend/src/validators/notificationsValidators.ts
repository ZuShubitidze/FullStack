import { z } from "zod";

export const markAsReadSchema = z.object({
  notificationId: z.number(),
});

export type markAsReadInput = z.infer<typeof markAsReadSchema>;
