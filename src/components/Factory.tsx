import { NICHES } from "../data/niches";
import { useState } from "react";
import { IconDoc, IconBot, IconReel, IconArrow, IconCheck, IconCopy, IconDownload } from "./icons";
import { downloadNicheMd } from "../lib/pdf";

const TABS = [
  { id: "pdf", label: "Текст PDF", icon: IconDoc },
  { id: "bot", label: "Сценарий бота", icon: IconBot },
  { id: "reels", label: "10 рилсов", icon: IconReel },
] as const;

export default function Factory({ preselectedId, demo, onUpgrade }: { preselectedId: string | null; demo?: boolean; onUpgrade?: () => void }) {
  const [nicheId, setNicheId] = useState(preselectedId || NICHES[0].id);
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("pdf");
  const [copied, setCopied] = useState<string | null>(null);

  const niche = NICHES.find((n) => n.id === nicheId) || NICHES[0];

  const copy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    }
  };

  return (
    <section id="factory" className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
      <h2 className="font-display font-extrabold text-3xl mb-4">Фабрика продукта</h2>
      <p className="text-mute mb-8">Текст гайда уже написан</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {NICHES.map((n) => (
          <button
            key={n.id}
            onClick={() => setNicheId(n.id)}
            className={`font-mono text-[11px] px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
              n.id === nicheId
                ? "bg-amber text-ink border-amber font-bold"
                : "border-line text-mute hover:border-amber/40 hover:text-fog"
            }`}
          >
            {n.name.split(" ")[0]}
          </button>
        ))}
      </div>

      <div className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 sm:px-5">
          <div className="flex overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3.5 font-mono text-[11.5px] whitespace-nowrap border-b-2 -mb-px transition-all duration-200 cursor-pointer ${
                  tab === t.id ? "border-amber text-amber" : "border-transparent text-mute hover:text-fog"
                }`}
              >
                <t.icon size={14} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 max-h-[640px] overflow-y-auto">
          {tab === "pdf" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-line bg-ink p-4">
                <div className="font-display font-bold text-[13.5px] text-fog mb-2">{niche.product.name}</div>
                <p className="text-[12px] text-mute leading-relaxed">{niche.pain}</p>
                <p className="text-[12px] text-mute leading-relaxed mt-2">Аудитория: {niche.audience}</p>
                <p className="text-[12px] text-mute leading-relaxed mt-2">Формат: {niche.product.format}</p>
                <p className="text-[12px] text-mute leading-relaxed mt-2">Объём: {niche.product.volume}</p>
              </div>
              <div className="rounded-xl border border-line bg-ink p-4">
                <div className="font-display font-bold text-[13.5px] text-fog mb-2">Содержание</div>
                <ul className="space-y-1.5">
                  <li className="text-[12px] text-mute">• Введение: почему это работает</li>
                  <li className="text-[12px] text-mute">• Фундамент за один вечер</li>
                  <li className="text-[12px] text-mute">• Основной метод по шагам</li>
                  <li className="text-[12px] text-mute">• Справочная таблица</li>
                  <li className="text-[12px] text-mute">• Ускорители</li>
                  <li className="text-[12px] text-mute">• Типичные ошибки</li>
                  <li className="text-[12px] text-mute">• План на 30 дней</li>
                  <li className="text-[12px] text-mute">• Бонусы и шаблоны</li>
                </ul>
              </div>
            </div>
          )}

          {tab === "bot" && (
            <div className="space-y-3">
              {[
                { step: "1 · Приветствие", text: `Привет! Ты написал(а) «${niche.keyword}» — значит, видел(а) мой рилс. Показываю, что внутри «Нишеведа».` },
                { step: "2 · Прогрев", text: `В каждом гайде: метод по шагам, справочная таблица, ускорители, план на 30 дней.` },
                { step: "3 · Оффер", text: `Подписка «Нишевед»: все 12 гайдов + фабрика продуктов. Единоразовая оплата 1 990 ₽ — полный доступ навсегда.` },
                { step: "4 · Оплата", text: `Кнопка «Подписаться» → оплата картой или Telegram Stars → бот присылает код доступа.` },
                { step: "5 · Выдача", text: `Твой код: [код из 8 символов]. Открывай сайт, вводи код — внутри библиотека PDF.` },
                { step: "6 · Дожим (24 ч)", text: `Привет! Уже заходил(а) в библиотеку? Если есть вопросы — отвечу.` },
              ].map((m) => (
                <div key={m.step} className="rounded-xl border border-line bg-ink p-4">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="font-mono text-[10px] text-mint tracking-wide">{m.step}</span>
                    <button
                      onClick={() => copy(m.text, m.step)}
                      className="font-mono text-[9.5px] text-dim hover:text-amber cursor-pointer"
                    >
                      {copied === m.step ? "✓" : "копировать"}
                    </button>
                  </div>
                  <p className="text-[13px] leading-relaxed text-fog/90">{m.text}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "reels" && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-separate border-spacing-y-2">
                <thead>
                  <tr className="font-mono text-[9.5px] text-dim tracking-[0.15em] text-left">
                    <th className="font-normal pb-1 pl-3 w-14">ДЕНЬ</th>
                    <th className="font-normal pb-1 w-40">ФОРМАТ</th>
                    <th className="font-normal pb-1">ТЕКСТ НА ВИДЕО</th>
                    <th className="font-normal pb-1 pr-3 w-24 text-right">СЛОВО</th>
                  </tr>
                </thead>
                <tbody>
                  {niche.reelHooks.map((h, i) => (
                    <tr key={i} className="group">
                      <td className="rounded-l-lg border border-line border-r-0 bg-ink px-3 py-3 font-mono text-[11px] text-amber">
                        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс", "Пн", "Вт", "Ср"][i]}
                      </td>
                      <td className="border-y border-line bg-ink px-3 py-3 font-mono text-[11px] text-mint">
                        {["Хук", "Ошибки", "Цифра", "До/После", "Вопрос", "Миф", "Чек-лист", "POV", "Разбор", "Ремейк"][i]}
                      </td>
                      <td className="border-y border-line bg-ink px-3 py-3 text-[12.5px] text-fog/90">{h}</td>
                      <td className="rounded-r-lg border border-line border-l-0 bg-ink px-3 py-3 text-right">
                        <button
                          onClick={() => copy(niche.keyword, `kw${i}`)}
                          className="font-mono text-[10.5px] font-bold text-coral hover:text-amber cursor-pointer"
                        >
                          {copied === `kw${i}` ? "✓" : niche.keyword}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="border-t border-line px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          {demo ? (
            <button
              onClick={onUpgrade}
              className="group inline-flex items-center gap-2 rounded-lg bg-amber text-ink font-display font-bold text-[12.5px] px-5 py-3 transition-all duration-300 hover:bg-coral cursor-pointer"
            >
              Получить полный доступ
              <IconArrow size={14} />
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => downloadNicheMd(niche)}
                className="inline-flex items-center gap-2 rounded-lg border border-line text-mute font-display font-bold text-[12.5px] px-4 py-3 transition-all duration-300 hover:border-mint/50 hover:text-mint cursor-pointer"
              >
                <IconDownload size={15} />
                Скачать .md
              </button>
              <button
                onClick={() => copy(niche.reelHooks.join("\n"), "all")}
                className="group inline-flex items-center gap-2 rounded-lg bg-amber text-ink font-display font-bold text-[12.5px] px-5 py-3 transition-all duration-300 hover:bg-coral cursor-pointer"
              >
                {copied === "all" ? <IconCheck size={15} /> : <IconCopy size={15} />}
                {copied === "all" ? "Скопировано" : "Скопировать всё"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
