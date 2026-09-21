import { useState } from "react";
import { IconSpark, IconRuble, IconArrow } from "./icons";

const PRESETS = {
  one: { label: "1 воронка", p: 1, price: 990, sales: 45, up: 8, upPrice: 2990, club: 0, services: 0 },
  ladder: { label: "Продуктовая лестница", p: 1, price: 990, sales: 45, up: 18, upPrice: 3990, club: 12, services: 0 },
  hundred: { label: "Сборка 100к+", p: 2, price: 990, sales: 40, up: 15, upPrice: 2990, club: 15, services: 1 },
};

const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU");

export default function ScalePlan() {
  const [v, setV] = useState(PRESETS.one);

  const base = v.p * v.price * v.sales;
  const upsell = v.p * v.sales * (v.up / 100) * v.upPrice;
  const club = v.club * 990;
  const services = v.services * 30000;
  const total = base + upsell + club + services;

  return (
    <section id="scale" className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-coral text-[11px] tracking-[0.22em] uppercase">05 · масштаб</span>
        <span className="h-px w-10 bg-coral/50" />
      </div>
      <h2 className="font-display font-extrabold text-[clamp(1.7rem,3.6vw,2.9rem)] leading-[1.08] tracking-tight mb-4">
        Одна воронка даёт 30–50к. <span className="text-coral">100к+ — это сборка</span>
      </h2>
      <p className="text-mute mb-8 text-[14px] leading-relaxed max-w-xl">Крути миксер: гайды, апселлы, клуб и услуги складываются в месячный доход. Цель — 100 000 ₽. Под миксером — лестница, по которой этот доход собирается по месяцам.</p>

      <div className="grid lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 panel p-6 sm:p-8">
          <div className="grid sm:grid-cols-2 gap-x-8">
            {[
              { k: "p", label: "Гайдов в портфеле", min: 1, max: 4, step: 1, unit: "шт" },
              { k: "price", label: "Чек базового гайда", min: 590, max: 1990, step: 100, unit: "₽" },
              { k: "sales", label: "Продаж на гайд в месяц", min: 15, max: 100, step: 5, unit: "шт" },
              { k: "up", label: "Берут апселл", min: 0, max: 30, step: 1, unit: "% покупателей" },
              { k: "upPrice", label: "Чек апселла", min: 1990, max: 9900, step: 500, unit: "₽" },
              { k: "club", label: "Участников клуба", min: 0, max: 60, step: 5, unit: "×990 ₽/мес" },
              { k: "services", label: "Услуг «под ключ»", min: 0, max: 6, step: 1, unit: "×30 000 ₽" },
            ].map((s) => (
              <div key={s.k} className="py-4 border-b border-line/60">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="font-mono text-[11px] text-mute">{s.label}</label>
                  <span className="font-display font-bold text-[13.5px] text-fog tabular-nums">
                    {v[s.k as keyof typeof v]}
                    <span className="font-mono text-[10px] text-dim ml-1.5">{s.unit}</span>
                  </span>
                </div>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  step={s.step}
                  value={v[s.k as keyof typeof v]}
                  onChange={(e) => setV({ ...v, [s.k]: Number(e.target.value) })}
                  className="w-full cursor-pointer"
                />
              </div>
            ))}
          </div>

          <div className="mt-7 space-y-3.5">
            {[
              { label: "Базовые гайды", value: base, cls: "bg-amber", text: "text-amber" },
              { label: "Апселлы", value: upsell, cls: "bg-coral", text: "text-coral" },
              { label: "Клуб (MRR)", value: club, cls: "bg-mint", text: "text-mint" },
              { label: "Услуги под ключ", value: services, cls: "bg-sky", text: "text-sky" },
            ].map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10.5px] text-mute">{r.label}</span>
                  <span className={`font-mono text-[11.5px] font-bold tabular-nums ${r.text}`}>{fmt(r.value)} ₽</span>
                </div>
                <div className="h-2 rounded-full bg-line/50 overflow-hidden">
                  <div className={`h-full rounded-full ${r.cls}`} style={{ width: `${Math.max(2, (r.value / Math.max(total, 1)) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 pt-6 border-t border-line">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-4">
              <div>
                <div className="font-mono text-[10px] text-dim tracking-[0.15em] mb-1.5">ИТОГО / МЕСЯЦ</div>
                <div className="font-display font-extrabold text-[clamp(1.9rem,3.4vw,2.5rem)] leading-none text-amber tabular-nums flex items-baseline gap-1">
                  {fmt(total)}
                  <span className="text-[0.55em] text-mute">₽</span>
                </div>
              </div>
              <div className={`inline-flex items-center gap-2 font-mono text-[10.5px] px-3.5 py-2 rounded-full border transition-colors duration-300 ${
                total >= 100000 ? "border-mint/50 bg-mint/10 text-mint" : "border-line text-dim"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${total >= 100000 ? "bg-mint animate-pulse" : "bg-dim"}`} />
                {total >= 100000 ? "цель 100к взята" : `${Math.min(100, Math.round((total / 100000) * 100))}% от цели 100 000 ₽`}
              </div>
            </div>
            <div className="h-2.5 rounded-full bg-line/50 overflow-hidden">
              <div
                className={`h-full rounded-full score-bar ${total >= 100000 ? "bg-gradient-to-r from-amber via-coral to-mint" : "bg-gradient-to-r from-amber to-coral"}`}
                style={{ width: `${Math.min(100, (total / 100000) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-3">
          {[
            { 
              sum: "0 → 30к", 
              tone: "text-fog", 
              bar: "bg-amber", 
              title: "Первая воронка", 
              time: "недели 1–4",
              items: [
                "Один гайд за 990 ₽ в одной нише",
                "1–2 рилса в день, кодовое слово под каждым",
                "Бот @nishevedbot: Stars-оплата и автовыдача"
              ]
            },
            { 
              sum: "30 → 60к", 
              tone: "text-sky", 
              bar: "bg-sky", 
              title: "Продуктовая лестница", 
              time: "месяцы 2–3",
              items: [
                "Апселл за 2 990–3 990 ₽ (шаблоны, разбор, база) — каждому 3-му покупателю",
                "Лид-магнит бесплатно → прогрев → допродажа",
                "Ремейки хитовых рилсов: лучший сценарий месяца переснимается 2–3 раза"
              ]
            },
            { 
              sum: "60 → 100к", 
              tone: "text-amber", 
              bar: "bg-amber", 
              title: "Портфель и доступ", 
              time: "месяцы 3–5",
              items: [
                "Второй гайд в смежной нише — та же аудитория покупает дважды",
                "Закрытый клуб 990 ₽/мес: 15 участников = 15к MRR, которые не сгорают",
                "VIP-разбор 9 900 ₽ — 2 штуки в месяц уже +20к"
              ]
            },
            { 
              sum: "100 → 200к+", 
              tone: "text-coral", 
              bar: "bg-coral", 
              title: "Услуга и второй аккаунт", 
              time: "месяц 6+",
              items: [
                "«Воронка под ключ» для экспертов: 25–40к × 3 клиента = +100к",
                "Второй аккаунт в другой нише по той же схеме",
                "Кейсы с цифрами → повышение чека и коллаборации"
              ]
            },
          ].map((l, i) => (
            <div key={l.sum} className="group panel p-5 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-line2" style={{ marginLeft: `${Math.min(i * 6, 18)}%` }}>
              <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${l.bar}`} />
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className={`font-display font-extrabold text-[14px] ${l.tone}`}>{l.sum}</span>
                  <span className="font-display font-bold text-[12px] text-fog">{l.title}</span>
                </div>
                <span className="font-mono text-[9px] text-dim border border-line rounded-full px-2 py-0.5 whitespace-nowrap">{l.time}</span>
              </div>
              <ul className="space-y-1.5">
                {l.items.map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 text-[11.5px] leading-relaxed text-mute">
                    <span className={`w-1.5 h-1.5 rounded-full ${l.bar} shrink-0 mt-1.5 transition-transform duration-300 group-hover:scale-125`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
