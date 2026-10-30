// Логика «Полного сопровождения»: вопросы о ситуации, пакеты и чекпоинты.
import { OFFERS, TYPES, offersByType, typeById, type Form, type Offer, type Tradition } from './catalog'

export type Answers = {
  situation?: 'now' | 'soon' | 'advance' | 'existing'
  place?: 'hospital' | 'home' | 'other' | 'unknown'
  tradition?: Tradition | 'unsure'
  form?: Form | 'unsure'
  plot?: 'family' | 'new' | 'unknown'
  guests?: 'small' | 'mid' | 'large'
  budget?: 'low' | 'mid' | 'high' | 'unknown'
}

export type Question = {
  key: keyof Answers
  title: string
  hint?: string
  options: { value: string; label: string; sub?: string; icon: string }[]
  showIf?: (a: Answers) => boolean
}

export const QUESTIONS: Question[] = [
  {
    key: 'situation',
    title: 'Расскажите, что сейчас происходит',
    hint: 'Так мы поймём, с чего лучше начать. Отвечайте так, как чувствуете, всё можно будет поменять.',
    options: [
      { value: 'now', label: 'Близкий человек ушёл недавно', sub: 'Нужно организовать прощание', icon: '🕊️' },
      { value: 'soon', label: 'Близкий человек тяжело болен', sub: 'Хочу понимать, что делать, когда придёт время', icon: '🤍' },
      { value: 'advance', label: 'Хочу всё продумать заранее', sub: 'Для себя или для родного человека', icon: '📝' },
      { value: 'existing', label: 'Нужно для уже существующего места', sub: 'Крест, табличка, цветы или уход за могилой', icon: '🌿' },
    ],
  },
  {
    key: 'place',
    title: 'Где сейчас находится ваш близкий?',
    hint: 'От этого зависит, нужна ли перевозка. Если не знаете, ничего страшного, мы поможем выяснить.',
    showIf: (a) => a.situation === 'now',
    options: [
      { value: 'hospital', label: 'В больнице или в морге', icon: '🏥' },
      { value: 'home', label: 'Дома', sub: 'Подскажем, кого вызвать и что делать', icon: '🏠' },
      { value: 'other', label: 'В хосписе или другом учреждении', icon: '🏢' },
      { value: 'unknown', label: 'Пока не знаю', icon: '💬' },
    ],
  },
  {
    key: 'tradition',
    title: 'Как вы хотели бы проститься?',
    hint: 'Подберём то, что принято в вашей традиции. Если близкий человек не был религиозен, выберите светское прощание.',
    showIf: (a) => a.situation !== 'existing',
    options: [
      { value: 'orthodox', label: 'По православной традиции', sub: 'С отпеванием и крестом', icon: '☦️' },
      { value: 'secular', label: 'Светское прощание', sub: 'Без религиозного обряда', icon: '🕯️' },
      { value: 'muslim', label: 'По мусульманской традиции', sub: 'Омовение, саван, джаназа', icon: '☪️' },
      { value: 'jewish', label: 'По иудейской традиции', sub: 'Тахара и простое погребение', icon: '✡️' },
      { value: 'unsure', label: 'Ещё не решили', sub: 'Покажем светский вариант, его легко изменить', icon: '💭' },
    ],
  },
  {
    key: 'form',
    title: 'Погребение или кремация?',
    hint: 'Если близкий человек говорил о своём желании, лучше опереться на его слова.',
    showIf: (a) => a.situation !== 'existing' && a.tradition !== 'muslim' && a.tradition !== 'jewish',
    options: [
      { value: 'burial', label: 'Погребение в землю', icon: '🌳' },
      { value: 'cremation', label: 'Кремация', sub: 'Урну можно будет захоронить позже', icon: '🏺' },
      { value: 'unsure', label: 'Пока не решили', sub: 'Начнём с погребения, переключиться можно в любой момент', icon: '💭' },
    ],
  },
  {
    key: 'plot',
    title: 'Есть ли место на кладбище?',
    showIf: (a) => a.situation !== 'existing' && resolveForm(a) === 'burial',
    options: [
      { value: 'family', label: 'Да, есть родственное захоронение', sub: 'Понадобится удостоверение о захоронении', icon: '🪦' },
      { value: 'new', label: 'Нет, нужно новое место', icon: '📍' },
      { value: 'unknown', label: 'Не знаю', sub: 'Поможем выяснить', icon: '💬' },
    ],
  },
  {
    key: 'guests',
    title: 'Сколько людей придёт попрощаться?',
    hint: 'Примерно. От этого зависит размер зала и транспорт.',
    showIf: (a) => a.situation !== 'existing',
    options: [
      { value: 'small', label: 'Только самые близкие', sub: 'До 10 человек', icon: '👥' },
      { value: 'mid', label: 'Семья и друзья', sub: '10-30 человек', icon: '👨‍👩‍👧' },
      { value: 'large', label: 'Много людей', sub: 'Больше 30 человек', icon: '🫂' },
    ],
  },
  {
    key: 'budget',
    title: 'На какой бюджет ориентируетесь?',
    hint: 'Это нужно только для подбора. Достойное прощание возможно при любом бюджете.',
    options: [
      { value: 'low', label: 'Как можно бережнее к бюджету', sub: 'До 50 000 ₽', icon: '🌱' },
      { value: 'mid', label: 'Средний', sub: '50 000 - 120 000 ₽', icon: '🌿' },
      { value: 'high', label: 'Хочется сделать всё максимально достойно', sub: 'От 120 000 ₽', icon: '🌳' },
      { value: 'unknown', label: 'Пока не знаю', icon: '💭' },
    ],
  },
]

