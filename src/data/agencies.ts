// 16 специализированных служб Москвы по вопросам похоронного дела.
// Названия, адреса, телефоны и почта взяты из списка, который прислала команда.
// Поля с пометкой needsCheck в исходном файле были обрезаны: их нужно уточнить перед запуском.
// Описания, часы работы, рейтинги и ассортимент на сайте демонстрационные.

export type Agency = {
  id: string
  slug: string
  name: string
  short: string
  legalForm: string
  address: string
  addressNote?: string
  okrug: string
  phones: { number: string; note?: string }[]
  email?: string
  hours: string
  dispatcher24: boolean
  since?: number
  rating: number
  reviewsCount: number
  ordersDone: number
  color: string
  about: string
  strengths: string[]
  needsCheck?: string[]
}

export const AGENCIES: Agency[] = [
  {
    id: 'a01', slug: 'gbu-ritual', legalForm: 'ГБУ', name: 'ГБУ «Ритуал»', short: 'Ритуал',
    address: 'г. Москва, ул. Песчаная, д. 3', addressNote: 'юридический адрес', okrug: 'САО',
    phones: [{ number: '8 (499) 157-43-83' }, { number: '8 (499) 610-00-00' }],
    email: 'info-ritual@ritual.mos.ru', hours: 'Круглосуточно', dispatcher24: true,
    rating: 4.7, reviewsCount: 412, ordersDone: 1840, color: '#dfeaf7',
    about: 'Городская служба, которая отвечает за организацию похорон в Москве и Московской области. Помогает с документами, местом на кладбище и полным циклом прощания.',
    strengths: ['Помощь с местом на городских кладбищах', 'Полный цикл: от документов до захоронения', 'Работает с гарантированным перечнем услуг'],
  },
  {
    id: 'a02', slug: 'ritual-servis', legalForm: 'АО', name: 'АО «Ритуал-Сервис»', short: 'Ритуал-Сервис',
    address: 'г. Москва, ул. Касаткина, д. 11, стр. 13, комната 41', okrug: 'СВАО',
    phones: [{ number: '8 (495) 310-23-10', note: 'диспетчерская служба' }, { number: '8 (495) 310-76-10', note: 'офис' }],
    email: 'info@moskvaritual.ru', hours: 'Диспетчерская круглосуточно, офис 9:00 до 18:00', dispatcher24: true,
    rating: 4.6, reviewsCount: 238, ordersDone: 960, color: '#fbe3da',
    about: 'Служба с круглосуточной диспетчерской. Можно позвонить в любое время, чтобы организовать перевозку и подготовку к прощанию.',
    strengths: ['Диспетчерская 24/7', 'Быстрый выезд агента', 'Собственный ритуальный зал'],
  },
  {
    id: 'a03', slug: 'ritorg-servis', legalForm: 'ОАО', name: 'ОАО «РИТОРГ-СЕРВИС»', short: 'Риторг-Сервис',
    address: 'г. Москва, ул. Маршала Тимошенко, д. 15, стр. 76', okrug: 'ЗАО',
    phones: [{ number: '8 (499) 149-99-70' }, { number: '8 (495) 530-00-01' }],
    email: 'info@ritorg.ru', hours: 'Ежедневно 8:00 до 21:00', dispatcher24: false,
    rating: 4.5, reviewsCount: 156, ordersDone: 720, color: '#dff0e5',
    about: 'Большой выбор ритуальных товаров: гробы, урны, венки, текстиль. Помогают подобрать всё необходимое без спешки.',
    strengths: ['Широкий ассортимент товаров', 'Собственный склад', 'Доставка к месту прощания'],
  },
  {
    id: 'a04', slug: 'ritus-servis', legalForm: 'ОАО', name: 'ОАО «Ритус-Сервис»', short: 'Ритус-Сервис',
    address: 'г. Москва, ул. Салтыковская, д. 5, к. 2, офис VIII', okrug: 'ВАО',
    phones: [{ number: '8 (495) 701-25-94', note: 'телефон и факс' }],
    email: 'info@ritus.ru', hours: 'Ежедневно 9:00 до 20:00', dispatcher24: false,
    rating: 4.4, reviewsCount: 97, ordersDone: 410, color: '#ebe5f7',
    about: 'Помогают организовать прощание на востоке Москвы. Спокойно объясняют каждый шаг и согласовывают детали с семьёй.',
    strengths: ['Работа на востоке Москвы', 'Подготовка тела', 'Транспорт для близких'],
  },
  {
    id: 'a05', slug: 'ritual-gorbrus', legalForm: 'АО', name: 'АО «Ритуал-Горбрус»', short: 'Ритуал-Горбрус',
    address: 'г. Москва, проезд Завода Серп и Молот', okrug: 'ЮВАО',
    phones: [{ number: '8 (495) 701-17-06' }],
    email: 'gorbrus@gmail.com', hours: 'Ежедневно 9:00 до 19:00', dispatcher24: false,
    rating: 4.3, reviewsCount: 64, ordersDone: 290, color: '#fff3b8',
    about: 'Изготовление и установка крестов, табличек и временных памятников. Помогают с оформлением места памяти.',
    strengths: ['Кресты и таблички', 'Временные памятники', 'Установка на кладбище'],
    needsCheck: ['номер дома в адресе'],
  },
  {
    id: 'a06', slug: 'rps', legalForm: 'ОАО', name: 'ОАО «Ритуальная православная служба»', short: 'Ритуальная православная служба',
    address: 'г. Москва, ул. Цюрупы, д. 3', okrug: 'ЮЗАО',
    phones: [{ number: '8 (495) 632-00-02' }, { number: '8 (495) 632-00-01', note: 'диспетчерская' }],
    email: 'info@rps-ritual.ru', hours: 'Диспетчерская круглосуточно', dispatcher24: true,
    rating: 4.8, reviewsCount: 301, ordersDone: 1120, color: '#fff3b8',
    about: 'Помогают проститься по православной традиции: договорятся об отпевании, подберут всё необходимое для обряда и подскажут, как всё устроено.',
    strengths: ['Отпевание и православный обряд', 'Диспетчерская 24/7', 'Деликатное сопровождение семьи'],
  },
  {
    id: 'a07', slug: 'vektor', legalForm: 'ООО', name: 'ООО «ЮОО ВОИ ВЕКТОР»', short: 'Вектор',
    address: 'г. Москва, ул. Днепропетровская, д. 18А', addressNote: 'фактический адрес', okrug: 'ЮАО',
    phones: [{ number: '8 (495) 313-41-10' }, { number: '8 (967) 190-38-20' }],
    email: 'ooo.vektor.2021@bk.ru', hours: 'Ежедневно 9:00 до 20:00', dispatcher24: false,
    rating: 4.4, reviewsCount: 58, ordersDone: 230, color: '#dfeaf7',
    about: 'Небольшая служба на юге Москвы. Внимательно относятся к пожеланиям семьи и помогают с бюджетными вариантами.',
    strengths: ['Бюджетные решения', 'Работа на юге Москвы', 'Гибкость в деталях'],
  },
  {
    id: 'a08', slug: 'anubis-servis', legalForm: 'АО', name: 'АО «Анубис-Сервис»', short: 'Анубис-Сервис',
    address: 'г. Москва, ул. Свободы, д. 99', okrug: 'СЗАО',
    phones: [{ number: '8 (495) 999-67-03' }],
    email: 'anubis.service@mail.ru', hours: 'Ежедневно 9:00 до 21:00', dispatcher24: false,
    rating: 4.5, reviewsCount: 83, ordersDone: 380, color: '#dff0e5',
    about: 'Служба на северо-западе Москвы. Организуют прощание, кремацию и захоронение урны.',
    strengths: ['Кремация под ключ', 'Урны и захоронение урны', 'Работа на северо-западе'],
    needsCheck: ['полное название', 'адрес почты'],
  },
  {
    id: 'a09', slug: 'stiks', legalForm: 'АО', name: 'АО «Стикс»', short: 'Стикс',
    address: 'г. Москва, ул. Дербеневская', okrug: 'ЮАО',
    phones: [{ number: '8 (499) 235-99-13' }],
    email: 'stiksoff@rambler.ru', hours: 'Ежедневно 9:00 до 19:00', dispatcher24: false,
    rating: 4.2, reviewsCount: 41, ordersDone: 170, color: '#fbe3da',
    about: 'Помогают с транспортом, носильщиками и проведением церемонии прощания.',
    strengths: ['Катафалки и автобусы', 'Носильщики', 'Ритуальный зал'],
    needsCheck: ['полное название', 'номер дома в адресе'],
  },
  {
    id: 'a10', slug: 'broniks-servis', legalForm: 'АО', name: 'АО «Броникс-Сервис»', short: 'Броникс-Сервис',
    address: 'г. Москва, ул. Адмирала Лазарева, д. 68', okrug: 'ЮЗАО',
    phones: [{ number: '8 (495) 427-98-70' }],
    email: 'i.sabol@rambler.ru', hours: 'Ежедневно 9:00 до 20:00', dispatcher24: false,
    rating: 4.3, reviewsCount: 52, ordersDone: 210, color: '#ebe5f7',
    about: 'Служба в Южном Бутово. Подбирают товары и услуги под бюджет семьи, без лишних позиций.',
    strengths: ['Без навязывания', 'Работа в Новой Москве и Бутово', 'Оформление документов'],
    needsCheck: ['окончание адреса'],
  },
  {
    id: 'a11', slug: 'vmk', legalForm: 'АО', name: 'АО «Военно-мемориальная компания»', short: 'Военно-мемориальная компания',
    address: 'г. Москва, Дмитровское шоссе, д. 56, офис 13', addressNote: 'юридический адрес', okrug: 'САО',
    phones: [{ number: '8 (495) 009-01-00' }],
    email: 'info@vmk-1.ru', hours: 'Ежедневно 9:00 до 18:00', dispatcher24: false,
    rating: 4.7, reviewsCount: 128, ordersDone: 540, color: '#dff0e5',
    about: 'Помогают проститься с теми, кто служил: организуют прощание с воинскими почестями и помогают оформить положенные выплаты.',
    strengths: ['Прощание с воинскими почестями', 'Помощь с выплатами', 'Мемориальные изделия'],
  },
  {
    id: 'a12', slug: 'genezis', legalForm: 'АО', name: 'АО «Генезис»', short: 'Генезис',
    address: 'г. Москва, ул. Нагорная, д. 23', okrug: 'ЮАО',
    phones: [{ number: '8 (925) 502-67-83' }],
    hours: 'Ежедневно 9:00 до 20:00', dispatcher24: false,
    rating: 4.3, reviewsCount: 37, ordersDone: 150, color: '#fff3b8',
    about: 'Помогают с подготовкой к прощанию и транспортом. Можно позвонить и спокойно обсудить все вопросы.',
    strengths: ['Подготовка тела', 'Транспорт', 'Цветы и венки'],
    needsCheck: ['полное название', 'адрес почты', 'окончание адреса'],
  },
  {
    id: 'a13', slug: 'kedr', legalForm: 'АО', name: 'АО фирма «Кедр»', short: 'Кедр',
    address: 'г. Москва, ул. Средняя Переяславская, д. 27, корп. 1, пом. 16П', okrug: 'ЦАО',
    phones: [{ number: '8 (495) 275-26-33' }, { number: '8 (499) 250-10-78' }],
    email: 'info@ritual-kedr.ru', hours: 'Ежедневно 9:00 до 21:00', dispatcher24: false,
    rating: 4.6, reviewsCount: 119, ordersDone: 500, color: '#dfeaf7',
    about: 'Служба в центре Москвы. Помогают организовать прощание в любой традиции и подобрать товары из натуральных материалов.',
    strengths: ['Работа в центре Москвы', 'Изделия из натурального дерева', 'Разные традиции прощания'],
  },
  {
    id: 'a14', slug: 'nko-vypolzov', legalForm: 'НКО', name: 'Некоммерческая организация (Выползов пер.)', short: 'НКО на Выползовом',
    address: 'г. Москва, Выползов пер., д. 7', okrug: 'ЦАО',
    phones: [{ number: '8 (495) 684-79-65' }],
    email: 'Gallyamov@bk.ru', hours: 'Ежедневно 8:00 до 20:00', dispatcher24: false,
    rating: 4.8, reviewsCount: 74, ordersDone: 260, color: '#dff0e5',
    about: 'Помогают организовать прощание по мусульманской традиции: омовение, саван, джаназа-намаз и погребение в короткие сроки.',
    strengths: ['Мусульманский обряд', 'Погребение в короткие сроки', 'Связь с общиной'],
    needsCheck: ['название организации', 'второй телефон'],
  },
  {
    id: 'a15', slug: 'ritual-yugo-zapad', legalForm: 'ОАО', name: 'ОАО «Ритуал-Юго-Запад»', short: 'Ритуал-Юго-Запад',
    address: 'г. Москва, Новоясеневский пр-т, д. 25А', okrug: 'ЮЗАО',
    phones: [{ number: '8 (495) 426-93-00' }],
    email: 'alena.68@inbox.ru', hours: 'Ежедневно 9:00 до 20:00', dispatcher24: false,
    rating: 4.4, reviewsCount: 66, ordersDone: 280, color: '#fbe3da',
    about: 'Служба на юго-западе Москвы. Организуют прощание и помогают с уходом за местом памяти.',
    strengths: ['Работа в Ясенево и на юго-западе', 'Уход за могилой', 'Цветы и венки'],
    needsCheck: ['полное название'],
  },
  {
    id: 'a16', slug: 'edem-s', legalForm: 'ОАО', name: 'ОАО «Эдем-С»', short: 'Эдем-С',
    address: 'г. Москва, пр-т Будённого, д. 51А', okrug: 'ВАО',
    phones: [{ number: '8 (495) 673-47-44' }],
    email: 'oaoedems@mail.ru', hours: 'Ежедневно 9:00 до 20:00', dispatcher24: false,
    rating: 4.5, reviewsCount: 88, ordersDone: 350, color: '#ebe5f7',
    about: 'Помогают с организацией прощания, поминальным обедом и сохранением памяти о близком человеке.',
    strengths: ['Поминальные обеды', 'Портреты и памятные изделия', 'Ритуальный зал'],
  },
]

export const agencyById = (id: string) => AGENCIES.find((a) => a.id === id)
export const agencyBySlug = (slug: string) => AGENCIES.find((a) => a.slug === slug)

export const mapLink = (address: string) => `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`
export const telLink = (phone: string) => `tel:+7${phone.replace(/\D/g, '').slice(1)}`
