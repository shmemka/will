// Каталог: категории, типы товаров и предложения служб.
// Тип товара (например, «Гроб из сосны») продают несколько служб, у каждой своё предложение (offer) со своей ценой.
// Все цены, параметры и отзывы демонстрационные.
import { AGENCIES, type Agency } from './agencies'

export type Tradition = 'orthodox' | 'secular' | 'muslim' | 'jewish'
export type Form = 'burial' | 'cremation'

export type Category = { id: string; name: string; short: string; art: ArtKind; blurb: string }

export type ArtKind =
  | 'coffin' | 'coffin-simple' | 'stretcher' | 'urn' | 'urn-wood' | 'wreath' | 'basket' | 'bouquet' | 'ribbon'
  | 'cross-wood' | 'cross-metal' | 'plate' | 'stele' | 'textile' | 'clothes' | 'kit' | 'shroud'
  | 'care' | 'cold' | 'hearse' | 'bus' | 'people' | 'hall' | 'church' | 'music' | 'mosque' | 'candle'
  | 'grave' | 'cremation' | 'docs' | 'portrait' | 'dinner' | 'camera' | 'screen' | 'leaf' | 'map'

export const CATEGORIES: Category[] = [
  { id: 'coffins', name: 'Гробы и носилки', short: 'Гробы', art: 'coffin', blurb: 'От простых до премиальных, из сосны и дуба' },
  { id: 'urns', name: 'Урны', short: 'Урны', art: 'urn', blurb: 'Керамика, мрамор, дерево и биоурны' },
  { id: 'flowers', name: 'Венки и цветы', short: 'Цветы', art: 'wreath', blurb: 'Живые и искусственные, ленты с надписью' },
  { id: 'signs', name: 'Кресты и таблички', short: 'Кресты', art: 'cross-wood', blurb: 'Временные знаки на месте памяти' },
  { id: 'textile', name: 'Одежда и текстиль', short: 'Текстиль', art: 'textile', blurb: 'Покрывала, одежда, обрядовые наборы' },
  { id: 'care', name: 'Подготовка тела', short: 'Подготовка', art: 'care', blurb: 'Бережная подготовка и хранение' },
  { id: 'transport', name: 'Транспорт', short: 'Транспорт', art: 'hearse', blurb: 'Катафалк, автобус для близких, носильщики' },
  { id: 'ceremony', name: 'Прощание и обряды', short: 'Прощание', art: 'hall', blurb: 'Зал, отпевание, панихида, координатор' },
  { id: 'burial', name: 'Погребение и кремация', short: 'Погребение', art: 'grave', blurb: 'Захоронение, кремация, документы' },
  { id: 'memory', name: 'Память и поминки', short: 'Память', art: 'portrait', blurb: 'Портрет, поминальный обед, трансляция' },
]

export type ProductType = {
  id: string
  category: string
  name: string
  base: number
  unit?: string
  art: ArtKind
  desc: string
  params: [string, string][]
  variants?: string[]
  traditions?: Tradition[] // если не указано, подходит всем
  forms?: Form[] // если не указано, подходит и для погребения, и для кремации
  essential?: boolean
  perGuest?: boolean
}

