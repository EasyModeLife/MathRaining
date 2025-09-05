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
  // Autoajuste vía font-size (px)
  const BASE_PX = 64;
  const MIN_PX = 18;
  const MAX_PX = 120;
  let fontPx = BASE_PX;
  let renderExpr = '';
  let usedMultiline = false;
  let lastQuestion = '';
  let fitQueued = false;
  let isFitting = false;

  // Separa en N líneas (2..6) por + y - a nivel superior (fuera de llaves)
  function splitTopLevelByPlusMinus(latex: string, lines: number): string[] | null {
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
        if (i === 0) continue; // signo unario al inicio
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
      if (head) parts.push(head);
      start = cut; // operador se conserva al inicio del siguiente
    }
    const tail = latex.slice(start).trim();
    if (tail) parts.push(tail);
    return parts;
  }

  // Envuelve filas en un array de una columna con separadores de línea correctos (\\)
  function arrayOfRows(rows: string[]): string {
    const body = rows.map(r => r.trim()).filter(Boolean).join(' \\\\ ');
    return `\\begin{array}{l}\n${body}\n\\end{array}`;
  }

  // Construye multilínea sin delimitadores externos
  function breakIntoNLines(latex: string, lines: number): string | null {
    const rows = splitTopLevelByPlusMinus(latex, lines);
    if (!rows || rows.length < 2) return null;
    return arrayOfRows(rows);
  }

  // Encuentra el primer par \left ... \right (anidamiento soportado) y devuelve cortes
  function findFirstLeftRight(latex: string): null | {
    pre: string; inside: string; post: string; leftTok: string; rightTok: string;
  } {
    const L = latex.length;
    const matchWord = (s:string, i:number, w:string)=> s.slice(i, i+w.length)===w;
    const readDelimToken = (s:string, i:number): { tok:string, end:number } => {
      // i apunta al primer char del delimitador tras \left o \right (saltando espacios antes)
      let j = i;
      while (j < s.length && /\s/.test(s[j])) j++;
      if (j>=s.length) return { tok:'', end:j };
      if (s[j] === '\\') {
        // comando: \\{  ó \\langle, \\vert, etc.
        let k = j+1;
        if (k < s.length && !/[A-Za-z]/.test(s[k])) {
          // símbolo de un char como { } .
          return { tok: s.slice(j, k+1), end: k+1 };
        }
        while (k < s.length && /[A-Za-z]/.test(s[k])) k++;
        return { tok: s.slice(j, k), end: k };
      } else {
        // un solo char: ( [ ] ) | . etc
        return { tok: s[j], end: j+1 };
      }
    };

    // buscar \left
    let i = 0; let depthBraces = 0; let startLeft = -1; let afterLeftDelim = -1; let leftTok = '';
    while (i < L) {
      const ch = latex[i];
      if (ch === '\\') { i += 2; continue; }
      if (ch === '{') { depthBraces++; i++; continue; }
      if (ch === '}') { depthBraces = Math.max(0, depthBraces-1); i++; continue; }
      if (depthBraces===0 && matchWord(latex, i, '\\left')) {
        // leer delimitador
        let j = i + '\\left'.length;
        const d = readDelimToken(latex, j);
        startLeft = i; afterLeftDelim = d.end; leftTok = latex.slice(j, d.end);
        break;
      }
      i++;
    }
    if (startLeft === -1) return null;
    // buscar \right emparejado con anidamiento de \left/\right
    let depthLR = 1; let k = afterLeftDelim;
    while (k < L) {
      if (matchWord(latex, k, '\\left')) {
        depthLR++; k += '\\left'.length; continue;
      }
      if (matchWord(latex, k, '\\right')) {
        depthLR--; if (depthLR === 0) break; k += '\\right'.length; continue;
      }
      k++;
    }
    if (k >= L) return null;
    // k apunta a \\right. Capturar token de cierre
    const rightWordLen = '\\right'.length;
    const rightDel = readDelimToken(latex, k + rightWordLen);
    const pre = latex.slice(0, startLeft);
    const inside = latex.slice(afterLeftDelim, k);
    const post = latex.slice(rightDel.end);
    const rightTok = latex.slice(k + rightWordLen, rightDel.end);
    return { pre, inside, post, leftTok, rightTok };
  }

  // Inserta multilínea (array{l}) dentro del primer par \left...\right o en paréntesis toplevel
  function multilineInsideDelims(latex: string, lines: number): string | null {
    const found = findFirstLeftRight(latex);
    if (found) {
      const rows = splitTopLevelByPlusMinus(found.inside, lines);
      if (rows && rows.length >= 2) {
        const arr = arrayOfRows(rows);
        return `${found.pre}\\left${found.leftTok} ${arr} \\right${found.rightTok}${found.post}`;
      }
    }
    // Fallback: paréntesis toplevel simples
    let depth=0, start=-1, end=-1;
    for (let i=0;i<latex.length;i++){
      const ch = latex[i];
      if (ch==='\\') { i++; continue; }
      if (ch==='{' ) depth++;
      else if (ch==='}') depth=Math.max(0,depth-1);
      else if (ch==='(' && depth===0 && start===-1) start=i;
    }
    if (start!==-1){
      depth=0;
      for (let i=latex.length-1;i>start;i--){
        const ch = latex[i];
        if (ch==='\\') { i--; continue; }
        if (ch==='}') depth++;
        else if (ch==='{' ) depth=Math.max(0,depth-1);
        else if (ch===')' && depth===0) { end=i; break; }
      }
      if (end!==-1){
        const pre = latex.slice(0, start);
        const inside = latex.slice(start+1, end);
        const post = latex.slice(end+1);
        const rows = splitTopLevelByPlusMinus(inside, lines);
        if (rows && rows.length>=2){
          const arr = arrayOfRows(rows);
          return `${pre}( ${arr} )${post}`;
        }
      }
    }
    return null;
  }

  function measureRect(el: HTMLElement){ return el.getBoundingClientRect(); }

  async function fit() {
    if (isFitting) return; // evita reentradas
    isFitting = true;
    if (question !== lastQuestion) {
      renderExpr = question;
      usedMultiline = false;
      lastQuestion = question;
    }
    // construir candidatos (1..6 líneas)
    const candidates: { expr:string, lines:number }[] = [{ expr: question, lines: 1 }];
    const hasDelims = /\\left|\\right/.test(question);
    for (let n = 2; n <= 6; n++) {
      // Si hay delimitadores, solo anidar dentro de ellos
      if (hasDelims) {
        const inside = multilineInsideDelims(question, n);
        if (inside) candidates.push({ expr: inside, lines: n });
        continue;
      }
      const inside = multilineInsideDelims(question, n);
      if (inside) { candidates.push({ expr: inside, lines: n }); continue; }
      const b = breakIntoNLines(question, n);
      if (b) candidates.push({ expr: b, lines: n });
    }

    await tick(); // esperar inicial
    if (!containerEl || !fitboxEl) return;

    const maxWidth = containerEl.clientWidth - 48; // margen extra para delimitadores
    const maxHeight = containerEl.clientHeight - 16;

    let best = { expr: question, size: MIN_PX, lines:1 };

    for (const cand of candidates) {
      renderExpr = cand.expr; usedMultiline = cand.lines > 1;
      fontPx = BASE_PX; // medir a base
      await tick();
      const rect = measureRect(fitboxEl);
      if (rect.width === 0 || rect.height === 0) continue;
      const s = Math.min(maxWidth / rect.width, maxHeight / rect.height);
      const size = Math.max(MIN_PX, Math.min(MAX_PX, Math.floor(s * BASE_PX * 0.96)));
      if (size > best.size) best = { expr: cand.expr, size, lines: cand.lines };
    }

    // aplicar mejor opción
    if (renderExpr !== best.expr) renderExpr = best.expr;
    if (Math.abs(fontPx - best.size) > 0.5) fontPx = best.size;
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
  <div class="fitbox" bind:this={fitboxEl} style={`--fsize:${fontPx}px`}> 
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
  @media (max-width:900px){ .problem-display { font-size: 7rem; } }
  @media (max-width:600px){ .problem-wrapper { height:30vh; } .problem-display { font-size: 5rem; letter-spacing:1.5px; } }
  @media (max-height:640px){ .problem-wrapper { height:30vh; } }
</style>
