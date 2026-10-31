import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AGENCIES } from '../data/agencies'
import { offersByAgency } from '../data/catalog'
import { Icon, Stars } from '../components/ui'
import PageHead from '../components/PageHead'
import { ScenePhoto } from '../components/ProductArt'
import { SCENE } from '../data/photos'
import { plural } from '../lib/format'

const OKRUGS = ['ЦАО', 'САО', 'СВАО', 'ВАО', 'ЮВАО', 'ЮАО', 'ЮЗАО', 'ЗАО', 'СЗАО']

export default function Agencies() {
  const [okrug, setOkrug] = useState('all')
  const [only24, setOnly24] = useState(false)
  const list = useMemo(() => AGENCIES.filter((a) => (okrug === 'all' || a.okrug === okrug) && (!only24 || a.dispatcher24)), [okrug, only24])
  return (
    <>
    <PageHead crumbs={[{ to: '/', label: 'Главная' }, { label: 'Службы' }]} title="Ритуальные службы Москвы" lead="Специализированные службы по вопросам похоронного дела. У каждой своя страница с товарами, контактами и отзывами." art={<ScenePhoto id={SCENE.agencies} ratio="4 / 3" />} />
    <section className="section-s" style={{ paddingTop: 16 }}>
      <div className="container">
        <div className="row" style={{ marginBottom: 20 }}>
          <div className="chips" style={{ flex: 1 }}>
            <button className={'chip' + (okrug === 'all' ? ' active' : '')} onClick={() => setOkrug('all')}>Все округа</button>
            {OKRUGS.map((o) => <button key={o} className={'chip' + (okrug === o ? ' active' : '')} onClick={() => setOkrug(o)}>{o}</button>)}
          </div>
          <label className="checkbox"><input type="checkbox" checked={only24} onChange={(e) => setOnly24(e.target.checked)} /> Круглосуточно</label>
        </div>
        <div className="grid grid-3">
          {list.map((a) => {
            const n = offersByAgency(a.id).length
            return (
              <Link key={a.id} to={`/sluzhby/${a.slug}`} className="card card-link stack">
                <div className="row" style={{ gap: 14 }}>
                  <div className="seller-ava">{a.short[0]}</div>
                  <div>
                    <h4>{a.name}</h4>
                    <div className="row small" style={{ gap: 6 }}><Stars value={a.rating} size={13} /> <span className="muted">{a.rating.toFixed(1)}</span></div>
                  </div>
                </div>
                <p className="small muted">{a.about}</p>
                <div className="contact-line small"><Icon name="pin" size={16} /> {a.address}</div>
                <div className="contact-line small"><Icon name="clock" size={16} /> {a.hours}</div>
                <div className="row" style={{ marginTop: 'auto' }}>
                  <span className="badge">{a.okrug}</span>
                  {a.dispatcher24 && <span className="badge badge-green">24/7</span>}
                  <span className="badge badge-gray">{n} {plural(n, 'товар', 'товара', 'товаров')}</span>
                </div>
              </Link>
            )
          })}
        </div>
        {list.length === 0 && <p className="empty muted">В этом округе пока нет служб с такими условиями. Попробуйте выбрать другой округ.</p>}
      </div>
    </section>
    </>
  )
}