export const TYPES: ProductType[] = [
  // Гробы
  { id: 'coffin-classic', category: 'coffins', name: 'Гроб из сосны, обитый тканью', base: 9900, art: 'coffin', essential: true, traditions: ['orthodox', 'secular'],
    desc: 'Простой и достойный вариант. Сосновый гроб, аккуратно обитый тканью, с мягкой внутренней отделкой.',
    params: [['Материал', 'Сосна'], ['Отделка', 'Ткань, внутренняя обивка'], ['Форма', 'Четырёхгранный'], ['Размер', 'Подбирается по росту, до 200 см']],
    variants: ['бордовая ткань', 'коричневая ткань', 'синяя ткань', 'белая ткань'] },
  { id: 'coffin-lacquer', category: 'coffins', name: 'Гроб из сосны, лакированный', base: 23900, art: 'coffin', traditions: ['orthodox', 'secular'],
    desc: 'Полированный сосновый гроб с лаковым покрытием, мягкой атласной обивкой и подушкой в комплекте.',
    params: [['Материал', 'Массив сосны'], ['Покрытие', 'Лак, полировка'], ['Форма', 'Шестигранный'], ['Обивка', 'Атлас'], ['Размер', 'Подбирается по росту, до 200 см']],
    variants: ['светлый орех', 'тёмный орех', 'вишня'] },
  { id: 'coffin-oak', category: 'coffins', name: 'Гроб из дуба', base: 67900, art: 'coffin', traditions: ['orthodox', 'secular'],
    desc: 'Гроб из массива дуба с ручной полировкой. Тяжёлая, благородная фактура дерева и бархатная отделка внутри.',
    params: [['Материал', 'Массив дуба'], ['Покрытие', 'Масло и воск, ручная полировка'], ['Форма', 'Шестигранный'], ['Обивка', 'Бархат'], ['Фурнитура', 'Латунные ручки']],
    variants: ['натуральный дуб', 'морёный дуб'] },
  { id: 'coffin-plain', category: 'coffins', name: 'Простой деревянный гроб без отделки', base: 11900, art: 'coffin-simple', traditions: ['jewish'],
    desc: 'Гроб из неокрашенных досок без металлических деталей. Соответствует иудейской традиции скромного погребения.',
    params: [['Материал', 'Сосна, неокрашенная'], ['Металлические детали', 'Нет'], ['Отделка', 'Без отделки']] },
  { id: 'coffin-cremation', category: 'coffins', name: 'Гроб для кремации', base: 7900, art: 'coffin-simple', forms: ['cremation'], traditions: ['orthodox', 'secular'],
    desc: 'Облегчённый гроб, который соответствует требованиям крематориев. Аккуратная тканевая отделка.',
    params: [['Материал', 'Сосна, облегчённая конструкция'], ['Отделка', 'Ткань'], ['Подходит для крематориев', 'Да']] },
  { id: 'tabut', category: 'coffins', name: 'Табут (носилки) для мусульманского обряда', base: 3500, art: 'stretcher', traditions: ['muslim'],
    desc: 'Деревянные носилки для переноса тела по мусульманскому обряду. Предоставляются на время прощания.',
    params: [['Материал', 'Дерево'], ['Формат', 'Аренда на время обряда'], ['Покрывало', 'Зелёное, в комплекте']] },

  // Урны
  { id: 'urn-ceramic', category: 'urns', name: 'Урна керамическая', base: 4500, art: 'urn', forms: ['cremation'], essential: true,
    desc: 'Спокойная керамическая урна с матовой глазурью. Можно добавить табличку с именем.',
    params: [['Материал', 'Керамика'], ['Объём', '3,5 л'], ['Высота', '26 см'], ['Гравировка', 'По желанию']],
    variants: ['белая', 'графит', 'песочная'] },
  { id: 'urn-marble', category: 'urns', name: 'Урна из мрамора', base: 11900, art: 'urn', forms: ['cremation'],
    desc: 'Урна из натурального камня. Каждая уникальна по рисунку.',
    params: [['Материал', 'Натуральный мрамор'], ['Объём', '3,5 л'], ['Высота', '24 см'], ['Гравировка', 'Включена']],
    variants: ['белый мрамор', 'серый мрамор'] },
  { id: 'urn-wood', category: 'urns', name: 'Деревянная урна с гравировкой', base: 7500, art: 'urn-wood', forms: ['cremation'],
    desc: 'Тёплая урна из массива дерева с гравировкой имени и дат.',
    params: [['Материал', 'Массив бука'], ['Объём', '3,5 л'], ['Гравировка', 'Имя и даты включены']] },
  { id: 'urn-bio', category: 'urns', name: 'Биоразлагаемая урна', base: 5900, art: 'urn', forms: ['cremation'], traditions: ['secular'],
    desc: 'Урна из натуральных материалов, которая со временем возвращается природе. Подходит для захоронения в землю.',
    params: [['Материал', 'Прессованная бумага и растительные волокна'], ['Срок разложения', 'Около года'], ['Объём', '3,5 л']] },

  // Цветы
  { id: 'wreath-art', category: 'flowers', name: 'Венок из искусственных цветов', base: 3200, art: 'wreath', traditions: ['orthodox', 'secular'],
    desc: 'Аккуратный венок, который долго сохраняет вид. Лента с надписью добавляется отдельно.',
    params: [['Диаметр', '80 см'], ['Цветы', 'Искусственные'], ['Лента', 'Можно добавить']],
    variants: ['красно-белый', 'белый', 'бордовый'] },
  { id: 'wreath-live', category: 'flowers', name: 'Венок из живых цветов', base: 9800, art: 'wreath', traditions: ['orthodox', 'secular'],
    desc: 'Венок из свежих роз, хризантем и зелени. Собирается флористом в день прощания.',
    params: [['Диаметр', '100 см'], ['Цветы', 'Живые: розы, хризантемы, зелень'], ['Готовность', 'В день прощания']] },
  { id: 'basket', category: 'flowers', name: 'Траурная корзина живых цветов', base: 6500, art: 'basket', traditions: ['orthodox', 'secular'],
    desc: 'Невысокая корзина живых цветов в спокойных тонах.',
    params: [['Размер', '50 × 40 см'], ['Цветы', 'Живые, сезонные'], ['Тона', 'Белый, кремовый, зелёный']] },
  { id: 'bouquet', category: 'flowers', name: 'Букет живых цветов', base: 2900, art: 'bouquet', traditions: ['orthodox', 'secular'],
    desc: 'Букет из чётного числа цветов для прощания или посещения места памяти.',
    params: [['Количество', '10 стеблей'], ['Цветы', 'Розы или гвоздики'], ['Упаковка', 'Тёмная лента']],
    variants: ['красные розы', 'белые розы', 'гвоздики'] },
  { id: 'ribbon', category: 'flowers', name: 'Траурная лента с надписью', base: 600, art: 'ribbon',
    desc: 'Лента на венок или корзину с вашими словами. Текст можно указать при оформлении заказа.',
    params: [['Длина', '1,5 м'], ['Печать', 'Золотом или серебром'], ['Текст', 'Указываете при оформлении']] },

  // Знаки
  { id: 'cross-wood', category: 'signs', name: 'Деревянный крест на могилу', base: 4900, art: 'cross-wood', traditions: ['orthodox'], forms: ['burial'], essential: true,
    desc: 'Временный православный крест из дерева с табличкой. Ставится до установки памятника.',
    params: [['Материал', 'Дуб или сосна'], ['Высота', '2 м'], ['Табличка', 'С именем и датами, включена'], ['Установка', 'Входит в стоимость']] },
  { id: 'cross-metal', category: 'signs', name: 'Металлический крест', base: 6900, art: 'cross-metal', traditions: ['orthodox'], forms: ['burial'],
    desc: 'Прочный крест с порошковой окраской и табличкой.',
    params: [['Материал', 'Металл, порошковая окраска'], ['Высота', '1,8 м'], ['Табличка', 'Включена']] },
  { id: 'plate', category: 'signs', name: 'Временная табличка с именем', base: 2200, art: 'plate', forms: ['burial'], essential: true, traditions: ['secular', 'muslim', 'jewish'],
    desc: 'Аккуратная табличка на подставке с именем и датами. Подходит для любой традиции.',
    params: [['Материал', 'Металл, ламинированная печать'], ['Размер таблички', '30 × 20 см'], ['Символ', 'По вашему выбору или без символа']] },
  { id: 'stele', category: 'signs', name: 'Временный памятник-стела', base: 7900, art: 'stele', forms: ['burial'], traditions: ['secular', 'orthodox'],
    desc: 'Небольшая стела с портретом и надписью. Достойно выглядит, пока готовится постоянный памятник.',
    params: [['Материал', 'Композит под камень'], ['Высота', '80 см'], ['Портрет', 'Можно добавить']] },

  // Текстиль
  { id: 'textile-set', category: 'textile', name: 'Покрывало и подушка', base: 2400, art: 'textile', essential: true, traditions: ['orthodox', 'secular'],
    desc: 'Комплект из покрывала и подушки. Мягкая ткань, спокойные цвета.',
    params: [['Состав', 'Покрывало, подушка'], ['Ткань', 'Атлас или бязь'], ['Цвет', 'Белый, кремовый']] },
  { id: 'clothes', category: 'textile', name: 'Одежда для прощания', base: 7500, art: 'clothes', traditions: ['orthodox', 'secular'],
    desc: 'Если подходящей одежды нет или её трудно найти сейчас, мы подберём комплект по размеру.',
    params: [['Комплект', 'Костюм или платье, бельё, обувь'], ['Размер', 'Подбирается'], ['Цвет', 'Спокойные тона']] },
  { id: 'orthodox-kit', category: 'textile', name: 'Православный набор', base: 900, art: 'kit', traditions: ['orthodox'], essential: true,
    desc: 'Всё, что нужно для православного обряда: венчик, разрешительная молитва, иконка и нательный крестик.',
    params: [['Состав', 'Венчик, разрешительная молитва, иконка, крестик'], ['Освящено', 'Да']] },
  { id: 'kafan', category: 'textile', name: 'Саван (кафан)', base: 3500, art: 'shroud', traditions: ['muslim'], essential: true,
    desc: 'Белая хлопковая ткань для мусульманского обряда, подготовленная по канонам.',
    params: [['Материал', '100% хлопок'], ['Цвет', 'Белый'], ['Комплект', 'Мужской или женский']] },
  { id: 'tachrichim', category: 'textile', name: 'Тахрихим (погребальные одежды)', base: 4500, art: 'shroud', traditions: ['jewish'], essential: true,
    desc: 'Простые белые льняные одежды по иудейской традиции.',
    params: [['Материал', 'Лён'], ['Цвет', 'Белый'], ['Изготовление', 'Без узлов, по традиции']] },

  // Подготовка
  { id: 'care-basic', category: 'care', name: 'Санитарная подготовка и одевание', base: 6500, art: 'care', essential: true, traditions: ['orthodox', 'secular'],
    desc: 'Бережная подготовка тела к прощанию: санитарная обработка, одевание, укладка в гроб.',
    params: [['Включено', 'Обработка, одевание, укладка'], ['Где', 'В морге или в помещении службы']] },
  { id: 'care-cosmetic', category: 'care', name: 'Косметическая подготовка', base: 9000, art: 'care', traditions: ['orthodox', 'secular'],
    desc: 'Специалист бережно подготовит лицо и руки, чтобы близкие могли спокойно попрощаться.',
    params: [['Включено', 'Макияж, укладка волос'], ['По фото', 'Можно передать фото, чтобы образ был привычным']] },
  { id: 'embalming', category: 'care', name: 'Бальзамирование', base: 12000, art: 'care', traditions: ['orthodox', 'secular'],
    desc: 'Нужно, если прощание переносится на несколько дней или предстоит перевозка в другой город.',
    params: [['Когда нужно', 'Прощание через 3 и более дней, перевозка'], ['Срок сохранности', 'До 7 дней']] },
  { id: 'cold-storage', category: 'care', name: 'Хранение в холодильной камере', base: 2500, unit: 'сутки', art: 'cold',
    desc: 'Если нужно время, чтобы собрать близких или дождаться документов.',
    params: [['Единица', 'Сутки'], ['Где', 'Помещение службы']] },
  { id: 'ghusl', category: 'care', name: 'Омовение (гусль)', base: 5000, art: 'care', traditions: ['muslim'], essential: true,
    desc: 'Ритуальное омовение проводят знающие люди того же пола, что и усопший, с уважением к канонам.',
    params: [['Кто проводит', 'Специалист того же пола'], ['Где', 'Помещение при мечети или службе']] },
  { id: 'tahara', category: 'care', name: 'Тахара (омовение)', base: 6000, art: 'care', traditions: ['jewish'], essential: true,
    desc: 'Омовение по иудейской традиции. Проводят члены погребального братства.',
    params: [['Кто проводит', 'Погребальное братство (хевра кадиша)'], ['Согласование', 'С общиной']] },

  // Транспорт
  { id: 'hearse', category: 'transport', name: 'Катафалк по Москве', base: 9500, art: 'hearse', essential: true,
    desc: 'Перевозка из морга к месту прощания и на кладбище или в крематорий. Водитель поможет с переносом.',
    params: [['Время', 'До 3 часов'], ['Зона', 'Москва в пределах МКАД'], ['Дополнительный час', 'По договорённости']] },
  { id: 'transfer-morgue', category: 'transport', name: 'Перевозка тела в морг', base: 6900, art: 'hearse',
    desc: 'Если близкий человек ушёл дома. Бригада приедет, бережно перенесёт и перевезёт тело в морг.',
    params: [['Когда', 'Круглосуточно'], ['Бригада', '2 человека'], ['Зона', 'Москва']] },
  { id: 'bus', category: 'transport', name: 'Автобус для близких', base: 12000, art: 'bus',
    desc: 'Чтобы все смогли приехать вместе и никому не пришлось искать дорогу.',
    params: [['Мест', 'До 20'], ['Время', 'До 4 часов'], ['Зона', 'Москва и область']] },
  { id: 'porters', category: 'transport', name: 'Носильщики', base: 6000, art: 'people',
    desc: 'Четыре человека помогут бережно перенести гроб. Близким не придётся делать это самим.',
    params: [['Состав', '4 человека'], ['Форма', 'Тёмная, аккуратная']] },
  { id: 'intercity', category: 'transport', name: 'Перевозка в другой город', base: 25000, art: 'map',
    desc: 'Если прощание пройдёт в другом городе. Поможем с документами для перевозки.',
    params: [['Стоимость', 'От 25 000 ₽, зависит от расстояния'], ['Документы', 'Поможем оформить']] },

  // Прощание
  { id: 'hall', category: 'ceremony', name: 'Ритуальный зал для прощания', base: 8000, art: 'hall',
    desc: 'Тихий светлый зал, где близкие могут спокойно побыть вместе и попрощаться.',
    params: [['Время', '1 час'], ['Вместимость', 'До 60 человек'], ['Включено', 'Постамент, свечи, музыка по желанию']] },
  { id: 'otpevanie', category: 'ceremony', name: 'Отпевание', base: 5000, art: 'church', traditions: ['orthodox'],
    desc: 'Договоримся с храмом или пригласим священника в ритуальный зал. Сумма указана как ориентир пожертвования.',
    params: [['Где', 'В храме или ритуальном зале'], ['Согласование', 'Берём на себя']] },
  { id: 'civil', category: 'ceremony', name: 'Гражданская панихида с ведущим', base: 9000, art: 'hall', traditions: ['secular'],
    desc: 'Ведущий бережно проведёт церемонию, поможет близким сказать важные слова.',
    params: [['Длительность', 'До 1 часа'], ['Включено', 'Встреча с семьёй, сценарий, ведение']] },
  { id: 'janaza', category: 'ceremony', name: 'Организация джаназа-намаза', base: 4000, art: 'mosque', traditions: ['muslim'],
    desc: 'Договоримся с мечетью о проведении погребальной молитвы в удобное время.',
    params: [['Где', 'В мечети'], ['Согласование', 'Берём на себя']] },
  { id: 'jewish-guide', category: 'ceremony', name: 'Сопровождение по иудейской традиции', base: 5000, art: 'candle', traditions: ['jewish'],
    desc: 'Свяжемся с общиной и раввином, поможем соблюсти традицию и сроки.',
    params: [['Включено', 'Связь с общиной, согласование обряда'], ['Сроки', 'Как можно скорее, по традиции']] },
  { id: 'music', category: 'ceremony', name: 'Живая музыка', base: 15000, art: 'music', traditions: ['orthodox', 'secular'],
    desc: 'Струнный квартет или виолончель. Можно выбрать любимые произведения близкого человека.',
    params: [['Состав', 'Квартет или солист'], ['Длительность', 'До 1 часа'], ['Репертуар', 'Согласуем с вами']] },
  { id: 'coordinator', category: 'ceremony', name: 'Персональный координатор', base: 7000, art: 'people',
    desc: 'Один человек, который весь день рядом: встретит, подскажет, решит все вопросы на месте.',
    params: [['Время', 'Весь день прощания'], ['Включено', 'Контроль всех служб, встреча гостей']] },

  // Погребение
  { id: 'burial', category: 'burial', name: 'Копка могилы и захоронение', base: 14000, art: 'grave', forms: ['burial'], essential: true,
    desc: 'Подготовка могилы и захоронение на выбранном кладбище бригадой кладбища.',
    params: [['Включено', 'Копка, опускание, оформление холма'], ['Кладбища', 'Москва и область']] },
  { id: 'reburial', category: 'burial', name: 'Подзахоронение в родственную могилу', base: 12000, art: 'grave', forms: ['burial'],
    desc: 'Если в семье уже есть место. Поможем получить разрешение и всё подготовить.',
    params: [['Нужно', 'Удостоверение о захоронении'], ['Разрешение', 'Поможем оформить']] },
  { id: 'cremation', category: 'burial', name: 'Кремация', base: 18000, art: 'cremation', forms: ['cremation'], essential: true,
    desc: 'Кремация с возможностью короткого прощания в зале крематория. Урну можно получить через 1-3 дня.',
    params: [['Включено', 'Кремация, прощальный зал до 15 минут'], ['Выдача урны', 'Через 1-3 дня']] },
  { id: 'urn-burial', category: 'burial', name: 'Захоронение урны', base: 6500, art: 'grave', forms: ['cremation'],
    desc: 'В землю, в колумбарий или в родственную могилу.',
    params: [['Варианты', 'Земля, колумбарий, родственная могила'], ['Документы', 'Поможем оформить']] },
  { id: 'docs', category: 'burial', name: 'Оформление документов', base: 3500, art: 'docs', essential: true,
    desc: 'Возьмём на себя бумаги: свидетельство о смерти, разрешения на захоронение, справки для выплат.',
    params: [['Включено', 'Свидетельство о смерти, справки, разрешения'], ['Как', 'По доверенности или вместе с вами']] },

  // Память
  { id: 'portrait', category: 'memory', name: 'Портрет в рамке с лентой', base: 1900, art: 'portrait',
    desc: 'Аккуратная обработка вашей фотографии и печать в рамке с траурной лентой.',
    params: [['Размер', '30 × 40 см'], ['Обработка фото', 'Включена'], ['Срок', 'В течение суток']] },
  { id: 'dinner', category: 'memory', name: 'Поминальный обед', base: 1600, unit: 'гость', art: 'dinner', perGuest: true,
    desc: 'Тихий зал и простое меню по традиции. Цена указана за одного гостя.',
    params: [['Цена', 'За одного гостя'], ['Меню', 'Традиционное или по пожеланиям'], ['Зал', 'Рядом с местом прощания']] },
  { id: 'stream', category: 'memory', name: 'Онлайн-трансляция прощания', base: 5000, art: 'screen',
    desc: 'Для родных, которые далеко и не могут приехать. Ссылку можно отправить только своим.',
    params: [['Формат', 'Закрытая ссылка'], ['Запись', 'Сохраняется для семьи']] },
  { id: 'photo', category: 'memory', name: 'Бережная фотосъёмка', base: 8000, art: 'camera', traditions: ['orthodox', 'secular'],
    desc: 'Фотограф работает незаметно и деликатно. Снимки останутся семье как память.',
    params: [['Длительность', 'До 2 часов'], ['Снимки', 'Через 3 дня']] },
  { id: 'candles', category: 'memory', name: 'Поминальный набор', base: 1200, art: 'candle', traditions: ['orthodox', 'secular'],
    desc: 'Свечи, платочки и памятки для гостей.',
    params: [['Состав', 'Свечи, платочки, памятки'], ['На сколько гостей', 'До 30']] },
  { id: 'grave-care', category: 'memory', name: 'Уход за местом памяти', base: 9000, unit: 'сезон', art: 'leaf', forms: ['burial'],
    desc: 'Будем ухаживать за могилой весь сезон и присылать фото после каждого визита.',
    params: [['Период', 'Апрель - октябрь'], ['Визиты', '2 раза в месяц'], ['Отчёт', 'Фото после визита']] },
]

