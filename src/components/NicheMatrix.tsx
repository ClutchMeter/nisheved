import { useEffect, useMemo, useState } from "react";
import { ACCENT_TEXT, NICHES, VERDICT_META } from "../data/niches";
import type { Niche, Verdict } from "../data/niches";
import { IconArrow, IconCopy, IconSort } from "./icons";

type SortKey = "total" | "demand" | "speed" | "margin";
const SORTS: { id: SortKey; label: string }[] = [
  { id: "total", label: "общий балл" },
  { id: "demand", label: "спрос" },
  { id: "speed", label: "скорость" },
  { id: "margin", label: "маржа" },
];

const AXIS: { key: keyof Niche["scores"]; label: string }[] = [
  { key: "demand", label: "Спрос" },
  { key: "entry", label: "Вход" },
  { key: "content", label: "Контент" },
  { key: "margin", label: "Маржа" },
  { key: "speed", label: "Скорость" },
];

const total = (n: Niche) => Object.values(n.scores).reduce((a, b) => a + b, 0);

export default function NicheMatrix({ preselectedId }: { preselectedId: string | null }) {
  const [filter, setFilter] = useState<Verdict | "all">("all");
  const [sort, setSort] = useState<SortKey>("total");
  const [open, setOpen] = useState<string | null>(NICHES[0].id);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedId) setOpen(preselectedId);
  }, [preselectedId]);

  const list = useMemo(() => {
    const filtered = NICHES.filter((n) => filter === "all" || n.verdict === filter);
    return [...filtered].sort((a, b) => (sort === "total" ? total(b) - total(a) : b.scores[sort] - a.scores[sort]));
  }, [filter, sort]);

  const copy = (text: string, key: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <section id="matrix" className="relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="reveal flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-amber text-[11px] tracking-[0.22em] uppercase">01 · матрица сканера</span>
              <span className="h-px w-10 bg-amber/50" />
            </div>
            <h2 className="font-display font-extrabold text-[clamp(1.7rem,3.6vw,2.9rem)] leading-[1.08] tracking-tight">
              12 ниш под воронку <span className="text-amber">рилсы → бот</span>
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-mute max-w-xl">
              Каждая проверена по пяти осям для формата без лица. Кликни строку — внутри продукт, чек, кодовое слово и
              три готовых хука для рилсов.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "top", "stable", "risky"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-mono text-[11px] px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                  filter === f ? "bg-fog text-ink border-fog font-bold" : "border-line text-mute hover:border-fog/40 hover:text-fog"
                }`}
              >
                {f === "all" ? "Все" : VERDICT_META[f].label}
              </button>
            ))}
            <label className="flex items-center gap-2 font-mono text-[11px] text-dim ml-2">
              <IconSort size={13} />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="bg-transparent text-mute outline-none cursor-pointer font-mono text-[11px]"
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id} className="bg-ink text-fog">
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="reveal rounded-2xl border border-line bg-ink2/60 overflow-hidden">
          {list.map((n, idx) => {
            const meta = VERDICT_META[n.verdict];
            const isOpen = open === n.id;
            return (
              <div key={n.id} className={`border-b border-line last:border-b-0 transition-colors duration-300 ${isOpen ? "bg-panel/70" : "hover:bg-panel/40"}`}>
                <button
                  onClick={() => setOpen(isOpen ? null : n.id)}
                  className="w-full grid grid-cols-[2rem_1fr_auto] sm:grid-cols-[2.5rem_1.4fr_1fr_auto] items-center gap-3 sm:gap-5 px-4 sm:px-6 py-4 text-left cursor-pointer"
                >
                  <span className="font-mono text-[11px] text-dim tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-display font-bold text-[14px] sm:text-[15px] text-fog">{n.title}</span>
                      <span className={`hidden sm:inline-flex items-center gap-1.5 font-mono text-[9px] px-2 py-0.5 rounded-full border ${meta.cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </span>
                    </div>
                    <div className={`font-mono text-[10.5px] mt-0.5 ${ACCENT_TEXT[n.accent]}`}>ключ «{n.keyword}» · чек {n.price} ₽</div>
                  </div>
                  <div className="hidden sm:flex items-center gap-4">
                    {AXIS.map((a) => (
                      <div key={a.key} className="w-14">
                        <div className="font-mono text-[8.5px] text-dim mb-1">{a.label}</div>
                        <div className="h-1.5 rounded-full bg-line/60 overflow-hidden">
                          <div className={`h-full rounded-full score-bar ${isOpen ? ACCENT_TEXT[n.accent].replace("text-", "bg-") : "bg-fog/40"}`} style={{ width: `${n.scores[a.key] * 10}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <span className={`font-mono text-[13px] font-bold tabular-nums ${ACCENT_TEXT[n.accent]}`}>{total(n)}</span>
                </button>

                {isOpen && (
                  <div className="anim-in px-4 sm:px-6 pb-6 pt-1 border-t border-line/60">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="rounded-xl border border-line bg-ink p-4">
                        <div className="font-mono text-[9.5px] tracking-[0.18em] text-dim mb-2">ПРОДУКТ</div>
                        <div className="font-display font-bold text-[13px] text-fog leading-snug">{n.product.name}</div>
                        <div className="font-mono text-[10.5px] text-mute mt-2">{n.product.format}</div>
                        <div className="font-mono text-[10px] text-dim mt-1">{n.product.volume}</div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-line/60">
                          <span className="font-mono text-[10px] text-dim">апселл: {n.upsell}</span>
                        </div>
                      </div>
                      <div className="rounded-xl border border-line bg-ink p-4">
                        <div className="font-mono text-[9.5px] tracking-[0.18em] text-dim mb-2">КОДОВОЕ СЛОВО</div>
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-display font-extrabold text-xl ${ACCENT_TEXT[n.accent]}`}>«{n.keyword}»</span>
                          <button
                            onClick={() => copy(`Пиши «${n.keyword}» в комментариях — пришлю гайд в личку`, `kw-${n.id}`)}
                            className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1.5 rounded-lg border border-line text-mute hover:border-amber/50 hover:text-amber transition-all duration-200 cursor-pointer"
                          >
                            <IconCopy size={11} />
                            {copied === `kw-${n.id}` ? "✓" : "призыв"}
                          </button>
                        </div>
                        <p className="font-mono text-[10.5px] text-dim leading-relaxed mt-2">
                          Аудитория: {n.audience}
                        </p>
                        <p className="font-mono text-[10px] text-dim leading-relaxed mt-2 italic">«{n.oneLiner}»</p>
                      </div>
                      <div className="rounded-xl border border-line bg-ink p-4">
                        <div className="font-mono text-[9.5px] tracking-[0.18em] text-dim mb-2">3 ХУКА ДЛЯ РИЛСОВ</div>
                        <ul className="space-y-2">
                          {n.reelHooks.map((h, k) => (
                            <li key={k} className="group flex items-start justify-between gap-2">
                              <span className="text-[11.5px] leading-relaxed text-fog/85">«{h}»</span>
                              <button
                                onClick={() => copy(h, `hk-${n.id}-${k}`)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-dim hover:text-amber cursor-pointer shrink-0"
                              >
                                {copied === `hk-${n.id}-${k}` ? <span className="font-mono text-[10px]">✓</span> : <IconCopy size={12} />}
                              </button>
                            </li>
                          ))}
                        </ul>
                        <a href="#factory" className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] text-amber hover:text-coral transition-colors duration-200">
                          текст гайда под нишу <IconArrow size={11} />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="reveal font-mono text-[10.5px] text-dim mt-4">
          Оси: спрос — живость запроса · вход — конкуренция и порог · контент — лёгкость производства без лица · маржа —
          потенциал чека · скорость — время до первой продажи. Баллы — экспертная оценка, не истина в последней инстанции.
        </p>
      </div>
    </section>
  );
}
