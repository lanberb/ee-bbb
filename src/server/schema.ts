import { z } from "zod";

export const GetBlogResponse = z.object({
  id: z.string(),
  title: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string(),
  content: z.string(),
});
export type TypeGetBlogResponse = z.infer<typeof GetBlogResponse>;

export const ListBlogResponse = z.object({
  blogs: GetBlogResponse.omit({ content: true }).array(),
});
export type TypeListBlogResponse = z.infer<typeof ListBlogResponse>;