export type Offer = {
  id: string
  typeId: string
  agencyId: string
  name: string
  price: number
  variant?: string
  available: 'today' | 'tomorrow' | 'order'
  rating: number
  reviews: number
  palette: number
}

// Детерминированный генератор, чтобы демо-каталог был одинаковым у всех
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}
function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619)
  return h >>> 0
}

// Специализация служб: какие типы точно есть (и какие точно нет)
const SPECIAL: Record<string, { add?: string[]; skip?: string[]; priceK?: number }> = {
  a01: { add: ['burial', 'reburial', 'docs', 'cremation', 'urn-burial', 'hearse', 'transfer-morgue', 'coffin-classic', 'plate', 'cross-wood'], priceK: 0.95 },
  a02: { add: ['transfer-morgue', 'hearse', 'hall', 'care-basic', 'coffin-classic', 'coffin-lacquer'], priceK: 1.0 },
  a03: { add: ['coffin-classic', 'coffin-lacquer', 'coffin-oak', 'urn-ceramic', 'urn-marble', 'urn-wood', 'wreath-art', 'wreath-live', 'textile-set', 'clothes'], priceK: 0.97 },
  a05: { add: ['cross-wood', 'cross-metal', 'plate', 'stele', 'grave-care'], priceK: 0.92 },
  a06: { add: ['otpevanie', 'orthodox-kit', 'cross-wood', 'coffin-classic', 'coffin-lacquer', 'care-basic', 'candles'], priceK: 1.05 },
  a07: { priceK: 0.86 },
  a08: { add: ['cremation', 'urn-ceramic', 'urn-wood', 'urn-bio', 'urn-burial', 'coffin-cremation'], priceK: 1.0 },
  a09: { add: ['hearse', 'bus', 'porters', 'hall'], priceK: 0.93 },
  a10: { priceK: 0.88 },
  a11: { add: ['coordinator', 'stele', 'porters', 'music'], priceK: 1.15 },
  a13: { add: ['coffin-oak', 'coffin-plain', 'tachrichim', 'tahara', 'jewish-guide', 'urn-wood'], priceK: 1.12 },
  a14: { add: ['tabut', 'kafan', 'ghusl', 'janaza', 'burial', 'plate', 'hearse', 'docs'], skip: ['coffin-classic', 'coffin-lacquer', 'coffin-oak', 'cremation', 'coffin-cremation', 'otpevanie', 'orthodox-kit', 'cross-wood', 'cross-metal', 'music', 'photo', 'urn-ceramic', 'urn-marble', 'urn-wood', 'urn-bio', 'urn-burial', 'embalming', 'care-cosmetic', 'wreath-art', 'wreath-live', 'basket'], priceK: 0.9 },
  a15: { add: ['grave-care', 'wreath-live', 'basket', 'bouquet'], priceK: 0.98 },
  a16: { add: ['dinner', 'portrait', 'hall', 'candles', 'stream'], priceK: 1.02 },
}
// Типы, которые есть только у профильных служб
const RARE = new Set(['tabut', 'kafan', 'ghusl', 'janaza', 'tachrichim', 'tahara', 'jewish-guide', 'coffin-plain'])
const RARE_EXTRA: Record<string, string[]> = { a01: ['kafan', 'plate'], a02: ['tachrichim'], a12: ['kafan', 'ghusl'] }