export function visibleQuestions(a: Answers) {
  return QUESTIONS.filter((q) => !q.showIf || q.showIf(a))
}

export function resolveTradition(a: Answers): Tradition {
  return a.tradition && a.tradition !== 'unsure' ? a.tradition : 'secular'
}
export function resolveForm(a: Answers): Form {
  if (a.tradition === 'muslim' || a.tradition === 'jewish') return 'burial'
  return a.form === 'cremation' ? 'cremation' : 'burial'
}

export type Checkpoint = {
  id: string
  title: string
  why: string
  types: string[] // доступные в этом шаге типы товаров
  icon: string
}

export type PackageId = 'min' | 'std' | 'ext'

export type Package = {
  id: PackageId
  name: string
  title: string
  desc: string
  includes: string[] // типы по умолчанию
}

function fits(typeId: string, tr: Tradition, form: Form) {
  const t = typeById(typeId)
  if (!t) return false
  if (t.traditions && !t.traditions.includes(tr)) return false
  if (t.forms && !t.forms.includes(form)) return false
  return offersByType(typeId).length > 0
}

// Чекпоинты под ситуацию
export function buildCheckpoints(a: Answers): Checkpoint[] {
  const tr = resolveTradition(a)
  const form = resolveForm(a)
  const f = (ids: string[]) => ids.filter((id) => fits(id, tr, form))

  if (a.situation === 'existing') {
    return [
      { id: 'sign', title: 'Знак на месте памяти', why: 'Крест или табличка с именем, пока готовится памятник.', types: ['plate', 'stele', 'cross-wood', 'cross-metal'].filter(fitsAny), icon: '🪧' },
      { id: 'flowers', title: 'Цветы', why: 'Для посещения места памяти.', types: ['bouquet', 'basket', 'wreath-art', 'ribbon'].filter(fitsAny), icon: '💐' },
      { id: 'care', title: 'Уход за местом', why: 'Мы будем приезжать и присылать фото.', types: ['grave-care'].filter(fitsAny), icon: '🌿' },
      { id: 'rebury', title: 'Подзахоронение', why: 'Если нужно подзахоронение в родственную могилу или захоронение урны.', types: ['reburial', 'urn-burial', 'docs'].filter(fitsAny), icon: '🪦' },
    ].map(dedupe).filter((c) => c.types.length)
  }

  const list: Checkpoint[] = [
    { id: 'docs', title: 'Документы', why: 'Поможем получить свидетельство о смерти и разрешения. Это первое, что нужно сделать.', types: f(['docs']), icon: '📄' },
  ]
  if (a.place === 'home') list.push({ id: 'move', title: 'Перевозка в морг', why: 'Бригада приедет в любое время суток и всё сделает бережно.', types: f(['transfer-morgue']), icon: '🚐' })
  list.push(
    { id: 'care', title: 'Подготовка к прощанию', why: 'Чтобы близкие могли спокойно попрощаться.', types: f(['ghusl', 'tahara', 'care-basic', 'care-cosmetic', 'embalming', 'cold-storage']), icon: '🤍' },
    { id: 'coffin', title: tr === 'muslim' ? 'Носилки' : 'Гроб', why: tr === 'muslim' ? 'По традиции используется табут, носилки для переноса.' : form === 'cremation' ? 'Для кремации подходит облегчённый гроб.' : 'Выберите то, что кажется правильным именно вам.', types: f(['tabut', 'coffin-plain', 'coffin-cremation', 'coffin-classic', 'coffin-lacquer', 'coffin-oak']), icon: '🕊️' },
    { id: 'textile', title: tr === 'muslim' ? 'Саван' : tr === 'jewish' ? 'Погребальные одежды' : 'Одежда и текстиль', why: 'Всё, во что будет одет и чем будет укрыт ваш близкий.', types: f(['kafan', 'tachrichim', 'orthodox-kit', 'textile-set', 'clothes']), icon: '🧺' },
  )
  if (tr !== 'muslim' && tr !== 'jewish') list.push({ id: 'flowers', title: 'Цветы и венки', why: 'От семьи, от друзей, от коллег. Можно добавить ленту с вашими словами.', types: f(['wreath-art', 'wreath-live', 'basket', 'bouquet', 'ribbon']), icon: '💐' })
  list.push(
    { id: 'ceremony', title: 'Прощание', why: 'Где и как близкие смогут побыть вместе и сказать важные слова.', types: f(['janaza', 'jewish-guide', 'otpevanie', 'civil', 'hall', 'coordinator', 'music']), icon: '🕯️' },
    { id: 'transport', title: 'Транспорт', why: 'Катафалк, автобус для близких и помощь с переносом.', types: f(['hearse', 'bus', 'porters', 'intercity']), icon: '🚌' },
  )
  if (form === 'cremation') {
    list.push({ id: 'burial', title: 'Кремация и урна', why: 'Урну можно будет забрать через 1-3 дня и захоронить, когда будете готовы.', types: f(['cremation', 'urn-ceramic', 'urn-wood', 'urn-marble', 'urn-bio', 'urn-burial']), icon: '🏺' })
  } else {
    list.push({ id: 'burial', title: 'Погребение', why: a.plot === 'family' ? 'Подзахоронение в родственную могилу. Поможем с разрешением.' : 'Подготовка места и захоронение на кладбище.', types: f(a.plot === 'family' ? ['reburial', 'burial'] : ['burial', 'reburial']), icon: '🌳' })
    list.push({ id: 'sign', title: tr === 'orthodox' ? 'Крест' : 'Знак на месте памяти', why: 'Временный знак с именем, пока готовится памятник.', types: f(['cross-wood', 'cross-metal', 'plate', 'stele']), icon: tr === 'orthodox' ? '✝️' : '🪧' })
  }
  list.push({ id: 'memory', title: 'Память', why: 'Портрет, поминальный обед и возможность попрощаться для тех, кто далеко.', types: f(['portrait', 'dinner', 'stream', 'candles', 'photo']), icon: '🖼️' })
  return list.filter((c) => c.types.length)
}

