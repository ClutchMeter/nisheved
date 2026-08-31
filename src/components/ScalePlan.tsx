import { useMemo, useState } from "react";
import { IconArrow, IconRuble, IconSpark } from "./icons";
import { useCountUp } from "../lib/hooks";

const GOAL = 100000;
const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU");

const PRESETS = {
  one: { label: "1 воронка", p: 1, price: 990, sales: 45, up: 8, upPrice: 2990, club: 0, clubPrice: 990, services: 0 },
  ladder: { label: "Продуктовая лестница", p: 1, price: 990, sales: 45, up: 18, upPrice: 3990, club: 12, clubPrice: 990, services: 0 },
  hundred: { label: "Сборка 100к+", p: 2, price: 990, sales: 40, up: 15, upPrice: 2990, club: 15, clubPrice: 990, services: 1 },
};
type PresetId = keyof typeof PRESETS;

const LADDER = [
  {
    sum: "0 → 30к",
    tone: "text-fog",
    bar: "bg-fog/50",
    title: "Первая воронка",
    time: "недели 1–4",
    levers: ["Один гайд за 990 ₽ в одной нише", "1–2 рилса в день, кодовое слово под каждым", "Бот @nishevedbot: Stars-оплата и автовыдача"],
  },
  {
    sum: "30 → 60к",
    tone: "text-sky",
    bar: "bg-sky",
    title: "Продуктовая лестница",
    time: "месяцы 2–3",
    levers: ["Апселл за 2 990–3 990 ₽ (шаблоны, разбор, база) — каждому 3-му покупателю", "Лид-магнит бесплатно → прогрев → допродажа", "Ремейки хитовых рилсов: лучший сценарий месяца переснимается 2–3 раза"],
  },
  {
    sum: "60 → 100к",
    tone: "text-amber",
    bar: "bg-amber",
    title: "Портфель и подписка",
    time: "месяцы 3–5",
    levers: ["Второй гайд в смежной нише — та же аудитория покупает дважды", "Закрытый клуб 990 ₽/мес: 15 участников = 15к MRR, которые не сгорают", "VIP-разбор 9 900 ₽ — 2 штуки в месяц уже +20к"],
  },
  {
    sum: "100 → 200к+",
    tone: "text-coral",
    bar: "bg-coral",
    title: "Услуга и второй аккаунт",
    time: "месяц 6+",
    levers: ["«Воронка под ключ» для экспертов: 25–40к × 3 клиента = +100к", "Второй аккаунт в другой нише по той же схеме", "Кейсы с цифрами → повышение чека и коллаборации"],
  },
];

const SLIDERS = [
  { k: "p", label: "Гайдов в портфеле", min: 1, max: 4, step: 1, unit: "шт" },
  { k: "price", label: "Чек базового гайда", min: 590, max: 1990, step: 100, unit: "₽" },
  { k: "sales", label: "Продаж на гайд в месяц", min: 15, max: 100, step: 5, unit: "шт" },
  { k: "up", label: "Берут апселл", min: 0, max: 30, step: 1, unit: "% покупателей" },
  { k: "upPrice", label: "Чек апселла", min: 1990, max: 9900, step: 500, unit: "₽" },
  { k: "club", label: "Участников клуба", min: 0, max: 60, step: 5, unit: "×990 ₽/мес" },
  { k: "services", label: "Услуг «под ключ»", min: 0, max: 6, step: 1, unit: "×30 000 ₽" },
] as const;

