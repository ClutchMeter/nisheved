import { NICHES, VERDICT_META, ACCENT_TEXT } from "../data/niches";
import type { Niche } from "../data/niches";
import { IconCopy } from "./icons";
import { useState, useMemo } from "react";

type FilterType = "all" | "top" | "stable" | "risky";
type SortType = "total-desc" | "total-asc";

const AXIS_LABELS: Record<string, string> = {
  demand: "Спрос",
  entry: "Вход",
  content: "Контент",
  margin: "Маржа",
  speed: "Скорость",
};

export default function NicheMatrix({ preselectedId, demo = false }: { preselectedId: string | null; demo?: boolean }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("total-desc");

  const copy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    }
  };

  const toggleExpand = (id: string) => {
    if (demo) return; // В демо-режиме не разворачиваем
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...NICHES];
    
    // Фильтрация
    if (filter !== "all") {
      result = result.filter((n) => n.verdict === filter);
    }
    
    // Сортировка
    result.sort((a, b) => {
      const totalA = Object.values(a.scores).reduce((sum, val) => sum + val, 0);
      const totalB = Object.values(b.scores).reduce((sum, val) => sum + val, 0);
      return sort === "total-desc" ? totalB - totalA : totalA - totalB;
    });
    
    return result;
  }, [filter, sort]);

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "Все" },
    { id: "top", label: "ТОП-запуск" },
    { id: "stable", label: "Стабильно" },
    { id: "risky", label: "С оговорками" },
  ];

  return (
    <section id="matrix" className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
      {/* Заголовок секции */}
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-amber text-[11px] tracking-[0.22em] uppercase">01 · матрица сканера</span>
        <span className="h-px w-10 bg-amber/50" />
      </div>
      <h2 className="font-display font-extrabold text-[clamp(1.7rem,3.6vw,2.9rem)] leading-[1.08] tracking-tight mb-4">
        12 ниш под воронку <span className="text-amber">рилсы → бот</span>
      </h2>
      <p className="text-mute mb-8 text-[14px] leading-relaxed max-w-2xl">
        Каждая проверена по пяти осям для формата без лица. Кликни строку — внутри продукт, чек, кодовое слово и три готовых хука для рилсов.
      </p>

      {/* Фильтры и сортировка */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`font-mono text-[11px] px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                filter === f.id
                  ? "bg-fog text-ink border-fog font-bold"
                  : "border-line text-mute hover:border-fog/40 hover:text-fog"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto">
          <button
            onClick={() => setSort(sort === "total-desc" ? "total-asc" : "total-desc")}
            className="font-mono text-[11px] px-3 py-2 rounded-lg border border-line text-mute hover:border-amber/50 hover:text-amber transition-all duration-200 cursor-pointer flex items-center gap-2"
          >
            <span>↕</span>
            <span>общий балл</span>
            <span>{sort === "total-desc" ? "∨" : "∧"}</span>
          </button>
        </div>
      </div>

      {/* Список ниш */}
      <div className="space-y-2">
        {filteredAndSorted.map((n, idx) => {
          const meta = VERDICT_META[n.verdict];
          const total = Object.values(n.scores).reduce((a, b) => a + b, 0);
          const isExpanded = expandedId === n.id;
          
          return (
            <div key={n.id} className="panel overflow-hidden transition-all duration-300">
              {/* Свернутая карточка */}
              <div
                className="grid grid-cols-[2rem_1fr_auto] sm:grid-cols-[2.5rem_1.4fr_1fr_auto] items-center gap-3 sm:gap-5 px-4 sm:px-6 py-4 cursor-pointer hover:bg-ink2/50 transition-colors duration-200"
                onClick={() => toggleExpand(n.id)}
              >
                {/* Номер */}
                <span className="font-mono text-[11px] text-dim tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
                
                {/* Название и ключ */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1">
                    <span className="font-display font-bold text-[14px] text-fog">{n.title}</span>
                    <span className={`inline-flex items-center gap-1.5 font-mono text-[9px] px-2 py-0.5 rounded-full border ${meta.cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                      {meta.label}
                    </span>
                  </div>
                  <div className={`font-mono text-[10.5px] ${ACCENT_TEXT[n.accent]}`}>
                    ключ «{n.keyword}» · чек {n.price} ₽
                  </div>
                </div>

                {/* Прогресс-бары (скрыты на мобильных) */}
                <div className="hidden sm:flex items-center gap-4">
                  {Object.entries(n.scores).map(([key, val]) => (
                    <div key={key} className="w-14">
                      <div className="font-mono text-[8.5px] text-dim mb-1">{AXIS_LABELS[key]}</div>
                      <div className="h-1.5 rounded-full bg-line/60 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${ACCENT_TEXT[n.accent].replace("text-", "bg-")}`}
                          style={{ width: `${val * 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Общий балл */}
                <span className={`font-mono text-[13px] font-bold tabular-nums ${ACCENT_TEXT[n.accent]}`}>
                  {total}
                </span>
              </div>

              {/* Развернутая карточка */}
              {isExpanded && (
                <div className="border-t border-line bg-ink2/30 p-5 sm:p-6 anim-in">
                  <div className="grid md:grid-cols-3 gap-5">
                    {/* Колонка 1: Продукт */}
                    <div>
                      <div className="font-mono text-[9.5px] tracking-[0.18em] text-dim uppercase mb-2">Продукт</div>
                      <div className="font-display font-bold text-[13.5px] text-fog mb-1 leading-snug">{n.product.name}</div>
                      <div className="font-mono text-[10.5px] text-mute">{n.product.format}</div>
                      <div className="font-mono text-[10px] text-dim mt-1">{n.product.volume}</div>
                      <div className="mt-3 pt-3 border-t border-line/60">
                        <div className="font-mono text-[9px] text-dim">апселл: {n.upsell}</div>
                      </div>
                    </div>

                    {/* Колонка 2: Кодовое слово */}
                    <div>
                      <div className="font-mono text-[9.5px] tracking-[0.18em] text-dim uppercase mb-2">Кодовое слово</div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`font-display font-extrabold text-xl ${ACCENT_TEXT[n.accent]}`}>
                          «{n.keyword}»
                        </span>
                        <button
                          onClick={() => copy(`Пиши «${n.keyword}» в комментариях — пришлю гайд в личку`, `call-${n.id}`)}
                          className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-1.5 rounded-lg border border-line text-mute hover:border-amber/50 hover:text-amber transition-all duration-200 cursor-pointer"
                        >
                          <IconCopy size={11} />
                          {copied === `call-${n.id}` ? "✓" : "призыв"}
                        </button>
                      </div>
                      <p className="font-mono text-[10.5px] text-dim leading-relaxed mb-2">
                        Аудитория: {n.audience}
                      </p>
                      <p className="font-mono text-[10px] text-dim leading-relaxed italic">
                        «{n.oneLiner}»
                      </p>
                    </div>

                    {/* Колонка 3: Хуки для рилсов */}
                    <div>
                      <div className="font-mono text-[9.5px] tracking-[0.18em] text-dim uppercase mb-2">3 хука для рилсов</div>
                      <ul className="space-y-2">
                        {n.reelHooks.map((h, i) => (
                          <li key={i} className="group flex items-start justify-between gap-2">
                            <span className="text-[11.5px] leading-relaxed text-fog/85 flex-1">«{h}»</span>
                            <button
                              onClick={() => copy(h, `hook-${n.id}-${i}`)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-dim hover:text-amber cursor-pointer shrink-0"
                            >
                              {copied === `hook-${n.id}-${i}` ? (
                                <span className="font-mono text-[10px]">✓</span>
                              ) : (
                                <IconCopy size={12} />
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                      <a
                        href="#factory"
                        className="mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] text-amber hover:text-coral transition-colors duration-200"
                      >
                        текст гайда под нишу →
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredAndSorted.length === 0 && (
        <div className="text-center py-12">
          <p className="font-mono text-[12px] text-dim">Нет ниш с выбранным фильтром</p>
        </div>
      )}

      <p className="font-mono text-[10.5px] text-dim mt-4 leading-relaxed">
        Оси: спрос — живость запроса · вход — конкуренция и порог · контент — лёгкость производства без лица · маржа —
        потенциал чека · скорость — время до первой продажи. Баллы — экспертная оценка, не истина в последней инстанции.
      </p>
    </section>
  );
}
