// =========================
// 📝 LATEX TYPES
// =========================

// LaTeX expression types
export type LatexExpression = string;

// LaTeX parsing result
export interface LatexParseResult {
  original: string;
  simplified: string;
  hasDelims: boolean;
  complexity: 'simple' | 'medium' | 'complex';
}

// Multiline configuration
export interface MultilineConfig {
  maxLines: number;
  termsPerLine: number;
  currentLine: number;
  isNested: boolean;
}

// LaTeX formatting options
export interface LatexFormatOptions {
  centerAlignment: boolean;
  compactSpacing: boolean;
  preserveDelimiters: boolean;
}

// LaTeX render context
export interface LatexRenderContext {
  containerWidth: number;
  containerHeight: number;
  currentFontSize: number;
  isMobile: boolean;
}

// Array formatting result
export interface ArrayFormatResult {
  latex: string;
  lineCount: number;
  isCentered: boolean;
}

// Delimiter matching result
export interface DelimiterMatch {
  start: number;
  end: number;
  content: string;
  leftDelim: string;
  rightDelim: string;
  depth: number;
}
