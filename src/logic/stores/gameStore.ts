import { writable, derived } from 'svelte/store';
import type { GameState, GameType, ScreenSize } from '../../types/game';

export const gameStore = writable<GameState>({
  level: 1,
  totalLevels: 10,
  correctAnswers: 0,
  currentQuestion: '',
  fontSize: 64,
  isLandscape: false,
  screenSize: 'desktop',
  responsiveSizing: {
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
  },
  currentGame: null as GameType | null,
  score: 0,
  lives: 3,
  timeLeft: 60,
  isPlaying: false,
  isPaused: false
});

// Derived stores for computed values
export const currentFontSize = derived(gameStore, ($game) => $game.fontSize);
export const isGameActive = derived(gameStore, ($game) => $game.isPlaying && !$game.isPaused);
export const gameProgress = derived(gameStore, ($game) => ({
  level: $game.level,
  score: $game.score,
  timeLeft: $game.timeLeft,
  lives: $game.lives
}));

// Actions for the store
export const gameActions = {
  setLevel: (level: number) => {
    gameStore.update(state => ({ ...state, level }));
  },

  setFontSize: (fontSize: number) => {
    gameStore.update(state => ({ ...state, fontSize }));
  },

  setScreenSize: (screenSize: ScreenSize) => {
    gameStore.update(state => ({ ...state, screenSize }));
  },

  setLandscape: (isLandscape: boolean) => {
    gameStore.update(state => ({ ...state, isLandscape }));
  },

  setGameType: (gameType: GameType) => {
    gameStore.update(state => ({ ...state, currentGame: gameType }));
  },

  startGame: () => {
    gameStore.update(state => ({
      ...state,
      isPlaying: true,
      isPaused: false,
      score: 0,
      timeLeft: 60,
      lives: 3
    }));
  },

  pauseGame: () => {
    gameStore.update(state => ({ ...state, isPaused: true }));
  },

  resumeGame: () => {
    gameStore.update(state => ({ ...state, isPaused: false }));
  },

  endGame: () => {
    gameStore.update(state => ({
      ...state,
      isPlaying: false,
      isPaused: false
    }));
  },

  updateScore: (points: number) => {
    gameStore.update(state => ({ ...state, score: state.score + points }));
  },

  loseLife: () => {
    gameStore.update(state => ({
      ...state,
      lives: Math.max(0, state.lives - 1),
      isPlaying: state.lives > 1
    }));
  },

  resetGame: () => {
    gameStore.update(state => ({
      ...state,
      level: 1,
      score: 0,
      lives: 3,
      timeLeft: 60,
      isPlaying: false,
      isPaused: false,
      currentGame: null
    }));
  }
};
