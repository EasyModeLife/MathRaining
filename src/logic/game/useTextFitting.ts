import { onMount, tick } from 'svelte';
import type { TextFittingResult, TextCandidate } from '../../types/game';
import { GAME_CONFIG } from '../../config/gameConfig';
import { useMultilineLogic } from './useMultiline';

// =========================
// 🔧 USE TEXT FITTING HOOK
// Modular text fitting logic with mobile support
// =========================

/**
 * Hook for automatic text size fitting in containers
 * Handles mobile-specific sizing and multiline detection
 */
export function useTextFitting(
  question: string,
  containerEl: HTMLElement | null,
  fitboxEl: HTMLElement | null
) {
  let fontPx: number = GAME_CONFIG.fontSize.base; // Start with base font size
  let renderExpr = question;
  let usedMultiline = false;
  let lastQuestion = '';
  let fitQueued = false;
  let isFitting = false;

  // Use the multiline logic hook instead of duplicating code
  const multilineLogic = useMultilineLogic(question);

  /**
   * Measure DOM element
   */
  function measureRect(el: HTMLElement) {
    return el.getBoundingClientRect();
  }

  /**
   * Main text fitting algorithm
   */
  async function fit() {
    if (isFitting) return;
    isFitting = true;

    // Mobile-specific font sizes
    const isMobile = window.innerWidth <= GAME_CONFIG.breakpoints.mobile;
    if (isMobile) {
      const vw = window.innerWidth;
      if (vw <= 360) {
        fontPx = GAME_CONFIG.textSizing.mobile.baseFontSize; // 32px
      } else if (vw <= 480) {
        fontPx = 32; // Small mobile
      } else {
        fontPx = 40; // Regular mobile
      }
    } else {
      fontPx = GAME_CONFIG.textSizing.desktop.baseFontSize; // 64px for desktop/tablet
    }

    // Update expression if question changed
    if (question !== lastQuestion) {
      renderExpr = question;
      usedMultiline = false;
      lastQuestion = question;
    }

    const optimalLines = multilineLogic.calculateOptimalLines(question);
    const candidates: TextCandidate[] = [{ expr: question, lines: 1, size: 0 }];

    // Use the multiline candidates from the separate hook
    const multilineCandidates = multilineLogic.generateMultilineCandidates(question);
    candidates.push(...multilineCandidates);

    await tick();

    if (!containerEl || !fitboxEl) {
      isFitting = false;
      return;
    }

    const maxWidth = containerEl.clientWidth - (isMobile ? 32 : 48);
    const maxHeight = containerEl.clientHeight - (isMobile ? 12 : 16);

    let best: TextCandidate = { expr: question, size: GAME_CONFIG.textSizing.desktop.minFontSize, lines: 1 };

    // Test each candidate
    for (const cand of candidates) {
      renderExpr = cand.expr;
      usedMultiline = cand.lines > 1;

      const testSize = fontPx;
      const rect = measureRect(fitboxEl);

      if (rect.width > 0 && rect.height > 0) {
        const scale = Math.min(maxWidth / rect.width, maxHeight / rect.height);
        const calculatedSize = Math.max(
          isMobile ? GAME_CONFIG.textSizing.mobile.minFontSize : GAME_CONFIG.textSizing.desktop.minFontSize,
          Math.min(isMobile ? GAME_CONFIG.textSizing.mobile.maxFontSize : GAME_CONFIG.textSizing.desktop.maxFontSize,
          Math.floor(scale * testSize * 0.96))
        );

        if (calculatedSize > best.size) {
          best = { expr: cand.expr, size: calculatedSize, lines: cand.lines };
        }
      }
    }

    // Apply best result
    if (renderExpr !== best.expr) renderExpr = best.expr;
    if (Math.abs(fontPx - best.size) > 0.5) fontPx = best.size;

    isFitting = false;
  }

  /**
   * Queue fit operation
   */
  function scheduleFit() {
    if (fitQueued) return;
    fitQueued = true;
    requestAnimationFrame(async () => {
      fitQueued = false;
      await fit();
    });
  }

  // Initialize fitting on mount
  onMount(() => {
    scheduleFit();

    const onResize = () => scheduleFit();
    window.addEventListener('resize', onResize);

    // ResizeObserver for container changes
    let ro: ResizeObserver | null = null;
    let roBox: ResizeObserver | null = null;

    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(() => scheduleFit());
      roBox = new ResizeObserver(() => scheduleFit());

      if (containerEl) ro.observe(containerEl);
      if (fitboxEl) roBox.observe(fitboxEl);
    }

    // Retry for lazy-loaded content
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

  // Refit when question changes
  $: if (question !== lastQuestion) {
    scheduleFit();
  }

  return {
    fontPx,
    renderExpr,
    usedMultiline,
    isFitting,
    scheduleFit
  };
}
