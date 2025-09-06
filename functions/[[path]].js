export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Si la ruta no es un archivo estático, intentar servir index.html
  if (!url.pathname.includes('.')) {
    const page = await next();

    // Si es 404, servir index.html
    if (page.status === 404) {
      try {
        // Fetch del index.html
        const indexResponse = await fetch(new URL('/index.html', request.url));

        if (indexResponse.ok) {
          const indexContent = await indexResponse.text();
          return new Response(indexContent, {
            status: 200,
            headers: {
              'Content-Type': 'text/html',
              ...Object.fromEntries(indexResponse.headers.entries())
            }
          });
        }
      } catch (error) {
        console.error('Error fetching index.html:', error);
      }
    }

    return page;
  }

  return next();
}