function buildOffers(): Offer[] {
  const out: Offer[] = []
  for (const agency of AGENCIES) {
    const spec = SPECIAL[agency.id] ?? {}
    const r = rng(hash(agency.id))
    for (const t of TYPES) {
      const forced = spec.add?.includes(t.id) || RARE_EXTRA[agency.id]?.includes(t.id)
      if (spec.skip?.includes(t.id)) continue
      if (RARE.has(t.id) && !forced) continue
      const roll = r()
      if (!forced && roll > 0.62) continue
      const k = (spec.priceK ?? 1) * (0.88 + r() * 0.32)
      let price = Math.round((t.base * k) / 100) * 100
      if (t.base < 1000) price = Math.round((t.base * k) / 10) * 10
      const variant = t.variants ? t.variants[Math.floor(r() * t.variants.length)] : undefined
      const av = r()
      out.push({
        id: `${agency.slug}--${t.id}`,
        typeId: t.id,
        agencyId: agency.id,
        name: t.name,
        price: Math.max(price, 300),
        variant,
        available: av < 0.55 ? 'today' : av < 0.85 ? 'tomorrow' : 'order',
        rating: Math.round((4.1 + r() * 0.9) * 10) / 10,
        reviews: Math.floor(r() * 46),
        palette: Math.floor(r() * 5),
      })
    }
  }
  return out
}

