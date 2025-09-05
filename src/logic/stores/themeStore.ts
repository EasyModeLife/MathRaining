import { writable, derived } from 'svelte/store';

export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeState {
  currentTheme: Theme;
  systemTheme: 'light' | 'dark';
  isDark: boolean;
}

export const themeStore = writable<ThemeState>({
  currentTheme: 'auto',
  systemTheme: 'light',
  isDark: false
});

// Derived stores
export const currentTheme = derived(themeStore, ($theme) => $theme.currentTheme);
export const isDarkMode = derived(themeStore, ($theme) => $theme.isDark);
export const effectiveTheme = derived(themeStore, ($theme) =>
  $theme.currentTheme === 'auto' ? $theme.systemTheme : $theme.currentTheme
);

// Actions for theme store
export const themeActions = {
  setTheme: (theme: Theme) => {
    themeStore.update(state => {
      const newState = { ...state, currentTheme: theme };
      newState.isDark = theme === 'dark' || (theme === 'auto' && state.systemTheme === 'dark');
      return newState;
    });

    // Update document class and localStorage
    updateDocumentTheme();
    saveThemeToStorage(theme);
  },

  setSystemTheme: (systemTheme: 'light' | 'dark') => {
    themeStore.update(state => {
      const newState = { ...state, systemTheme, isDark: state.currentTheme === 'dark' || (state.currentTheme === 'auto' && systemTheme === 'dark') };
      return newState;
    });
  },

  initTheme: () => {
    if (typeof window === 'undefined') return;

    // Load saved theme from localStorage
    const saved = localStorage.getItem('mathraining-theme') as Theme | null;
    if (saved) {
      themeActions.setTheme(saved);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      themeActions.setSystemTheme(prefersDark ? 'dark' : 'light');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      themeActions.setSystemTheme(e.matches ? 'dark' : 'light');
    });
  },

  toggleTheme: () => {
    themeStore.update(state => {
      const newTheme = state.isDark ? 'light' : 'dark';
      themeActions.setTheme(newTheme);
      return state; // This will be overridden by setTheme anyway
    });
  }
};

// Helper functions
function updateDocumentTheme() {
  if (typeof document === 'undefined') return;

  themeStore.subscribe(($theme) => {
    const isDark = $theme.currentTheme === 'dark' ||
                  ($theme.currentTheme === 'auto' && $theme.systemTheme === 'dark');

    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  });
}

function saveThemeToStorage(theme: Theme) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('mathraining-theme', theme);
  }
}
