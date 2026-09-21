import { useMemo, useRef, useState } from "react";
import { ACCENT_TEXT, NICHES } from "../data/niches";
import type { Niche } from "../data/niches";
import { chapterWords, exportHeader, fullChapters, serializeChapter } from "../data/content";
import type { Block } from "../data/content";
import { IconArrow, IconBot, IconCheck, IconCopy, IconDoc, IconLock, IconReel } from "./icons";

const KW2: Record<string, string> = {
  neuro: "ПРОМПТ", tarot: "АРКАН", reels: "СЦЕНАРИЙ", remote: "ОФФЕР", english: "СУРВАЙВ",
  "smm-finance": "ПОДУШКА", excel: "ВПР", sleep: "РИТУАЛ", nails: "ПРАЙС", back: "ЛФК", food: "ДЕФИЦИТ", move: "ВИЗА",
};

const botScript = (n: Niche, kw: string) => [
  { step: "1 · Приветствие", text: `Привет! Ты написал(а) «${kw}» — значит, видел(а) мой рилс. Показываю, что внутри «Нишеведа»: 12 готовых PDF-гайдов, среди них — «${n.product.name}». Жми «Смотреть» 👇` },
  { step: "2 · Прогрев", text: `В каждом гайде: метод по шагам, справочная таблица с цифрами, ускорители, план на 30 дней и чек-листы. Плюс фабрика: сценарии ботов, 10 рилсов на нишу и калькулятор дохода. Всё скачивается в один клик.` },
  { step: "3 · Оффер", text: `Доступ к «Нишеведу»: все 12 гайдов + фабрика продуктов + обновления. Единоразовая оплата 1 990 ₽ — полный доступ навсегда. Окупается с одной продажи гайда под своим брендом.` },
  { step: "4 · Оплата", text: `Кнопка «Подписаться» → оплата картой или Telegram Stars → бот мгновенно присылает персональный код доступа к сайту. Один код — одно место. Не получилось — напиши «ПОДДЕРЖКА».` },
  { step: "5 · Выдача", text: `Твой код: [код из 8 символов]. Открывай сайт, вводи код — внутри библиотека PDF: скачивай, что нужно. Начни с «${n.title.toLowerCase()}» — там самая горячая аудитория. Пришли скрин результата со словом РЕЗУЛЬТАТ.` },
  { step: "6 · Дожим (24 ч)", text: `Привет! Уже заходил(а) в библиотеку? Если есть вопросы по гайдам — отвечу. Напомню: новые гайды добавляются каждый месяц, твой доступ открывает их автоматически.` },
];

const reelsPlan = (n: Niche, kw: string, kw2: string) => [
  { d: "Пн", f: "Хук-провокация", h: n.reelHooks[0], k: kw },
  { d: "Вт", f: "«3 ошибки»", h: `3 ошибки, из-за которых не получается в теме «${n.short.toLowerCase()}» (третья — у всех)`, k: kw },
  { d: "Ср", f: "Хук-цифра", h: n.reelHooks[1], k: kw },
  { d: "Чт", f: "До / После", h: `Мой результат за 30 дней в «${n.short.toLowerCase()}»: что изменилось и сколько часов это заняло`, k: kw2 },
  { d: "Пт", f: "Хук-вопрос", h: n.reelHooks[2], k: kw },
  { d: "Сб", f: "Разрушение мифа", h: `Главный миф про «${n.short.toLowerCase()}», в который до сих пор верят`, k: kw2 },
  { d: "Вс", f: "Чек-лист", h: `5 шагов к первому результату в «${n.short.toLowerCase()}» — сохраняй`, k: kw },
  { d: "Пн", f: "POV", h: `POV: ты узнал(а) главный секрет «${n.short.toLowerCase()}», о котором молчат эксперты`, k: kw2 },
  { d: "Вт", f: "Разбор подписчика", h: `Разбираю ошибку подписчика в «${n.short.toLowerCase()}» (анонимно)`, k: kw },
  { d: "Ср", f: "Ремейк хита", h: "Повтор лучшего рилса недели другим монтажом + другое кодовое слово", k: kw2 },
];

const TABS = [
  { id: "pdf", label: "Текст PDF", icon: IconDoc },
  { id: "bot", label: "Сценарий бота", icon: IconBot },
  { id: "reels", label: "10 рилсов", icon: IconReel },
] as const;
type TabId = (typeof TABS)[number]["id"];

