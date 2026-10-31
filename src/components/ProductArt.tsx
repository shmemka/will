// Фотография товара. Три «ракурса» на карточке товара: общий план, крупный план и смещённый кадр.
import { photoUrl, typePhoto } from '../data/photos'

const VIEWS = [
  { transform: 'none', objectPosition: '50% 50%' },
  { transform: 'scale(1.45)', objectPosition: '50% 50%' },
  { transform: 'scale(1.2)', objectPosition: '15% 60%' },
]

export default function ProductArt({ typeId, palette = 0, view = 0, className, label, ratio = '4 / 3' }: { typeId: string; palette?: number; view?: number; className?: string; label?: string; ratio?: string }) {
  const id = typePhoto(typeId, palette)
  const v = VIEWS[view % VIEWS.length]
  return (
    <div className={'photo ' + (className ?? '')} style={{ aspectRatio: ratio }}>
      <img ref={imgReady} onLoad={imgLoaded} src={photoUrl(id)} alt={label ?? ''} loading="lazy" decoding="async" style={{ transform: v.transform, objectPosition: v.objectPosition }} />
    </div>
  )
}

export function ScenePhoto({ id, className, alt = '', ratio, position }: { id: string; className?: string; alt?: string; ratio?: string; position?: string }) {
  return (
    <div className={'photo ' + (className ?? '')} style={ratio ? { aspectRatio: ratio } : undefined}>
      <img ref={imgReady} onLoad={imgLoaded} src={photoUrl(id)} alt={alt} loading="lazy" decoding="async" style={position ? { objectPosition: position } : undefined} />
    </div>
  )
}

// Мягкое появление фотографий после загрузки
function imgLoaded(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.classList.add('ok')
}
function imgReady(el: HTMLImageElement | null) {
  if (el && el.complete && el.naturalWidth) el.classList.add('ok')
}
