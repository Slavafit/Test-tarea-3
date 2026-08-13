# Snapbuild — расширение лендинга

Тестовое задание: адаптивный лендинг на React + Vite в стилистике текущего сайта Snapbuild. Проект работает полностью на клиенте и не требует бэкенда.

## Что реализовано

- hero и навигация в визуальном языке Snapbuild;
- 3 кейса с бизнес-результатами;
- блок ключевых метрик;
- слайдер отзывов, данные загружаются из JSON через service layer;
- 3 тарифных плана;
- форма заявки с клиентской валидацией, состояниями загрузки/успеха/ошибки и mock submit;
- адаптивная верстка для desktop, tablet и mobile;
- базовая доступность: семантика, label, aria-атрибуты, клавиатурные элементы, reduced motion.

## Локальный запуск

```bash
npm install
npm run dev
```

Сборка production-версии:

```bash
npm run build
npm run preview
```

## Структура

```text
src/
  data/testimonials.json          # локальные данные отзывов
  services/testimonialsService.js # асинхронный слой получения отзывов
  services/leadService.js         # mock-отправка заявки
  main.jsx                        # компоненты страницы и интерактивность
  styles.css                      # дизайн-система и адаптив
```

## GitHub Pages

1. Создайте репозиторий и загрузите проект.
2. В `package.json` добавьте скрипт `"deploy": "vite build"` при использовании собственного workflow.
3. В настройках репозитория откройте **Settings → Pages → Build and deployment** и выберите **GitHub Actions**.
4. Используйте стандартный workflow для Vite из каталога GitHub Actions. Vite автоматически собирается в папку `dist`.

Для project page с адресом вида `username.github.io/repository/` передайте имя репозитория при сборке:

```bash
npm run build -- --base=/repository/
```

Либо укажите `base: '/repository/'` в `vite.config.js`. Для custom domain или корневого `username.github.io` оставьте `/`.

## Архитектурные решения

Service layer отделяет интерфейс от источника данных: локальный JSON можно заменить API без изменения компонентов. Mock submit имитирует сетевую задержку и возвращает номер заявки. Все визуальные элементы собраны на CSS без тяжёлых изображений, поэтому страница быстро загружается и легко переносится.