function fitsAny(id: string) {
  return offersByType(id).length > 0
}
function dedupe(c: Checkpoint): Checkpoint {
  return { ...c, types: Array.from(new Set(c.types)) }
}

export function buildPackages(a: Answers): Package[] {
  // в пакет попадает только то, что есть в шагах подбора, иначе позицию нельзя будет увидеть и изменить
  const cpTypes = new Set(buildCheckpoints(a).flatMap((c) => c.types))
  return buildPackagesRaw(a).map((p) => ({ ...p, includes: Array.from(new Set(p.includes)).filter((t) => cpTypes.has(t)) }))
}

function buildPackagesRaw(a: Answers): Package[] {
  const tr = resolveTradition(a)
  const form = resolveForm(a)
  const f = (ids: string[]) => ids.filter((id) => fits(id, tr, form) || (a.situation === 'existing' && fitsAny(id)))
  const big = a.guests === 'mid' || a.guests === 'large'

  if (a.situation === 'existing') {
    return [
      { id: 'min', name: 'Минимум', title: 'Самое необходимое', desc: 'Табличка с именем и цветы.', includes: f(['plate', 'bouquet']) },
      { id: 'std', name: 'Стандарт', title: 'Достойное место памяти', desc: 'Знак, корзина цветов и уход в течение сезона.', includes: f(['stele', 'basket', 'grave-care']) },
      { id: 'ext', name: 'Расширенный', title: 'Полная забота о месте', desc: 'Крест или стела, цветы, лента и уход за местом.', includes: f(['cross-wood', 'stele', 'basket', 'ribbon', 'grave-care']) },
    ]
  }

  const coffinMin = tr === 'muslim' ? 'tabut' : tr === 'jewish' ? 'coffin-plain' : form === 'cremation' ? 'coffin-cremation' : 'coffin-classic'
  const coffinStd = tr === 'muslim' ? 'tabut' : tr === 'jewish' ? 'coffin-plain' : form === 'cremation' ? 'coffin-cremation' : 'coffin-lacquer'
  const coffinExt = tr === 'muslim' ? 'tabut' : tr === 'jewish' ? 'coffin-plain' : form === 'cremation' ? 'coffin-lacquer' : 'coffin-oak'
  const care = tr === 'muslim' ? 'ghusl' : tr === 'jewish' ? 'tahara' : 'care-basic'
  const textile = tr === 'muslim' ? ['kafan'] : tr === 'jewish' ? ['tachrichim'] : tr === 'orthodox' ? ['textile-set', 'orthodox-kit'] : ['textile-set']
  const rite = tr === 'muslim' ? 'janaza' : tr === 'jewish' ? 'jewish-guide' : tr === 'orthodox' ? 'otpevanie' : 'civil'
  const end = form === 'cremation' ? ['cremation', 'urn-ceramic'] : [a.plot === 'family' ? 'reburial' : 'burial', tr === 'orthodox' ? 'cross-wood' : 'plate']
  const endExt = form === 'cremation' ? ['cremation', 'urn-marble', 'urn-burial'] : [a.plot === 'family' ? 'reburial' : 'burial', tr === 'orthodox' ? 'cross-wood' : 'stele']
  const move = a.place === 'home' ? ['transfer-morgue'] : []

  return [
    {
      id: 'min', name: 'Минимум', title: 'Самое необходимое',
      desc: 'Всё, без чего прощание не состоится. Скромно и достойно.',
      includes: f(['docs', ...move, care, coffinMin, ...textile, 'hearse', ...end]),
    },
    {
      id: 'std', name: 'Стандарт', title: 'Спокойное прощание',
      desc: 'Обряд или церемония, зал для прощания, цветы и портрет. То, что выбирает большинство семей.',
      includes: f(['docs', ...move, care, coffinStd, ...textile, rite, 'hall', 'wreath-art', 'ribbon', 'hearse', ...(big ? ['bus'] : []), ...end, 'portrait']),
    },
    {
      id: 'ext', name: 'Расширенный', title: 'Забота обо всём',
      desc: 'Личный координатор на весь день, живые цветы, транспорт для всех, поминальный обед и трансляция для тех, кто далеко.',
      includes: f(['docs', ...move, care, 'care-cosmetic', coffinExt, ...textile, rite, 'hall', 'coordinator', 'music', 'wreath-live', 'ribbon', 'hearse', 'bus', 'porters', ...endExt, 'portrait', 'dinner', 'stream']),
    },
  ]
}

