import { z } from "zod";

export const PostSchema = z.object({
  id: z.string(),
  userId: z.string(),
  author: z.string(),
  description: z.string().min(1, "Post description is required"),
  mediaUrl: z.string().optional(),
  totalLikes: z.number().default(0),
  likedBy: z.array(z.string()).default([]),
  createdAt: z.date(),
  subscriptionStatus: z.enum(["pending", "approved", "rejected"]).optional(),
  comments: z
    .array(
      z.object({
        id: z.string(),
        userId: z.string(),
        author: z.string(),
        content: z.string(),
        createdAt: z.date(),
      })
    )
    .default([]),
});

export type Post = z.infer<typeof PostSchema>;

export type CreatePostInput = Omit<
  Post,
  "id" | "totalLikes" | "likedBy" | "comments" | "createdAt"
>;
export type UpdatePostInput = Partial<Omit<Post, "id" | "createdAt">>;
