<script lang="ts">
  import LevelProgress from '../games/arithmetic/components/LevelProgress.svelte';
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
</script>

<div class="trainer-layout">
  <div class="app-frame">
    <header class="app-header">
      <div class="header-left">
        <slot name="header-left"></slot>
      </div>
      <LevelProgress
        {levelId}
        {total}
        {correct}
        {showTimer}
        remainingSeconds={remainingSeconds}
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
  .header-left { display:flex; align-items:center; gap:.5rem; }
  .grid-modular{
    display:grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto auto;
    gap: clamp(0.75rem, 2vw, 1rem);
    min-height: 0;
  }
  @media (min-width: 768px){
    .grid-modular{
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr auto auto;
      gap: clamp(1rem, 2.5vw, 1.25rem);
    }
    :global([data-area="problem"]) { grid-column: 1 / -1; }
    :global([data-area="image"]) { grid-column: 2; grid-row: 1 / 2; }
    :global([data-area="answer"]) { grid-column: 1 / -1; }
    :global([data-area="footer"]) { grid-column: 1 / -1; }
  }

  @media (min-width: 1024px) {
    .grid-modular {
      gap: 1.5rem;
    }
  }
</style>
