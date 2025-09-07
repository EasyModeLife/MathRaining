<script lang="ts">
  import { onMount, afterUpdate, createEventDispatcher, onDestroy } from 'svelte';
  import { tick } from 'svelte';

  export let expr: string = '';
  export let display: boolean = false;
  export let prerender: boolean = true; // Enable SSR by default
  export let throwOnError: boolean = false;

  let el: HTMLSpanElement;
  let katex: any;
  let isPrerendered = false;
  let hasRendered = false;
  let currentExpr = '';

  const dispatch = createEventDispatcher();

  // ========================================
  // SSR (Server-Side Rendering) Logic
  // ========================================
  async function loadFromSSR(): Promise<boolean> {
    if (!prerender || !el || hasRendered) return false;

    try {
      const fontSize = '1.2'; // Default font size
      const response = await fetch(
        `/latex-render?expr=${encodeURIComponent(expr)}&display=${display}&size=${fontSize}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'text/html',
            'Cache': 'force-cache'
          }
        }
      );

      if (response.ok && response.headers.get('X-Prerendered') === 'true') {
        const html = await response.text();

        if (html && html.includes('katex-ssr')) {
          el.innerHTML = html;
          isPrerendered = true;
          currentExpr = expr;

          // Apply minimal CSS for prerendered content
          applyPrerenderedStyles();
          dispatch('rendered', { method: 'ssr', success: true });
          return true;
        }
      }
    } catch (e) {
      console.warn('[MathRenderer] SSR failed, falling back to client:', e);
    }

    return false;
  }

  // ========================================
  // Client-Side Rendering Logic
  // ========================================
  async function loadClientSide(): Promise<void> {
    if (!el || isPrerendered) return;

    try {
      // Load KaTeX lazily only when needed
      if (!katex) {
        const m = await import('katex');
        await import('katex/dist/katex.min.css');
        katex = m.default ?? m;
      }

      // Clear any previous SSR content
      el.innerHTML = '';

      // Render with KaTeX client-side
      katex.render(expr, el, {
        displayMode: display,
        throwOnError: false,
        errorColor: '#ff6b6b'
      });

      currentExpr = expr;
      dispatch('rendered', { method: 'client', success: true });

    } catch (e) {
      console.error('[MathRenderer] Client-side KaTeX failed:', e);

      // Ultimate fallback: plain text
      if (el) {
        el.innerHTML = `<span style="color: #ff6b6b; font-family: monospace;">${expr}</span>`;
      }

      dispatch('rendered', { method: 'fallback', success: false, error: e instanceof Error ? e.message : String(e) });
    }
  }

  // ========================================
  // Styles and Utilities
  // ========================================
  function applyPrerenderedStyles(): void {
    if (!el) return;

    // Ensure prerendered KaTeX has proper styling
    const style = document.createElement('style');
    style.textContent = `
      .katex-ssr .katex {
        color: var(--text, #000);
        font-size: 1em;
        margin: 0;
      }
      .katex-ssr .katex-display {
        margin: 0;
      }
      .katex-ssr.katex-size-12 { font-size: 1.2em; }
      .katex-ssr.katex-size-15 { font-size: 1.5em; }
      .katex-error {
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 4px;
        padding: 4px 8px;
        color: #dc2626;
        font-family: monospace;
        font-size: 0.9em;
      }
    `;

    // Remove any existing styles and add new one
    const existing = el.querySelector('style[data-katex-ssr]');
    if (existing) existing.remove();
    style.setAttribute('data-katex-ssr', 'true');
    el.appendChild(style);
  }

  // ========================================
  // Main Rendering Pipeline
  // ========================================
  async function render(): Promise<void> {
    if (!el || hasRendered && currentExpr === expr) return;

    // Step 1: Try SSR first (if enabled and not previously failed)
    if (prerender) {
      if (await loadFromSSR()) return; // Success!
    }

    // Step 2: If SSR fails, use client-side rendering
    await loadClientSide();
  }

  // ========================================
  // Lifecycle Management
  // ========================================
  onMount(async () => {
    // Delay initial render to allow component mounting
    await tick();
    await render();
    hasRendered = true;
  });

  afterUpdate(async () => {
    if (expr !== currentExpr) {
      await render();
    }
  });

  onDestroy(() => {
    // Cleanup any attached styles
    if (el) {
      const styles = el.querySelectorAll('style[data-katex-ssr]');
      styles.forEach(style => style.remove());
    }
  });
</script>

<span bind:this={el} class="math-render"></span>

<style>
  .math-render {
    display: inline-block;
    color: var(--text);
    max-width: 100%;
    min-height: 1em; /* Prevent layout shift */
  }

  /* SSR Styles */
  :global(.katex-ssr .katex) {
    color: var(--text);
    font-size: inherit;
    margin: 0;
  }
  :global(.katex-ssr .katex-display) {
    margin: 0;
    color: var(--text);
  }
  :global(.katex-ssr.katex-size-12) { font-size: 1.2em; }
  :global(.katex-ssr.katex-size-15) { font-size: 1.5em; }

  /* Client-side KaTeX styles */
  :global(.katex) { color: var(--text); }
  :global(.katex-display) { margin: 0; color: var(--text); }
  :global(.katex .delimsizing, .katex .mopen, .katex .mclose) { overflow: visible; }
  :global(.katex .sizing, .katex .op-symbol, .katex .mord) { overflow: visible; }

  /* Error/Fallback styles */
  :global(.katex-error) {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 4px;
    padding: 4px 8px;
    color: #dc2626;
    font-family: monospace;
    font-size: 0.9em;
    white-space: nowrap;
  }

  /* Loading state */
  :global(.math-render[aria-busy="true"]) {
    opacity: 0.7;
    min-height: 1.2em;
  }
</style>
