import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">MathRaining</h1>
        <p className="text-slate-600 dark:text-slate-300">Entrena matemáticas con práctica guiada y juegos.</p>
        <div className="flex justify-center gap-3 pt-2">
          <Link href="/arithmetic" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Empezar Aritmética</Link>
          <Link href="/calculus" className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Empezar Cálculo</Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Link href="/arithmetic" className="block rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
          <h2 className="text-xl font-semibold mb-1">Aritmética</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Suma, resta y multiplicación. Ritmo rápido, racha y tiempo límite.</p>
        </Link>
        <Link href="/calculus" className="block rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
          <h2 className="text-xl font-semibold mb-1">Cálculo</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Derivadas básicas con notación LaTeX. Practica y mejora tu intuición.</p>
        </Link>
      </section>

      <section className="text-center">
        <p className="text-slate-600 dark:text-slate-300">¿Buscas más temas?</p>
        <Link href="/categories" className="inline-block mt-2 px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/60">Ver todas las categorías</Link>
      </section>
    </div>
  );
}
