import { NICHES, VERDICT_META, ACCENT_TEXT } from "../data/niches";
import { IconCheck, IconCopy } from "./icons";
import { useState } from "react";

export default function NicheMatrix({ preselectedId }: { preselectedId: string | null }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="matrix" className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-amber text-[11px] tracking-[0.22em] uppercase">01 · матрица сканера</span>
              <span className="h-px w-10 bg-amber/50" />
            </div>      <h2 className="font-display font-extrabold text-[clamp(1.7rem,3.6vw,2.9rem)] leading-[1.08] tracking-tight mb-4">
        Выбери нишу — <span className="text-amber">мы покажем все</span>
      </h2>
      <p className="text-mute mb-8 text-[14px] leading-relaxed max-w-xl">12 проверенных ниш с оценками по 5 осям: спрос, вход, контент, маржа, скорость. Каждая — с готовым продуктом, кодовым словом и хуками для рилсов.</p>
      <div className="space-y-3">
        {NICHES.map((n, idx) => {
          const meta = VERDICT_META[n.verdict];
          const total = Object.values(n.scores).reduce((a, b) => a + b, 0);
          const isExpanded = expandedId === n.id;
          return (
            <div key={n.id} className="panel overflow-hidden transition-all duration-300">
              <div 
                className="p-5 cursor-pointer hover:bg-ink2/50 transition-colors duration-200"
                onClick={() => toggleExpand(n.id)}
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-[11px] text-dim tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap mb-2">
                      <span className="font-display font-bold text-[15px] text-fog">{n.title}</span>
                      <span className={`inline-flex items-center gap-1.5 font-mono text-[9px] px-2 py-0.5 rounded-full border ${meta.cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </span>
                    </div>
                    <div className={`font-mono text-[10.5px] mt-0.5 ${ACCENT_TEXT[n.accent]}`}>
                      ключ «{n.keyword}» · чек {n.price} ₽
                    </div>
                    <p className="text-[12px] text-mute mt-2">{n.oneLiner}</p>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
                      {Object.entries(n.scores).map(([key, val]) => (
                        <div key={key}>
                          <div className="font-mono text-[8.5px] text-dim mb-1">{key}</div>
                          <div className="h-1.5 rounded-full bg-line/60 overflow-hidden">
                            <div className={`h-full rounded-full ${ACCENT_TEXT[n.accent].replace("text-", "bg-")}`} style={{ width: `${val * 10}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-mono text-[13px] font-bold tabular-nums text-amber">{total}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-2">
                          {n.reelHooks.slice(0, 2).map((h, i) => (
                            <button
                              key={i}
                              onClick={(e) => {
                                e.stopPropagation();
                                copy(h, `${n.id}-${i}`);
                              }}
                              className="font-mono text-[9.5px] px-2 py-1 rounded border border-line text-dim hover:border-amber/50 hover:text-amber transition-all duration-200 cursor-pointer"
                            >
                              {copied === `${n.id}-${i}` ? "✓" : "хук"}
                            </button>
                          ))}
                        </div>
                        <span className={`text-dim transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                          ▼
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {isExpanded && (
                <div className="border-t border-line bg-ink2/30 p-5 anim-in">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <div className="font-mono text-[9.5px] tracking-[0.18em] text-dim uppercase mb-2">Продукт</div>
                      <div className="font-display font-bold text-[13.5px] text-fog mb-1">{n.product.name}</div>
                      <div className="font-mono text-[10.5px] text-mute">{n.product.format}</div>
                      <div className="font-mono text-[10px] text-dim mt-1">{n.product.volume}</div>
                    </div>
                    <div>
                      <div className="font-mono text-[9.5px] tracking-[0.18em] text-dim uppercase mb-2">Аудитория</div>
                      <div className="text-[12px] text-fog/90 leading-relaxed">{n.audience}</div>
                    </div>
                  </div>
                  
                  <div className="mt-5">
                    <div className="font-mono text-[9.5px] tracking-[0.18em] text-dim uppercase mb-2">Апселл</div>
                    <div className="text-[12px] text-fog/90">{n.upsell}</div>
                  </div>
                  
                  <div className="mt-5">
                    <div className="font-mono text-[9.5px] tracking-[0.18em] text-dim uppercase mb-3">Все хуки для рилсов</div>
                    <div className="space-y-2">
                      {n.reelHooks.map((h, i) => (
                        <div key={i} className="flex items-start justify-between gap-3 group">
                          <span className="text-[12px] text-fog/85 flex-1">«{h}»</span>
                          <button
                            onClick={() => copy(h, `hook-${n.id}-${i}`)}
                            className="font-mono text-[9.5px] px-2 py-1 rounded border border-line text-dim hover:border-amber/50 hover:text-amber transition-all duration-200 cursor-pointer shrink-0"
                          >
                            {copied === `hook-${n.id}-${i}` ? "✓" : "копировать"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-5">
                    <div className="font-mono text-[9.5px] tracking-[0.18em] text-dim uppercase mb-2">Нюанс ниши</div>
                    <div className="text-[12px] text-mute italic leading-relaxed">{n.note}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
