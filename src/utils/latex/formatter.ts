// =========================
// 📝 LATEX FORMATTER UTILITIES
// Pure functions for LaTeX expression formatting
// =========================

import type { LatexExpression } from '../../types/latex';

/**
 * Create centered LaTeX array from rows
 */
export function createCenteredArray(rows: string[]): string {
  if (rows.length === 0) return '';

  // Filter out empty rows and join with LaTeX line breaks
  const validRows = rows.map(row => row.trim()).filter(row => row.length > 0);

  if (validRows.length === 0) return '';
  if (validRows.length === 1) return validRows[0];

  const body = validRows.join(' \\\\ ');
  return `\\begin{array}{c}\n${body}\n\\end{array}`;
}

/**
 * Create left-aligned LaTeX array from rows (fallback)
 */
export function createLeftAlignedArray(rows: string[]): string {
  if (rows.length === 0) return '';

  const validRows = rows.map(row => row.trim()).filter(row => row.length > 0);

  if (validRows.length === 0) return '';
  if (validRows.length === 1) return validRows[0];

  const body = validRows.join(' \\\\ ');
  return `\\begin{array}{l}\n${body}\n\\end{array}`;
}

/**
 * Format multiline expression by splitting at operators
 */
export function formatMultilineExpression(
  latex: LatexExpression,
  maxTermsPerLine: number = 3
): string | null {
  const terms = splitByTopLevelOperators(latex, maxTermsPerLine);

  if (terms.length <= 1) return null;

  return createCenteredArray(terms);
}

/**
 * Split LaTeX expression by top-level operators (+ and -)
 */
function splitByTopLevelOperators(latex: LatexExpression, maxTerms: number = 3): string[] {
  const terms: string[] = [];
  let currentTerm = '';
  let depth = 0;

  for (let i = 0; i < latex.length; i++) {
    const ch = latex[i];

    if (ch === '\\') {
      // Handle LaTeX commands
      if (latex.startsWith('\\left', i)) {
        depth++;
      } else if (latex.startsWith('\\right', i)) {
        depth = Math.max(0, depth - 1);
      }
      currentTerm += ch;
      i++; // Skip next character of command
      if (i < latex.length) currentTerm += latex[i];
    } else if (depth === 0 && (ch === '+' || ch === '-')) {
      // Top-level operator - split here
      if (currentTerm.trim()) {
        terms.push(currentTerm.trim());
      }
      currentTerm = ch; // Start new term with operator
    } else {
      currentTerm += ch;
    }
  }

  // Add remaining term
  if (currentTerm.trim()) {
    terms.push(currentTerm.trim());
  }

  return terms;
}

/**
 * Format expression inside delimiters with multiline
 */
export function formatInsideDelimiters(
  latex: LatexExpression,
  termsPerLine: number = 3
): { content: string; original: string } | null {
  // Find \left...\right pair
  const leftMatch = latex.match(/(\\left\s*[({[])/);
  const rightMatch = latex.match(/(\\right\s*[)}\]])/);

  if (!leftMatch || !rightMatch) return null;

  const leftIndex = leftMatch.index!;
  const leftEnd = leftIndex + leftMatch[0].length;
  const rightIndex = rightMatch.index!;

  const pre = latex.slice(0, leftEnd);
  const inside = latex.slice(leftEnd, rightIndex);
  const post = latex.slice(rightIndex);

  // Try to format inside content
  const formattedInside = formatMultilineExpression(inside, termsPerLine);

  if (!formattedInside) return null;

  return {
    content: pre + formattedInside + post,
    original: latex
  };
}

/**
 * Optimize LaTeX expression for rendering
 */
export function optimizeLatexExpression(latex: LatexExpression): LatexExpression {
  return latex
    // Normalize spacing around operators
    .replace(/\s*\+\s*/g, ' + ')
    .replace(/\s*-\s*/g, ' - ')
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Create compact single-line expression
 */
export function createCompactExpression(latex: LatexExpression): LatexExpression {
  return latex
    .replace(/\s+/g, '') // Remove all whitespace
    .replace(/\s*([+\-])\s*/g, '$1') // Remove spaces around operators
    .trim();
}

/**
 * Balance delimiters in LaTeX expression
 */
export function balanceDelimiters(latex: LatexExpression): LatexExpression {
  let result = latex;
  let leftCount = (latex.match(/\\left/g) || []).length;
  let rightCount = (latex.match(/\\right/g) || []).length;

  // Add missing \right delimiters
  while (rightCount < leftCount) {
    result += '\\right)';
    rightCount++;
  }

  // Note: We can't easily add missing \left because we don't know where to place them
  // This is handled by the multiline formatting functions

  return result;
}
