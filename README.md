# От Души · MVP

Бережный онлайн-сервис организации прощания в Москве. Семья собирает всё необходимое у 16 специализированных ритуальных служб по фиксированной цене, оплачивает онлайн и следит за заказом в личном кабинете.

Стек: React 18, TypeScript, Vite, React Router, Supabase (авторизация по ссылке из письма и база заказов).

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте http://localhost:5173. Сайт уже подключён к Supabase: публичные ключи лежат в `.env.development` и `.env.production`. Если удалить ключи, сайт переключится в **демо-режим**: заказы, кабинет и заявки будут храниться в браузере (localStorage), вход в кабинет произойдёт сразу по почте.

## Подключение Supabase

1. Создайте проект на [supabase.com](https://supabase.com).
2. SQL Editor: выполните `supabase/schema.sql`, затем `supabase/seed.sql` (каталог: 16 служб, 53 типа товаров, 460 предложений).
3. Authentication -> URL Configuration: добавьте адрес сайта (например `http://localhost:5173` и боевой домен) в **Site URL** и **Redirect URLs**, путь `/kabinet`.
4. Authentication -> Providers -> Email: включите Email, вход по magic link работает из коробки. Для продакшена подключите свой SMTP.
5. Скопируйте `.env.example` в `.env` и вставьте `Project URL` и `anon public` ключ из Project Settings -> API.
6. Перезапустите `npm run dev`. Полоса вверху сменится на «Тестовый запуск».

Что происходит с Supabase:
- после оплаты заказ пишется в `orders` и `order_parts` (часть заказа на каждую службу);
- на почту уходит ссылка для входа, по ней создаётся пользователь, а личный кабинет показывает заказы с той же почтой (RLS);
- заявки «Перезвоните мне», заявки служб и отзывы пишутся в `callback_requests`, `partner_applications`, `reviews`;
- для кабинета службы есть таблица `agency_members` (пользователь ↔ служба) и политики на чтение и смену статусов своих частей заказа.

Каталог на сайте пока читается из `src/data/*.ts`, а `seed.sql` генерируется из тех же файлов: `npm run seed:sql`. Следующий шаг: читать каталог из таблиц `offers` и `product_types`.

## Что есть в MVP

**Главная.** Две кнопки-сценария («Помогите всё организовать» и «Я знаю, что мне нужно»), ссылка на памятку для тех, у кого только что ушёл близкий, и сразу под ними маркетплейс всех товаров с категориями и сортировкой.

**Полное сопровождение** (`/soprovozhdenie`).
1. Анкета из 4-7 вопросов: ситуация (ушёл недавно, тяжело болен, заранее, уже есть место), где сейчас тело, традиция (православная, светская, мусульманская, иудейская), погребение или кремация, место на кладбище, число гостей, бюджет.
2. Три пакета: Минимум, Стандарт, Расширенный. Состав и цена считаются под ответы, рекомендуемый пакет подсвечивается по бюджету.
3. Чекпоинты с прогресс-баром: документы, перевозка, подготовка, гроб или табут, текстиль, цветы, прощание, транспорт, погребение или кремация и урна, знак на месте памяти, память. В каждом шаге предложения разных служб, их можно выбрать, убрать или пропустить шаг.
4. Итог по шагам, сумма, число служб. Можно сохранить план (он появится в кабинете) или сразу оформить.
Прогресс сохраняется, к подбору можно вернуться.

**Каталог** (`/katalog`). Основные товары (тип товара, «от N ₽», в скольких службах), страница сравнения предложений всех служб по одному товару, режим «Все предложения» с фильтрами по службе, цене и сроку, поиск из шапки.

**Карточка товара.** Три «фото» (в MVP иллюстрации), параметры, срок, продавец, количество, отзывы с формой, тот же товар у других служб, другие товары службы.

**Страница службы.** Контакты, адрес со ссылкой на карту, часы работы, сильные стороны, все товары с фильтром по категориям, отзывы.

**Корзина и оформление.** Корзина сгруппирована по службам. Оформление в 3 шага: контакты, детали прощания (всё необязательно, можно уточнить с координатором), демо-оплата картой или СБП. После оплаты заказ делится на части по службам, создаётся личный кабинет на указанную почту.

**Личный кабинет.** Заказы со статусами каждой части (ждёт подтверждения, подтверждено, в работе, выполнено, служба не сможет), детали прощания, оплата и печать чека, контакты служб и координатора. Сохранённые планы, памятка-чек-лист, профиль.

**Дополнительно.**
- Гид «Что делать сейчас»: первые часы, документы, ЗАГС, выплаты (пособие на погребение 9 678,63 ₽ с 1 февраля 2026 года), гарантированный перечень бесплатных услуг, FAQ.
- Поддержка 24/7: плавающая кнопка, чат с быстрыми ответами, звонок и заявка «Перезвоните мне».
- Для служб: лендинг с условиями и заявкой на подключение, демо-кабинет службы (`/partner`): подтверждение и смена статусов заказов, цены и наличие, выплаты за вычетом комиссии 15%.

## Перед запуском проверить

- **Данные служб.** В исходном списке часть строк была обрезана. Уточните поля из `needsCheck` в `src/data/agencies.ts`: полные названия «Анубис-Сервис», «Стикс», «Генезис», «Ритуал-Юго-Запад», название НКО на Выползовом пер., номера домов у «Ритуал-Горбрус» и «Стикс», окончания адресов «Броникс-Сервис» и «Генезис», почты «Анубис-Сервис» и «Генезис».
- **Демо-данные.** Описания служб, часы работы, рейтинги, ассортимент, цены и отзывы примерные. Отзывы помечены «Пример отзыва». Перед показом службам или публичным запуском их нужно заменить реальными или согласовать с самими службами.
- **Телефон поддержки** `SUPPORT_PHONE` в `src/data/guide.ts` (сейчас демо-номер).
- **Оплата.** Сейчас имитация. Для боевой версии подключите платёжный сервис с безопасной сделкой или холдированием (например, ЮKassa) и перенесите создание заказа в Supabase Edge Function по вебхуку оплаты, а политику `orders insert` для anon уберите.
- **Юридические тексты** в `src/pages/Legal.tsx` шаблонные, нужен юрист. Обработка персональных данных должна соответствовать 152-ФЗ.

## Фотографии

Все фотографии на сайте взяты с [Unsplash](https://unsplash.com) и используются по [лицензии Unsplash](https://unsplash.com/license): её можно бесплатно использовать на сайте, в том числе в коммерческих целях. Платные снимки Unsplash+ не использовались. Файлы лежат в `public/photos`, привязка к товарам и разделам в `src/data/photos.ts`. Фото товаров иллюстративные: перед запуском их лучше заменить настоящими фото товаров служб.

Источники:

- https://images.unsplash.com/photo-1450101499163-c8848c66ca85
- https://images.unsplash.com/photo-1469317835793-6d02c2392778
- https://images.unsplash.com/photo-1491336477066-31156b5e4f35
- https://images.unsplash.com/photo-1522752622479-65eefd320386
- https://images.unsplash.com/photo-1532956985363-fb868d867e67
- https://images.unsplash.com/photo-1533101732515-d9bffae4edb9
- https://images.unsplash.com/photo-1534011056808-50c1c6082fe7
- https://images.unsplash.com/photo-1535655685871-dc8158ff167e
- https://images.unsplash.com/photo-1567129610638-e83b2e9e5e90
- https://images.unsplash.com/photo-1567428051128-5f09a0200655
- https://images.unsplash.com/photo-1572982758354-c097406beae5
- https://images.unsplash.com/photo-1574808146141-fbd663cfb174
- https://images.unsplash.com/photo-1576701617175-5fa0ce5769dc
- https://images.unsplash.com/photo-1577965207665-ca08b7be0581
- https://images.unsplash.com/photo-1590075865003-e48277faa558
- https://images.unsplash.com/photo-1590239549758-4c4bcc36971c
- https://images.unsplash.com/photo-1595204538982-59dc87ae8d0f
- https://images.unsplash.com/photo-1598146621261-7cdbb2b30d4b
- https://images.unsplash.com/photo-1600814832809-579119f47045
- https://images.unsplash.com/photo-1601276174812-63280a55656e
- https://images.unsplash.com/photo-1606770347238-77fcfd29906c
- https://images.unsplash.com/photo-1619263719761-165c773ee5df
- https://images.unsplash.com/photo-1619418602850-35ad20aa1700
- https://images.unsplash.com/photo-1630520612416-6ff802604865
- https://images.unsplash.com/photo-1631407779166-86952be9dbd7
- https://images.unsplash.com/photo-1644413816296-9533c9d831bf
- https://images.unsplash.com/photo-1644665088789-b5a3de58f278
- https://images.unsplash.com/photo-1644666218912-5c4069dc05f0
- https://images.unsplash.com/photo-1644697701010-e17ae80d9d92
- https://images.unsplash.com/photo-1644698430557-b0bc57940f05
- https://images.unsplash.com/photo-1644698430577-0b5c5b20bbe7
- https://images.unsplash.com/photo-1649615318499-c888057747fe
- https://images.unsplash.com/photo-1650737806228-4a29d3a3e291
- https://images.unsplash.com/photo-1659902374294-0a97f40b8877
- https://images.unsplash.com/photo-1669240728303-305faaf6abf8
- https://images.unsplash.com/photo-1690182183994-85c53baa6d10
- https://images.unsplash.com/photo-1700615753088-c21bb092b5d9
- https://images.unsplash.com/photo-1708632904133-f4341f1a7f5b
- https://images.unsplash.com/photo-1718801666793-ed47601f8270
- https://images.unsplash.com/photo-1718801666842-f6b9f1ca99b3
- https://images.unsplash.com/photo-1718801666911-a008a2fac017
- https://images.unsplash.com/photo-1726325935075-98581cb9c202
- https://images.unsplash.com/photo-1743356629167-343e188d100b
- https://images.unsplash.com/photo-1754838514611-5d855fd46514
- https://images.unsplash.com/photo-1760627591811-39400df258bf
- https://images.unsplash.com/photo-1762013728525-4e093240ae7b
- https://images.unsplash.com/photo-1762765685348-4bced247d12c
- https://images.unsplash.com/photo-1765137138067-38429bc553e5
- https://images.unsplash.com/photo-1765146567664-cf0c0d987da9
- https://images.unsplash.com/photo-1769812343870-f6264ffd6bad
- https://images.unsplash.com/photo-1769981533227-2bbf02c714f2
- https://images.unsplash.com/photo-1773255933858-6decc64267a8
- https://images.unsplash.com/photo-1775344553937-709753db9316
- https://images.unsplash.com/photo-1780400358320-9e512a6be0a3
- https://images.unsplash.com/photo-1784901392899-f87a11b0671a
- https://images.unsplash.com/photo-1785851099674-c933f4417739

## Структура

```
src/
  data/        agencies.ts (16 служб), catalog.ts (категории, типы, предложения, отзывы),
               flow.ts (анкета, пакеты, чекпоинты), guide.ts (памятка, FAQ)
  lib/         api.ts (Supabase или демо), store.tsx (корзина, пользователь, уведомления), supabase.ts
  components/  Layout, ProductCard, ProductArt (иллюстрации), SupportWidget, Illustrations, ui
  pages/       Home, Support, Catalog, TypePage, Product, Agencies, AgencyPage, Cart, Checkout,
               Success, Guide, Partners, Legal, account/*, partner/*
supabase/      schema.sql, seed.sql
scripts/       generate-seed.ts
```

## Деплой

**GitHub Pages.** Сайт открывается по адресу https://shmemka.github.io/will/ и публикуется из ветки `gh-pages`. Чтобы выложить новую версию, выполните:

```bash
npm run deploy
```

Команда соберёт сайт и отправит его в ветку `gh-pages`, через 1-2 минуты изменения появятся на сайте. В настройках репозитория Settings -> Pages -> Source должно стоять **Deploy from a branch**, ветка `gh-pages`, папка `/ (root)`. В Supabase (Authentication -> URL Configuration) добавьте `https://shmemka.github.io/will/kabinet` в Redirect URLs.

**Другие хостинги.** 
Подходит любой статический хостинг. Для Vercel и Netlify уже есть правила для SPA (`vercel.json`, `public/_redirects`). Не забудьте указать переменные `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY` в настройках хостинга.
