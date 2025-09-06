import { writable } from 'svelte/store';

export const remainingSeconds = writable(0);
let timerId: number | null = null;

export function startTimer(seconds: number) {
  cleanupTimer();
  remainingSeconds.set(seconds);

  timerId = window.setInterval(() => {
    remainingSeconds.update(current => {
      if (current <= 1) {
        cleanupTimer();
        return 0;
      }
      return current - 1;
    });
  }, 1000);
}

export function pauseTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

export function resetTimer() {
  cleanupTimer();
  remainingSeconds.set(0);
}

export function cleanupTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}
