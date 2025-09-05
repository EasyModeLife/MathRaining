// =========================
// 🔀 USE MULTILINE HOOK
// Extract multiline logic for better separation of concerns
// =========================

import type { LatexExpression, MultilineConfig, ArrayFormatResult, DelimiterMatch } from '../../types/latex';
import type { TextCandidate } from '../../types/game';

/**
 * Hook for handling multiline LaTeX expression formatting
 * Separated from text fitting for better modularity
 */
export function useMultilineLogic(question: string) {
  /**
   * Calculate optimal number of lines for LaTeX expression
   */
  function calculateOptimalLines(latex: LatexExpression, maxLines = 6): number {
    const ops: number[] = [];
    let depth = 0;

    // Parse LaTeX to find operators at top level
    for (let i = 0; i < latex.length; i++) {
      const ch = latex[i];
      if (ch === '\\') {
        i++; // Skip command
        continue;
      }
      if (ch === '{') {
        depth++;
        continue;
      }
      if (ch === '}') {
        depth = Math.max(0, depth - 1);
        continue;
      }
      if (depth === 0 && (ch === '+' || ch === '-')) {
        if (i === 0) continue; // Skip unary operators
        ops.push(i);
      }
    }

    const totalTerms = ops.length + 1;
    const termsPerLine = 3;
    const requiredLines = Math.ceil(totalTerms / termsPerLine);
    return Math.max(1, Math.min(requiredLines, maxLines));
  }

  /**
   * Split LaTeX into terms per line
   */
  function splitByTermsPerLine(latex: LatexExpression, termsPerLine = 3): string[] | null {
    const ops: number[] = [];
    let depth = 0;

    // Find operators at top level
    for (let i = 0; i < latex.length; i++) {
      const ch = latex[i];
      if (ch === '\\') {
        i++;
        continue;
      }
      if (ch === '{') {
        depth++;
        continue;
      }
      if (ch === '}') {
        depth = Math.max(0, depth - 1);
        continue;
      }
      if (depth === 0 && (ch === '+' || ch === '-')) {
        if (i === 0) continue;
        ops.push(i);
      }
    }

    if (ops.length === 0) return null;

    const parts: string[] = [];
    let start = 0;

    // Split by terms per line
    for (let i = 0; i < ops.length; ) {
      const cutOps = ops.slice(i, i + termsPerLine);
      if (cutOps.length === 0) break;

      const lastOpIndex = cutOps[cutOps.length - 1];
      const segment = latex.slice(start, lastOpIndex).trim();
      if (segment) parts.push(segment);
      start = lastOpIndex;
      i += termsPerLine;
    }

    if (start < latex.length) {
      const tail = latex.slice(start).trim();
      if (tail) parts.push(tail);
    }

    return parts.length > 1 ? parts : null;
  }

  /**
   * Find first left-right delimiter pair
   */
  function findFirstLeftRight(latex: LatexExpression): DelimiterMatch | null {
    const L = latex.length;
    const matchWord = (s: string, i: number, w: string) => s.slice(i, i + w.length) === w;

    let startLeft = -1;
    let afterLeftDelim = -1;
    let leftTok = '';

    // Find \left
    for (let i = 0; i < L; i++) {
      if (matchWord(latex, i, '\\left')) {
        let j = i + '\\left'.length;
        // Skip whitespace
        while (j < latex.length && /\s/.test(latex[j])) j++;
        if (j < latex.length) {
          const ch = latex[j];
          leftTok = ch === '\\' ? latex.slice(j, j + 2) : ch;
          startLeft = i;
          afterLeftDelim = j + 1;
          break;
        }
      }
    }

    if (startLeft === -1) return null;

    // Find matching \right
    let depthLR = 1;
    let k = afterLeftDelim;
    while (k < L) {
      if (matchWord(latex, k, '\\left')) {
        depthLR++;
        k += '\\left'.length;
      } else if (matchWord(latex, k, '\\right')) {
        depthLR--;
        if (depthLR === 0) break;
        k += '\\right'.length;
      } else {
        k++;
      }
    }

    if (k >= L) return null;

    const rightDel = readDelimToken(latex, k + '\\right'.length);
    return {
      start: startLeft,
      end: rightDel.end,
      content: latex.slice(afterLeftDelim, k),
      leftDelim: leftTok,
      rightDelim: latex.slice(k + '\\right'.length, rightDel.end),
      depth: 0
    };
  }

  /**
   * Helper to read delimiter tokens
   */
  function readDelimToken(latex: LatexExpression, i: number) {
    let j = i;
    while (j < latex.length && /\s/.test(latex[j])) j++;
    if (j >= latex.length) return { tok: '', end: j };

    const ch = latex[j];
    if (ch === '\\') {
      let k = j + 1;
      if (k < latex.length && !/[A-Za-z]/.test(latex[k])) {
        return { tok: latex.slice(j, k + 1), end: k + 1 };
      }
      while (k < latex.length && /[A-Za-z]/.test(latex[k])) k++;
      return { tok: latex.slice(j, k), end: k };
    } else {
      return { tok: ch, end: j + 1 };
    }
  }

  /**
   * Insert multiline inside delimiters
   */
  function multilineInsideDelims(latex: LatexExpression, lines: number): string | null {
    const found = findFirstLeftRight(latex);
    if (found) {
      const rows = splitByTermsPerLine(found.content, Math.ceil(calculateOptimalLines(found.content) * 3 / lines));
      if (rows && rows.length >= 2) {
        const arr = arrayOfRows(rows);
        return `${latex.slice(0, found.start)}\\left${found.leftDelim} ${arr} \\right${found.rightDelim}${latex.slice(found.end)}`;
      }
    }

    // Fallback: parenthesized expressions
    let depth = 0;
    let start = -1;
    let end = -1;

    for (let i = 0; i < latex.length; i++) {
      const ch = latex[i];
      if (ch === '\\') {
        i++;
        continue;
      }
      if (ch === '{') depth++;
      else if (ch === '}') depth = Math.max(0, depth - 1);
      else if (ch === '(' && depth === 0) start = i;
    }

    if (start !== -1) {
      depth = 0;
      for (let i = latex.length - 1; i > start; i--) {
        const ch = latex[i];
        if (ch === '\\') {
          i--;
          continue;
        }
        if (ch === '}') depth++;
        else if (ch === '{') depth = Math.max(0, depth - 1);
        else if (ch === ')' && depth === 0) {
          end = i;
          break;
        }
      }

      if (end !== -1) {
        const pre = latex.slice(0, start);
        const inside = latex.slice(start + 1, end);
        const post = latex.slice(end + 1);
        const rows = splitByTermsPerLine(inside, Math.ceil(calculateOptimalLines(inside) * 3 / lines));
        if (rows && rows.length >= 2) {
          const arr = arrayOfRows(rows);
          return `${pre}( ${arr} )${post}`;
        }
      }
    }

    return null;
  }

  /**
   * Create centered LaTeX array
   */
  function arrayOfRows(rows: string[]): string {
    const body = rows.map(r => r.trim()).filter(Boolean).join(' \\\\ ');
    return `\\begin{array}{c}\n${body}\n\\end{array}`;
  }

  /**
   * Format multiline expression
   */
  function breakIntoNLines(latex: LatexExpression, lines: number): string | null {
    const rows = splitByTermsPerLine(latex, Math.ceil(calculateOptimalLines(latex) * 3 / lines));
    if (!rows || rows.length < 2) return null;
    return arrayOfRows(rows);
  }

  /**
   * Generate multiline candidates for fitting
   */
  function generateMultilineCandidates(question: string): TextCandidate[] {
    const optimalLines = calculateOptimalLines(question);
    const candidates: TextCandidate[] = [];

    if (optimalLines > 1) {
      const hasDelims = /\\left|\\right/.test(question);

      // Optimal lines candidate
      if (hasDelims) {
        const inside = multilineInsideDelims(question, optimalLines);
        if (inside) candidates.push({ expr: inside, lines: optimalLines, size: 0 });
      } else {
        const b = breakIntoNLines(question, optimalLines);
        if (b) candidates.push({ expr: b, lines: optimalLines, size: 0 });
      }

      // Additional candidates with fewer lines
      for (let n = optimalLines - 1; n >= 2; n--) {
        if (hasDelims) {
          const inside = multilineInsideDelims(question, n);
          if (inside) candidates.push({ expr: inside, lines: n, size: 0 });
        } else {
          const b = breakIntoNLines(question, n);
          if (b) candidates.push({ expr: b, lines: n, size: 0 });
        }
      }
    }

    return candidates;
  }

  // Return public API
  return {
    calculateOptimalLines,
    generateMultilineCandidates,
    breakIntoNLines,
    multilineInsideDelims,
    splitByTermsPerLine
  };
}

// Pure functions for LaTeX array formatting
export const latexFormatting = {
  /**
   * Create centered array from rows
   */
  createCenteredArray: (rows: string[]): string => {
    const body = rows.map(r => r.trim()).filter(Boolean).join(' \\\\ ');
    return `\\begin{array}{c}\n${body}\n\\end{array}`;
  },

  /**
   * Create left-aligned array (fallback)
   */
  createLeftAlignedArray: (rows: string[]): string => {
    const body = rows.map(r => r.trim()).filter(Boolean).join(' \\\\ ');
    return `\\begin{array}{l}\n${body}\n\\end{array}`;
  }
};
