import type { TextSizeConfig, ResponsiveSizingConfig, ScreenSize } from '../types/game';

export const GAME_CONFIG = {
  // Text sizing configuration for different screen sizes
  textSizing: {
    mobile: {
      baseFontSize: 32,
      maxFontSize: 64,
      minFontSize: 18,
      scalingFactor: 1.2
    },
    tablet: {
      baseFontSize: 48,
      maxFontSize: 96,
      minFontSize: 24,
      scalingFactor: 1.1
    },
    desktop: {
      baseFontSize: 64,
      maxFontSize: 120,
      minFontSize: 32,
      scalingFactor: 1.0
    }
  } as const satisfies Record<ScreenSize, TextSizeConfig>,

  // Breakpoints for responsive design
  breakpoints: {
    mobile: 600,
    tablet: 768,
    desktop: 1024
  } as const,

  // Game timings and limits
  timing: {
    answerTimeout: 60000, // 60 seconds
    flashDuration: 250,   // 250ms for correct/incorrect feedback
    levelUpDelay: 1000,   // 1 second delay after correct answer
    gameStartDelay: 500   // 0.5 second delay before starting
  } as const,

  // Font size constants
  fontSize: {
    base: 64,
    min: 18,
    max: 120,
    scalingSteps: [18, 24, 32, 48, 64, 96, 120]
  } as const,

  // Storage keys for localStorage
  storage: {
    theme: 'mathraining-theme',
    gameProgress: 'mathraining-progress',
    settings: 'mathraining-settings',
    highScores: 'mathraining-highscores'
  } as const,

  // Feature flags
  features: {
    enableHighScores: true,
    enableTheming: true,
    enableResponsiveText: true,
    enableGameStats: true,
    enableSoundEffects: false, // Disabled for now
    enableAnimations: true
  } as const,

  // Performance budgets
  performance: {
    maxBundleSize: 150 * 1024, // 150KB
    maxInitialLoadTime: 2000, // 2 seconds
    maxLayoutShift: 0.1,      // 0.1 CLS score
    targetFps: 60
  } as const,

  // Accessibility settings
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false
  } as const,

  // Debug settings (only for development)
  debug: {
    enableLogging: false,
    showPerformanceMetrics: false,
    enableDevTools: false
  } as const
} as const;

// Helper functions for configuration
export const getTextSizeForScreen = (screenSize: ScreenSize): TextSizeConfig => {
  return GAME_CONFIG.textSizing[screenSize];
};

export const getBreakpointValue = (breakpoint: keyof typeof GAME_CONFIG.breakpoints): number => {
  return GAME_CONFIG.breakpoints[breakpoint];
};

export const isFeatureEnabled = (feature: keyof typeof GAME_CONFIG.features): boolean => {
  return GAME_CONFIG.features[feature];
};

export const getStorageKey = (key: keyof typeof GAME_CONFIG.storage): string => {
  return GAME_CONFIG.storage[key];
};

// Type exports for external use
export type GameConfig = typeof GAME_CONFIG;
export type BreakpointKeys = keyof typeof GAME_CONFIG.breakpoints;
export type FeatureFlags = typeof GAME_CONFIG.features;
export type TimingConfig = typeof GAME_CONFIG.timing;
export type FontSizeConfig = typeof GAME_CONFIG.fontSize;
