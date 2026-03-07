import { z } from "zod";

export const BlogMetaSchema = z.object({
  id: z.string(),
  title: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string(),
});

export type BlogMeta = z.infer<typeof BlogMetaSchema>;
