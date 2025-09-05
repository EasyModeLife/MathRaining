<script lang="ts">
  import { onMount, afterUpdate } from 'svelte';
  export let expr: string = '';
  export let display: boolean = false;
  export let throwOnError: boolean = false;
  let el: HTMLSpanElement;
  let katex: any;

  function render() {
    if (!el) return;
    try {
      if (!katex) return; // aún no cargado
      katex.render(expr || '', el, { displayMode: display, throwOnError });
    } catch (e) {
      // Fallback to text if render fails
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
  .math-render { display: inline-block; color: var(--text); }
  :global(.katex) { color: var(--text); }
  :global(.katex-display) { margin: 0; color: var(--text); }
</style>
