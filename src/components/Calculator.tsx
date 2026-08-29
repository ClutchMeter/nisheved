import { useMemo, useState } from "react";
import { IconRuble } from "./icons";

const PRESETS = {
  start: { reels: 1, views: 15000, kw: 1.0, start: 50, buy: 5, price: 590 },
  razgon: { reels: 2, views: 40000, kw: 1.5, start: 60, buy: 8, price: 990 },
  machine: { reels: 3, views: 100000, kw: 2.0, start: 65, buy: 12, price: 1490 },
};
type PresetId = keyof typeof PRESETS;

const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU");

export default function Calculator() {
  const [v, setV] = useState(PRESETS.start);
  const [preset, setPreset] = useState<PresetId | null>("start");

  const set = (k: keyof typeof PRESETS.start, val: number) => {
    setV((s) => ({ ...s, [k]: val }));
    setPreset(null);
  };

  const calc = useMemo(() => {
    const monthReels = v.reels * 30;
    const monthViews = monthReels * v.views;
    const kw = monthViews * (v.kw / 100);
    const bot = kw * (v.start / 100);
    const buys = bot * (v.buy / 100);
    const revenue = buys * v.price;
    return { monthReels, monthViews, kw, bot, buys, revenue };
  }, [v]);

  const steps = [
    { label: "просмотров / мес", value: calc.monthViews, bar: "bg-fog/50", width: 100 },
    { label: "кодовых слов", value: calc.kw, bar: "bg-sky", width: 62 },
    { label: "зашли в бота", value: calc.bot, bar: "bg-mint", width: 40 },
    { label: "купили PDF", value: calc.buys, bar: "bg-amber", width: 24 },
  ];

  return (
    <section id="calculator" className="relative scroll-mt-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-10 left-[8%] w-[400px] h-[400px] rounded-full bg-sky/8 blur-[110px]" />
      </div>
      <div className="reveal max-w-7xl mx-auto px-5 sm:px-8 py-24 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-amber2 text-[11px] tracking-[0.22em] uppercase">04 · калькулятор</span>
              <span className="h-px w-10 bg-amber2/50" />
            </div>
            <h2 className="font-display font-extrabold text-[clamp(1.7rem,3.6vw,2.9rem)] leading-[1.08] tracking-tight">
              Сколько это <span className="text-amber2">приносит</span>
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-mute max-w-xl">
              Честная математика воронки. Крути ползунки — формула открыта, без «успешного успеха»: 1–2% зрителей пишут
              кодовое слово, в бота заходит половина, покупают 5–12%.
            </p>
          </div>
          <div className="flex gap-2">
            {(Object.keys(PRESETS) as PresetId[]).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setV(PRESETS[p]);
                  setPreset(p);
                }}
                className={`font-mono text-[11px] px-4 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                  preset === p ? "bg-amber2 text-ink border-amber2 font-bold" : "border-line text-mute hover:border-amber2/50 hover:text-fog hover:-translate-y-0.5"
                }`}
              >
                {p === "start" ? "Старт" : p === "razgon" ? "Разгон" : "Машина"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* sliders */}
          <div className="panel rounded-2xl p-6 sm:p-8">
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
            <p className="font-mono text-[10px] text-dim leading-relaxed mt-4">
              Диапазоны — реалистичные для аккаунтов без лица на 1–6 месяце. Рилс без лица при 1–3 публикациях в день
              набирает 5–40 тыс. просмотров при стабильной нише.
            </p>
          </div>

          {/* result */}
          <div className="flex flex-col gap-6">
            <div className="panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber via-amber2 to-coral" />
              <div className="font-mono text-[10px] tracking-[0.2em] text-dim mb-4">ВЫРУЧКА В МЕСЯЦ</div>
              <div className="flex items-end gap-3">
                <span className="font-display font-extrabold text-[clamp(2.4rem,5vw,3.6rem)] leading-none text-amber tabular-nums">{fmt(calc.revenue)}</span>
                <span className="font-display font-bold text-2xl text-mute mb-1">₽</span>
              </div>
              <div className="font-mono text-[11px] text-mute mt-3">
                {fmt(calc.buys)} продаж × {fmt(v.price)} ₽ · {fmt(calc.monthReels)} рилсов · {fmt(calc.monthViews)} просмотров
              </div>

              <div className="mt-8 space-y-4">
                {steps.map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10.5px] text-mute">{s.label}</span>
                      <span className="font-mono text-[11.5px] font-bold text-fog tabular-nums">{fmt(s.value)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-line/60 overflow-hidden">
                      <div className={`h-full rounded-full ${s.bar} score-bar`} style={{ width: `${Math.max(8, Math.pow(s.value / Math.max(calc.monthViews, 1), 0.28) * s.width)}%`, opacity: 0.85 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel rounded-2xl p-6 flex items-start gap-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber2/12 text-amber2 shrink-0">
                <IconRuble size={19} />
              </span>
              <div>
                <div className="font-display font-bold text-[13.5px] mb-1.5">Где ломается математика</div>
                <p className="font-mono text-[10.5px] text-mute leading-relaxed">
                  Чаще всего — на «заходят в бота»: ссылка в директ доходит не всем. Лечится автоответом в комментариях
                  (ManyChat) и напоминанием. Вторая дыра — чек: 290 ₽ требуют втрое больше трафика, чем 990 ₽.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
