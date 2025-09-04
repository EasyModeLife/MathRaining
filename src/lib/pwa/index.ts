export const isPwa = () =>
  typeof window !== "undefined" && (window.matchMedia?.("(display-mode: standalone)")?.matches ?? false);
