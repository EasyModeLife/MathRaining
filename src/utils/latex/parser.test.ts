import { describe, it, expect } from 'vitest';
import {
  parseLatexDelimiters,
  extractDelimiterContent,
  detectDelimiterTypes,
  getTopLevelOperatorCount,
  analyzeLatexComplexity
} from './parser';

describe('LaTeX Parser Utilities', () => {
  describe('parseLatexDelimiters', () => {
    it('should parse simple parentheses delimiters', () => {
      const latex = '\\left(a + b\\right)';
      const result = parseLatexDelimiters(latex);

      expect(result.left).toHaveLength(1);
      expect(result.right).toHaveLength(1);
      expect(result.pairs).toHaveLength(1);
      expect(result.pairs[0].leftChar).toBe('(');
      expect(result.pairs[0].rightChar).toBe(')');
    });

    it('should handle nested delimiters', () => {
      const latex = '\\left[\\left(a\\right) + b\\right]';
      const result = parseLatexDelimiters(latex);

      expect(result.left).toHaveLength(2);
      expect(result.right).toHaveLength(2);
      expect(result.pairs).toHaveLength(2);
    });

    it('should handle mixed delimiter types', () => {
      const latex = '\\left(a\\right]\\left[b\\right)';
      const result = parseLatexDelimiters(latex);

      expect(result.pairs).toHaveLength(2);
      expect(result.pairs[0].leftChar).toBe('(');
      expect(result.pairs[0].rightChar).toBe(']');
      expect(result.pairs[1].leftChar).toBe('[');
      expect(result.pairs[1].rightChar).toBe(')');
    });
  });

  describe('extractDelimiterContent', () => {
    it('should extract content from delimiters', () => {
      const latex = '\\left(a + b\\right)';
      const contents = extractDelimiterContent(latex);

      expect(contents).toHaveLength(1);
      expect(contents[0].content).toBe('a + b');
    });

    it('should extract multiple delimiter contents', () => {
      const latex = '\\left(a\\right) + \\left(b + c\\right)';
      const contents = extractDelimiterContent(latex);

      expect(contents).toHaveLength(2);
      expect(contents[0].content).toBe('a');
      expect(contents[1].content).toBe('b + c');
    });
  });

  describe('detectDelimiterTypes', () => {
    it('should detect parentheses', () => {
      const result = detectDelimiterTypes('\\left(a + b\\right)');
      expect(result.hasParentheses).toBe(true);
      expect(result.hasLeftRightDelims).toBe(true);
    });

    it('should detect brackets', () => {
      const result = detectDelimiterTypes('\\left[a + b\\right]');
      expect(result.hasBrackets).toBe(true);
      expect(result.hasLeftRightDelims).toBe(true);
    });

    it('should detect braces', () => {
      const result = detectDelimiterTypes('\\left{a + b\\right}');
      expect(result.hasBraces).toBe(true);
      expect(result.hasLeftRightDelims).toBe(true);
    });

    it('should detect complex expressions', () => {
      const result = detectDelimiterTypes('\\frac{a}{b} + \\sqrt{c}');
      expect(result.isComplex).toBe(true);
    });
  });

  describe('getTopLevelOperatorCount', () => {
    it('should count simple operators', () => {
      const result = getTopLevelOperatorCount('a + b - c');
      expect(result.operators).toBe(2);
      expect(result.depth).toBe(0);
    });

    it('should ignore operators inside delimiters', () => {
      const result = getTopLevelOperatorCount('a + \\left(b + c\\right) - d');
      expect(result.operators).toBe(2); // Only top-level + and -
    });

    it('should handle nested delimiters', () => {
      const result = getTopLevelOperatorCount('\\left(a + \\left(b + c\\right)\\right)');
      expect(result.operators).toBe(0); // All operators are inside delimiters
    });
  });

  describe('analyzeLatexComplexity', () => {
    it('should analyze simple expression', () => {
      const result = analyzeLatexComplexity('a + b + c');

      expect(result.length).toBe(9);
      expect(result.hasFractions).toBe(false);
      expect(result.hasIntegrals).toBe(false);
      expect(result.complexity).toBeLessThanOrEqual(2);
      expect(result.complexityLabel).toBe('simple');
    });

    it('should analyze complex expression', () => {
      const result = analyzeLatexComplexity('\\int_{0}^{\\infty} \\frac{x^2 + 2x + 1}{(x + 1)^3} dx');

      expect(result.hasFractions).toBe(true);
      expect(result.hasIntegrals).toBe(true);
      expect(result.hasParentheses).toBe(true); // Uses regular parentheses, not \left\right
      expect(result.complexity).toBeGreaterThanOrEqual(5);
      expect(result.complexityLabel).toBe('complex');
    });

    it('should handle fractions', () => {
      const result = analyzeLatexComplexity('\\frac{a + b}{c - d}');
      expect(result.hasFractions).toBe(true);
      expect(result.complexity).toBeGreaterThanOrEqual(2);
    });

    it('should analyze empty string', () => {
      const result = analyzeLatexComplexity('');
      expect(result.length).toBe(0);
      expect(result.complexityLabel).toBe('simple');
    });
  });
});
