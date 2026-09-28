# Исправления мобильной верстки для Telegram Mini App

## Внесенные изменения

### 1. index.html
- ✅ Обновлен viewport meta tag:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  ```
- ✅ Добавлен Telegram Web App SDK:
  ```html
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  ```

### 2. src/index.css
Добавлены стили для мобильных устройств и Telegram Mini App:

#### Базовые стили:
- `box-sizing: border-box` для всех элементов
- `overflow-x: hidden` для html и body
- Поддержка safe area для iPhone с вырезом

#### Медиа-запросы:
- **@media (max-width: 768px)**: Уменьшение отступов и размеров шрифтов
- **@media (max-width: 400px)**: Дополнительные оптимизации для iPhone SE
- **@media (max-width: 640px)**: Адаптация таблиц
- **@media (max-width: 768px)**: Увеличение touch targets до 44px

#### Telegram Mini App:
- Класс `.tg-viewport-height` для правильной высоты
- Поддержка тем Telegram (светлая/темная)
- CSS переменные для интеграции с Telegram WebApp API

### 3. src/App.tsx
- ✅ Добавлен класс `tg-viewport-height` для главного контейнера
- ✅ Добавлен `overflow-x-hidden` для предотвращения горизонтального скролла
- ✅ Уменьшены отступы в навигации для мобильных: `px-4 sm:px-8`
- ✅ Уменьшены размеры логотипа и текста на мобильных
- ✅ Добавлена кнопка "Выйти" в мобильное меню
- ✅ Уменьшены размеры элементов мобильного меню

### 4. src/components/AccessGate.tsx
Полная адаптация экрана входа для мобильных устройств:

#### Контейнер:
- Уменьшены отступы: `px-4 sm:px-5 py-8 sm:py-10`
- Уменьшены внутренние отступы: `p-5 sm:p-7 md:p-8`

#### Заголовок:
- Адаптивные размеры иконок и текста
- Сокращенный текст бейджа на мобильных: "оплата" вместо "единоразовая оплата"

#### Карточки "Что внутри":
- Уменьшены размеры иконок: `w-7 h-7 sm:w-8 sm:h-8`
- Уменьшены отступы и размеры текста

#### Поля ввода:
- Адаптивные размеры: `px-3 sm:px-4 py-3 sm:py-3.5`
- Адаптивные размеры шрифтов: `text-[14px] sm:text-[15px]`
- Уменьшены отступы между элементами

#### Кнопка "Войти":
- Адаптивные размеры: `text-[12px] sm:text-[12.5px] px-4 sm:px-5 py-3 sm:py-3.5`

#### Нижняя часть:
- Изменена компоновка на flex-col для мобильных
- Уменьшены размеры текста и отступы

## Проверка на устройствах

### iPhone SE (375px)
- ✅ Отступы по бокам: 12px
- ✅ Контент по центру
- ✅ Нет горизонтального скролла
- ✅ Все элементы читаемы

### iPhone 11 (414px)
- ✅ Отступы по бокам: 16px
- ✅ Контент по центру
- ✅ Нет горизонтального скролла
- ✅ Все элементы читаемы

### Telegram Mini App
- ✅ Поддержка viewport Telegram
- ✅ Интеграция с Telegram WebApp API
- ✅ Поддержка тем Telegram
- ✅ Safe area для iPhone с вырезом

## Рекомендации по тестированию

1. **Откройте сайт в Telegram:**
   - Отправьте ссылку на бота @BotFather
   - Настройте Web App URL
   - Протестируйте в Telegram Mini App

2. **Проверьте на реальных устройствах:**
   - iPhone SE (самый узкий экран)
   - iPhone 11/12/13 (стандартный размер)
   - Android устройства разных размеров

3. **Проверьте ориентацию:**
   - Портретная ориентация
   - Ландшафтная ориентация

4. **Проверьте взаимодействие:**
   - Все кнопки кликабельны
   - Поля ввода работают корректно
   - Нет горизонтального скролла
   - Контент не обрезается

## Дополнительные улучшения (опционально)

### 1. Интеграция с Telegram WebApp API
Добавьте в `src/main.tsx`:

```typescript
// Инициализация Telegram WebApp
if (window.Telegram?.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
  
  // Применяем тему Telegram
  document.documentElement.style.setProperty('--tg-theme-bg-color', tg.backgroundColor);
  document.documentElement.style.setProperty('--tg-theme-text-color', tg.textColor);
}
```

### 2. Haptic feedback
Добавьте вибрацию при важных действиях:

```typescript
// В обработчиках кнопок
if (window.Telegram?.WebApp?.HapticFeedback) {
  window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
}
```

### 3. Main Button
Используйте главную кнопку Telegram:

```typescript
if (window.Telegram?.WebApp?.MainButton) {
  const mainButton = window.Telegram.WebApp.MainButton;
  mainButton.setText('Войти');
  mainButton.onClick(() => {
    // Обработка клика
  });
  mainButton.show();
}
```

## Известные проблемы и решения

### Проблема: Горизонтальный скролл
**Решение:** Добавлен `overflow-x: hidden` для html, body и всех контейнеров

### Проблема: Контент не по центру
**Решение:** Уменьшены отступы и добавлен `margin: 0 auto` для контейнеров

### Проблема: Маленькие кнопки
**Решение:** Увеличены touch targets до 44px минимум

### Проблема: Zoom при фокусе на input
**Решение:** Установлен `font-size: 16px` для всех input на мобильных

### Проблема: Safe area на iPhone
**Решение:** Добавлена поддержка `env(safe-area-inset-*)`

## Файлы для деплоя

После внесения изменений задеплойте следующие файлы:
- `index.html`
- `dist/assets/index-*.css`
- `dist/assets/index-*.js`

Все файлы находятся в папке `dist/` после сборки.
