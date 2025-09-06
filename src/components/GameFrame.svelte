<script lang="ts">
  import LevelProgress from './LevelProgress.svelte';
  import ProblemDisplay from '../games/arithmetic/components/ProblemDisplay.svelte';
  import '../games/arithmetic/styles/trainer.css';
  import GameBox from './GameBox.svelte';
  // Render condicional de slots
  // @ts-ignore - $$slots es inyectado por Svelte
  const hasImage = !!$$slots?.image;

  // Props comunes
  export let title: string = '';
  export let levelId: number;
  export let total: number;
  export let correct: number;
  export let showTimer: boolean = false;
  export let remainingSeconds: number = 0;
  // duración por defecto para sincronizar marcador visual (segundos)
  export let questionDurationSeconds: number = 8;

  export let question: string = '';
  export let flash: boolean = false;
  export let penalty: boolean = false;
  export let overlayLabel: string = '';
  export let overlayColor: string = '';
  export let overlayTrigger: number = 0;

  // Control del input desde el padre
  export let input: string = '';
  export let inputEl: HTMLInputElement | null = null;
  export let handleInput: (e: Event) => void;
  export let handleInputKey: (e: KeyboardEvent) => void;
  export let disabled: boolean = false;
  export let key: any;
</script>

<div class="trainer-layout">
  <div class="app-frame">
    <header class="app-header">
      <div class="header-left">
        <slot name="header-left"></slot>
        <h1 class="main-title">{title}</h1>
      </div>
      <LevelProgress
        {levelId}
        {total}
        {correct}
        {showTimer}
  remainingSeconds={remainingSeconds}
  questionDurationSeconds={questionDurationSeconds}
      />
    </header>
    <main class="app-main">
      <div class="trainer-grid grid-modular">
        <!-- Caja de problema -->
        <slot name="problem">
          <GameBox area="problem">
            <ProblemDisplay
              {question}
              {flash}
              penalty={penalty}
              overlayLabel={overlayLabel}
              overlayColor={overlayColor}
              overlayTrigger={overlayTrigger}
            />
          </GameBox>
        </slot>

        <!-- Caja de imagen opcional -->
        {#if hasImage}
          <GameBox area="image">
            <slot name="image"></slot>
          </GameBox>
        {/if}

        <!-- Caja de respuesta -->
        <slot name="answer">
          <GameBox area="answer">
            <input
              class="answer-input"
              bind:this={inputEl}
              bind:value={input}
              on:input={handleInput}
              on:keydown={handleInputKey}
              {disabled}
              autocomplete="off"
              inputmode="text"
              aria-label="Answer"
            />
          </GameBox>
        </slot>

        <!-- Caja de pie -->
        <GameBox area="footer">
          <slot name="footer">
            <div class="footer-stats">
              <slot name="footer-left"></slot>
              <slot name="footer-right"></slot>
            </div>
          </slot>
        </GameBox>
      </div>
    </main>
  </div>
  
</div>

<style>
  .trainer-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .app-frame {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--bg);
    color: var(--text);
  }

  .app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
    background: var(--bg-secondary);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: clamp(0.75rem, 2vw, 1rem);
  }

  .main-title {
    font-size: clamp(1.25rem, 3vw, 1.75rem);
    font-weight: 600;
    margin: 0;
    color: var(--text);
  }

  .app-main {
    flex: 1;
    overflow: hidden;
    padding: 1rem;
  }

  .trainer-grid {
    height: 100%;
    display: grid;
    gap: 1rem;
  }

  .grid-modular {
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 1fr;
  }

  .footer-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .answer-input {
    width: 100%;
    padding: 0.75rem;
    font-size: 1.25rem;
    border: 2px solid var(--border);
    border-radius: 0.5rem;
    background: var(--bg);
    color: var(--text);
    text-align: center;
    transition: border-color 0.2s;
  }

  .answer-input:focus {
    outline: none;
    border-color: var(--accent);
  }

  :global([data-area="problem"]) {
    grid-column: 1 / -1;
  }

  :global([data-area="image"]) {
    grid-column: 1 / -1;
  }

  :global([data-area="answer"]) {
    grid-column: 1 / -1;
  }

  :global([data-area="footer"]) {
    grid-column: 1 / -1;
  }

  @media (min-width: 768px) {
    .grid-modular {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto 1fr auto;
    }

    :global([data-area="problem"]) {
      grid-column: 1 / -1;
    }

    :global([data-area="image"]) {
      grid-column: 1 / 3;
      grid-row: 2;
    }

    :global([data-area="answer"]) {
      grid-column: 1 / -1;
      grid-row: 3;
    }

    :global([data-area="footer"]) {
      grid-column: 1 / -1;
      grid-row: 4;
    }
  }

  @media (min-width: 1024px) {
    .grid-modular {
      gap: 1.5rem;
    }

    .app-header {
      padding: 1.5rem 2rem;
    }

    .app-main {
      padding: 1.5rem;
    }
  }
</style>
