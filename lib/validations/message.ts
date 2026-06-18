import { z } from "zod";

export const messageSchema = z.object({
  sender_name: z.string().min(1, "Name is required"),
  sender_company: z.string().optional(),
  content: z.string().min(1, "Message is required"),
  target_user_id: z.string(),
});

export type MessageInput = z.infer<typeof messageSchema>;
