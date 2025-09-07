// =========================
// 🎨 PROBLEM RENDERING ENGINE V2
// Complete rewrite with modular rendering pipeline
// =========================

import { onMount, tick } from 'svelte';
import type { TextFittingResult, TextCandidate } from '../../types/game';
import { GAME_CONFIG } from '../../config/gameConfig';
import { useMultilineLogic } from './useMultiline';

/**
 * Advanced types for rendering pipeline
 */
export interface RenderContext {
  availableWidth: number;
  availableHeight: number;
  isMobile: boolean;
  viewport: 'small' | 'medium' | 'large';
  fontScale: number;
}

export interface RenderCandidate {
  content: string;
  layout: 'single' | 'multiline' | 'compact';
  fontSize: number;
  padding: { horizontal: number; vertical: number };
  score: number; // Quality score 0-1
  isValid: boolean;
}

export interface RenderingResult {
  finalContent: string;
  fontSize: number;
  layout: string;
  padding: RenderCandidate['padding'];
  usedSpace: { width: number; height: number };
}

/**
 * Input processor - determines content type and preprocessing needs
 */
class ContentProcessor {
  static analyzeContent(rawContent: string) {
    return {
      isLatex: /\\(dfrac|frac|sqrt|alpha|beta|gamma|cdot|times|plus|minus|div|sum|int)/.test(rawContent),
      containsMath: /[+\-×÷=<>≤≥≠≈∅∈∉∪∩∏∑∫]/.test(rawContent),
      length: rawContent.length,
      wordCount: rawContent.split(/\s+/).length,
      specialChars: (rawContent.match(/[{}()[\]|]/g) || []).length,
      hasNumbers: /\d/.test(rawContent)
    };
  }

  static preprocess(rawContent: string, contentType: { isLatex: boolean; containsMath: boolean }) {
    if (contentType.isLatex) {
      return this.preprocessLatex(rawContent);
    }
    return this.preprocessText(rawContent);
  }

  private static preprocessLatex(content: string) {
    // Add line breaks for very long expressions
    return content
      .replace(/([+\-=])/g, ' $1 ') // Add spaces around operators
      .replace(/\s{2,}/g, ' ') // Normalize spaces
      .trim();
  }

  private static preprocessText(content: string) {
    // Smart word wrapping preparation
    return content
      .replace(/(\d)([a-zA-Z])/g, '$1 $2') // Space between numbers and letters
      .replace(/([a-zA-Z])(\d)/g, '$1 $2') // Space between letters and numbers
      .replace(/\s{2,}/g, ' ')
      .trim();
  }
}

/**
 * Space calculator - determines available rendering area
 */
class SpaceCalculator {
  static getOptimalPadding(context: RenderContext): RenderCandidate['padding'] {
    const baseMobile = { horizontal: 0.25, vertical: 0.125 };
    const baseDesktop = { horizontal: 0.5, vertical: 0.25 };

    if (context.isMobile) {
      const reduction = Math.max(0.1, 1 - context.fontScale * 0.2);
      return {
        horizontal: baseMobile.horizontal * reduction,
        vertical: baseMobile.vertical * reduction
      };
    }

    const expansion = Math.min(2, 1 + (context.viewport === 'large' ? 0.5 : 0));
    return {
      horizontal: Math.min(1, baseDesktop.horizontal * expansion),
      vertical: Math.min(0.5, baseDesktop.vertical * expansion)
    };
  }

  static calculateEffectiveSpace(
    container: HTMLElement,
    padding: RenderCandidate['padding']
  ): RenderContext {
    const rect = container.getBoundingClientRect();
    const computed = window.getComputedStyle(container);

    // Account for existing padding and borders
    const existingPadLeft = parseFloat(computed.paddingLeft) || 0;
    const existingPadRight = parseFloat(computed.paddingRight) || 0;
    const existingPadTop = parseFloat(computed.paddingTop) || 0;
    const existingPadBottom = parseFloat(computed.paddingBottom) || 0;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    return {
      availableWidth: rect.width - existingPadLeft - existingPadRight - (padding.horizontal * 2),
      availableHeight: rect.height - existingPadTop - existingPadBottom - (padding.vertical * 2),
      isMobile: viewportWidth <= GAME_CONFIG.breakpoints.mobile,
      viewport: viewportWidth < 480 ? 'small' : viewportWidth < 1024 ? 'medium' : 'large',
      fontScale: Math.min(rect.width / viewportWidth, 1) // Responsive font scaling
    };
  }
}

