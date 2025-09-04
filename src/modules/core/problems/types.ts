export type Problem = {
  question: string; // KaTeX permitido
  answer: unknown;
  meta?: { category: string; subcategory?: string; suggestedTime?: number };
};

export type ProblemGeneratorParams = {
  category: string;
  subcategories?: string[];
  count: number;
  timePerProblem?: number;
  quotas?: Record<string, number>; // o weights
  weights?: Record<string, number>;
};

export type SolutionVerificator = (userInput: string, answer: unknown) => boolean;
