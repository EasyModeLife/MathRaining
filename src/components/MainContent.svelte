<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { path } from '../router';
  import { createPageRouter } from '../router/pageRouter';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // Create router instance
  const router = createPageRouter(path);

  // Get reactive stores from router
  const currentRouteStore = router.getCurrentRoute();
  const currentComponentStore = router.getCurrentComponent();

  // Handle answer events from games
  function handleAnswer(event: CustomEvent) {
    dispatch('answer', event.detail);
  }

  // Cleanup on destroy
  onDestroy(() => {
    router.destroy();
  });
</script>

<main class="page-main">
  {#if $currentComponentStore}
    <svelte:component this={$currentComponentStore} on:answer={handleAnswer} />
  {:else}
    <div class="loading">Loading...</div>
  {/if}
</main>

<style>
  .page-main {
    position: relative;
    width: 100vw;
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    display: grid;
    grid-template-rows: 1fr;
    box-sizing: border-box;
  }

  /* Host del juego: ocupa 100% del main sin desbordar */
  .game-host {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: grid;
    position: relative;
    z-index: 1;
  }
  .game-host :global(.trainer-layout) { height: 100%; }
  .game-host :global(.app-frame) { height: 100%; }

  /* Sección de juego con submenú centrado y responsivo */
  .game-section {
    display: grid;
    grid-template-rows: auto 1fr;
    min-height: 0;
  }

  .game-content {
    min-height: 0;
    position: relative;
  }

  .learning-box {
  padding: clamp(1.5rem, 5vw, 3rem) clamp(1.25rem, 6vw, 2rem);
  display: grid;
  place-items: center;
  gap: clamp(1rem, 3vh, 2rem);
  text-align: center;
  /* Ajuste: que la caja de "learning" coincida con el ancho del app-frame/problem box */
  max-width: clamp(380px, 90%, 650px); /* límites más conservadores */
  width: 100%;
  min-height: 0;
  overflow: hidden;
  margin: 0 auto;
  }

  .learning-box h2 {
    margin: 0;
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 700;
  }

  .learning-box p {
    margin: 0;
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    opacity: 0.8;
    line-height: 1.6;
  }

  .not-found {
    padding: clamp(2rem, 6vw, 4rem);
    display: grid;
    place-content: center;
    text-align: center;
    gap: clamp(1rem, 3vh, 2rem);
  }

  .not-found h2 {
    margin: 0;
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 900;
    color: var(--accent-cool);
    opacity: 0.5;
  }

  .not-found p {
    margin: 0;
    font-size: clamp(1.1rem, 2.8vw, 1.4rem);
    opacity: 0.9;
  }

  .not-found a {
    color: var(--accent-cool);
    text-decoration: underline;
    font-weight: 600;
  }

  .loading {
    padding: clamp(2rem, 5vw, 4rem);
    display: grid;
    place-items: center;
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    font-weight: 500;
    opacity: 0.8;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0.5; }
  }

  /* Breakpoints altamente responsivos */
  @media (max-width: 768px) {
    .learning-box {
  padding: 2rem 1.5rem;
    }

    .not-found {
      padding: 3rem 1.5rem;
    }

    .loading {
      padding: 3rem 1.5rem;
    }
  }

  /* Desktop/tablet: aumentar el max-width para que coincida con .app-frame en trainer.css */
  @media (min-width: 768px) {
    .learning-box { max-width: 700px; }
  }

  @media (max-width: 480px) {
    .learning-box {
      padding: 1.5rem 1rem;
      gap: 1rem;
    }

    .learning-box h2 {
      font-size: 1.75rem;
    }

    .learning-box p {
      font-size: 1rem;
    }

    .not-found {
      padding: 2rem 1rem;
      gap: 1rem;
    }

    .not-found h2 {
      font-size: 4rem;
    }

    .not-found p {
      font-size: 1.1rem;
    }

    .loading {
      padding: 2.5rem 1rem;
      font-size: 1.2rem;
    }
  }

  @media (max-width: 360px) {
    .learning-box {
      padding: 1.25rem 0.75rem;
    }

    .learning-box h2 {
      font-size: 1.5rem;
    }

    .not-found {
      padding: 1.5rem 0.75rem;
    }

    .not-found h2 {
      font-size: 3rem;
    }

    .not-found p {
      font-size: 1rem;
    }

    .loading {
      padding: 2rem 0.75rem;
      font-size: 1.1rem;
    }
  }

  /* Dark mode enhancements */
  @media (prefers-color-scheme: dark) {
    .learning-box h2 {
      color: rgba(255,255,255,.95);
    }

    .learning-box p {
      color: rgba(255,255,255,.8);
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .learning-box h2 {
      color: var(--text);
    }

    .learning-box p {
      color: var(--text);
      opacity: 1;
    }

    .not-found a {
      outline: 2px solid var(--accent-cool);
      outline-offset: 2px;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .loading {
      animation: none;
    }
  }

  /* Print styles */
  @media print {
    .loading {
      animation: none;
    }
  }
</style>
