export default function ProgressInfo({ index, total, streak }: { index: number; total: number; streak: number }) {
  return (
    <div className="text-sm text-slate-600 dark:text-slate-300">
      Problema {index + 1} de {total} · Racha: {streak}
    </div>
  )
}
