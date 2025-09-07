<script lang="ts">
  import GameCard from '../components/GameCard.svelte';
  import { navigate } from '../router';

  function openArithmetic() {
    navigate('/arithmetic/game');
  }

  function openCalculus() {
    navigate('/calculus/game');
  }
</script>

<section class="games-grid" aria-label="Available games">
  <GameCard
    title="Arithmetic"
    description="Practice addition, subtraction, multiplication and division with time limits and increasing levels."
    mathExpr={'\\large \\times \\quad \\div \\quad + \\quad -'}
    onClick={openArithmetic}
    ariaLabel="Enter Arithmetic"
  />

  <GameCard
    title="Calculus"
    description="Basic derivatives, integration rules and trigonometric functions with text verification."
    mathExpr={'\\large \\int \\quad \\frac{d}{dx}'}
    onClick={openCalculus}
    ariaLabel="Enter Calculus"
  />
</section>

<style>
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

  /* Responsive breakpoints */
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
  }

  @media (max-width: 360px) {
    .games-grid {
      padding: 1rem 0.5rem;
    }
  }
</style>
