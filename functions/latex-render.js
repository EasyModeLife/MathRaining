// ==========================================
// 🎨 KaTeX Server-Side Rendering Function
// CloudFlare Edge Function for prerendering LaTeX
// ==========================================

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // Get LaTeX expression from query params
  const expr = url.searchParams.get('expr');
  const display = url.searchParams.get('display') === 'true';
  const fontSize = url.searchParams.get('size') || '1.2';
  const cacheKey = `katex:${expr}:${display}:${fontSize}`;

  // Validation
  if (!expr) {
    return new Response('Missing LaTeX expression parameter', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // Sanitize expression (basic XSS prevention)
  const sanitizedExpr = expr.trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .slice(0, 1000); // Limit length

  if (sanitizedExpr !== expr) {
    return new Response('Invalid LaTeX expression', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  try {
    // Dynamic import of KaTeX (ES modules compatibility)
    const katex = await import('katex');

    // Render options for optimal performance and security
    const renderOptions = {
      displayMode: display,
      throwOnError: false,
      errorColor: '#ff6b6b',
      strict: 'ignore',
      trust: false,
      output: 'mathml',
      macros: {
        // Common mathematical macros
        "\\RR": "\\mathbb{R}",
        "\\NN": "\\mathbb{N}",
        "\\ZZ": "\\mathbb{Z}",
        "\\QQ": "\\mathbb{Q}",
        "\\CC": "\\mathbb{C}",
        "\\FF": "\\mathbb{F}",
        "\\PP": "\\mathbb{P}",
        "\\EE": "\\mathbb{E}",
        "\\dd": "\\mathrm{d}",
        "\\ee": "\\mathrm{e}",
        "\\ii": "\\mathrm{i}",
        "\\oo": "\\infty"
      }
    };

    // Render LaTeX to HTML string
    const html = katex.renderToString(sanitizedExpr, renderOptions);

    // Return prerendered HTML with metadata
    const responseHtml = `<span class="katex-ssr katex-size-${fontSize.replace('.', '')}"
      style="font-size: ${fontSize}em; display: inline-block;"
      data-expr="${sanitizedExpr}"
      data-display="${display}">${html}</span>`;

    return new Response(responseHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200', // CDN + browser cache
        'X-Prerendered': 'true',
        'X-Katex-Version': katex.version || 'latest',
        'X-SSR-Source': 'cloudflare-edge',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Max-Age': '86400'
      }
    });

  } catch (error) {
    console.error('[KatexSSR] Render error:', error);

    // Comprehensive error handling with fallback
    const errorResponse = `<span class="katex-error"
      style="color: #ff6b6b; font-family: monospace; padding: 4px 8px; border: 1px solid #fee; border-radius: 3px; background: #fef2f2;"
      title="LaTeX render failed">${sanitizedExpr}</span>`;

    return new Response(errorResponse, {
      status: 500,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Ssr-Failed': 'true',
        'X-Error-Type': 'render-error',
        'Cache-Control': 'no-cache'
      }
    });
  }
}

// Handle OPTIONS for CORS preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}
