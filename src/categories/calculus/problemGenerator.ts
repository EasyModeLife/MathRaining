export interface Exercise {
  id: string;
  question: string;
  answer: string;
  topic: CalcTopic;
  timeMs: number;
}

export type CalcTopic = 'derivative-poly' | 'integral-poly' | 'derivative-trig' | 'differential-poly';

export function rand(min: number, max: number): number {
  if (globalThis.crypto) {
    const array = new Uint32Array(1);
    globalThis.crypto.getRandomValues(array);
    const cryptoRand = array[0] / (2**32 - 1);
    return Math.floor(cryptoRand * (max - min + 1)) + min;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function timeFor(topic: CalcTopic): number {
  const BASE_QUESTION_TIME = 17000;
  if (topic === 'derivative-trig') return BASE_QUESTION_TIME - 2000;
  if (topic === 'differential-poly') return BASE_QUESTION_TIME + 2000;
  return BASE_QUESTION_TIME;
}

export function polyToLaTeX(coeffs: number[]): string {
  // Convert polynomial coefficients to clean LaTeX
  const parts: string[] = [];
  coeffs.forEach((c, i) => {
    const pow = coeffs.length - 1 - i;
    if (c === 0) return;
    const sign = c > 0 ? '+' : '-';
    const abs = Math.abs(c);

    let term = '';
    if (pow === 0) {
      term = `${abs}`;
    } else if (abs === 1) {
      term = pow === 1 ? 'x' : `x^{${pow}}`;
    } else {
      term = pow === 1 ? `${abs}x` : `${abs}x^{${pow}}`;
    }

    parts.push(`${sign} ${term}`);
  });

  let s = parts.join(' ');
  s = s.replace(/^\+\s?/, '').trim();
  return s || '0';
}

export function derivativePoly(coeffs: number[]): number[] {
  const res: number[] = [];
  for (let i = 0; i < coeffs.length - 1; i++) {
    const pow = coeffs.length - 1 - i;
    res.push(coeffs[i] * pow);
  }
  return res.length ? res : [0];
}

export function integralPoly(coeffs: number[]): string {
  const parts: string[] = [];
  for (let i = 0; i < coeffs.length; i++) {
    const pow = coeffs.length - 1 - i;
    const np = pow + 1;
    const c = coeffs[i] / np;
    if (c === 0) continue;
    const sign = c > 0 ? '+' : '-';
    const abs = Math.abs(c);
    let term = '';
    if (np === 0) {
      term = `${abs}`;
    } else if (abs === 1) {
      term = np === 1 ? 'x' : `x^{${np}}`;
    } else {
      term = np === 1 ? `${abs}x` : `${abs}x^{${np}}`;
    }
    parts.push(`${sign} ${term}`);
  }
  const s = parts.join(' ').replace(/^\+\s/, '').trim();
  return s ? `${s} + C` : 'C';
}

export function evalPoly(coeffs: number[], x: number): number {
  return coeffs.reduce((acc, c) => acc * x + c, 0);
}

export function createProblemGenerator(topics: CalcTopic[]): Exercise {
  const topic = topics[rand(0, topics.length - 1)];

  if (topic === 'derivative-poly') {
    const deg = rand(1, 3);
    const coeffs = Array.from({ length: deg + 1 }, () => rand(-6, 6));
    if (coeffs[0] === 0) coeffs[0] = rand(1, 6);
    const poly = polyToLaTeX(coeffs);
    const q = `\\frac{d}{dx} [${poly}]`;
    const derivedCoeffs = derivativePoly(coeffs);
    const ans = polyToLaTeX(derivedCoeffs).replace(/^\+\s?/, '').trim();
    const id = `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    return { id, question: q, answer: ans, topic, timeMs: timeFor(topic) };
  }

  if (topic === 'integral-poly') {
    const deg = rand(0, 3);
    const coeffs = Array.from({ length: deg + 1 }, () => rand(-5, 5));
    const sumAbs = coeffs.reduce((a, c) => a + Math.abs(c), 0);
    if (sumAbs === 0) coeffs[deg] = 1;
    const poly = polyToLaTeX(coeffs);
    const q = `\\int (${poly}) \\, dx`;
    const ans = integralPoly(coeffs);
    return { id: `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`, question: q, answer: ans, topic, timeMs: timeFor(topic) };
  }

  if (topic === 'derivative-trig') {
    const opts = ['\\sin x', '\\cos x', '\\tan x'];
    const pick = opts[rand(0, opts.length - 1)];
    const q = `\\frac{d}{dx} [${pick}]`;
    const ans = pick === '\\sin x' ? '\\cos x' : pick === '\\cos x' ? '-\\sin x' : '\\sec^{2} x';
    return { id: `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`, question: q, answer: ans, topic, timeMs: timeFor(topic) };
  }

  // differential-poly
  const deg = rand(1, 3);
  const coeffs = Array.from({ length: deg + 1 }, () => rand(-5, 5));
  if (coeffs[0] === 0) coeffs[0] = rand(1, 5);
  const fprime = derivativePoly(coeffs);
  const x0 = rand(-4, 4);
  const poly = polyToLaTeX(coeffs);
  const yprime = polyToLaTeX(fprime).replace(/^\+\s?/, '');
  const q = `\\text{If } y = ${poly}, \\text{ find } dy \\text{ at } x = ${x0} \\text{ } (dy = y'(x) \\, dx)`;
  const ans = `dy = (${yprime}) \\, dx, \\quad y'(${x0}) = ${evalPoly(fprime, x0)}`;
  return { id: `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`, question: q, answer: ans, topic: 'differential-poly', timeMs: timeFor(topic) };
}
