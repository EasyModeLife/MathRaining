<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';

  export let question = '';
  export let flash = false;
  export let penalty = false;
  // Overlay (juicio)
  export let overlayLabel: string = '';
  export let overlayColor: string = '';
  export let overlayTrigger: number = 0; // to restart animation

  // Refs
  let wrapperEl: HTMLElement | null = null;
  let contentEl: HTMLElement | null = null;
  let scale = 1;
  let wrapped = false; // cuando true, colocamos el contenido en modo multilinea/stack
  let ro: ResizeObserver | null = null;

  const MIN_SCALE = 0.45; // evita escalados ilegibles

  async function adjustScale() {
    if (!wrapperEl || !contentEl) return;
    await tick(); // asegurarse que DOM está actualizado

  // Medidas naturales del contenido
  const containerW = wrapperEl.clientWidth;
  const containerH = wrapperEl.clientHeight;

  // Si el elemento ya tiene un transform, quitarlo temporalmente para medir el tamaño natural
  const prevTransform = contentEl.style.transform;
  contentEl.style.transform = 'none';

  // contenido sin escalar: scrollWidth/Height (medición fiable sin transform)
  const contentW = contentEl.scrollWidth || contentEl.offsetWidth;
  const contentH = contentEl.scrollHeight || contentEl.offsetHeight;

    // calcular factor que haga que el contenido quepa en anchura y altura
    const scaleW = contentW > 0 ? containerW / contentW : 1;
    const scaleH = contentH > 0 ? containerH / contentH : 1;
    const desired = Math.min(1, Math.min(scaleW, scaleH));

    if (desired >= MIN_SCALE) {
      // cabe sin degradar por debajo del minimo: usar scale y no wrapped
      wrapped = false;
      const next = Math.max(MIN_SCALE, desired);
      if (Math.abs(next - scale) > 0.005) {
        scale = next;
        contentEl.style.transform = `scale(${scale})`;
        contentEl.style.transformOrigin = 'center';
      } else {
        contentEl.style.transform = prevTransform || `scale(${scale})`;
      }
    } else {
      // No cabe incluso al MIN_SCALE: pasar a modo wrapped (stack/multilínea)
      wrapped = true;
      scale = 1; // no escalamos en wrapped, dejamos que el layout fluya
      contentEl.style.transform = 'none';
    }
  }

  onMount(() => {
    // Observadores para redimensionar cuando cambie contenido o contenedor
    ro = new ResizeObserver(adjustScale);
    if (wrapperEl) ro.observe(wrapperEl);
    if (contentEl) ro.observe(contentEl);

    window.addEventListener('resize', adjustScale);
    // primera pasada
    adjustScale();

    return () => {
      if (ro) {
        ro.disconnect();
        ro = null;
      }
      window.removeEventListener('resize', adjustScale);
    };
  });

  onDestroy(() => {
    if (ro) ro.disconnect();
  });

  // cuando la pregunta cambie, recalcular
  $: if (question !== undefined) {
    // esperar ciclo de render y ajustar
    tick().then(adjustScale);
  }
</script>

