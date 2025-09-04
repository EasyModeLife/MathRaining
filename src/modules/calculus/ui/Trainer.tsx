"use client";
import React, { useEffect } from "react";
import { generateDerivatives } from "@modules/calculus/generators/derivatives";
import { verifyDerivative } from "@modules/calculus/verificators/derivatives";
import { usePracticeStore } from "@modules/practice/store";
import QuestionBox from "@components/QuestionBox";
import AnswerBox from "@components/AnswerBox";
import ProgressInfo from "@components/ProgressInfo";
import MathKeyboard from "@components/MathKeyboard";
import { useCountdown } from "@modules/practice/useCountdown";

export default function CalculusTrainer() {
	const { session, start, submitAnswer, next, reset, timeout } = usePracticeStore();

		useEffect(() => {
			const needNew = !session || session.category !== "calculus" || !session.running;
			if (needNew) {
				if (session && session.category !== "calculus") reset();
				const problems = generateDerivatives({ category: "calculus", count: 5 });
				start(problems, { category: "calculus", timeoutMs: 20000 });
			}
		}, [session, start, reset]);

		const hasSession = !!session;
		const curr = hasSession ? session.attempts[session.currentIndex] : undefined;
		const startAt = curr?.startedAt ?? Date.now();
		const remaining = useCountdown(startAt, session?.timeoutMs ?? 0, session?.paused ?? true);
		const secs = Math.ceil(remaining / 1000);
		const [answer, setAnswer] = React.useState("");
		React.useEffect(() => { setAnswer(""); }, [session?.currentIndex]);
		React.useEffect(() => {
			if (hasSession && remaining <= 0 && curr && curr.endedAt === undefined) {
				setTimeout(() => { timeout(); }, 0);
			}
		}, [hasSession, remaining, curr?.endedAt, timeout]);
	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold">Entrenador de Cálculo</h2>
					<div className="flex items-center justify-between">
						<ProgressInfo index={session?.currentIndex ?? 0} total={session?.attempts.length ?? 0} streak={session?.streak ?? 0} />
						<span className={"text-sm px-2 py-1 rounded " + (secs > 5 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40" : "bg-amber-100 text-amber-800 dark:bg-amber-900/40")}>Tiempo: {secs}s</span>
					</div>
			{hasSession && curr ? (
				<>
					<QuestionBox latex={curr.problem.question} />
					<AnswerBox value={answer} onChange={setAnswer} onSubmit={(val) => submitAnswer(val, verifyDerivative)} />
				</>
			) : (
				<div>Preparando práctica…</div>
			)}
					<MathKeyboard onInsert={(txt) => setAnswer((v) => v + txt)} />
					<button className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700" onClick={() => next()}>Siguiente</button>
		</div>
	);
}
