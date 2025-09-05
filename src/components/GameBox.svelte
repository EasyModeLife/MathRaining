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
    padding: clamp(0.5rem, 2vw, 0.75rem) clamp(0.75rem, 3vw, 1rem);
    background: linear-gradient(160deg, var(--surface, #0d1117), var(--surface-alt, #161b22));
    border: 1px solid var(--border, #2c313a);
    box-shadow: 0 8px 28px -12px rgba(0,0,0,.45);
    color: var(--text, #e6edf3);
    min-height: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow: hidden;
  }

  .box-title {
    font-weight: 700;
    font-size: clamp(0.9rem, 2.2vw, 1.1rem);
    opacity: .85;
    margin-bottom: .5rem;
    letter-spacing: .3px;
    flex-shrink: 0;
  }

  .box-content {
    min-height: 0;
    flex: 1 1 auto;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: .5rem;
    overflow: hidden;
  }

  /* Responsive area configurations */
  :global([data-area="problem"]) {
    min-height: var(--min-height-problem, clamp(200px, 35vh, 480px));
  }

  :global([data-area="image"]) {
    min-height: var(--min-height-image, clamp(100px, 18vh, 280px));
    align-self: start;
  }

  :global([data-area="answer"]) {
    min-height: var(--min-height-answer, clamp(70px, 12vh, 160px));
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global([data-area="footer"]) {
    min-height: var(--min-height-footer, clamp(40px, 6vh, 80px));
  }

  /* Mobile optimizations */
  @media (max-width: 768px) {
    .game-box {
      padding: clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.6rem, 2vw, 0.75rem);
      border-radius: clamp(12px, 4vw, 16px);
    }

    :global([data-area="problem"]) { min-height: clamp(160px, 28vh, 360px); }
    :global([data-area="image"]) { min-height: clamp(80px, 14vh, 200px); }
    :global([data-area="answer"]) { min-height: clamp(60px, 10vh, 120px); }
    :global([data-area="footer"]) { min-height: clamp(35px, 5vh, 60px); }
  }

  @media (max-width: 480px) {
    .game-box {
      padding: .4rem .6rem;
      border-radius: 12px;
    }

    :global([data-area="problem"]) { min-height: clamp(140px, 24vh, 300px); }
    :global([data-area="image"]) { min-height: clamp(60px, 12vh, 160px); }
    :global([data-area="answer"]) { min-height: clamp(50px, 8vh, 100px); }
    :global([data-area="footer"]) { min-height: clamp(30px, 4vh, 50px); }
  }

  @media (max-width: 360px) {
    :global([data-area="problem"]) { min-height: clamp(120px, 20vh, 250px); }
    :global([data-area="image"]) { min-height: clamp(50px, 10vh, 140px); }
    :global([data-area="answer"]) { min-height: clamp(45px, 7vh, 90px); }
  }

  @media (max-height: 500px) and (orientation: landscape) {
    :global([data-area="problem"]) { min-height: clamp(120px, 30vh, 220px); }
    :global([data-area="image"]) { min-height: clamp(80px, 25vh, 160px); }
    :global([data-area="answer"]) { min-height: clamp(50px, 15vh, 90px); }
  }
</style>
