"use client";
import React, { useEffect } from "react";
import { generateArithmetic } from "@modules/arithmetic";
import { verifyArithmetic } from "@modules/arithmetic";
import { usePracticeStore } from "@modules/practice/store";
import QuestionBox from "@components/QuestionBox";
import AnswerBox from "@components/AnswerBox";
import ProgressInfo from "@components/ProgressInfo";
import MathKeyboard from "@components/MathKeyboard";
import { useCountdown } from "@modules/practice/useCountdown";

export default function ArithmeticTrainer() {
	const { session, start, submitAnswer, next, reset, timeout } = usePracticeStore();

		useEffect(() => {
			const needNew = !session || session.category !== "arithmetic" || !session.running;
			if (needNew) {
				if (session && session.category !== "arithmetic") reset();
				const problems = generateArithmetic({ category: "arithmetic", count: 10 });
				start(problems, { category: "arithmetic", timeoutMs: 15000 });
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
				// auto-timeout
				// marcar timeout y habilitar siguiente
				// usamos timeout() del store
				// luego no avanzamos automáticamente para que el usuario vea el resultado
				// y pueda dar siguiente
				setTimeout(() => { timeout(); }, 0);
			}
		}, [hasSession, remaining, curr?.endedAt, timeout]);

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold">Entrenador de Aritmética</h2>
									<div className="flex items-center justify-between">
										<ProgressInfo index={session?.currentIndex ?? 0} total={session?.attempts.length ?? 0} streak={session?.streak ?? 0} />
						<span className={"text-sm px-2 py-1 rounded " + (secs > 5 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40" : "bg-amber-100 text-amber-800 dark:bg-amber-900/40")}>Tiempo: {secs}s</span>
					</div>
							{hasSession && curr ? (
								<>
									<QuestionBox latex={curr.problem.question} />
									<AnswerBox value={answer} onChange={setAnswer} onSubmit={(val) => submitAnswer(val, verifyArithmetic)} />
								</>
							) : (
								<div>Preparando práctica…</div>
							)}
					<MathKeyboard onInsert={(txt) => setAnswer((v) => v + txt)} />
			<div className="flex gap-2">
				<button
					className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700"
					onClick={() => next()}
				>
					Siguiente
				</button>
			</div>
		</div>
	);
}