// Выбор предложения по умолчанию для пакета
export function defaultOffer(typeId: string, pkg: PackageId): Offer | undefined {
  const list = offersByType(typeId)
  if (!list.length) return undefined
  if (pkg === 'min') return list[0]
  if (pkg === 'std') return list[Math.floor((list.length - 1) / 2)]
  // для расширенного берём хорошо оценённое предложение из верхней половины
  const top = list.slice(Math.floor(list.length / 2))
  return top.sort((x, y) => y.rating - x.rating)[0]
}

export function guestsCount(a: Answers) {
  return a.guests === 'large' ? 40 : a.guests === 'mid' ? 20 : 8
}

export function packageEstimate(p: Package, a: Answers) {
  let sum = 0
  for (const t of p.includes) {
    const o = defaultOffer(t, p.id)
    if (!o) continue
    const type = typeById(t)
    sum += o.price * (type?.perGuest ? guestsCount(a) : 1)
  }
  return sum
}

export const TRADITION_NOTES: Record<Tradition, string> = {
  orthodox: 'По православной традиции прощание обычно проходит на третий день. Отпевание можно провести в храме или в ритуальном зале.',
  secular: 'Светское прощание можно устроить так, как близкий человек хотел бы: с музыкой, словами друзей, любимыми цветами.',
  muslim: 'По мусульманской традиции погребение стараются провести как можно скорее, обычно в течение суток. Мы подберём службы, которые работают быстро. Детали лучше согласовать с имамом.',
  jewish: 'По иудейской традиции погребение проводят как можно скорее, без кремации и обычно без цветов. Мы поможем связаться с общиной, окончательные решения лучше согласовать с раввином.',
}

export const ALL_TYPE_IDS = TYPES.map((t) => t.id)
export const OFFERS_COUNT = OFFERS.length
