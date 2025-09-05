<script lang="ts">
  import { onMount, afterUpdate, createEventDispatcher } from 'svelte';
  export let expr: string = '';
  export let display: boolean = false;
  export let throwOnError: boolean = false;
  let el: HTMLSpanElement;
  let katex: any;
  const dispatch = createEventDispatcher();

  function render() {
    if (!el) return;
    try {
      if (!katex) return; // aún no cargado
      katex.render(expr || '', el, { displayMode: display, throwOnError });
      dispatch('rendered');
    } catch (e) {
      // Fallback to text if render fails
      console.error('[MathRenderer] KaTeX render failed:', e);
      el.textContent = expr;
    }
  }

  onMount(async () => {
    try {
      const m = await import('katex');
      await import('katex/dist/katex.min.css');
      katex = m.default ?? m;
      render();
    } catch (e) {
      // Si KaTeX falla al cargar, degradamos a texto
      console.warn('KaTeX no pudo cargarse:', e);
      render();
    }
  });
  afterUpdate(render);
</script>

<span bind:this={el} class="math-render"></span>

<style>
  .math-render { display: inline-block; color: var(--text); max-width: 100%; }
  :global(.katex) { color: var(--text); }
  :global(.katex-display) { margin: 0; color: var(--text); }
  /* Evitar cortes en delimitadores escalados */
  :global(.katex .delimsizing, .katex .mopen, .katex .mclose) { overflow: visible; }
  :global(.katex .sizing, .katex .op-symbol, .katex .mord) { overflow: visible; }
</style>
