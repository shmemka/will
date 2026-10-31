// Реальные фотографии с Unsplash (лицензия Unsplash: бесплатное использование, в том числе коммерческое).
// Файлы лежат в public/photos/<id>.jpg. Список источников: README, раздел «Фотографии».
import type { ArtKind } from './catalog'

const BASE = import.meta.env.BASE_URL

export const photoUrl = (id: string) => `${BASE}photos/${id}.jpg`

/** Фото для каждого типа товара. Если вариантов несколько, разные службы получают разные снимки. */
export const TYPE_PHOTOS: Record<string, string[]> = {
  'coffin-classic': ['1574808146141-fbd663cfb174', '1718801666793-ed47601f8270'],
  'coffin-lacquer': ['1718801666911-a008a2fac017', '1718801666793-ed47601f8270'],
  'coffin-oak': ['1718801666842-f6b9f1ca99b3'],
  'coffin-plain': ['1785851099674-c933f4417739'],
  'coffin-cremation': ['1780400358320-9e512a6be0a3'],
  tabut: ['1644666218912-5c4069dc05f0'],
  'urn-ceramic': ['1572982758354-c097406beae5'],
  'urn-marble': ['1784901392899-f87a11b0671a'],
  'urn-wood': ['1769981533227-2bbf02c714f2'],
  'urn-bio': ['1760627591811-39400df258bf'],
  'wreath-art': ['1743356629167-343e188d100b'],
  'wreath-live': ['1649615318499-c888057747fe', '1567129610638-e83b2e9e5e90'],
  basket: ['1469317835793-6d02c2392778'],
  bouquet: ['1769812343870-f6264ffd6bad', '1631407779166-86952be9dbd7'],
  ribbon: ['1567129610638-e83b2e9e5e90'],
  'cross-wood': ['1726325935075-98581cb9c202'],
  'cross-metal': ['1533101732515-d9bffae4edb9'],
  plate: ['1708632904133-f4341f1a7f5b'],
  stele: ['1775344553937-709753db9316'],
  'textile-set': ['1601276174812-63280a55656e'],
  clothes: ['1491336477066-31156b5e4f35'],
  'orthodox-kit': ['1630520612416-6ff802604865'],
  kafan: ['1619263719761-165c773ee5df'],
  tachrichim: ['1619263719761-165c773ee5df'],
  'care-basic': ['1567428051128-5f09a0200655'],
  'care-cosmetic': ['1631407779166-86952be9dbd7'],
  embalming: ['1669240728303-305faaf6abf8'],
  'cold-storage': ['1669240728303-305faaf6abf8'],
  ghusl: ['1600814832809-579119f47045'],
  tahara: ['1576701617175-5fa0ce5769dc'],
  hearse: ['1644413816296-9533c9d831bf', '1595204538982-59dc87ae8d0f'],
  'transfer-morgue': ['1595204538982-59dc87ae8d0f'],
  bus: ['1534011056808-50c1c6082fe7'],
  porters: ['1644666218912-5c4069dc05f0'],
  intercity: ['1535655685871-dc8158ff167e'],
  hall: ['1644698430557-b0bc57940f05', '1644698430577-0b5c5b20bbe7'],
  otpevanie: ['1650737806228-4a29d3a3e291'],
  civil: ['1762013728525-4e093240ae7b'],
  janaza: ['1590075865003-e48277faa558'],
  'jewish-guide': ['1765146567664-cf0c0d987da9'],
  music: ['1532956985363-fb868d867e67', '1690182183994-85c53baa6d10'],
  coordinator: ['1644665088789-b5a3de58f278'],
  burial: ['1522752622479-65eefd320386'],
  reburial: ['1754838514611-5d855fd46514'],
  cremation: ['1644697701010-e17ae80d9d92'],
  'urn-burial': ['1590239549758-4c4bcc36971c'],
  docs: ['1619418602850-35ad20aa1700', '1450101499163-c8848c66ca85'],
  portrait: ['1765137138067-38429bc553e5'],
  dinner: ['1700615753088-c21bb092b5d9', '1762765685348-4bced247d12c'],
  stream: ['1606770347238-77fcfd29906c'],
  photo: ['1577965207665-ca08b7be0581'],
  candles: ['1773255933858-6decc64267a8'],
  'grave-care': ['1598146621261-7cdbb2b30d4b'],
}

/** Фото для категорий (плитки, заглушки) */
export const KIND_FALLBACK: Partial<Record<ArtKind, string>> = {
  coffin: '1718801666842-f6b9f1ca99b3',
  urn: '1572982758354-c097406beae5',
  wreath: '1743356629167-343e188d100b',
}

/** Фото для разделов сайта */
export const SCENE = {
  hero: '1659902374294-0a97f40b8877',
  support: '1644665088789-b5a3de58f278',
  catalog: '1469317835793-6d02c2392778',
  partners: '1450101499163-c8848c66ca85',
  call: '1567428051128-5f09a0200655',
  guideFirst: '1576701617175-5fa0ce5769dc',
  guideOrganize: '1644698430557-b0bc57940f05',
  guideMoney: '1619418602850-35ad20aa1700',
  agencies: '1644698430577-0b5c5b20bbe7',
  roses: '1769812343870-f6264ffd6bad',
  candles: '1765146567664-cf0c0d987da9',
  lilies: '1669240728303-305faaf6abf8',
} as const

export function typePhoto(typeId: string, variant = 0) {
  const list = TYPE_PHOTOS[typeId]
  if (!list?.length) return SCENE.lilies
  return list[variant % list.length]
}

export const ALL_PHOTO_IDS = Array.from(new Set([...Object.values(TYPE_PHOTOS).flat(), ...Object.values(SCENE), ...Object.values(KIND_FALLBACK)]))
