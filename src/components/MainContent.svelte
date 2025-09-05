<script lang="ts">
  import { onMount } from 'svelte';
  import { path, navigate } from '../router';
  import { createEventDispatcher } from 'svelte';
  import GameCard from './GameCard.svelte';
  import SubNav from './SubNav.svelte';

  const dispatch = createEventDispatcher();

  export let currentPath = '/';

  let TrainerComp: any = null;
  let CalcTrainerComp: any = null;
  let AboutComp: any = null;

  function handleAnswer(event: CustomEvent) {
    dispatch('answer', event.detail);
  }

  $: unsubscribe = path.subscribe(async (p) => {
    currentPath = p;
    if (import.meta.env?.DEV) console.log('[router] path', p);
    // Precarga ligera del componente según ruta
    if (p.startsWith('/arithmetic') && !TrainerComp) {
      try {
        const m = await import('../games/arithmetic/Trainer.svelte');
        TrainerComp = m.default;
      } catch (e:any) {
        console.error('[router] failed to load arithmetic trainer', e);
      }
    } else if (p.startsWith('/calculus') && !CalcTrainerComp) {
      try {
        const m = await import('../games/calculus/Trainer.svelte');
        CalcTrainerComp = m.default;
      } catch (e:any) {
        console.error('[router] failed to load calculus trainer', e);
      }
    } else if (p === '/about' && !AboutComp) {
      try {
        const m = await import('../About.svelte');
        AboutComp = m.default;
      } catch (e) {
        console.error('[router] failed to load about', e);
      }
    }
  });

  function openArithmetic() { navigate('/arithmetic/game'); }
  function openCalculus() { navigate('/calculus/game'); }

  onMount(() => {
    return () => {
      unsubscribe?.();
    };
  });
</script>

<main class="page-main">
  {#if currentPath === '/'}
    <section class="games-grid" aria-label="Juegos disponibles">
      <GameCard
        title="Aritmética"
        description="Practica sumas, restas, multiplicación y división con límite de tiempo y niveles crecientes."
        mathExpr={'\\times\\ \\div\\ +\\ -'}
        onClick={openArithmetic}
        ariaLabel="Entrar a Aritmética"
      />

      <GameCard
        title="Cálculo"
        description="Derivadas, integrales y diferenciales intro con verificación de texto."
        mathExpr={'\\int \\; \\frac{d}{dx}'}
        onClick={openCalculus}
        ariaLabel="Entrar a Cálculo"
      />
    </section>

  {:else if currentPath.startsWith('/arithmetic')}
    <section class="game-host" aria-label="Aritmética">
      <div class="game-section">
        <SubNav {currentPath} gameType="arithmetic" />

        <div class="game-content" role="region" aria-live="polite">
          {#if currentPath === '/arithmetic' || currentPath === '/arithmetic/game'}
            {#if TrainerComp}
              <svelte:component this={TrainerComp} on:answer={handleAnswer} />
            {:else}
              <div class="loading">Cargando…</div>
            {/if}
          {:else if currentPath === '/arithmetic/practice'}
            {#if TrainerComp}
              <svelte:component this={TrainerComp} on:answer={handleAnswer} />
            {:else}
              <div class="loading">Cargando…</div>
            {/if}
          {:else}
            <div class="learning-box">
              <h2>Aprendizaje de Aritmética</h2>
              <p>Repasa conceptos clave: operaciones básicas, jerarquía de operaciones, trucos mentales.</p>
            </div>
          {/if}
        </div>
      </div>
    </section>

  {:else if currentPath.startsWith('/calculus')}
    <section class="game-host" aria-label="Cálculo">
      <div class="game-section">
        <SubNav {currentPath} gameType="calculus" />

        <div class="game-content" role="region" aria-live="polite">
          {#if currentPath === '/calculus' || currentPath === '/calculus/game'}
            {#if CalcTrainerComp}
              <svelte:component this={CalcTrainerComp} on:answer={handleAnswer} />
            {:else}
              <div class="loading">Cargando…</div>
            {/if}
          {:else if currentPath === '/calculus/practice'}
            {#if CalcTrainerComp}
              <svelte:component this={CalcTrainerComp} on:answer={handleAnswer} />
            {:else}
              <div class="loading">Cargando…</div>
            {/if}
          {:else}
            <div class="learning-box">
              <h2>Aprendizaje de Cálculo</h2>
              <p>Derivadas básicas, reglas de integración y funciones trigonométricas.</p>
            </div>
          {/if}
        </div>
      </div>
    </section>

  {:else if currentPath === '/about'}
    <section class="game-host" aria-label="Acerca de">
      {#if AboutComp}
        <svelte:component this={AboutComp} />
      {:else}
        <div class="loading">Cargando…</div>
      {/if}
    </section>

  {:else}
    <section class="game-host" aria-label="No encontrado">
      <div class="not-found">
        <h2>404</h2>
        <p>Ruta no encontrada. <a href="/">Volver al inicio</a>.</p>
      </div>
    </section>
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

  /* Vista Home: grilla de tarjetas dentro del 100% de main */
  .games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(clamp(200px, 25vw, 320px), 1fr));
    gap: clamp(1rem, 4vw, 2rem);
    padding: clamp(1.5rem, 6vw, 3rem) clamp(2rem, 8vw, 4rem);
    height: 100%;
    width: 100vw;
    max-width: 100vw;
    margin: 0;
    box-sizing: border-box;
    place-items: stretch;
    justify-content: center;
    align-content: start;
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
    padding: clamp(1.5rem, 5vw, 3rem);
    display: grid;
    place-items: center;
    gap: clamp(1rem, 3vh, 2rem);
    text-align: center;
    max-width: 800px;
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
  @media (max-width: 1024px) {
    .games-grid {
      padding: 1rem 1.5rem;
      gap: 1rem;
    }
  }

  @media (max-width: 768px) {
    .games-grid {
      grid-template-columns: 1fr;
      max-width: 500px;
      gap: 1.5rem;
      padding: 2rem 1.5rem;
    }

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

  @media (max-width: 640px) {
    .games-grid {
      padding: 1.5rem 1rem;
      gap: 1.25rem;
    }
  }

  @media (max-width: 480px) {
    .games-grid {
      padding: 1.25rem 0.75rem;
      gap: 1rem;
    }

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
    .games-grid {
      padding: 1rem 0.5rem;
    }

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
