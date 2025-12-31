# Дашборд UX-аудита клиник

Интерактивный дашборд для сравнения UX-показателей медицинских клиник.

**Демо:** https://dmitrysatin.github.io/clinic-dashboard/

## Обновление данных клиник

Данные хранятся в файле `src/data/clinics.json`

### Структура данных клиники

```json
{
  "id": "example.ru",           // URL сайта (используется как ID и ссылка)
  "name": "Название клиники",   // Отображаемое название
  "city": "Москва",             // Город
  "country": "ru",              // Код страны: "ru" или "us"
  "isBenchmark": false,         // true для эталонных клиник (пунктирная рамка)
  "functionality": 73,          // Функциональность (0-100%)
  "functionalityDetails": {     // Детализация функциональности
    "yes": 27,                  // Количество "да"
    "warning": 7,               // Количество "частично"
    "no": 3                     // Количество "нет"
  },
  "flesch": 38,                 // Читабельность по Flesch (0-100)
  "wcag": 11,                   // Количество WCAG-ошибок (меньше = лучше)
  "seo": "warning",             // SEO: "good", "warning" или "bad"
  "integrated": 65,             // Интегральный балл (0-100)
  "stars": 4,                   // Устаревшее поле (не используется)
  "app": {                      // Мобильное приложение (null если нет)
    "rating": 3.8,              // Рейтинг (0-5)
    "reviewsCount": 21,         // Количество отзывов
    "negativePercent": 57,      // Процент негативных отзывов
    "store": "google_play"      // "google_play" или "app_store"
  }
}
```

### Добавление новой клиники

1. Откройте `src/data/clinics.json`
2. Добавьте новый объект в массив `clinics`
3. Заполните все обязательные поля
4. Если нет приложения, укажите `"app": null`

### Редактирование существующей клиники

1. Найдите клинику по `id` в файле `src/data/clinics.json`
2. Измените нужные поля
3. Сохраните файл

## Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка
npm run build
```

## Деплой на GitHub Pages

```bash
npm run deploy
```

Сайт обновится на https://dmitrysatin.github.io/clinic-dashboard/

## Технологии

- React 19 + TypeScript
- Vite
- Recharts (графики)
- Lucide React (иконки)
