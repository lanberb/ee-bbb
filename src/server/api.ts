import { handleRequestListBlog } from "./handler";

export const createApiResponse = (req: Request): Response => {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api/, "");

  if (path === "/blogs") {
    return handleRequestListBlog(req);
  }

  return new Response("Not Found", { status: 404 });
};
