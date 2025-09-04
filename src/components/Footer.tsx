export default function Footer() {
	return (
		<footer className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
			<p>© {new Date().getFullYear()} MathRaining — Libre y sin telemetry</p>
		</footer>
	);
}
