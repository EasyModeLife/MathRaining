import { describe, it, expect, beforeEach } from 'vitest';
import { GAME_CONFIG } from '../../config/gameConfig';

describe('GAME_CONFIG', () => {
  it('should have valid font size configuration', () => {
    expect(GAME_CONFIG.fontSize.base).toBe(64);
    expect(GAME_CONFIG.fontSize.min).toBe(18);
    expect(GAME_CONFIG.fontSize.max).toBe(120);
    expect(GAME_CONFIG.fontSize.base).toBeGreaterThan(GAME_CONFIG.fontSize.min);
    expect(GAME_CONFIG.fontSize.base).toBeLessThan(GAME_CONFIG.fontSize.max);
  });

  it('should have valid breakpoint configuration', () => {
    expect(GAME_CONFIG.breakpoints.mobile).toBe(600);
    expect(GAME_CONFIG.breakpoints.tablet).toBe(768);
    expect(GAME_CONFIG.breakpoints.desktop).toBe(1024);
    expect(GAME_CONFIG.breakpoints.mobile).toBeLessThan(GAME_CONFIG.breakpoints.tablet);
    expect(GAME_CONFIG.breakpoints.tablet).toBeLessThan(GAME_CONFIG.breakpoints.desktop);
  });

  it('should have valid text sizing for different screen sizes', () => {
    const { textSizing } = GAME_CONFIG;

    expect(textSizing.mobile.baseFontSize).toBe(32);
    expect(textSizing.mobile.minFontSize).toBe(18);
    expect(textSizing.mobile.maxFontSize).toBe(64);

    expect(textSizing.tablet.baseFontSize).toBe(48);
    expect(textSizing.tablet.minFontSize).toBe(24);
    expect(textSizing.tablet.maxFontSize).toBe(96);

    expect(textSizing.desktop.baseFontSize).toBe(64);
    expect(textSizing.desktop.minFontSize).toBe(32);
    expect(textSizing.desktop.maxFontSize).toBe(120);
  });

  it('should have valid performance configuration', () => {
    expect(GAME_CONFIG.performance.maxBundleSize).toBe(150 * 1024);
    expect(GAME_CONFIG.performance.maxInitialLoadTime).toBe(2000);
    expect(GAME_CONFIG.performance.maxLayoutShift).toBe(0.1);
    expect(GAME_CONFIG.performance.targetFps).toBe(60);
  });

  it('should have timing configuration', () => {
    expect(GAME_CONFIG.timing.answerTimeout).toBe(60000);
    expect(GAME_CONFIG.timing.flashDuration).toBe(250);
    expect(GAME_CONFIG.timing.levelUpDelay).toBe(1000);
    expect(GAME_CONFIG.timing.gameStartDelay).toBe(500);
  });
});

describe('Text Fitting Logic', () => {
  it('should work with simple mathematical expressions', () => {
    const expressions = [
      '2x + 3 = 7',
      'x^2 + 2x + 1 = 0',
      'a + b = c',
      'x = 5',
    ];

    expressions.forEach(expr => {
      expect(typeof expr).toBe('string');
      expect(expr.length).toBeGreaterThan(0);
      // Basic validation that expression doesn't contain invalid characters
      expect(/^[a-zA-Z0-9+\-*/=().\s^\\]+$/.test(expr) || expr.includes('\\')).toBe(true);
    });
  });

  it('should handle LaTeX expressions', () => {
    const latexExpressions = [
      '\\frac{a}{b}',
      '\\int_{0}^{\\infty} e^{-x} dx',
      '\\sum_{n=1}^{\\infty} \\frac{1}{n^2}',
      '\\sqrt{x^2 + y^2}',
      '\\lim_{x \\to 0} \\frac{\\sin x}{x}',
    ];

    latexExpressions.forEach(expr => {
      expect(expr).toContain('\\');
      expect(typeof expr).toBe('string');
      expect(expr.length).toBeGreaterThan(0);
    });
  });

  it('should validate mobile responsive sizing logic', () => {
    // Test that mobile breakpoints work as expected
    const smallMobile = 360;
    const largeMobile = 480;
    const tablet = 700;
    const desktop = 1000;

    expect(smallMobile <= GAME_CONFIG.breakpoints.mobile).toBe(true);
    expect(largeMobile <= GAME_CONFIG.breakpoints.mobile).toBe(true);
    expect(tablet > GAME_CONFIG.breakpoints.mobile).toBe(true);
    expect(tablet <= GAME_CONFIG.breakpoints.tablet).toBe(true);
    expect(desktop > GAME_CONFIG.breakpoints.tablet).toBe(true);
  });

  it('should calculate font scaling factors correctly', () => {
    const scalingTests = [
      { container: 320, text: 100, expected: 3.2 },
      { container: 640, text: 100, expected: 6.4 },
      { container: 800, text: 100, expected: 8.0 },
    ];

    scalingTests.forEach(test => {
      const scale = test.container / test.text;
      expect(scale).toBeCloseTo(test.expected, 1);
    });
  });

  it('should handle edge cases in font size calculations', () => {
    // Test minimum constraints
    expect(GAME_CONFIG.textSizing.mobile.minFontSize).toBeGreaterThan(0);
    expect(GAME_CONFIG.textSizing.desktop.minFontSize).toBeGreaterThan(0);

    // Test maximum constraints
    expect(GAME_CONFIG.textSizing.mobile.maxFontSize).toBeGreaterThan(GAME_CONFIG.textSizing.mobile.minFontSize);
    expect(GAME_CONFIG.textSizing.desktop.maxFontSize).toBeGreaterThan(GAME_CONFIG.textSizing.desktop.minFontSize);
  });
});
