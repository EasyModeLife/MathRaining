<script lang="ts">
  import { onMount } from 'svelte';

  export let currentPath = '/';
  export let goHome: () => void;
  export let cycleTheme: () => void;
  export let HEADER_PCT: number;
</script>

<header class="page-header">
  <div class="header-box">
    <div class="brand">
      {#if currentPath !== '/'}
        <button class="back" on:click={goHome} aria-label="Volver">⟵</button>
      {/if}
      <h1 class="title">The Math Games</h1>
      <small class="view-indicator" aria-live="polite">{currentPath}</small>
    </div>
    <nav class="nav">
      <button class="action theme-btn" on:click={cycleTheme} title="Cambiar tema" aria-label="Cambiar tema">
        <svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 4V2M12 22v-2M4.93 4.93 3.51 3.51M20.49 20.49l-1.42-1.42M4 12H2M22 12h-2M4.93 19.07 3.51 20.49M20.49 3.51l-1.42 1.42" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.6"/>
        </svg>
      </button>
    </nav>
  </div>
</header>

<style>
  .page-header {
    height: clamp(56px, var(--header-pct), 84px);
    background: linear-gradient(180deg, rgba(0,0,0,.12), rgba(0,0,0,0));
    border-bottom: 1px solid rgba(255,255,255,.05);
    display: flex;
    align-items: center;
    padding: .4rem .5rem;
    box-sizing: border-box;
    position: relative;
    z-index: 10;
  }

  .header-box {
    height: 100%;
    width: 100vw;
    max-width: 100vw;
    margin: 0;
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: clamp(0.5rem, 2vw, 0.75rem);
    box-sizing: border-box;
    padding: .5rem .75rem;
    border: 1px solid var(--border);
    border-left: none;
    border-right: none;
    border-radius: 0;
    background: linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
    backdrop-filter: blur(4px);
  }

  .brand { height: 100%; display:flex; align-items:center; gap:.75rem; padding: 0 .25rem; }
  .title { font-size: clamp(1.1rem, 2.5vw, 1.6rem); margin: 0; letter-spacing: .4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .back { border:1px solid var(--border); background: var(--surface-alt); color: var(--text); border-radius: 10px; padding:.4rem .6rem; cursor: pointer; }
  .nav { display:flex; align-items:center; gap:.5rem; }
  .action {
    border:1px solid var(--border);
    background: var(--surface-alt);
    color: var(--text);
    border-radius: 10px;
    padding:.45rem .8rem;
    cursor: pointer;
    font-size:.9rem;
    text-decoration: none;
    display:inline-flex; align-items:center; gap:.4rem;
  }
  .action:hover { filter: brightness(1.1); }
  .action:active { transform: translateY(1px); }
  .theme-btn { display:inline-grid; place-items:center; padding:.45rem; width: 38px; height: 38px; }
  .theme-btn .icon { display:block; }
  .view-indicator { margin-left:.5rem; opacity:.5; font-size:.75rem; }
</style>
