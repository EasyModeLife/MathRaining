<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import SubNav from '../components/SubNav.svelte';
  import { path } from '../router';
  import { gameStore, gameActions } from '../logic/stores/gameStore';
  import { responsiveActions } from '../logic/stores/responsiveStore';
  import { themeActions } from '../logic/stores/themeStore';

  const dispatch = createEventDispatcher();
  export let currentPath = '/';

  // Reactive to path changes
  $: currentPath = $path;

  // Determine game type from path
  $: gameType = currentPath.startsWith('/arithmetic') ? ('arithmetic' as const) : ('calculus' as const);
  $: isLearning = currentPath.includes('/learning');

  let TrainerComp: any = null;

  // Load appropriate trainer component
  $: if (gameType === 'arithmetic' && !TrainerComp) {
    import('../categories/arithmetic/Trainer.svelte').then(module => {
      TrainerComp = module.default;
    }).catch(err => console.error('Failed to load arithmetic trainer:', err));
  } else if (gameType === 'calculus' && !TrainerComp) {
    import('../categories/calculus/Trainer.svelte').then(module => {
      TrainerComp = module.default;
    }).catch(err => console.error('Failed to load calculus trainer:', err));
  }

  function handleAnswer(event: CustomEvent) {
    dispatch('answer', event.detail);
  }

  onMount(() => {
    // Initialize responsive and theme systems
    responsiveActions.initResponsive();
    themeActions.initTheme();

    // Set game type in store
    gameActions.setGameType(gameType);
  });
</script>

<section class="game-host" aria-label="{gameType} Game">
  <div class="game-section">
    <SubNav {currentPath} {gameType} />

    <div class="game-content" role="region" aria-live="polite">
      {#if isLearning}
        <div class="learning-box">
          <h2>{gameType === 'arithmetic' ? 'Arithmetic' : 'Calculus'} Learning</h2>
          <p>Review key concepts and improve your skills.</p>
        </div>
      {:else if TrainerComp}
        <svelte:component this={TrainerComp} on:answer={handleAnswer} />
      {:else}
        <div class="loading">Loading {gameType} game...</div>
      {/if}
    </div>
  </div>
</section>

<style>
  .game-host {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: grid;
    position: relative;
    z-index: 1;
  }

  .game-host :global(.trainer-layout) {
    height: 100%;
  }

  .game-host :global(.app-frame) {
    height: 100%;
  }

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

  .loading {
    padding: 2rem;
    display: grid;
    place-items: center;
    font-size: 1.2rem;
    font-weight: 500;
    opacity: 0.8;
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0.5; }
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .learning-box {
      padding: 1.5rem 1rem;
    }

    .learning-box h2 {
      font-size: 1.5rem;
    }

    .learning-box p {
      font-size: 1rem;
    }

    .loading {
      padding: 1.5rem 1rem;
      font-size: 1.1rem;
    }
  }
</style>
