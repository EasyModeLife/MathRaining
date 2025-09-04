export function verifyArithmetic(userInput: string, answer: unknown): boolean {
  const parsed = Number(String(userInput).replace(/,/g, ".").trim());
  if (!Number.isFinite(parsed) || typeof answer !== "number") return false;
  return parsed === answer;
}
