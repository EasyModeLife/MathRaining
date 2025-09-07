<script lang="ts">
  export let onKey: (key: string) => void;

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.'];
  const letters = ['x', 'y', 'z', 'Backspace'];
  const operations = ['+', '-', '*', '/', '=', '(', ')'];

  function handleKey(key: string) {
    if (key === 'Backspace') {
      onKey('Backspace');
    } else {
      onKey(key);
    }
  }
</script>

<div class="mobile-keyboard">
  <div class="keyboard-row">
    {#each numbers as num}
      <button class="key-button" on:click={() => handleKey(num)}>{num}</button>
    {/each}
  </div>
  <div class="keyboard-row">
    {#each letters as letter}
      <button class="key-button" on:click={() => handleKey(letter)}>{letter}</button>
    {/each}
  </div>
  <div class="keyboard-row">
    {#each operations as op}
      <button class="key-button" on:click={() => handleKey(op)}>{op}</button>
    {/each}
  </div>
</div>

<style>
  .mobile-keyboard {
    padding: 0.5rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    max-height: 35vh;
    overflow-y: auto;
  }

  .keyboard-row {
    display: flex;
    justify-content: center;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
  }

  .keyboard-row:last-child {
    margin-bottom: 0;
  }

  .key-button {
    flex: 1;
    padding: 0.75rem;
    font-size: 1rem;
    border: 1px solid var(--border);
    border-radius: 0.25rem;
    background: var(--bg);
    color: var(--text);
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .key-button:hover {
    background: var(--surface-alt);
  }

  .key-button:active {
    background: var(--accent-active);
  }

  @media (max-width: 768px) {
    .keyboard-row {
      flex-wrap: wrap;
    }

    .key-button {
      min-width: 2rem;
      padding: 0.5rem;
      font-size: 0.9rem;
    }
  }
</style>
