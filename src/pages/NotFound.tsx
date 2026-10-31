import { Link } from 'react-router-dom'
import { ScenePhoto } from '../components/ProductArt'
import { SCENE } from '../data/photos'

export default function NotFound() {
  return (
    <section className="section">
      <div className="container empty stack" style={{ alignItems: 'center' }}>
        <ScenePhoto id={SCENE.candles} className="intro-photo" ratio="16 / 9" />
        <h2>Такой страницы нет</h2>
        <p className="muted">Возможно, ссылка устарела. Давайте вернёмся туда, где мы сможем помочь.</p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">На главную</Link>
          <Link to="/katalog" className="btn btn-outline">В каталог</Link>
        </div>
      </div>
    </section>
  )
}
