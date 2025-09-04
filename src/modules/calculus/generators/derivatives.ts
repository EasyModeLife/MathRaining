import type { Problem, ProblemGeneratorParams } from "@modules/core/problems/types";

type PolyTerm = { c: number; p: number };

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function polyToString(terms: PolyTerm[]): string {
  return terms
    .map(({ c, p }, idx) => {
      const sign = c >= 0 ? (idx === 0 ? "" : "+") : "-";
      const abs = Math.abs(c);
      if (p === 0) return `${sign} ${abs}`.trim();
      if (p === 1) return `${sign} ${abs}x`.trim();
      return `${sign} ${abs}x^{${p}}`.trim();
    })
    .join(" ");
}

function derive(terms: PolyTerm[]): PolyTerm[] {
  return terms
    .filter((t) => t.p !== 0)
    .map(({ c, p }) => ({ c: c * p, p: p - 1 }));
}

export function generateDerivatives(params: ProblemGeneratorParams): Problem[] {
  const count = Math.max(1, params.count ?? 5);
  const problems: Problem[] = [];
  for (let i = 0; i < count; i++) {
    const termCount = randInt(1, 3);
    const terms: PolyTerm[] = Array.from({ length: termCount }, () => ({ c: randInt(-5, 5) || 1, p: randInt(0, 5) }));
    const d = derive(terms);
    problems.push({
      question: `f(x) = ${polyToString(terms)}`,
      answer: polyToString(d),
      meta: { category: "calculus", subcategory: "derivative", suggestedTime: 30 },
    });
  }
  return problems;
}