/**
 * Layout optimizer - finds best rendering strategy
 */
class LayoutOptimizer {
  static generateCandidates(
    content: string,
    context: RenderContext,
    contentType: { isLatex: boolean; containsMath: boolean; length: number }
  ): RenderCandidate[] {
    const candidates: RenderCandidate[] = [];
    const baseFontSize = context.isMobile
      ? GAME_CONFIG.textSizing.mobile.baseFontSize
      : GAME_CONFIG.textSizing.desktop.baseFontSize;

    // Single line candidate
    candidates.push(this.createCandidate(content, 'single', baseFontSize, context, contentType));

    // Don't create multiline for very short content
    if (contentType.length < 15) return candidates;

    if (contentType.isLatex || contentType.containsMath) {
      // LaTeX multiline candidates
      const multilineLogic = useMultilineLogic(content);
      const multilineCandidates = multilineLogic.generateMultilineCandidates(content);

      multilineCandidates.forEach(multiline => {
        candidates.push(this.createCandidate(
          multiline.expr,
          'multiline',
          baseFontSize * (multiline.lines > 2 ? 0.85 : 0.95),
          context,
          contentType
        ));
      });

      // Force 2-line layout if content is long
      if (contentType.length > 25 && multilineCandidates.length === 0) {
        const forcedMultiline = multilineLogic.breakIntoNLines(content, 2);
        if (forcedMultiline) {
          candidates.push(this.createCandidate(
            forcedMultiline,
            'multiline',
            baseFontSize * 0.9,
            context,
            contentType
          ));
        }
      }

    } else {
      // Text word wrapping candidates
      candidates.push(this.createCandidate(content, 'multiline', baseFontSize * 0.95, context, contentType));
    }

    return candidates;
  }

  private static createCandidate(
    content: string,
    layout: string,
    baseSize: number,
    context: RenderContext,
    contentType: any
  ): RenderCandidate {
    const padding = SpaceCalculator.getOptimalPadding(context);

    return {
      content,
      layout: layout as any,
      fontSize: this.optimizeFontSize(baseSize, context, padding, contentType),
      padding,
      score: this.calculateScore(layout, context, contentType, baseSize),
      isValid: true
    };
  }

  private static optimizeFontSize(
    baseSize: number,
    context: RenderContext,
    padding: RenderCandidate['padding'],
    contentType: any
  ): number {
    let optimizedSize = baseSize;

    if (context.isMobile) {
      // More aggressive reduction on mobile
      if (context.viewport === 'small') {
        optimizedSize *= contentType.isLatex ? 0.75 : 0.85;
      } else {
        optimizedSize *= contentType.isLatex ? 0.85 : 0.9;
      }
    } else {
      optimizedSize *= 0.95; // Minor reduction for desktop stability
    }

    // Further reduce for very long content
    if (contentType.length > 30) {
      optimizedSize *= 0.9;
    }

    return Math.max(
      context.isMobile ? 12 : 16,
      Math.floor(optimizedSize * context.fontScale)
    );
  }

  private static calculateScore(
    layout: string,
    context: RenderContext,
    contentType: any,
    baseSize: number
  ): number {
    let score = 0.5;

    // Layout preferences
    if (layout === 'single' && contentType.length < 20) score += 0.3;
    if (layout === 'multiline' && contentType.length > 25) score += 0.25;
    if (layout === 'compact' && context.isMobile) score += 0.2;

    // Content type preferences
    if (contentType.isLatex && layout !== 'single') score += 0.1;
    if (contentType.containsMath) score += 0.1;

    // Size optimization
    if (baseSize > 40 && !context.isMobile) score += 0.1;

    return Math.min(1, score);
  }
}

/**
 * Render executor - applies final rendering decisions
 */
