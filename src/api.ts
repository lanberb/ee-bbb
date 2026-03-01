export function handleApiRequest(url: URL): Response {
  const path = url.pathname.replace(/^\/api/, "");

  if (path === "/blogs") {
    return getBlogList();
  }

  return new Response("Not Found", { status: 404 });
}

function getBlogList(): Response {
  // TODO: import.meta.globでmdファイルを読み、frontmatterをパースして返す
  return Response.json([]);
}
