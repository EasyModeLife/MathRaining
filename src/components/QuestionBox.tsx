import { BlockMath } from 'react-katex'

export default function QuestionBox({ latex }: { latex: string }) {
  return (
    <div className="border rounded-md p-4 bg-white dark:bg-slate-800">
      <BlockMath math={latex} />
    </div>
  )
}
