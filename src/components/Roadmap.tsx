import { useState } from "react";
import { IconCheck, IconClock } from "./icons";

const DAYS = [
  { d: "День 1", t: "Выбор ниши и проверка", h: "1–2 ч", points: ["Прогони квиз и открой топ-1 в матрице.", "Вбей кодовое слово и продукт в поиск Instagram: есть живые аккаунты с просмотрами — спрос живой.", "Проверь конкурентов: что в шапке, какой чек, что пишут в комментариях."] },
  { d: "День 2", t: "Продукт: текст → PDF", h: "3–4 ч", points: ["Скачай .md из «Фабрики», вставь в Google Docs, добавь 3–7 своих примеров.", "Сверстай в Canva по инструкции (A4, 2 шрифта, один акцент).", "Экспорт «PDF Стандарт» до 15 МБ + лид-магнит на 5 страниц."] },
  { d: "День 3", t: "Бот с оплатой", h: "2–3 ч", points: ["BotFather → токен, конструктор → сценарий из «Фабрики».", "Подключи оплату: Telegram Stars для старта.", "Прогони путь покупателя со второго аккаунта: слово → бот → оплата → файл."] },
  { d: "День 4", t: "Упаковка Instagram", h: "2 ч", points: ["Ник, аватар по промпту из «Запуска», био с кодовым словом.", "Ссылка на бота в шапку профиля.", "9 постов-подложек: обложки глав, цитаты, «до/после»."] },
  { d: "День 5", t: "Партия рилсов", h: "3–4 ч", points: ["Сценарии — из вкладки «10 рилсов» в «Фабрике».", "Сними/смонтируй 10 штук за один вечер: стоки, субтитры, ИИ-озвучка.", "Под каждым — кодовое слово и призыв «пиши Х в комментариях»."] },
  { d: "День 6", t: "Самозанятость и документы", h: "30 мин", points: ["«Мой налог»: 4% с физлиц, чеки автоматически.", "Короткая оферта в закреплённом (что продаёшь, как вернуть).", "Дисклеймер, если ниша чувствительная (сон, спина, финансы)."] },
  { d: "День 7", t: "Запуск", h: "1 ч", points: ["Публикуй первый рилс в 18:00–21:00.", "Отвечай на каждый комментарий кодовым словом в первые 2 часа.", "Дальше — по одному рилсу в день, аналитика раз в неделю."] },
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

export default function Roadmap() {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const count = Object.values(done).filter(Boolean).length;
  const pct = Math.round((count / CHECKLIST.length) * 100);

  return (
    <section id="roadmap" className="relative scroll-mt-24 bg-paper text-paperink overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-layer opacity-60" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="reveal flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-coral">06 · план запуска</span>
              <span className="h-px w-10 bg-coral/60" />
            </div>
            <h2 className="font-display font-extrabold text-[clamp(1.7rem,3.6vw,2.9rem)] leading-[1.08] tracking-tight">
              От «не могу выбрать» до первой продажи — <span className="text-coral">7 дней</span>
            </h2>
          </div>
          <p className="font-mono text-[11px] text-paperink/60 max-w-xs leading-relaxed">
            Каждый день — один блок работы. Если времени меньше, растяни блок на два дня: порядок важнее темпа.
          </p>
        </div>

        <div className="reveal grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DAYS.slice(0, 4).map((d) => (
            <DayCard key={d.d} d={d} />
          ))}
        </div>
        <div className="reveal grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {DAYS.slice(4).map((d) => (
            <DayCard key={d.d} d={d} />
          ))}
        </div>

        {/* checklist */}
        <div className="reveal mt-14 grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="rounded-2xl border-2 border-paperink/15 bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-extrabold text-[17px]">Чек-лист экспорта</h3>
              <span className="font-mono text-[11px] font-bold tabular-nums text-coral">{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-paperink/10 overflow-hidden mb-6">
              <div className="h-full rounded-full bg-coral score-bar" style={{ width: `${pct}%` }} />
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {CHECKLIST.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setDone((s) => ({ ...s, [i]: !s[i] }))}
                  className={`flex items-start gap-3 text-left rounded-xl border px-4 py-3.5 transition-all duration-200 cursor-pointer ${
                    done[i] ? "border-mint/60 bg-mint/10" : "border-paperink/15 bg-white hover:border-paperink/40 hover:-translate-y-0.5"
                  }`}
                >
                  <span className={`flex items-center justify-center w-5 h-5 rounded-md border shrink-0 mt-0.5 transition-all duration-200 ${done[i] ? "bg-mint border-mint text-ink" : "border-paperink/30"}`}>
                    {done[i] && <IconCheck size={12} />}
                  </span>
                  <span className={`text-[12.5px] leading-relaxed transition-colors duration-200 ${done[i] ? "text-paperink/50 line-through" : "text-paperink/85"}`}>{c}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-paperink text-fog p-6 sm:p-7 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-amber/15 blur-2xl" />
            <div className="font-mono text-[10px] tracking-[0.2em] text-amber mb-4">КРИТЕРИЙ ЗАПУСКА</div>
            <p className="font-display font-bold text-[15px] leading-relaxed">
              Запускайся, когда отмечено 5+ пунктов. Идеала не будет — будет первый клиент и первые данные.
            </p>
            <p className="font-mono text-[10.5px] text-fog/60 leading-relaxed mt-4">
              Первая продажа важнее идеального PDF: она покажет, что читать, что докрутить и какой чек реально проходит.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function DayCard({ d }: { d: (typeof DAYS)[number] }) {
  return (
    <div className="group rounded-2xl border-2 border-paperink/12 bg-white p-5 transition-all duration-300 hover:border-coral/50 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(20,27,40,0.35)]">
      <div className="flex items-center justify-between mb-3">
        <span className="font-display font-extrabold text-[12px] tracking-wide text-coral">{d.d.toUpperCase()}</span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] text-paperink/50">
          <IconClock size={11} />
          {d.h}
        </span>
      </div>
      <div className="font-display font-bold text-[14.5px] mb-3 leading-snug">{d.t}</div>
      <ul className="space-y-2">
        {d.points.map((p, k) => (
          <li key={k} className="flex gap-2.5 text-[11.5px] leading-relaxed text-paperink/75">
            <span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0 mt-1.5 transition-transform duration-300 group-hover:scale-125" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