<div class="problem-wrapper">
  {#if overlayLabel}
    {#key overlayTrigger}
      <div class="judgement {overlayColor==='multi' ? 'multi' : ''}" data-label={overlayLabel}>
        {overlayLabel.toUpperCase()}
      </div>
    {/key}
  {/if}
  <div bind:this={wrapperEl} class="problem-display {flash ? 'is-correct' : ''} {penalty ? 'is-penalty' : ''} {wrapped ? 'wrapped' : ''}" aria-live="polite" role="heading" aria-level="1">
    <!-- Contenido separado para medir sin interferir con transform -->
    <div class="problem-content-outer">
      <div bind:this={contentEl} class="problem-content" aria-hidden="false">
        {question}
      </div>
    </div>
  </div>
</div>

<style>
  .problem-wrapper {
    position:relative;
    height:33vh;
    display:flex;
    align-items:center;
    justify-content:center;
    overflow: hidden;
  }
  .problem-display {
    font-size:clamp(3.2rem,12vh,10rem);
    font-weight:700;
    padding:0.5rem 0.75rem; /* Reducido significativamente para maximizar espacio */
    border-radius:28px;
    display:flex;
    align-items:center;
    justify-content:center;
    min-height:100%;
    text-align:center;
    letter-spacing:3px;
    background:transparent;
    transition:background .25s,transform .25s;
    text-shadow:0 4px 18px rgba(0,0,0,.55);
    position: relative;
    overflow: hidden;
    width: 100%; /* Asegurar que use todo el ancho */
  }

  /* Outer wrapper mantiene layout y centro; inner content se escala */
  .problem-content-outer {
    display:flex;
    align-items:center;
    justify-content:center;
    width:100%;
    height:100%;
    padding:0.25rem; /* espacio interior para evitar tocar bordes */
    box-sizing: border-box;
  }

  .problem-content {
    font-size:inherit;
    font-weight:inherit;
    line-height:1;
    padding:0.25rem 0.5rem;
    border-radius:20px;
    text-align:center;
    letter-spacing:3px;
    text-shadow:0 4px 18px rgba(0,0,0,.55);
    word-break: break-word;
    white-space: normal;
    overflow-wrap: break-word;
    transform-origin:center;
    transition: transform 160ms ease-out;
    display:inline-block; /* permite medir scrollWidth correctamente */
    max-width:100%;
    box-sizing: border-box;
  }
  /* Modo wrapped: el contenido fluye y se coloca en bloque; deja margen inferior para elementos debajo */
  .problem-display.wrapped {
    align-items: flex-start;
    padding-top: 0.6rem;
  }
  .problem-display.wrapped .problem-content-outer {
    align-items: flex-start;
    justify-content: center;
    padding: 0.35rem 0.25rem 0.9rem; /* espacio inferior para elementos debajo */
  }
  .problem-display.wrapped .problem-content {
    transform: none !important; /* evitar escalado en wrapped */
    display:block;
    width:100%;
    text-align:center;
    font-size: clamp(1.2rem, 4.6vh, 3.6rem); /* reducir para mejorar legibilidad si hay muchas líneas */
    line-height:1.05;
    margin:0 auto;
    word-break: break-word;
  }
  .problem-display::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius:28px;
    background-color: rgba(0,0,0,0.02);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
  /* selectors relacionados con overflowing eliminados porque la lógica ahora usa transform/scale */
  
  .judgement { position:absolute; top:.55rem; left:.8rem; font-size:clamp(1.4rem,4.4vw,3.2rem); font-weight:800; letter-spacing:3px; color:var(--judge-color, var(--text)); opacity:.18; pointer-events:none; text-shadow:0 2px 12px rgba(0,0,0,.55); animation:judgeburst .95s ease-out forwards; mix-blend-mode:screen; }
  .judgement.multi { background:linear-gradient(90deg,#FF715B,#F9CB40,#BCED09,#2F52E0,#FF715B); -webkit-background-clip:text; background-clip:text; color:transparent; background-size:400% 100%; animation:judgeburst .95s ease-out forwards, hue 2.2s linear infinite; }
  @keyframes judgeburst { 0% { transform:translateY(6px) scale(.6); opacity:.05; } 18% { transform:translateY(0) scale(1); opacity:.32; } 60% { opacity:.22; } 100% { transform:translateY(-10px) scale(.9); opacity:0; } }
  @keyframes hue { 0% { background-position:0% 50%; } 100% { background-position:100% 50%; } }
  @media (max-width:900px){ .problem-display { font-size:clamp(2.8rem,11vh,7rem); } }
  @media (max-width:600px){
    .problem-wrapper { height:30vh; }
    .problem-display {
      font-size:clamp(2.2rem,12vw,5rem);
      letter-spacing:1px;
      padding:0.25rem 0.375rem; /* Padding mínimo en móviles */
    }
  }
  @media (max-height:640px){ .problem-wrapper { height:30vh; } }
</style>
