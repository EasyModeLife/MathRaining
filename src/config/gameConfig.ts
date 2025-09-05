// =========================
// ⚙️ GAME CONFIGURATION
// Centralizado configuration system
// =========================

import type { ResponsiveSizingConfig, Breakpoints } from '../types/responsive';

// Breakpoints
export const BREAKPOINTS: Breakpoints = {
  mobile: 600,
  tablet: 768,
  desktop: 1024
} as const;

// Font size configurations per device type
export const BASE_FONT_SIZE = {
  mobile: 28,
  tablet: 48,
  desktop: 64
} as const;

export const MIN_FONT_SIZE = {
  mobile: 18,
  tablet: 24,
  desktop: 32
} as const;

export const MAX_FONT_SIZE = {
  mobile: 64,
  tablet: 96,
  desktop: 120
} as const;

export const RESPONSIVE_SIZING: ResponsiveSizingConfig = {
  breakpoints: BREAKPOINTS,
  fontScaling: {
    mobile: {
      baseSize: BASE_FONT_SIZE.mobile,
      minSize: MIN_FONT_SIZE.mobile,
      maxSize: MAX_FONT_SIZE.mobile,
      scalingFactor: 1.2
    },
    tablet: {
      baseSize: BASE_FONT_SIZE.tablet,
      minSize: MIN_FONT_SIZE.tablet,
      maxSize: MAX_FONT_SIZE.tablet,
      scalingFactor: 1.15
    },
    desktop: {
      baseSize: BASE_FONT_SIZE.desktop,
      minSize: MIN_FONT_SIZE.desktop,
      maxSize: MAX_FONT_SIZE.desktop,
      scalingFactor: 1.1
    }
  },
  containerQueries: {
    enabled: true,
    baseSize: 64,
    maxWidth: 800
  }
} as const;

// LaTeX processing configuration
export const LATEX_CONFIG = {
  maxLines: 6,
  termsPerLine: 3,
  arrayAlignment: 'center',
  delimiterProcessing: {
    enabled: true,
    preserveDelimiters: true
  }
} as const;

// Game constants
export const GAME_CONFIG = {
  fontSizeRange: {
    min: 18,
    max: 120,
    base: 64
  },
  multilineOptions: {
    termsPerLine: 3,
    maxLines: 6,
    centerArrays: true
  },
  responsiveBreakpoints: BREAKPOINTS
} as const;

// Feature flags for gradual rollout
export const FEATURES = {
  enableResponsiveTextFitting: true,
  enableMobileMultiline: true,
  enableContainerQueries: true,
  enableTypeScriptMigration: true
} as const;
