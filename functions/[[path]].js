export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Si la ruta no es un archivo estático, servir index.html
  if (!url.pathname.includes('.')) {
    const page = await next();
    if (page.status === 404) {
      return new Response(await fetch(new URL('/index.html', request.url)), {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    return page;
  }

  return next();
}
