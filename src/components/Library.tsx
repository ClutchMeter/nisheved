import { NICHES } from "../data/niches";
import { downloadNichePdf, downloadNicheMd } from "../lib/pdf";
import { IconDownload, IconCheck } from "./icons";
import { useState } from "react";

export default function Library({ demo }: { demo?: boolean }) {
  const [state, setState] = useState<Record<string, "idle" | "busy" | "ok">>({});

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
    <section id="library" className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-display font-extrabold text-3xl mb-4">Библиотека гайдов</h2>
        <p className="text-mute">12 готовых PDF-гайдов с полным текстом и справочниками</p>
      </div>
      {demo && (
        <div className="mb-8 flex items-center gap-3 rounded-xl border border-sky/35 bg-sky/6 px-5 py-4">
          <p className="font-mono text-[11px] text-mute leading-relaxed">
            <span className="text-sky font-bold">Демо-режим.</span> Листай и изучай гайды — скачивание откроется после оплаты.
          </p>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {NICHES.map((n) => {
          const st = state[n.id] ?? "idle";
          return (
            <div key={n.id} className="panel overflow-hidden flex flex-col">
              <div className="p-5 border-b border-line/70">
                <div className="font-mono text-[8.5px] tracking-[0.18em] text-amber mb-2">PDF-ГАЙД</div>
                <div className="font-display font-extrabold text-[15px] leading-snug text-fog">{n.product.name}</div>
                <div className="font-mono text-[9.5px] mt-1.5 text-mint">{n.name}</div>
              </div>
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
    </section>
  );
}
