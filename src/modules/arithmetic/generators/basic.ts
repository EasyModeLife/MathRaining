import type { Problem, ProblemGeneratorParams } from "@modules/core/problems/types";

type Op = "+" | "-" | "*";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateArithmetic(
  params: ProblemGeneratorParams,
  options?: { ops?: Op[]; min?: number; max?: number }
): Problem[] {
  const count = Math.max(1, params.count ?? 10);
  const ops: Op[] = options?.ops ?? ["+", "-", "*"];
  const min = options?.min ?? 0;
  const max = options?.max ?? 10;

  const problems: Problem[] = [];
  for (let i = 0; i < count; i++) {
    const a = randInt(min, max);
    const b = randInt(min, max);
    const op = ops[randInt(0, ops.length - 1)];
    let ans: number;
    if (op === "+") ans = a + b;
    else if (op === "-") ans = a - b;
    else ans = a * b;
    problems.push({
      question: `${a} ${op} ${b}`,
      answer: ans,
      meta: { category: "arithmetic", suggestedTime: 20 },
    });
  }
  return problems;
}
