import type { Niche } from "../data/niches";

export function downloadNichePdf(n: Niche): void {
  const content = generatePdfContent(n);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${n.name.replace(/[^a-zа-я0-9]/gi, "_")}_Нишевед.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function downloadNicheMd(n: Niche): void {
  const content = generateMarkdownContent(n);
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${n.name.replace(/[^a-zа-я0-9]/gi, "_")}_Нишевед.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function generatePdfContent(n: Niche): string {
  return `
# ${n.product.name}

Ниша: ${n.name}
Аудитория: ${n.audience}
Формат: ${n.product.format}
Объём: ${n.product.volume}

## Введение

${n.pain}

Этот гайд поможет вам решить эту проблему за 14 дней.

## Глава 1. Фундамент

Первые шаги в нише "${n.name}".

## Глава 2. Основной метод

Пошаговый метод для достижения результата.

## Глава 3. Справочник

Таблицы и справочные материалы.

## Глава 4. Ускорители

10 приёмов для ускорения результата.

## Глава 5. Ошибки

7 типичных ошибок новичков.

## Глава 6. План на 30 дней

Детальный план действий.

## Глава 7. Бонусы

Дополнительные материалы и шаблоны.

## Глава 8. Следующий уровень

Как масштабировать результат.

---
Собрано на платформе «Нишевед» · @nisheved · доступ к библиотеке гайдов
`.trim();
}

function generateMarkdownContent(n: Niche): string {
  return generatePdfContent(n);
}
