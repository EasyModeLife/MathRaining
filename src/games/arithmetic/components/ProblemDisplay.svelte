<script lang="ts">
  import MathRenderer from '../../../components/Math.svelte';
  import { onMount, tick } from 'svelte';
  export let question = '';
  export let flash = false;
  export let penalty = false;
  // Overlay (juicio)
  export let overlayLabel: string = '';
  export let overlayColor: string = '';
  export let overlayTrigger: number = 0; // to restart animation

  // Ajuste automático de tamaño para que la expresión quepa en la caja
  let containerEl: HTMLDivElement;
  let fitboxEl: HTMLDivElement;
  let scale = 1; // escala aplicada a la expresión
  let renderExpr = '';
  let usedMultiline = false;
  let lastQuestion = '';
  let fitQueued = false;
  let isFitting = false;

  // Divide en N líneas (2..6) en operadores + y - a nivel superior (fuera de llaves),
  // preservando el operador al inicio de la línea siguiente, y usa aligned con &.
  function breakIntoNLines(latex: string, lines: number): string | null {
    if (lines < 2) return null;
    const ops: number[] = [];
    let depth = 0;
    let escaping = false;
    for (let i = 0; i < latex.length; i++) {
      const ch = latex[i];
      if (escaping) { escaping = false; continue; }
      if (ch === '\\') { escaping = true; continue; }
      if (ch === '{') { depth++; continue; }
      if (ch === '}') { depth = Math.max(0, depth - 1); continue; }
      if (depth === 0 && (ch === '+' || ch === '-')) {
        // evita primer signo si es unario al inicio
        if (i === 0) continue;
        ops.push(i);
      }
    }
    if (ops.length === 0) return null;
    const cuts: number[] = [];
    for (let k = 1; k < lines; k++) {
      const target = Math.floor((k * ops.length) / lines);
      const idx = Math.min(Math.max(target, 0), ops.length - 1);
      const pos = ops[idx];
      if (!cuts.includes(pos)) cuts.push(pos);
    }
    cuts.sort((a, b) => a - b);
    const parts: string[] = [];
    let start = 0;
    for (const cut of cuts) {
      const head = latex.slice(start, cut).trim();
      const op = latex[cut];
      if (head) parts.push(head);
      start = cut; // el operador irá al inicio de la siguiente línea
      // Para que la siguiente línea inicie con el operador, no lo incluimos en head
      latex = latex.slice(0, cut) + ' ' + latex.slice(cut); // asegura espacio antes del operador
    }
    const tail = latex.slice(start).trim();
    if (tail) parts.push(tail);
    // Construir aligned con un & al principio de cada fila
    const body = parts.map(p => ` & ${p.trim()}`).join(' \\\n');
    return `\\begin{aligned}\n${body}\n\\end{aligned}`;
  }

  async function fit() {
    if (isFitting) return; // evita reentradas
    isFitting = true;
    if (question !== lastQuestion) {
      renderExpr = question;
      usedMultiline = false;
      lastQuestion = question;
    }
    await tick(); // esperar a que KaTeX renderice
    if (!containerEl || !fitboxEl) return;

  const maxWidth = containerEl.clientWidth - 48; // margen extra amplio para delimitadores grandes
  const maxHeight = containerEl.clientHeight - 16;
    const measure = () => fitboxEl.getBoundingClientRect();
    let rect = measure();
    if (rect.width === 0 || rect.height === 0) return;
    // Medir dimensiones no escaladas (rect ya incluye la escala actual)
    const unscaledW = rect.width / (scale || 1);
    const unscaledH = rect.height / (scale || 1);
  let s = Math.min(maxWidth / unscaledW, maxHeight / unscaledH, 1) * 0.96; // fudge mayor para evitar cortes

    // Si la escala requerida es demasiado pequeña, probamos N líneas (2..4)
    if (s < 0.78) {
      for (let lines = 2; lines <= 4 && s < 0.88; lines++) {
        const broken = breakIntoNLines(question, lines);
        if (!broken) break;
        renderExpr = broken; usedMultiline = true;
        await tick(); rect = measure();
        const unW = rect.width / (scale || 1);
        const unH = rect.height / (scale || 1);
        s = Math.min(maxWidth / unW, maxHeight / unH, 1) * 0.96;
      }
    }
    // Redondeo suave para evitar jitter
  const nextScale = Math.max(0.4, Math.min(1, Number(s.toFixed(3))));
    if (Math.abs(nextScale - scale) > 0.001) {
      scale = nextScale;
    }
    isFitting = false;
  }

  function scheduleFit(){
    if (fitQueued) return;
    fitQueued = true;
    requestAnimationFrame(async ()=>{ fitQueued = false; await fit(); });
  }

  onMount(() => {
    scheduleFit();
    const onResize = () => scheduleFit();
    window.addEventListener('resize', onResize);
    let ro: ResizeObserver | null = null;
    let roBox: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(() => scheduleFit());
      if (containerEl) ro.observe(containerEl);
      roBox = new ResizeObserver(() => scheduleFit());
      if (fitboxEl) roBox.observe(fitboxEl);
    }
    // Reintentos cortos post-mount por carga diferida de KaTeX
    let attempts = 0;
    const retry = () => {
      attempts++;
      scheduleFit();
      if (attempts < 8) setTimeout(retry, 60);
    };
    setTimeout(retry, 50);
    return () => {
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
      if (roBox) roBox.disconnect();
    };
  });

  // Reajustar cuando cambie la pregunta
  $: if (question !== lastQuestion) { scheduleFit(); }
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
    <div class="fitbox" bind:this={fitboxEl} style={`--scale:${scale}`}> 
      <MathRenderer expr={renderExpr || question} display={true} on:rendered={() => scheduleFit()} />
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
    transform: scale(var(--scale, 1));
    transform-origin: center center;
    /* Evitar cortes de KaTeX al escalar */
    will-change: transform;
    max-width: 100%;
    line-height: 1.1;
  padding-inline: .25em; /* amortiguador para brackets grandes */
  max-height: 100%;
     overflow: hidden; /* evitamos scroll visible, forzamos ajuste */
     white-space: normal; /* permite envoltura en KaTeX cuando hay espacios */
   }
  
  .judgement { position:absolute; top:.55rem; left:.8rem; font-size:clamp(1.4rem,4.4vw,3.2rem); font-weight:800; letter-spacing:3px; color:var(--judge-color, var(--text)); opacity:.18; pointer-events:none; text-shadow:0 2px 12px rgba(0,0,0,.55); animation:judgeburst .95s ease-out forwards; mix-blend-mode:screen; }
  .judgement.multi { background:linear-gradient(90deg,#FF715B,#F9CB40,#BCED09,#2F52E0,#FF715B); -webkit-background-clip:text; background-clip:text; color:transparent; background-size:400% 100%; animation:judgeburst .95s ease-out forwards, hue 2.2s linear infinite; }
  @keyframes judgeburst { 0% { transform:translateY(6px) scale(.6); opacity:.05; } 18% { transform:translateY(0) scale(1); opacity:.32; } 60% { opacity:.22; } 100% { transform:translateY(-10px) scale(.9); opacity:0; } }
  @keyframes hue { 0% { background-position:0% 50%; } 100% { background-position:100% 50%; } }
  @media (max-width:900px){ .problem-display { font-size: 7rem; } }
  @media (max-width:600px){ .problem-wrapper { height:30vh; } .problem-display { font-size: 5rem; letter-spacing:1.5px; } }
  @media (max-height:640px){ .problem-wrapper { height:30vh; } }
</style>
