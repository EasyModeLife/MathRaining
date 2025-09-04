import { Subnav } from '@components/Subnav'

export default function CategoryLayout({ children, params }: { children: React.ReactNode; params: { category: string } }) {
  return (
    <section>
      <Subnav base={`/${params.category}`} />
      <div className="container mx-auto px-4 py-4">{children}</div>
    </section>
  )
}