export const OFFERS: Offer[] = buildOffers()

export const typeById = (id: string) => TYPES.find((t) => t.id === id)
export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id)
export const offerById = (id: string) => OFFERS.find((o) => o.id === id)
export const offersByType = (typeId: string) => OFFERS.filter((o) => o.typeId === typeId).sort((a, b) => a.price - b.price)
export const offersByAgency = (agencyId: string) => OFFERS.filter((o) => o.agencyId === agencyId)
export const offersByCategory = (cat: string) => OFFERS.filter((o) => typeById(o.typeId)?.category === cat)
export const typesByCategory = (cat: string) => TYPES.filter((t) => t.category === cat)
export const minPrice = (typeId: string) => Math.min(...offersByType(typeId).map((o) => o.price))

export const AVAILABILITY: Record<Offer['available'], string> = {
  today: 'Можно сегодня',
  tomorrow: 'Можно завтра',
  order: 'Под заказ, 2-3 дня',
}

export function offerTitle(o: Offer) {
  return o.variant ? `${o.name}, ${o.variant}` : o.name
}

export function agencyOfOffer(o: Offer): Agency {
  return AGENCIES.find((a) => a.id === o.agencyId)!
}

// Демо-отзывы
const NAMES = ['Ольга М.', 'Андрей К.', 'Наталья С.', 'Игорь П.', 'Елена В.', 'Марина Д.', 'Сергей Л.', 'Татьяна Г.', 'Дмитрий Р.', 'Ирина Ф.', 'Алексей Т.', 'Светлана Б.', 'Рустам Х.', 'Анна Ш.', 'Мария Е.']
const TEXTS_5 = [
  'Всё сделали аккуратно и вовремя. В такой момент очень важно, что не пришлось ни о чём переживать.',
  'Спасибо за спокойствие и внимание. Нам всё объяснили по шагам, никто не торопил.',
  'Цена совпала с той, что была на сайте. Никаких «доплат на месте», за это отдельная благодарность.',
  'Очень бережно отнеслись к нашей маме. Всё выглядело достойно.',
  'Привезли точно ко времени, качество хорошее. Координатор был на связи весь день.',
  'Помогли с документами, сами бы мы не разобрались. Спасибо за человеческое отношение.',
]
const TEXTS_4 = [
  'В целом всё хорошо, немного задержались с доставкой, но предупредили заранее.',
  'Качество хорошее. Хотелось бы чуть больше вариантов цвета, но нам помогли подобрать.',
  'Всё прошло нормально, менеджер вежливый. Пришлось один раз перезвонить, чтобы уточнить время.',
]
const TEXTS_3 = ['Сам товар хороший, но связаться со службой получилось не с первого раза.']

