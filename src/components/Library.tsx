import { useMemo, useState } from "react";
import { ACCENT_TEXT, NICHES } from "../data/niches";
import { chapterWords, downloadNicheMd, downloadNichePdf, fullChapters } from "../lib/pdf";
import { IconCheck, IconDoc, IconDownload } from "./icons";

const ACCENT_HEX: Record<string, string> = {
  amber: "#ffb224",
  mint: "#3fd68f",
  coral: "#ff6a5c",
  sky: "#58b7ff",
};

export default function Library({ demo = false }: { demo?: boolean }) {
  const [state, setState] = useState<Record<string, "idle" | "busy" | "ok">>({});

  const stats = useMemo(() => {
    let pages = 0;
    let words = 0;
    NICHES.forEach((n) => {
      const ch = fullChapters(n);
      pages += ch.reduce((s, c) => s + c.pages, 0) + 6;
      words += ch.reduce((s, c) => s + chapterWords(c), 0);
    });
    return { pages, words };
  }, []);

  const download = (id: string, kind: "pdf" | "md") => {
    if (demo) return;
    const n = NICHES.find((x) => x.id === id);
    if (!n || state[id] === "busy") return;
    setState((s) => ({ ...s, [id]: "busy" }));
    setTimeout(() => {
      try {
        if (kind === "pdf") downloadNichePdf(n);
        else downloadNicheMd(n);
        setState((s) => ({ ...s, [id]: "ok" }));
        setTimeout(() => setState((s) => ({ ...s, [id]: "idle" })), 2600);
      } catch {
        setState((s) => ({ ...s, [id]: "idle" }));
      }
    }, 350);
  };

  return (
    <section id="library" className="relative scroll-mt-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-0 left-[20%] w-[460px] h-[400px] rounded-full bg-amber/9 blur-[120px]" />
        <div className="absolute bottom-0 right-[10%] w-[380px] h-[380px] rounded-full bg-sky/8 blur-[110px]" />
      </div>

      <div className="reveal relative max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-amber text-[11px] tracking-[0.22em] uppercase">библиотека гайдов</span>
              <span className="h-px w-10 bg-amber/50" />
            </div>
            <h2 className="font-display font-extrabold text-[clamp(1.7rem,3.6vw,2.9rem)] leading-[1.08] tracking-tight">
              Скачай гайд — <span className="text-amber">прямо отсюда</span>
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-mute max-w-xl">
              Каждый файл — настоящий свёрстанный PDF: титул, главы, справочные таблицы, чек-листы. Скачивай, читай,
              применяй — или адаптируй под свой бренд в Canva.
            </p>
          </div>
          <div className="flex gap-6 sm:gap-8 shrink-0">
            <div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-amber tabular-nums">{NICHES.length}</div>
              <div className="font-mono text-[10px] text-dim mt-0.5">гайдов</div>
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-amber tabular-nums">~{stats.pages}</div>
              <div className="font-mono text-[10px] text-dim mt-0.5">страниц</div>
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-amber tabular-nums">~{Math.round(stats.words / 1000)}к</div>
              <div className="font-mono text-[10px] text-dim mt-0.5">слов</div>
            </div>
          </div>
        </div>

        {demo && (
          <div className="reveal mb-8 flex items-center gap-3 rounded-xl border border-sky/35 bg-sky/6 px-5 py-4">
            <IconDoc size={17} className="text-sky shrink-0" />
            <p className="font-mono text-[11px] text-mute leading-relaxed">
              <span className="text-sky font-bold">Демо-режим.</span> Листай и изучай гайды — скачивание PDF и .md
              откроется после оплаты доступа в <span className="text-fog">@nishevedbot</span>.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {NICHES.map((n, i) => {
            const hex = ACCENT_HEX[n.accent] ?? "#ffb224";
            const st = state[n.id] ?? "idle";
            return (
              <div
                key={n.id}
                className="group panel overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:border-line2 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)]"
                style={{ transitionDelay: `${(i % 3) * 40}ms` }}
              >
                {/* обложка */}
                <div className="relative p-5 border-b border-line/70 overflow-hidden" style={{ background: `linear-gradient(135deg, ${hex}1f, transparent 65%)` }}>
                  <div
                    className="absolute -right-7 -top-7 w-24 h-24 rounded-full blur-2xl opacity-25 transition-transform duration-500 group-hover:scale-125"
                    style={{ background: hex }}
                  />
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[8.5px] tracking-[0.18em] px-2 py-1 rounded border" style={{ color: hex, borderColor: `${hex}55` }}>
                      PDF-ГАЙД
                    </span>
                    <span className="font-mono text-[8.5px] text-dim">{n.product.volume}</span>
                  </div>
                  <div className="font-display font-extrabold text-[15px] leading-snug tracking-tight text-fog max-w-[95%]">
                    {n.product.name}
                  </div>
                  <div className={`font-mono text-[9.5px] mt-1.5 ${ACCENT_TEXT[n.accent]}`}>{n.title}</div>
                </div>

                {/* тело */}
                <div className="p-5 flex flex-col flex-1">
                  <p className="font-mono text-[10px] text-dim leading-relaxed">{n.audience}</p>
                  <div className="flex items-center gap-2 flex-wrap mt-3.5">
                    <span className="font-mono text-[9.5px] px-2 py-1 rounded bg-line/50 text-mute">ключ «{n.keyword}»</span>
                    <span className="font-mono text-[9.5px] px-2 py-1 rounded bg-line/50 text-mute">{n.price} ₽</span>
                  </div>

                  <div className="mt-auto pt-5 flex items-center gap-2.5">
                    <button
                      onClick={() => download(n.id, "pdf")}
                      disabled={st === "busy" || demo}
                      className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg font-display font-bold text-[11.5px] px-4 py-3 transition-all duration-300 ${
                        demo
                          ? "bg-line/40 text-dim cursor-not-allowed"
                          : "bg-amber text-ink hover:bg-coral hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
                      }`}
                    >
                      {st === "ok" ? <IconCheck size={14} /> : <IconDownload size={14} />}
                      {st === "busy" ? "Формирую…" : st === "ok" ? "Сохранён" : demo ? "Демо" : "Скачать PDF"}
                    </button>
                    <button
                      onClick={() => download(n.id, "md")}
                      disabled={demo}
                      title={demo ? "Недоступно в демо-режиме" : "Скачать исходный текст в Markdown"}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border font-mono text-[10px] px-3.5 py-3 transition-all duration-200 ${
                        demo ? "border-line/50 text-line2 cursor-not-allowed" : "border-line text-mute hover:border-mint/50 hover:text-mint cursor-pointer"
                      }`}
                    >
                      .md
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="reveal mt-12 grid md:grid-cols-3 gap-4">
          {[
            { t: "Для себя", d: "Выбрал нишу по душе — скачал гайд и идёшь по плану на 30 дней. Чек-листы в конце глав не дают слиться." },
            { t: "Под свой бренд", d: "Скачай .md, добавь свои примеры и скриншоты, сверстай в Canva за вечер — и продавай под своим ником." },
            { t: "Как витрину метода", d: "Показывай раздел покупателям доступа: 12 продуктов, калькулятор и план запуска — это и есть ценность «Нишеведа»." },
          ].map((c, i) => (
            <div key={c.t} className="rounded-xl border border-line bg-ink2/60 p-5 transition-colors duration-300 hover:border-amber/35">
              <div className="font-mono text-[9px] tracking-[0.2em] text-amber mb-2">0{i + 1}</div>
              <div className="font-display font-bold text-[13.5px] mb-2">{c.t}</div>
              <p className="font-mono text-[10.5px] text-mute leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>

        <p className="reveal font-mono text-[10px] text-dim mt-6 leading-relaxed">
          Справочные цифры (цены, нормативы, вилки дохода) — ориентиры на 2024–2026 гг. Перед тем как давать советы
          клиентам, сверяй их с актуальными источниками.
        </p>

        <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-dim mt-2">
          <IconDoc size={12} className="text-amber" />
          новые гайды добавляются в библиотеку каждый месяц — скачанные версии остаются у тебя навсегда
        </div>
      </div>
    </section>
  );
}