export default function ScalePlan() {
  const [v, setV] = useState({ ...PRESETS.hundred });
  const [preset, setPreset] = useState<PresetId>("hundred");

  const set = (k: string, val: number) => {
    setV((s) => ({ ...s, [k]: val }));
    setPreset(null as unknown as PresetId);
  };

  const calc = useMemo(() => {
    const base = v.p * v.price * v.sales;
    const upsell = v.p * v.sales * (v.up / 100) * v.upPrice;
    const club = v.club * 990;
    const services = v.services * 30000;
    const total = base + upsell + club + services;
    return { base, upsell, club, services, total };
  }, [v]);

  const [totalRef, totalText] = useCountUp(calc.total, 1100);
  const pct = Math.min(100, Math.round((calc.total / GOAL) * 100));
  const goalHit = calc.total >= GOAL;

  const rows = [
    { label: "Базовые гайды", value: calc.base, cls: "bg-amber", text: "text-amber" },
    { label: "Апселлы", value: calc.upsell, cls: "bg-coral", text: "text-coral" },
    { label: "Клуб (MRR)", value: calc.club, cls: "bg-mint", text: "text-mint" },
    { label: "Услуги под ключ", value: calc.services, cls: "bg-sky", text: "text-sky" },
  ];
  const max = Math.max(calc.total, 1);

  return (
    <section id="scale" className="relative scroll-mt-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-10 right-[12%] w-[420px] h-[420px] rounded-full bg-coral/9 blur-[120px]" />
        <div className="absolute bottom-10 left-[6%] w-[380px] h-[380px] rounded-full bg-amber/8 blur-[110px]" />
      </div>

      <div className="reveal relative max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-coral text-[11px] tracking-[0.22em] uppercase">05 · масштаб</span>
              <span className="h-px w-10 bg-coral/50" />
            </div>
            <h2 className="font-display font-extrabold text-[clamp(1.7rem,3.6vw,2.9rem)] leading-[1.08] tracking-tight max-w-2xl">
              Одна воронка даёт 30–50к. <span className="text-coral">100к+ — это сборка</span>
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-mute max-w-xl">
              Крути миксер: гайды, апселлы, клуб и услуги складываются в месячный доход. Цель — 100 000 ₽. Под миксером —
              лестница, по которой этот доход собирается по месяцам.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            {(Object.keys(PRESETS) as PresetId[]).map((pid) => (
              <button
                key={pid}
                onClick={() => {
                  setV({ ...PRESETS[pid] });
                  setPreset(pid);
                }}
                className={`font-mono text-[11px] px-4 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                  preset === pid ? "bg-coral text-ink border-coral font-bold" : "border-line text-mute hover:border-coral/50 hover:text-fog hover:-translate-y-0.5"
                }`}
              >
                {PRESETS[pid].label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* mixer */}
          <div className="lg:col-span-7 panel rounded-2xl p-6 sm:p-8">
            <div className="grid sm:grid-cols-2 gap-x-8">
              {SLIDERS.map((s) => (
                <div key={s.k} className="py-4 border-b border-line/60">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="font-mono text-[11px] text-mute">{s.label}</label>
                    <span className="font-display font-bold text-[13.5px] text-fog tabular-nums">
                      {v[s.k]}
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

            {/* breakdown */}
            <div className="mt-7 space-y-3.5">
              {rows.map((r) => (
                <div key={r.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[10.5px] text-mute">{r.label}</span>
                    <span className={`font-mono text-[11.5px] font-bold tabular-nums ${r.text}`}>{fmt(r.value)} ₽</span>
                  </div>
                  <div className="h-2 rounded-full bg-line/50 overflow-hidden">
                    <div className={`h-full rounded-full ${r.cls} score-bar`} style={{ width: `${Math.max(2, (r.value / max) * 100)}%`, opacity: 0.85 }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 pt-6 border-t border-line flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="font-mono text-[10px] text-dim tracking-[0.15em] mb-1.5">ИТОГО / МЕСЯЦ</div>
                <div className="font-display font-extrabold text-[clamp(1.9rem,3.4vw,2.5rem)] leading-none text-amber tabular-nums flex items-baseline gap-1">
                  <span ref={totalRef}>{totalText}</span>
                  <span className="text-[0.55em] text-mute">₽</span>
                </div>
              </div>
              <div
                className={`inline-flex items-center gap-2 font-mono text-[10.5px] px-3.5 py-2 rounded-full border transition-colors duration-300 ${
                  goalHit ? "border-mint/50 bg-mint/10 text-mint" : "border-line text-dim"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${goalHit ? "bg-mint animate-pulse" : "bg-dim"}`} />
                {goalHit ? "цель 100к взята" : `${pct}% от цели 100 000 ₽`}
              </div>
            </div>
            <div className="mt-4 h-2.5 rounded-full bg-line/50 overflow-hidden">
              <div
                className={`h-full rounded-full score-bar ${goalHit ? "bg-gradient-to-r from-amber via-coral to-mint" : "bg-gradient-to-r from-amber to-coral"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* ladder */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {LADDER.map((l, i) => (
              <div
                key={l.sum}
                className="group panel rounded-2xl p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-line2"
                style={{ marginLeft: `${Math.min(i * 6, 18)}%` }}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${l.bar}`} />
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className={`font-display font-extrabold text-[14px] ${l.tone}`}>{l.sum}</span>
                    <span className="font-display font-bold text-[12px] text-fog">{l.title}</span>
                  </div>
                  <span className="font-mono text-[9px] text-dim border border-line rounded-full px-2 py-0.5 whitespace-nowrap">{l.time}</span>
                </div>
                <ul className="space-y-1.5">
                  {l.levers.map((lv) => (
                    <li key={lv} className="flex gap-2.5 text-[11.5px] leading-relaxed text-mute">
                      <span className={`w-1.5 h-1.5 rounded-full ${l.bar} shrink-0 mt-1.5 transition-transform duration-300 group-hover:scale-125`} />
                      {lv}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="panel rounded-2xl p-5 border-coral/30 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-coral/12 blur-2xl" />
              <div className="flex items-center gap-2.5 mb-3">
                <IconSpark size={15} className="text-coral" />
                <span className="font-display font-bold text-[13px]">Эта неделя с @nisheved</span>
              </div>
              <ol className="space-y-2">
                {[
                  <>Подключи <b className="text-fog">@nishevedbot</b> к автоответам: ManyChat ловит кодовое слово и шлёт ссылку в Директ.</>,
                  <>Залей первый PDF в бота, включи оплату Telegram Stars и сделай тестовую покупку сам(а).</>,
                  <>9 постов-подложек + био из «Запуска» → первые 10 рилсов по плану из «Фабрики».</>,
                  <>Каждому покупателю через 3 дня — сообщение про апселл: лестница начинается с первой продажи.</>,
                ].map((t, i) => (
                  <li key={i} className="flex gap-3 text-[11.5px] leading-relaxed text-mute">
                    <span className="font-mono text-[10px] font-bold text-coral shrink-0 pt-0.5">{i + 1}.</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
              <a
                href="#factory"
                className="mt-4 group inline-flex items-center gap-2 font-mono text-[10.5px] text-coral hover:text-amber transition-colors duration-200"
              >
                взять текст гайда и 10 рилсов
                <IconArrow size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>

            <div className="flex items-start gap-3 font-mono text-[10.5px] text-dim leading-relaxed">
              <IconRuble size={14} className="text-amber shrink-0 mt-0.5" />
              <span>
                Реалистичная сборка 100к+: 2 гайда × 40 продаж × 990 ₽ + апселлы 15% × 2 990 ₽ + клуб 15 × 990 ₽ + 1 услуга
                «под ключ» ≈ <b className="text-fog">138 000 ₽/мес</b>. Миксер выше считает то же самое.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
