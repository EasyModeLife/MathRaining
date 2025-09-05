// =========================
// ✂️ LATEX SPLITTER UTILITIES
// Pure functions for splitting LaTeX expressions
// =========================

import type { LatexExpression } from '../../types/latex';

/**
 * Split LaTeX expression by top-level operators
 */
export function splitByOperators(
  latex: LatexExpression,
  operators: string[] = ['+', '-']
): string[] {
  const terms: string[] = [];
  let currentTerm = '';
  let depth = 0;
  let inCommand = false;

  for (let i = 0; i < latex.length; i++) {
    const ch = latex[i];

    if (ch === '\\') {
      inCommand = true;
      currentTerm += ch;
    } else if (inCommand) {
      currentTerm += ch;

      // Handle specific commands
      if (latex.startsWith('\\left', i - '\\left'.length + 1)) {
        depth++;
      } else if (latex.startsWith('\\right', i - '\\right'.length + 1)) {
        depth = Math.max(0, depth - 1);
      }

      inCommand = false; // End of command character
    } else if (depth === 0 && operators.includes(ch)) {
      // Top-level operator found
      if (currentTerm.trim()) {
        terms.push(currentTerm.trim());
      }
      currentTerm = ch; // Start new term with operator
    } else {
      currentTerm += ch;

      // Handle bracket nesting
      if (ch === '{' || ch === '[' || ch === '(') {
        depth++;
      } else if (ch === '}' || ch === ']' || ch === ')') {
        depth = Math.max(0, depth - 1);
      }
    }
  }

  // Add remaining term
  if (currentTerm.trim()) {
    terms.push(currentTerm.trim());
  }

  return terms;
}

/**
 * Split expression while respecting delimiter nesting
 */
export function splitRespectingDelimiters(
  latex: LatexExpression,
  maxTermsPerLine: number = 3
): string[] {
  const terms = splitByOperators(latex);
  const lines: string[] = [];
  let currentLine: string[] = [];

  for (const term of terms) {
    currentLine.push(term);

    if (currentLine.length >= maxTermsPerLine) {
      lines.push(currentLine.join(' '));
      currentLine = [];
    }
  }

  // Add remaining terms
  if (currentLine.length > 0) {
    lines.push(currentLine.join(' '));
  }

  return lines;
}

/**
 * Calculate optimal split points for responsive design
 */
export function calculateOptimalSplit(
  latex: LatexExpression,
  availableWidth: number,
  approxCharWidth: number = 12
): { lines: string[]; estimatedWidth: number } {
  const maxCharsPerLine = Math.floor(availableWidth / approxCharWidth);
  const terms = splitByOperators(latex);

  // Simple algorithm: try different splits
  for (let termsPerLine = terms.length; termsPerLine >= 1; termsPerLine--) {
    const lines = splitIntoLines(terms, termsPerLine);
    const maxLineLength = Math.max(...lines.map(line => line.length));

    if (maxLineLength <= maxCharsPerLine) {
      return {
        lines,
        estimatedWidth: maxLineLength * approxCharWidth
      };
    }
  }

  // Fallback: single term per line
  const lines = terms;
  const estimatedWidth = Math.max(...lines.map(line => line.length)) * approxCharWidth;

  return { lines, estimatedWidth };
}

/**
 * Split terms into lines with specified terms per line
 */
function splitIntoLines(terms: string[], termsPerLine: number): string[] {
  const lines: string[] = [];

  for (let i = 0; i < terms.length; i += termsPerLine) {
    const lineTerms = terms.slice(i, i + termsPerLine);
    lines.push(lineTerms.join(' '));
  }

  return lines;
}

/**
 * Smart splitting that considers mathematical structure
 */
export function smartSplitExpression(
  latex: LatexExpression,
  context: {
    isMobile: boolean;
    termsPerLine: number;
    prioritizeEquals: boolean;
  }
): string[] {
  let terms: string[];

  if (context.prioritizeEquals && latex.includes('=')) {
    // Split around equals sign first
    const parts = latex.split('=');
    if (parts.length === 2) {
      terms = [parts[0] + '=', '=' + parts[1]];
    } else {
      terms = splitByOperators(latex);
    }
  } else {
    terms = splitByOperators(latex);
  }

  // Apply mobile-specific adjustments
  const maxTermsPerLine = context.isMobile
    ? Math.max(2, context.termsPerLine - 1)
    : context.termsPerLine;

  return splitIntoLines(terms, maxTermsPerLine);
}

/**
 * Extract terms considering mathematical semantics
 */
export function extractMathematicalTerms(latex: LatexExpression): {
  terms: string[];
  operators: string[];
  structure: 'simple' | 'equation' | 'expression';
} {
  const operators: string[] = [];
  const terms: string[] = [];
  let currentTerm = '';
  let structure: 'simple' | 'equation' | 'expression' = 'simple';

  // Detect equation
  if (latex.includes('=')) {
    structure = 'equation';
  } else if (/[+\-]/.test(latex)) {
    structure = 'expression';
  }

  for (let i = 0; i < latex.length; i++) {
    const ch = latex[i];

    if (['+', '-', '='].includes(ch) && currentTerm.trim()) {
      terms.push(currentTerm.trim());
      operators.push(ch);
      currentTerm = '';
    } else {
      currentTerm += ch;
    }
  }

  if (currentTerm.trim()) {
    terms.push(currentTerm.trim());
  }

  return { terms, operators, structure };
}

/**
 * Split expression for display with width constraints
 */
export function splitForWidth(
  latex: LatexExpression,
  maxWidth: number,
  fontSize: number
): {
  lines: string[];
  totalHeight: number;
  maxWidthUsed: number;
} {
  // Estimate character width based on font size
  const charWidth = fontSize * 0.6; // Rough estimate
  const maxChars = Math.floor(maxWidth / charWidth);

  const terms = extractMathematicalTerms(latex).terms;
  const lines: string[] = [];

  let currentLine = '';
  let currentChars = 0;

  for (const term of terms) {
    const termLength = term.length;

    if (currentChars + termLength + 1 <= maxChars) {
      // Add to current line
      if (currentLine) currentLine += ' ' + term;
      else currentLine = term;
      currentChars += termLength + (currentLine ? 1 : 0);
    } else {
      // Start new line
      if (currentLine) lines.push(currentLine);
      currentLine = term;
      currentChars = termLength;
    }
  }

  if (currentLine) lines.push(currentLine);

  return {
    lines,
    totalHeight: lines.length * fontSize * 1.2, // Line height estimate
    maxWidthUsed: Math.max(...lines.map(line => line.length)) * charWidth
  };
}
