'use client'
import { useState } from 'react'

type Props = {
  onSubmit: (value: string) => void
  onChange?: (value: string) => void
  value?: string
  placeholder?: string
}

export default function AnswerBox({ onSubmit, onChange, value: controlled, placeholder = 'Tu respuesta' }: Props) {
  const [uncontrolled, setUncontrolled] = useState('')
  const value = controlled !== undefined ? controlled : uncontrolled
  const setValue = (v: string) => {
    if (controlled !== undefined) onChange?.(v)
    else setUncontrolled(v)
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(value); if (controlled === undefined) setUncontrolled('') }} className="flex gap-2">
      <input value={value} onChange={(e) => setValue(e.target.value)} className="border rounded px-2 py-1 flex-1 dark:bg-slate-900" placeholder={placeholder} />
      <button className="px-3 py-1 rounded bg-blue-600 text-white">Enviar</button>
    </form>
  )
}
