function normalize(expr: string) {
  return expr.replace(/\s+/g, " ").replace(/\+\s*\-/g, "-").trim();
}

export function verifyDerivative(userInput: string, answer: unknown): boolean {
  if (typeof answer !== 'string') return false;
  return normalize(String(userInput)) === normalize(answer);
}
