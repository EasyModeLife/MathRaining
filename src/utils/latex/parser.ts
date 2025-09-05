// =========================
// 📝 LATEX PARSER UTILITIES
// Pure functions for LaTeX expression parsing
// =========================

import type { LatexExpression } from '../../types/latex';

/**
 * Parse LaTeX expression to extract delimiter information
 */
export function parseLatexDelimiters(latex: LatexExpression) {
  const delimiters = {
    left: [] as { pos: number; char: string }[],
    right: [] as { pos: number; char: string }[],
    pairs: [] as { start: number; end: number; leftChar: string; rightChar: string }[]
  };

  let depth = 0;
  const pairs: number[] = [];

  for (let i = 0; i < latex.length; i++) {
    if (latex.startsWith('\\left', i)) {
      const leftChar = latex[i + '\\left'.length] || '(';
      delimiters.left.push({ pos: i, char: leftChar });
      pairs.push(i);
      depth++;
      i += '\\left'.length; // Skip command
    } else if (latex.startsWith('\\right', i)) {
      const rightChar = latex[i + '\\right'.length] || ')';
      delimiters.right.push({ pos: i, char: rightChar });
      if (pairs.length > 0) {
        const startPos = pairs.pop()!;
        delimiters.pairs.push({
          start: startPos,
          end: i,
          leftChar: delimiters.left.find(d => d.pos === startPos)?.char || '(',
          rightChar: rightChar
        });
      }
      depth = Math.max(0, depth - 1);
      i += '\\right'.length; // Skip command
    }
  }

  return delimiters;
}

/**
 * Extract content between left-right delimiter pairs
 */
export function extractDelimiterContent(latex: LatexExpression) {
  const delimiters = parseLatexDelimiters(latex);
  const contents: { content: string; start: number; end: number }[] = [];

  for (const pair of delimiters.pairs) {
    const start = pair.start + '\\left'.length + 1; // Skip \left + delimiter
    const end = pair.end;
    const content = latex.slice(start, end);
    contents.push({ content, start: pair.start, end: pair.end });
  }

  return contents;
}

/**
 * Detect delimiter types in LaTeX expression
 */
export function detectDelimiterTypes(latex: LatexExpression) {
  return {
    hasParentheses: /\([^)]*\)/.test(latex) || /\\left\([^)]*\\right\)/.test(latex),
    hasBrackets: /\[[^\]]*\]/.test(latex) || /\\left\[[^\]]*\\right\]/.test(latex),
    hasBraces: /\{[^}]*\}/.test(latex) || /\\left\{[^}]*\\right\}/.test(latex),
    hasLeftRightDelims: /\\left|\\right/.test(latex),
    isComplex: (/\\frac|\\sqrt|\\int|\\sum/.test(latex))
  };
}

/**
 * Get operator count at top level (outside delimiters)
 */
export function getTopLevelOperatorCount(latex: LatexExpression) {
  let operators = 0;
  let depth = 0;

  for (let i = 0; i < latex.length; i++) {
    const ch = latex[i];

    if (ch === '\\') {
      // Handle LaTeX commands
      if (latex.startsWith('\\left', i)) {
        depth++;
        i += '\\left'.length - 1;
      } else if (latex.startsWith('\\right', i)) {
        depth = Math.max(0, depth - 1);
        i += '\\right'.length - 1;
      } else {
        i++; // Skip other commands
      }
    } else if (depth === 0 && (ch === '+' || ch === '-')) {
      operators++;
    }
  }

  return { operators, depth };
}

/**
 * Analyze LaTeX expression complexity
 */
export function analyzeLatexComplexity(latex: LatexExpression) {
  const analysis = {
    length: latex.length,
    hasFractions: /\\frac/.test(latex),
    hasIntegrals: /\\int/.test(latex),
    hasSums: /\\sum/.test(latex),
    hasRoots: /\\sqrt/.test(latex),
    hasDelimiters: /\\left|\\right/.test(latex),
    ...getTopLevelOperatorCount(latex),
    ...detectDelimiterTypes(latex)
  };

  // Complexity score
  let complexity = 0;
  if (analysis.hasFractions) complexity += 2;
  if (analysis.hasIntegrals) complexity += 3;
  if (analysis.hasSums) complexity += 3;
  if (analysis.hasRoots) complexity += 2;
  if (analysis.hasDelimiters) complexity += 1;
  if (analysis.operators > 3) complexity += 2;
  if (analysis.length > 100) complexity += 1;

  return {
    ...analysis,
    complexity,
    complexityLabel: complexity <= 2 ? 'simple' : complexity <= 5 ? 'medium' : 'complex'
  };
}
