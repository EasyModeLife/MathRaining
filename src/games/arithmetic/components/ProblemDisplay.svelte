<script lang="ts">
  import MathRenderer from '../../../components/Math.svelte';
  import { useTextFitting } from '../../../logic/game/useTextFitting';

  // Component props
  export let question = '';
  export let flash = false;
  export let penalty = false;
  export let overlayLabel = '';
  export let overlayColor = '';
  export let overlayTrigger = 0;

  // DOM refs
  let containerEl: HTMLDivElement;
  let fitboxEl: HTMLDivElement;

  // Use the modular text fitting hook
  const { fontPx, renderExpr } = useTextFitting(
    question,
    containerEl,
    fitboxEl
  );
</script>

  <div class="problem-wrapper">
  {#if overlayLabel}
    {#key overlayTrigger}
      <div class="judgement {overlayColor==='multi' ? 'multi' : ''}" data-label={overlayLabel}>
        {overlayLabel.toUpperCase()}
      </div>
    {/key}
  {/if}
  <div
    class="problem-display {flash ? 'is-correct' : ''} {penalty ? 'is-penalty' : ''}"
    bind:this={containerEl}
    aria-live="polite" role="heading" aria-level="1"
  >
  <div class="fitbox" bind:this={fitboxEl} style={`--fsize:${fontPx}px`}>
      <MathRenderer expr={renderExpr || question} display={true} />
    </div>
  </div>
  
</div>

<style>
  .problem-wrapper { position:relative; height:clamp(28vh, 36vh, 46vh); display:flex; align-items:center; justify-content:center; }
  .problem-display { 
    font-weight:700;
    /* Tamaño base fluido, luego se ajusta con escala */
    font-size: clamp(4rem, 10vw, 8rem);
    font-size: clamp(4rem, 7cqi, 8rem);
    padding:1rem 1.2rem;
    border-radius:28px;
    display:flex; align-items:center; justify-content:center;
    min-height:100%; width:100%;
  text-align:center; letter-spacing:0; background:transparent;
    transition:background .25s, transform .25s;
    text-shadow:0 4px 18px rgba(0,0,0,.55);
  overflow: hidden;
    box-sizing: border-box;
  }
  .fitbox { 
    display:inline-block;
    font-size: var(--fsize, 64px);
    max-width: 100%;
    line-height: 1.12;
    padding-inline: .25em; /* amortiguador para brackets grandes */
    max-height: 100%;
    overflow: hidden; /* evitamos scroll visible, forzamos ajuste */
    white-space: normal; /* permite envoltura en KaTeX si hay espacios */
  }
  
  .judgement { position:absolute; top:.55rem; left:.8rem; font-size:clamp(1.4rem,4.4vw,3.2rem); font-weight:800; letter-spacing:3px; color:var(--judge-color, var(--text)); opacity:.18; pointer-events:none; text-shadow:0 2px 12px rgba(0,0,0,.55); animation:judgeburst .95s ease-out forwards; mix-blend-mode:screen; }
  .judgement.multi { background:linear-gradient(90deg,#FF715B,#F9CB40,#BCED09,#2F52E0,#FF715B); -webkit-background-clip:text; background-clip:text; color:transparent; background-size:400% 100%; animation:judgeburst .95s ease-out forwards, hue 2.2s linear infinite; }
  @keyframes judgeburst { 0% { transform:translateY(6px) scale(.6); opacity:.05; } 18% { transform:translateY(0) scale(1); opacity:.32; } 60% { opacity:.22; } 100% { transform:translateY(-10px) scale(.9); opacity:0; } }
  @keyframes hue { 0% { background-position:0% 50%; } 100% { background-position:100% 50%; } }
  /* Font sizing is now handled by the fit() system, no hardcoded media queries needed */
  @media (max-width:600px){ .problem-wrapper { height:clamp(24vh, 32vh, 38vh); } }
  @media (max-height:640px){ .problem-wrapper { height:clamp(24vh, 30vh, 36vh); } }
</style>
