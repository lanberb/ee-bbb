import { type BlogMeta, BlogMetaSchema } from "../schema/blog";

export const handleRequestListBlog = (_req: Request): Response => {
  const blogModules = import.meta.glob<{ meta: BlogMeta }>("../../docs/blog/*.mdx", { eager: true });

  const blogs = Object.entries(blogModules)
    .map(([path, blog]) => {
      const id = path.replace("../../docs/blog/", "").replace(".mdx", "");
      return BlogMetaSchema.parse({
        id,
        title: blog.meta.title,
        publishedAt: blog.meta.publishedAt,
        updatedAt: blog.meta.updatedAt,
      });
    })
    .sort((a, b) => {
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    });

  return Response.json(blogs);
};
