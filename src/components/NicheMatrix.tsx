import { NICHES, VERDICT_META, ACCENT_TEXT } from "../data/niches";
import { IconCheck, IconCopy } from "./icons";
import { useState } from "react";

export default function NicheMatrix({ preselectedId }: { preselectedId: string | null }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    }
  };

  return (
    <section id="matrix" className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
      <h2 className="font-display font-extrabold text-3xl mb-4">Матрица 12 ниш</h2>
      <p className="text-mute mb-8">Оценки по 5 осям для формата без лица</p>
      <div className="space-y-3">
        {NICHES.map((n, idx) => {
          const meta = VERDICT_META[n.verdict];
          const total = Object.values(n.scores).reduce((a, b) => a + b, 0);
          return (
            <div key={n.id} className="panel p-5">
              <div className="flex items-start gap-4">
                <span className="font-mono text-[11px] text-dim tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-2">
                    <span className="font-display font-bold text-[15px] text-fog">{n.name}</span>
                    <span className={`inline-flex items-center gap-1.5 font-mono text-[9px] px-2 py-0.5 rounded-full border ${meta.cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                      {meta.label}
                    </span>
                  </div>
                  <div className={`font-mono text-[10.5px] mt-0.5 ${ACCENT_TEXT[n.accent]}`}>
                    ключ «{n.keyword}» · чек {n.price} ₽
                  </div>
                  <p className="text-[12px] text-mute mt-2">{n.pain}</p>
                  <div className="grid grid-cols-5 gap-2 mt-3">
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
                    <div className="flex gap-2">
                      {n.reelHooks.slice(0, 2).map((h, i) => (
                        <button
                          key={i}
                          onClick={() => copy(h, `${n.id}-${i}`)}
                          className="font-mono text-[9.5px] px-2 py-1 rounded border border-line text-dim hover:border-amber/50 hover:text-amber transition-all duration-200 cursor-pointer"
                        >
                          {copied === `${n.id}-${i}` ? "✓" : "хук"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
