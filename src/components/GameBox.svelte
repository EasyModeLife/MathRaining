<script lang="ts">
  export let title: string | undefined = undefined;
  export let area: 'problem' | 'image' | 'answer' | 'footer' | string = 'problem';
</script>

<div class="game-box" data-area={area}>
  {#if title}
    <div class="box-title">{title}</div>
  {/if}
  <div class="box-content">
    <slot></slot>
  </div>
</div>

<style>
  .game-box {
    border-radius: 20px;
    padding: 0.75rem 1rem;
    background: linear-gradient(160deg, var(--surface, #0d1117), var(--surface-alt, #161b22));
    border: 1px solid var(--border, #2c313a);
    box-shadow: 0 8px 28px -12px rgba(0,0,0,.45);
    color: var(--text, #e6edf3);
    min-height: 0; /* importante para grid */
  }
  .box-title {
    font-weight: 700;
    font-size: clamp(0.9rem, 2.2vw, 1.1rem);
    opacity: .85;
    margin-bottom: .5rem;
    letter-spacing: .3px;
  }
  .box-content{
    min-height: 0;
  }
</style>
