import type { ReactNode } from 'react'
import { Crumbs } from './ui'
import { TornEdge } from './Illustrations'

/** Жёлтая шапка внутренней страницы с рваным нижним краем */
export default function PageHead({ crumbs, title, lead, art, children }: { crumbs: { to?: string; label: string }[]; title: ReactNode; lead?: ReactNode; art?: ReactNode; children?: ReactNode }) {
  return (
    <section className="page-head">
      <div className="container">
        <Crumbs items={crumbs} />
        <div className="page-head-grid">
          <div>
            <h1>{title}</h1>
            {lead && <p className="lead">{lead}</p>}
            {children}
          </div>
          {art && <div className="page-head-art">{art}</div>}
        </div>
      </div>
      <TornEdge />
    </section>
  )
}