class RenderExecutor {
  static async testCandidate(
    candidate: RenderCandidate,
    context: RenderContext,
    fitbox: HTMLElement
  ): Promise<{ fits: boolean; actualSize: { width: number; height: number } }> {

    // Apply candidate content
    const testDiv = document.createElement('div');
    testDiv.innerHTML = candidate.content;
    testDiv.style.fontSize = `${candidate.fontSize}px`;
    testDiv.style.fontWeight = '700';
    testDiv.style.lineHeight = '1.12';
    testDiv.style.whiteSpace = candidate.layout === 'single' ? 'nowrap' : 'normal';
    testDiv.style.wordBreak = candidate.layout === 'multiline' ? 'break-word' : 'normal';
    testDiv.style.position = 'absolute';
    testDiv.style.visibility = 'hidden';
    testDiv.style.left = '-9999px';

    document.body.appendChild(testDiv);

    // Wait for font loading and layout
    await tick();
    await new Promise(resolve => setTimeout(resolve, 16));

    const actualRect = testDiv.getBoundingClientRect();
    const fits = actualRect.width <= context.availableWidth && actualRect.height <= context.availableHeight;

    document.body.removeChild(testDiv);

    return {
      fits,
      actualSize: { width: actualRect.width, height: actualRect.height }
    };
  }

  static applyRendering(
    result: RenderingResult,
    container: HTMLElement,
    fitbox: HTMLElement
  ): void {
    // Apply final CSS variables and classes
    container.style.setProperty('--render-font-size', `${result.fontSize}px`);
    container.style.setProperty('--render-padding-h', `${result.padding.horizontal}rem`);
    container.style.setProperty('--render-padding-v', `${result.padding.vertical}rem`);

    container.classList.add(`layout-${result.layout}`);
    container.classList.remove('overflowing'); // Remove overflow indicator
  }
}

/**
 * Simplified problem rendering engine - compatible with Svelte versions
 */
export function useProblemRenderer(
  question: string,
  containerEl: HTMLElement | null,
  fitboxEl: HTMLElement | null
): RenderingResult {
  // Simple initial values
  const result: RenderingResult = {
    finalContent: question,
    fontSize: 64,
    layout: 'single',
    padding: { horizontal: 0.5, vertical: 0.25 },
    usedSpace: { width: 0, height: 0 }
  };

  // Synchronous rendering logic for basic compatibility
  if (containerEl && fitboxEl) {
    try {
      // Simple content analysis
      const contentType = ContentProcessor.analyzeContent(question);
      const processedContent = ContentProcessor.preprocess(question, contentType);

      // Basic space calculation
      const availableWidth = containerEl.clientWidth || 400;
      const availableHeight = containerEl.clientHeight || 200;
      const isMobile = window.innerWidth <= GAME_CONFIG.breakpoints.mobile;

      // Optimize font size based on content and space
      let optimizedSize = isMobile ?
        GAME_CONFIG.textSizing.mobile.baseFontSize :
        GAME_CONFIG.textSizing.desktop.baseFontSize;

      if (contentType.length > 30) optimizedSize *= 0.8;
      if (isMobile && contentType.isLatex) optimizedSize *= 0.75;

      result.finalContent = processedContent;
      result.fontSize = Math.max(isMobile ? 12 : 16, Math.floor(optimizedSize));
      result.layout = (contentType.length > 20 && (contentType.isLatex || contentType.containsMath)) ? 'multiline' : 'single';
      result.padding = isMobile ? { horizontal: 0.25, vertical: 0.125 } : { horizontal: 0.5, vertical: 0.25 };

      // Apply minimal CSS
      containerEl.classList.add(`layout-${result.layout}`);
      containerEl.style.setProperty('--render-font-size', `${result.fontSize}px`);

    } catch (error) {
      console.warn('[ProblemRenderer] Rendering error:', error);
    }
  }

  return result;
}

// Legacy compatibility - maintains existing API
export function useTextFitting(
  question: string,
  containerEl: HTMLElement | null,
  fitboxEl: HTMLElement | null
) {
  const result = useProblemRenderer(question, containerEl, fitboxEl);

  return {
    fontPx: result.fontSize,
    renderExpr: result.finalContent,
    usedMultiline: result.layout === 'multiline',
    isFitting: false, // Not used in new system
    scheduleFit: () => {/* No-op */} // Not needed in new system
  };
}
