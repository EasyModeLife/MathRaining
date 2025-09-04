'use client'
export default function MathKeyboard({ onInsert }: { onInsert: (txt: string) => void }) {
  const keys = ['+', '-', '×', '÷', '^', '√', 'π']
  return (
    <div className="flex flex-wrap gap-2">
      {keys.map(k => (
        <button key={k} type="button" className="px-2 py-1 border rounded" onClick={() => onInsert(k)}>{k}</button>
      ))}
    </div>
  )
}
