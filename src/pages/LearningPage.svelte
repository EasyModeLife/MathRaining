<script lang="ts">
  import { path } from '../router';

  // Reactive to path changes
  $: currentPath = $path;
  $: gameType = currentPath.includes('/arithmetic') ? 'arithmetic' : 'calculus';
  $: mode = currentPath.includes('/instructions') ? 'instructions' : 'learning';
</script>

<section class="learning-host" aria-label="{gameType} {mode}">
  <div class="learning-box">
    <h2>{gameType === 'arithmetic' ? 'Arithmetic' : 'Calculus'} {mode === 'instructions' ? 'Instructions' : 'Learning'}</h2>
    {#if mode === 'instructions'}
      <p>Get started with {gameType}: {gameType === 'arithmetic'
        ? 'learn how to play arithmetic games and improve your math skills'
        : 'understand calculus concepts and practice problem-solving'}.</p>
    {:else}
      <p>Review key concepts: {gameType === 'arithmetic'
        ? 'basic operations, order of operations, mental math tricks'
        : 'derivatives, integration rules, trigonometric functions'}.</p>
    {/if}
  </div>
</section>

<style>
  .learning-host {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: grid;
    position: relative;
    z-index: 1;
  }

  .learning-box {
    padding: 2rem;
    display: grid;
    place-items: center;
    gap: 1rem;
    text-align: center;
    max-width: 650px;
    width: 100%;
    min-height: 0;
    margin: 0 auto;
  }

  .learning-box h2 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
  }

  .learning-box p {
    margin: 0;
    font-size: 1.1rem;
    opacity: 0.8;
    line-height: 1.6;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .learning-box {
      padding: 1.5rem 1rem;
      gap: 1rem;
    }

    .learning-box h2 {
      font-size: 1.5rem;
    }

    .learning-box p {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    .learning-box {
      padding: 1.25rem 0.75rem;
    }

    .learning-box h2 {
      font-size: 1.25rem;
    }

    .learning-box p {
      font-size: 0.95rem;
    }
  }
</style>
