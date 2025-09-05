import { writable } from 'svelte/store';

export type Theme = 'deep-blue' | 'solarized-light' | 'dark';
export const THEMES: Theme[] = ['deep-blue', 'solarized-light', 'dark'];

const STORAGE_KEY = 'theme';

export const theme = writable<Theme>('deep-blue');

export function labelForTheme(t: Theme): string {
  switch (t) {
    case 'deep-blue':
      return 'Deep Blue';
    case 'solarized-light':
      return 'White Solarized';
    case 'dark':
      return 'Dark';
  }
}

export function applyTheme(t: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', t);
  }
}

export function saveTheme(t: Theme) {
  try { localStorage.setItem(STORAGE_KEY, t); } catch {}
}

export function loadTheme(): Theme | null {
  try {
    const t = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (t && THEMES.includes(t)) return t;
  } catch {}
  return null;
}

export function initTheme() {
  const t = loadTheme() ?? 'deep-blue';
  theme.set(t);
  applyTheme(t);
}

export function cycleTheme() {
  let next: Theme;
  let curr: Theme;
  const unsub = theme.subscribe((v) => (curr = v as Theme));
  unsub!();
  const idx = THEMES.indexOf(curr!);
  next = THEMES[(idx + 1) % THEMES.length];
  theme.set(next);
  applyTheme(next);
  saveTheme(next);
}
