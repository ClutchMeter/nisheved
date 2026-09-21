import { useState } from "react";
import { IconRuble } from "./icons";

const PRESETS = {
  start: { reels: 1, views: 15000, kw: 1.0, start: 50, buy: 5, price: 590 },
  razgon: { reels: 2, views: 40000, kw: 1.5, start: 60, buy: 8, price: 990 },
  machine: { reels: 3, views: 100000, kw: 2.0, start: 65, buy: 12, price: 1490 },
};

const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU");

export default function Calculator() {
  const [v, setV] = useState(PRESETS.start);

  const set = (k: keyof typeof PRESETS.start, val: number) => {
    setV((s) => ({ ...s, [k]: val }));
  };

  const monthReels = v.reels * 30;
  const monthViews = monthReels * v.views;
  const kw = monthViews * (v.kw / 100);
  const bot = kw * (v.start / 100);
  const buys = bot * (v.buy / 100);
  const revenue = buys * v.price;

  return (
    <section id="calculator" className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-amber2 text-[11px] tracking-[0.22em] uppercase">04 · калькулятор</span>
        <span className="h-px w-10 bg-amber2/50" />
      </div>
      <h2 className="font-display font-extrabold text-[clamp(1.7rem,3.6vw,2.9rem)] leading-[1.08] tracking-tight mb-4">
        Сколько реально <span className="text-amber2">можно заработать</span>
      </h2>
      <p className="text-mute mb-8 text-[14px] leading-relaxed max-w-xl">Честная математика воронки без «успешного успеха». Крути ползунки — смотри, как меняются цифры. Формула открыта: просмотры → кодовое слово → бот → чек.</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="panel p-6 sm:p-8">
          {[
            { k: "reels" as const, label: "Рилсов в день", min: 1, max: 5, step: 1, unit: "шт" },
            { k: "views" as const, label: "Средние просмотры на рилс", min: 5000, max: 200000, step: 5000, unit: "" },
            { k: "kw" as const, label: "Пишут кодовое слово", min: 0.5, max: 3, step: 0.25, unit: "% зрителей" },
            { k: "start" as const, label: "Заходят в бота", min: 40, max: 75, step: 5, unit: "% написавших" },
            { k: "buy" as const, label: "Покупают в боте", min: 3, max: 15, step: 1, unit: "% зашедших" },
            { k: "price" as const, label: "Чек PDF", min: 290, max: 1990, step: 100, unit: "₽" },
          ].map((s) => (
            <div key={s.k} className="py-4 border-b border-line/60 last:border-b-0">
              <div className="flex items-center justify-between mb-2.5">
                <label className="font-mono text-[11px] text-mute">{s.label}</label>
                <span className="font-display font-bold text-[13.5px] text-fog tabular-nums">
                  {s.k === "views" ? fmt(v[s.k]) : v[s.k]}
                  <span className="font-mono text-[10px] text-dim ml-1.5">{s.unit}</span>
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step={s.step}
                value={v[s.k]}
                onChange={(e) => set(s.k, Number(e.target.value))}
                className="w-full cursor-pointer"
              />
            </div>
          ))}
        </div>

        <div className="panel p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber via-amber2 to-coral" />
          <div className="font-mono text-[10px] tracking-[0.2em] text-dim mb-4">ВЫРУЧКА В МЕСЯЦ</div>
          <div className="flex items-end gap-3">
            <span className="font-display font-extrabold text-[clamp(2.4rem,5vw,3.6rem)] leading-none text-amber tabular-nums">{fmt(revenue)}</span>
            <span className="font-display font-bold text-2xl text-mute mb-1">₽</span>
          </div>
          <div className="font-mono text-[11px] text-mute mt-3">
            {fmt(buys)} продаж × {fmt(v.price)} ₽ · {fmt(monthReels)} рилсов · {fmt(monthViews)} просмотров
          </div>

          <div className="mt-8 space-y-4">
            {[
              { label: "просмотров / мес", value: monthViews, bar: "bg-fog/50" },
              { label: "кодовых слов", value: kw, bar: "bg-sky" },
              { label: "зашли в бота", value: bot, bar: "bg-mint" },
              { label: "купили PDF", value: buys, bar: "bg-amber" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10.5px] text-mute">{s.label}</span>
                  <span className="font-mono text-[11.5px] font-bold text-fog tabular-nums">{fmt(s.value)}</span>
                </div>
                <div className="h-2 rounded-full bg-line/60 overflow-hidden">
                  <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${Math.max(8, (s.value / Math.max(monthViews, 1)) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
