<script lang="ts">
  export let title: string;
  export let description: string;
  export let textContent: string;
  export let onClick: () => void;
  export let ariaLabel: string;
</script>

<button
  class="game-card"
  type="button"
  on:click={onClick}
  on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
  aria-label={ariaLabel}
>
  <div class="game-card__media" aria-hidden="true">
    <span class="math-text">{textContent}</span>
  </div>
  <div class="game-card__body">
    <h2 class="game-card__title">{title}</h2>
    <p class="game-card__desc">{description}</p>
  </div>
</button>

<style>
  .game-card {
    display: grid;
    grid-template-rows: 1fr auto;
    width: 100%;
    max-width: 100%;
    /* Altura acotada y responsiva */
    min-height: clamp(180px, 28vh, 320px);
    max-height: clamp(220px, 36vh, 420px);
    border: 1px solid var(--border);
    border-radius: clamp(8px, 3vw, 16px);
    background: linear-gradient(155deg, var(--surface) 0%, var(--surface-alt) 80%);
    color: var(--text);
    box-shadow: 0 10px 40px -12px rgba(0,0,0,.4);
    cursor: pointer;
    overflow: hidden;
    transition: all 0.15s ease;
    appearance: none;
    outline: none;
    padding: 0;
    text-align: left;
    position: relative;
    box-sizing: border-box;
  }

  .game-card:focus-visible {
    outline: 3px solid var(--accent-cool);
    outline-offset: 2px;
  }

  .game-card:hover,
  .game-card:focus {
    transform: translateY(-2px);
    box-shadow: 0 14px 60px -20px rgba(0,0,0,.55);
    border-color: var(--accent-cool);
  }

  .game-card:active {
    transform: translateY(0);
  }

  .game-card__media {
    display: grid;
    place-items: center;
    font-weight: 800;
    font-size: clamp(2.5rem, 7vw, 5rem);
    opacity: 0.4;
    letter-spacing: 0.3rem;
    min-height: clamp(84px, 18vh, 180px);
    background: linear-gradient(135deg, var(--surface) 0%, var(--surface-alt) 100%);
    border-bottom: 1px solid var(--border);
    position: relative;
    overflow: hidden;
  }

  .math-text {
    font-family: 'KaTeX_Main', serif;
    font-size: 2rem;
    color: currentColor;
  }

  .game-card__media::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(255,255,255,.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .game-card__body {
    padding: clamp(1rem, 3vw, 1.5rem);
    display: grid;
    gap: clamp(0.25rem, 1vh, 0.5rem);
    align-content: start;
    background: var(--surface);
  }

  .game-card__title {
    margin: 0;
    font-size: clamp(1.1rem, 3vw, 1.4rem);
    font-weight: 600;
    line-height: 1.2;
  }

  .game-card__desc {
    margin: clamp(0.25rem, 1vh, 0.5rem) 0 0 0;
    font-size: clamp(0.9rem, 2.5vw, 1rem);
    opacity: 0.85;
    line-height: 1.4;
  }

  /* Breakpoints altamente responsivos */
  @media (max-width: 768px) {
    .game-card {
      min-height: clamp(160px, 24vh, 280px);
      max-height: clamp(200px, 32vh, 380px);
    }

    .game-card__media {
      min-height: clamp(70px, 15vh, 150px);
      font-size: clamp(1.8rem, 5vw, 4rem);
    }

    .game-card__body {
      padding: 1rem;
    }

    .game-card__title {
      font-size: clamp(1rem, 2.8vw, 1.3rem);
    }

    .game-card__desc {
      font-size: clamp(0.85rem, 2.3vw, 0.95rem);
      margin-top: 0.4rem;
    }
  }

  @media (max-width: 640px) {
    .game-card {
      min-height: clamp(140px, 20vh, 240px);
      max-height: clamp(180px, 28vh, 340px);
    }

    .game-card__media {
      min-height: clamp(60px, 12vh, 120px);
      font-size: clamp(1.6rem, 4vw, 3.5rem);
    }

    .game-card__title {
      font-size: clamp(0.95rem, 2.6vw, 1.2rem);
    }
  }

  @media (max-width: 480px) {
    .game-card {
      min-height: clamp(120px, 18vh, 200px);
      max-height: clamp(150px, 24vh, 280px);
      border-radius: 12px;
    }

    .game-card__media {
      min-height: clamp(50px, 10vh, 100px);
      font-size: clamp(1.4rem, 3.5vw, 3rem);
      letter-spacing: 0.2rem;
    }

    .game-card__body {
      padding: 0.75rem;
    }

    .game-card__title {
      font-size: clamp(0.9rem, 2.4vw, 1.1rem);
    }

    .game-card__desc {
      font-size: clamp(0.8rem, 2vw, 0.9rem);
      line-height: 1.3;
    }
  }

  @media (max-width: 360px) {
    .game-card {
      min-height: clamp(110px, 16vh, 180px);
      max-height: clamp(140px, 20vh, 250px);
    }

    .game-card__media {
      min-height: clamp(45px, 8vh, 80px);
      font-size: clamp(1.2rem, 3vw, 2.5rem);
    }

    .game-card__title {
      font-size: clamp(0.85rem, 2.2vw, 1rem);
    }

    .game-card__desc {
      font-size: clamp(0.75rem, 1.8vw, 0.85rem);
    }
  }

  /* Dark mode improvements */
  @media (prefers-color-scheme: dark) {
    .game-card__media {
      background: linear-gradient(135deg, var(--surface-alt) 0%, var(--surface) 100%);
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .game-card {
      border-width: 2px;
      border-color: var(--text);
    }

    .game-card__media {
      opacity: 0.4;
      border-width: 2px;
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .game-card {
      transition: none;
    }

    .game-card:hover,
    .game-card:focus {
      transform: none;
    }
  }
</style>
