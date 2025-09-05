// =========================
// 🎮 GAME TYPES
// =========================

// Screen size breakpoints
export type ScreenSize = 'mobile' | 'tablet' | 'desktop';

// Game area types
export type GameAreaType = 'problem' | 'image' | 'answer' | 'footer';

// Text fitting result
export interface TextFittingResult {
  fontSize: number;
  renderExpr: string;
  multiline: boolean;
  candidates: TextCandidate[];
}

// Text candidate for fitting algorithms
export interface TextCandidate {
  expr: string;
  lines: number;
  size: number;
}

// Game state interface
export interface GameState {
  level: number;
  totalLevels: number;
  correctAnswers: number;
  currentQuestion: string;
  fontSize: number;
  isLandscape: boolean;
  screenSize: ScreenSize;
  responsiveSizing: ResponsiveSizingConfig;
}

// Responsive sizing configuration
export interface ResponsiveSizingConfig {
  mobile: TextSizeConfig;
  tablet: TextSizeConfig;
  desktop: TextSizeConfig;
}

// Text size configuration for different screen sizes
export interface TextSizeConfig {
  baseFontSize: number;
  maxFontSize: number;
  minFontSize: number;
  scalingFactor: number;
}

// Game component props
export interface GameComponentProps {
  levelId: number;
  total: number;
  correct: number;
  showTimer?: boolean;
  remainingSeconds?: number;
  question?: string;
  flash?: boolean;
  penalty?: boolean;
  input?: string;
  inputEl?: HTMLInputElement | null;
}

// Overlay/judgement configuration
export interface JudgementConfig {
  label: string;
  color: string;
  trigger: number;
}

// Problem display state
export interface ProblemDisplayState {
  question: string;
  renderExpr: string;
  fontPx: number;
  isFitting: boolean;
  usedMultiline: boolean;
  lastQuestion: string;
  flash: boolean;
  penalty: boolean;
}

// Container ref for DOM manipulation
export interface ContainerRef {
  current: HTMLElement | null;
}

// Auto-fit hook return type
export interface UseTextFittingReturn {
  fontPx: number;
  renderExpr: string;
  usedMultiline: boolean;
  isFitting: boolean;
  containerRef: ContainerRef;
  fitboxRef: ContainerRef;
}

// Constants for the game
export const GAME_CONSTANTS = {
  FONT_SIZE: {
    BASE: 64,
    MIN: 18,
    MAX: 120
  },
  BREAKPOINTS: {
    MOBILE: 600,
    TABLET: 768,
    DESKTOP: 1024
  }
} as const;
