import { useState } from "react";
import { IconCheck, IconClock, IconLock } from "./icons";

const DAYS = [
  { d: "День 1", t: "Выбор ниши и проверка", h: "1–2 ч", points: ["Прогони квиз и открой топ-1 в матрице.", "Вбей кодовое слово и продукт в поиск Instagram.", "Проверь конкурентов."] },
  { d: "День 2", t: "Продукт: текст → PDF", h: "3–4 ч", points: ["Скачай .md из «Фабрики», вставь в Google Docs.", "Сверстай в Canva.", "Экспорт «PDF Стандарт» до 15 МБ."] },
  { d: "День 3", t: "Бот с оплатой", h: "2–3 ч", points: ["BotFather → токен, конструктор → сценарий из «Фабрики».", "Подключи оплату: Telegram Stars.", "Прогони путь покупателя."] },
  { d: "День 4", t: "Упаковка Instagram", h: "2 ч", points: ["Ник, аватар, био с кодовым словом.", "Ссылка на бота в шапку профиля.", "9 постов-подложек."] },
  { d: "День 5", t: "Партия рилсов", h: "3–4 ч", points: ["Сценарии — из вкладки «10 рилсов» в «Фабрике».", "Сними/смонтируй 10 штук за один вечер.", "Под каждым — кодовое слово."] },
  { d: "День 6", t: "Самозанятость", h: "30 мин", points: ["«Мой налог»: 4% с физлиц.", "Короткая оферта в закреплённом.", "Дисклеймер, если ниша чувствительная."] },
  { d: "День 7", t: "Запуск", h: "1 ч", points: ["Публикуй первый рилс в 18:00–21:00.", "Отвечай на каждый комментарий кодовым словом.", "Дальше — по одному рилсу в день."] },
];

const CHECKLIST = [
  "PDF свёрстан и открывается на телефоне",
  "Файл залит в приватный канал / Drive",
  "Оплата подключена, тестовый платёж прошёл",
  "Бот присылает файл после оплаты",
  "Ключевое слово под рилсом = триггер бота",
  "Самозанятость оформлена",
  "Три рилса смонтированы и ждут публикации",
];

export default function Roadmap({ demo }: { demo?: boolean }) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const count = Object.values(done).filter(Boolean).length;
  const pct = Math.round((count / CHECKLIST.length) * 100);

  return (
    <section id="roadmap" className="py-20 px-5 sm:px-8 max-w-7xl mx-auto bg-paper text-paperink">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-coral text-[11px] tracking-[0.22em] uppercase">06 · план запуска</span>
        <span className="h-px w-10 bg-coral/60" />
      </div>
      <h2 className="font-display font-extrabold text-3xl mb-4">От «не могу выбрать» до первой продажи — 7 дней</h2>
      <p className="text-paperink/60 mb-8">Каждый день — один блок работы</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DAYS.slice(0, 4).map((d) => (
          <div key={d.d} className="rounded-2xl border-2 border-paperink/12 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-extrabold text-[12px] tracking-wide text-coral">{d.d.toUpperCase()}</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] text-paperink/50">
                <IconClock size={11} />
                {d.h}
              </span>
            </div>
            <div className="font-display font-bold text-[14.5px] leading-snug">{d.t}</div>
            {demo ? (
              <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-[9.5px] text-paperink/40">
                <IconLock size={11} />
                подробные шаги — в полной версии
              </p>
            ) : (
              <ul className="space-y-2 mt-3">
                {d.points.map((p, k) => (
                  <li key={k} className="flex gap-2.5 text-[11.5px] leading-relaxed text-paperink/75">
                    <span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0 mt-1.5" />
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {DAYS.slice(4).map((d) => (
          <div key={d.d} className="rounded-2xl border-2 border-paperink/12 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-extrabold text-[12px] tracking-wide text-coral">{d.d.toUpperCase()}</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] text-paperink/50">
                <IconClock size={11} />
                {d.h}
              </span>
            </div>
            <div className="font-display font-bold text-[14.5px] leading-snug">{d.t}</div>
            {demo ? (
              <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-[9.5px] text-paperink/40">
                <IconLock size={11} />
                подробные шаги — в полной версии
              </p>
            ) : (
              <ul className="space-y-2 mt-3">
                {d.points.map((p, k) => (
                  <li key={k} className="flex gap-2.5 text-[11.5px] leading-relaxed text-paperink/75">
                    <span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0 mt-1.5" />
                    {p}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="mt-14 grid lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="rounded-2xl border-2 border-paperink/15 bg-white p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-extrabold text-[17px]">Чек-лист экспорта</h3>
            <span className="font-mono text-[11px] font-bold tabular-nums text-coral">{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-paperink/10 overflow-hidden mb-6">
            <div className="h-full rounded-full bg-coral" style={{ width: `${pct}%` }} />
          </div>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {CHECKLIST.map((c, i) => (
              <button
                key={i}
                onClick={() => setDone((s) => ({ ...s, [i]: !s[i] }))}
                className={`flex items-start gap-3 text-left rounded-xl border px-4 py-3.5 transition-all duration-200 cursor-pointer ${
                  done[i] ? "border-mint/60 bg-mint/10" : "border-paperink/15 bg-white hover:border-paperink/40"
                }`}
              >
                <span className={`flex items-center justify-center w-5 h-5 rounded-md border shrink-0 mt-0.5 ${done[i] ? "bg-mint border-mint text-ink" : "border-paperink/30"}`}>
                  {done[i] && <IconCheck size={12} />}
                </span>
                <span className={`text-[12.5px] leading-relaxed ${done[i] ? "text-paperink/50 line-through" : "text-paperink/85"}`}>{c}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