function BlockView({ b }: { b: Block }) {
  switch (b.kind) {
    case "lead":
      return <p className="text-[13.5px] font-medium leading-relaxed text-fog">{b.text}</p>;
    case "p":
      return <p className="text-[13px] leading-relaxed text-mute">{b.text}</p>;
    case "h":
      return (
        <div className="flex items-center gap-2.5 pt-1">
          <span className="w-1.5 h-1.5 rotate-45 bg-amber shrink-0" />
          <span className="font-display font-bold text-[13px] text-fog">{b.text}</span>
        </div>
      );
    case "list":
      return (
        <ul className="space-y-1.5">
          {(b.items ?? []).map((i) => (
            <li key={i} className="flex gap-2.5 text-[12.5px] leading-relaxed text-mute">
              <span className="text-amber shrink-0">▸</span>
              <span>{i}</span>
            </li>
          ))}
        </ul>
      );
    case "num":
      return (
        <ol className="space-y-2">
          {(b.items ?? []).map((i, k) => (
            <li key={k} className="flex gap-3 text-[12.5px] leading-relaxed text-mute">
              <span className="font-mono text-[11px] font-bold text-amber shrink-0 pt-0.5 w-5">{k + 1}.</span>
              <span>{i}</span>
            </li>
          ))}
        </ol>
      );
    case "tip":
      return (
        <div className="rounded-lg border border-mint/30 bg-mint/5 px-3.5 py-2.5">
          <span className="font-mono text-[9px] tracking-[0.18em] text-mint">СОВЕТ</span>
          <p className="text-[12.5px] leading-relaxed text-fog/85 mt-1">{b.text}</p>
        </div>
      );
    case "warn":
      return (
        <div className="rounded-lg border border-coral/30 bg-coral/5 px-3.5 py-2.5">
          <span className="font-mono text-[9px] tracking-[0.18em] text-coral">НЮАНС НИШИ</span>
          <p className="text-[12.5px] leading-relaxed text-fog/85 mt-1">{b.text}</p>
        </div>
      );
    case "quote":
      return <blockquote className="border-l-2 border-amber pl-3.5 font-display text-[12.5px] italic text-fog/80 leading-relaxed">«{b.text}»</blockquote>;
    case "table":
      return (
        <div className="rounded-lg border border-line overflow-hidden">
          <table className="w-full table-fixed text-left">
            <thead>
              <tr className="bg-line/40">
                <th className="font-mono text-[9.5px] tracking-[0.12em] text-amber px-3 py-2 font-normal w-[38%]">{b.head?.[0]}</th>
                <th className="font-mono text-[9.5px] tracking-[0.12em] text-amber px-3 py-2 font-normal">{b.head?.[1]}</th>
              </tr>
            </thead>
            <tbody>
              {(b.rows ?? []).map((r, k) => (
                <tr key={k} className={`border-t border-line/60 transition-colors duration-200 hover:bg-line/20 ${k % 2 ? "bg-ink2/40" : ""}`}>
                  <td className="px-3 py-2 text-[11.5px] font-medium text-fog/90 align-top break-words [overflow-wrap:anywhere]">{r[0]}</td>
                  <td className="px-3 py-2 text-[11.5px] text-mute align-top font-mono break-words [overflow-wrap:anywhere]">{r[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export default function Factory({
  preselectedId,
  demo = false,
  onUpgrade,
}: {
  preselectedId: string | null;
  demo?: boolean;
  onUpgrade?: () => void;
}) {
  const [nicheId, setNicheId] = useState<string>(NICHES[0].id);
  const [tab, setTab] = useState<TabId>("pdf");
  const [open, setOpen] = useState<Record<number, boolean>>({ 0: true });
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const niche = useMemo(() => NICHES.find((n) => n.id === nicheId) ?? NICHES[0], [nicheId]);
  const kw2 = KW2[niche.id] ?? "ПЛАН";
  const chapters = useMemo(() => fullChapters(niche), [niche]);
  const pages = chapters.reduce((s, c) => s + c.pages, 0) + 6;
  const words = useMemo(() => chapters.reduce((s, c) => s + chapterWords(c), 0), [chapters]);
  const allOpen = chapters.every((_, i) => open[i]);

  if (preselectedId && preselectedId !== nicheId && NICHES.some((n) => n.id === preselectedId)) {
    setTimeout(() => setNicheId(preselectedId), 0);
  }

  const copy = (text: string, key: string) => {
    if (timer.current) clearTimeout(timer.current);
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    timer.current = setTimeout(() => setCopied(null), 1600);
  };

  const sectionText = (t: TabId): string => {
    if (t === "pdf") return [exportHeader(niche), ...chapters.map((c, i) => serializeChapter(c, i))].join("\n\n");
    if (t === "bot") return botScript(niche, niche.keyword).map((m) => `【${m.step}】\n${m.text}`).join("\n\n");
    return reelsPlan(niche, niche.keyword, kw2).map((r, i) => `${i + 1}. ${r.d} · ${r.f}: «${r.h}» → кодовое слово «${r.k}»`).join("\n");
  };

  const fullText = () => (["pdf", "bot", "reels"] as TabId[]).map((t) => sectionText(t)).join("\n\n" + "—".repeat(40) + "\n\n");

  const download = () => {
    const blob = new Blob([fullText()], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${niche.id}-gaid.md`;
    a.click();
    URL.revokeObjectURL(url);
    copy(fullText(), "dl");
  };

  return (
    <section id="factory" className="relative scroll-mt-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-24 right-[10%] w-[420px] h-[420px] rounded-full bg-mint/8 blur-[110px]" />
        <div className="absolute bottom-0 left-[5%] w-[380px] h-[380px] rounded-full bg-amber/8 blur-[110px]" />
      </div>

      <div className="reveal max-w-7xl mx-auto px-5 sm:px-8 py-24 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-amber text-[11px] tracking-[0.22em] uppercase">фабрика продукта</span>
              <span className="h-px w-10 bg-amber/50" />
            </div>
            <h2 className="font-display font-extrabold text-[clamp(1.7rem,3.6vw,2.9rem)] leading-[1.08] tracking-tight max-w-xl">
              Весь текст гайда — <span className="text-amber">уже написан</span>
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-mute max-w-xl">
              Выбирай нишу — и получай готовый текст PDF: метод по шагам, справочные таблицы, ускорители, ошибки, план на 30 дней. Копируй по главам или скачивай целиком — и сразу на вёрстку в Canva.
            </p>
          </div>
          <div className="flex gap-6 sm:gap-8 shrink-0">
            <div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-amber tabular-nums">{chapters.length}</div>
              <div className="font-mono text-[10px] text-dim mt-0.5">глав</div>
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-amber tabular-nums">~{words}</div>
              <div className="font-mono text-[10px] text-dim mt-0.5">слов</div>
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-amber tabular-nums">~{pages}</div>
              <div className="font-mono text-[10px] text-dim mt-0.5">стр. в PDF</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 min-w-0 flex flex-col gap-5">
            <div className="panel p-4 flex flex-wrap gap-2">
              {NICHES.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setNicheId(n.id)}
                  className={`font-mono text-[11px] px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                    n.id === nicheId
                      ? "bg-amber text-ink border-amber font-bold shadow-[0_4px_18px_-4px_var(--color-amber)]"
                      : "border-line text-mute hover:border-amber/40 hover:text-fog hover:-translate-y-0.5"
                  }`}
                >
                  {n.short}
                </button>
              ))}
            </div>

            <div className="group relative rounded-2xl border border-line bg-ink2 p-5 overflow-hidden lift">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber via-coral to-mint" />
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-amber/10 blur-2xl transition-transform duration-500 group-hover:scale-125" />
              <div className="font-mono text-[10px] text-dim tracking-[0.2em] mb-5">ОБЛОЖКА PDF · ПРЕВЬЮ</div>
              <div className="rounded-xl bg-ink border border-line p-5 transition-transform duration-500 group-hover:rotate-[1.2deg] group-hover:scale-[1.02]">
                <div className="flex items-start justify-between mb-6">
                  <span className="font-mono text-[9px] px-2 py-1 rounded border border-amber/40 text-amber tracking-[0.15em]">PDF-ГАЙД</span>
                  <span className="font-mono text-[9px] text-dim">~{pages} стр.</span>
                </div>
                <div className="font-display font-extrabold text-[clamp(1.05rem,1.7vw,1.35rem)] leading-[1.15] tracking-tight text-fog">{niche.product.name}</div>
                <div className={`font-mono text-[10.5px] mt-2 ${ACCENT_TEXT[niche.accent]}`}>ниша: {niche.title}</div>
                <div className="mt-5 flex items-end justify-between">
                  <div className="font-mono text-[9.5px] text-dim leading-relaxed">
                    {niche.product.format.toLowerCase()}
                    <br />за 14 дней · без опыта
                  </div>
                  <div className="font-display font-extrabold text-amber text-xl tabular-nums">{niche.price} ₽</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse shrink-0" />
                  <span className="font-mono text-[10px] text-mute truncate">
                    слова: <b className="text-mint">{niche.keyword}</b> / <b className="text-mint">{kw2}</b>
                  </span>
                </div>
                <button
                  onClick={() => copy(`${niche.product.name} · чек ${niche.price} ₽ · ключ «${niche.keyword}»`, "cover")}
                  className="font-mono text-[10px] text-dim hover:text-amber transition-colors cursor-pointer shrink-0"
                >
                  {copied === "cover" ? "✓ скопировано" : "скопировать оффер"}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 min-w-0">
            <div className="panel overflow-hidden flex flex-col h-full">
              <div className="flex items-center justify-between border-b border-line px-4 sm:px-5">
                <div className="flex min-w-0 overflow-x-auto scrollbar-none">
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
                {tab === "pdf" && (
                  <button
                    onClick={() => {
                      const next: Record<number, boolean> = {};
                      chapters.forEach((_, i) => (next[i] = !allOpen));
                      setOpen(next);
                    }}
                    className="hidden sm:block font-mono text-[10.5px] px-3 py-1.5 rounded-lg border border-line text-mute hover:border-amber/50 hover:text-amber transition-all duration-200 cursor-pointer shrink-0"
                  >
                    {allOpen ? "свернуть всё" : "развернуть всё"}
                  </button>
                )}
              </div>

              <div key={`${tab}-${nicheId}`} className="anim-in p-4 sm:p-6 flex-1 min-w-0 max-w-full max-h-[640px] overflow-y-auto overflow-x-hidden scrollbar-none">
                {tab === "pdf" && (
                  <div className="space-y-3">
                    {chapters.map((c, i) => (
                      <div key={c.title} className="rounded-xl border border-line bg-ink overflow-hidden transition-colors duration-300 hover:border-line2">
                        <div className="flex items-center gap-3 w-full px-4 py-3.5 text-left cursor-pointer group" onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}>
                          <span className="font-display font-extrabold text-amber/70 text-lg leading-none w-6 shrink-0">{i + 1}</span>
                          <span className="font-display font-bold text-[13.5px] text-fog flex-1 min-w-0">{c.title}</span>
                          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-line/60 text-dim shrink-0 hidden sm:inline">~{c.pages} стр.</span>
                          {!demo && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copy(serializeChapter(c, i), `ch${i}`);
                              }}
                              className="font-mono text-[9.5px] px-2 py-1 rounded border border-line text-dim sm:opacity-0 sm:group-hover:opacity-100 hover:border-amber/50 hover:text-amber transition-all duration-200 cursor-pointer shrink-0"
                            >
                              {copied === `ch${i}` ? "✓" : "копировать"}
                            </button>
                          )}
                          <span className={`text-dim transition-transform duration-300 shrink-0 ${open[i] ? "rotate-90" : ""}`}>▸</span>
                        </div>
                        {open[i] && (
                          <div className="anim-in relative px-4 sm:px-5 pb-5 pt-1 border-t border-line/60">
                            <div
                              className={`space-y-3.5 ${
                                demo ? "blur-[7px] opacity-50 select-none pointer-events-none" : ""
                              }`}
                              aria-hidden={demo}
                            >
                              {c.blocks.map((b, k) => (
                                <BlockView key={k} b={b} />
                              ))}
                            </div>
                            {demo && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex items-center gap-2.5 rounded-xl border border-amber/40 bg-ink/90 backdrop-blur-sm px-5 py-3.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8)]">
                                  <IconLock size={16} className="text-amber shrink-0" />
                                  <span className="font-display font-bold text-[12px] text-fog whitespace-nowrap">
                                    Текст доступен в полной версии
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="flex gap-4 rounded-xl border border-dashed border-mint/40 bg-mint/5 px-4 py-3.5">
                      <span className="font-display font-extrabold text-mint text-lg leading-none pt-0.5 w-6 shrink-0">+</span>
                      <div>
                        <span className="font-display font-bold text-[13.5px] text-mint">Бонус и лид-магнит</span>
                        <p className="font-mono text-[10.5px] text-mute leading-relaxed mt-1">
                          Бонус: шаблоны и чек-листы отдельными файлами (~6 стр.). Лид-магнит: мини-версия на 5 страниц —
                          бесплатно в боте, прогревает до покупки.
                        </p>
                      </div>
                    </div>
                    <p className="font-mono text-[10.5px] text-dim leading-relaxed">
                      Цифры в справочниках — ориентиры 2024–2026: перед продажей проверь актуальность под свой город и
                      добавь свои примеры. Это и честность, и твоя защита.
                    </p>
                  </div>
                )}

                {tab === "bot" && (
                  <div className="space-y-3">
                    {botScript(niche, niche.keyword).map((m) => (
                      <div key={m.step} className="group rounded-xl border border-line bg-ink p-4 transition-all duration-300 hover:border-mint/40 hover:translate-x-1">
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <span className="font-mono text-[10px] text-mint tracking-wide">{m.step}</span>
                          <button
                            onClick={() => copy(m.text, m.step)}
                            className="sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 font-mono text-[9.5px] text-dim hover:text-amber cursor-pointer"
                          >
                            {copied === m.step ? "✓" : "копировать"}
                          </button>
                        </div>
                        <p className="text-[13px] leading-relaxed text-fog/90">{m.text}</p>
                      </div>
                    ))}
                    <p className="font-mono text-[10.5px] text-dim leading-relaxed pt-1">
                      Собирается в конструкторах (SaleBot, BotHelper, ManyBot). Файл выдаётся автоматически после оплаты.
                    </p>
                  </div>
                )}

                {tab === "reels" && (
                  <div className="overflow-x-auto scrollbar-none -mx-1">
                    <table className="w-full border-separate border-spacing-y-2 px-1">
                      <thead>
                        <tr className="font-mono text-[9.5px] text-dim tracking-[0.15em] text-left">
                          <th className="font-normal pb-1 pl-3 w-12 sm:w-14">ДЕНЬ</th>
                          <th className="font-normal pb-1 w-28 sm:w-40">ФОРМАТ</th>
                          <th className="font-normal pb-1">ТЕКСТ НА ВИДЕО</th>
                          <th className="font-normal pb-1 pr-3 w-16 sm:w-24 text-right">СЛОВО</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reelsPlan(niche, niche.keyword, kw2).map((r, i) => (
                          <tr key={i} className="group">
                            <td className="rounded-l-lg border border-line border-r-0 bg-ink px-3 py-3 font-mono text-[11px] text-amber">{r.d}</td>
                            <td className="border-y border-line bg-ink px-3 py-3 font-mono text-[11px] text-mint whitespace-nowrap">{r.f}</td>
                            <td className="border-y border-line bg-ink px-3 py-3 text-[12.5px] text-fog/90">{r.h}</td>
                            <td className="rounded-r-lg border border-line border-l-0 bg-ink px-3 py-3 text-right transition-colors duration-200 group-hover:bg-line/40">
                              <button
                                onClick={() => copy(r.k, `kw${i}`)}
                                className="font-mono text-[10.5px] font-bold text-coral hover:text-amber transition-colors cursor-pointer"
                              >
                                {copied === `kw${i}` ? "✓" : r.k}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="border-t border-line px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[10.5px] text-dim hidden sm:block">
                  {tab === "pdf" ? "Каждую главу можно копировать отдельно." : "Копируется по одному."}
                </p>
                {demo ? (
                  <button
                    onClick={onUpgrade}
                    className="group inline-flex items-center gap-2 rounded-lg bg-amber text-ink font-display font-bold text-[12.5px] px-5 py-3 transition-all duration-300 hover:bg-coral hover:-translate-y-0.5 cursor-pointer"
                  >
                    <IconLock size={15} className="transition-transform duration-300 group-hover:rotate-12" />
                    Получить полный доступ
                    <IconArrow size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={download}
                      className="inline-flex items-center gap-2 rounded-lg border border-line text-mute font-display font-bold text-[12.5px] px-4 py-3 transition-all duration-300 hover:border-mint/50 hover:text-mint hover:-translate-y-0.5 cursor-pointer"
                    >
                      {copied === "dl" ? <IconCheck size={15} className="text-mint" /> : <IconDoc size={15} />}
                      {copied === "dl" ? "Скачано" : "Скачать .md"}
                    </button>
                    <button
                      onClick={() => copy(fullText(), "all")}
                      className="group inline-flex items-center gap-2 rounded-lg bg-amber text-ink font-display font-bold text-[12.5px] px-5 py-3 transition-all duration-300 hover:bg-coral hover:-translate-y-0.5 cursor-pointer"
                    >
                      {copied === "all" ? <IconCheck size={15} /> : <IconCopy size={15} />}
                      {copied === "all" ? "Всё скопировано" : "Скопировать всё"}
                      <IconArrow size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
