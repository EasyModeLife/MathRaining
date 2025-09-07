<script lang="ts">
  import MathRenderer from '../../../components/Math.svelte';
  export let levelId: number;
  export let total: number;
  export let correct: number;
  export let showTimer: boolean;
  export let remainingSeconds: number;
  $: countExpr = `\\displaystyle \\frac{${Math.max(0, correct)}}{${total}}`;
</script>

<div class="level-progress">
  <div class="level-progress__meta">
    <div class="level-progress__label">Level {levelId}</div>
    <div class="level-progress__count-inline" aria-hidden="true"><MathRenderer expr={countExpr} /></div>
    {#if showTimer}
      <div class="level-progress__timer-inline" aria-label="Remaining seconds">{remainingSeconds.toFixed(1)}s</div>
    {/if}
  </div>
  <!--<div class="level-progress__count"><MathRenderer expr={countExpr} /></div>-->
  
</div>

<style>
  .level-progress { display:flex;flex-direction:column;gap:.6rem; }
  .level-progress__meta { display:flex;align-items:center;gap:0.8rem; }
  /* match header route styling */
  .level-progress__label, .level-progress__count-inline, .level-progress__timer-inline { font-size:.8rem; opacity:.8; font-weight:600; letter-spacing:.4px; }
  .level-progress__label { color: var(--text); }
  .level-progress__count-inline { min-width:48px; }
  .level-progress__timer-inline { opacity:.8; }
  @media (max-width:560px){ .level-progress { gap:.8rem; } .level-progress__label { font-size:.78rem; } }
  @media (max-width:600px){
    .level-progress__label { font-size:.7rem; }
  }
</style>