export type Review = { id: string; author: string; rating: number; text: string; date: string; target: string; demo: true }

export function demoReviews(targetId: string, count: number): Review[] {
  const r = rng(hash(targetId))
  const list: Review[] = []
  const n = Math.min(count, 6)
  for (let i = 0; i < n; i++) {
    const roll = r()
    const rating = roll < 0.7 ? 5 : roll < 0.93 ? 4 : 3
    const pool = rating === 5 ? TEXTS_5 : rating === 4 ? TEXTS_4 : TEXTS_3
    const d = new Date(2026, 9, 28)
    d.setDate(d.getDate() - Math.floor(r() * 300))
    list.push({
      id: `${targetId}-r${i}`,
      author: NAMES[Math.floor(r() * NAMES.length)],
      rating,
      text: pool[Math.floor(r() * pool.length)],
      date: d.toISOString().slice(0, 10),
      target: targetId,
      demo: true,
    })
  }
  return list.sort((a, b) => b.date.localeCompare(a.date))
}

export const PLATFORM_FEE = 0 // для семьи сервис бесплатный, комиссию платит служба

// Описание предложения от службы (демо): одна фраза про товар и одна про саму службу
const NOTES: Record<string, string[]> = {
  coffins: ['Перед выдачей проверяем каждое изделие, покажем фото, если хотите.', 'Подберём размер и обивку, привезём к нужному времени.', 'Изделия от постоянного поставщика, без сколов и запаха лака.'],
  urns: ['Поможем выбрать урну под место захоронения или колумбарий.', 'Можно нанести гравировку с именем и датами.', 'Урна упакована бережно, привезём или передадим в офисе.'],
  flowers: ['Соберём в день прощания, чтобы цветы были свежими.', 'Ленту с надписью напечатаем бесплатно, текст согласуем с вами.', 'Пришлём фото готовой композиции перед доставкой.'],
  signs: ['Табличку изготовим за сутки, текст согласуем заранее.', 'Установим на месте, если это нужно.', 'Материалы выдерживают погоду до установки памятника.'],
  textile: ['Подберём размер и комплект, всё новое и упакованное.', 'Можно заказать отдельно покрывало или всё вместе.', 'Ткани спокойных цветов, есть варианты для разных традиций.'],
  care: ['Работаем бережно и с уважением, можно передать любимую одежду.', 'Сделаем всё к назначенному времени прощания.', 'Опытные специалисты, сохраняем естественный вид.'],
  transport: ['Машина чистая и аккуратная, водитель знает маршруты по кладбищам.', 'Приедем заранее, подождём, если прощание затянется.', 'Поможем с погрузкой, сопровождающим есть места.'],
  ceremony: ['Всё подготовим заранее и будем рядом во время прощания.', 'Согласуем время и порядок, подскажем, как всё устроено.', 'Тихая обстановка, можно побыть с близким без спешки.'],
  burial: ['Возьмём на себя переговоры с кладбищем и документы.', 'Подскажем, какие бумаги нужны, и проверим их за вас.', 'Работаем на городских кладбищах Москвы и области.'],
  memory: ['Поможем со всеми деталями, можно согласовать всё по телефону.', 'Сделаем аккуратно и в срок, покажем результат заранее.', 'Учтём пожелания семьи и традиции.'],
}
export function offerNote(o: Offer): string {
  const t = typeById(o.typeId)
  const a = agencyOfOffer(o)
  const r = rng(hash(o.id + ':note'))
  const pool = NOTES[t?.category ?? ''] ?? NOTES.memory
  const first = pool[Math.floor(r() * pool.length)]
  const s = a.strengths[Math.floor(r() * a.strengths.length)]
  return `${first} ${s}.`
}
