<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import LevelProgress from './LevelProgress.svelte';
  import ProblemDisplay from '../categories/arithmetic/components/ProblemDisplay.svelte';
  import '../categories/arithmetic/styles/trainer.css';
  import GameBox from './GameBox.svelte';
  // Render condicional de slots
  // @ts-ignore - $$slots es inyectado por Svelte
  const hasImage = !!$$slots?.image;

  // Props comunes
  export let levelId: number;
  export let total: number;
  export let correct: number;
  export let showTimer: boolean = false;
  export let remainingSeconds: number = 0;
  // duración por defecto para sincronizar marcador visual (segundos)
  // (no expuesto, eliminado de las props públicas porque no se utiliza externamente)

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

  // Heurística para detectar dispositivos de escritorio con teclado
  function isDesktopWithKeyboard(): boolean {
    try {
      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
        if (mq.matches) return true;
      }
      return typeof window !== 'undefined' && window.innerWidth >= 1024;
    } catch (e) {
      return false;
    }
  }

  // Captura global: enfoca el input y reenvía caracteres al handler del padre
  function globalKeyboardCapture(e: KeyboardEvent) {
    if (!isDesktopWithKeyboard()) return;
    const target = e.target as HTMLElement | null;
    const tag = target?.tagName ?? '';
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
      if (target === inputEl) return; // deja que el propio input gestione el evento
      return; // ignora si el foco está en otro control
    }
    if (disabled) return;
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') return;

    // Asegurar foco en el input para compatibilidad de accesibilidad
    inputEl?.focus();

    let newValue = input ?? '';
    if (e.key === 'Backspace') {
      newValue = newValue.slice(0, -1);
      e.preventDefault();
      e.stopImmediatePropagation();
    } else if (e.key === 'Escape') {
      newValue = '';
      e.preventDefault();
      e.stopImmediatePropagation();
    } else if (e.key === 'Enter') {
      if (handleInputKey) handleInputKey(e);
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    } else if (e.key.length === 1) {
      newValue = newValue + e.key;
      e.preventDefault();
      e.stopImmediatePropagation();
    } else {
      return;
    }

    if (typeof handleInput === 'function') {
      const fakeEvent = { target: { value: newValue } } as unknown as Event;
      handleInput(fakeEvent);
    } else if (inputEl) {
      input = newValue;
      inputEl.value = newValue;
      const ev = new Event('input', { bubbles: true });
      inputEl.dispatchEvent(ev);
    }
  }

  onMount(() => {
    // focus inicial (si está presente)
    setTimeout(() => inputEl?.focus(), 0);
    if (isDesktopWithKeyboard()) window.addEventListener('keydown', globalKeyboardCapture);
  });

  onDestroy(() => {
    if (isDesktopWithKeyboard()) window.removeEventListener('keydown', globalKeyboardCapture);
  });
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
    justify-content: flex-start;
    gap: 1rem;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border);
    background: var(--bg-secondary);
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: clamp(0.75rem, 2vw, 1rem);
  }

  /* title removed: styles kept for reference */

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
    user-select: none;
  }

  .answer-input:focus {
    outline: none;
    border-color: var(--border);
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

  @media (max-width: 768px) {
    .app-header {
      padding: 0.5rem 1rem;
    }

    .app-main {
      padding: 0.5rem;
    }
  }
</style>
