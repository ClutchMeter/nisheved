import { useScramble, useCountUp } from "../lib/hooks";
import { IconFunnel, IconRuble, IconReel, IconComment, IconDm, IconBot, IconArrow } from "./icons";

const FUNNEL = [
  { icon: IconReel, label: "рилсы без лица", value: "100 000", sub: "просмотров/мес", bar: "bg-fog/70", width: 100 },
  { icon: IconComment, label: "пишут кодовое слово", value: "1 500", sub: "≈1,5% зрителей", bar: "bg-sky", width: 62 },
  { icon: IconDm, label: "ссылка в личку", value: "1 500", sub: "автоответ бота", bar: "bg-sky", width: 56 },
  { icon: IconBot, label: "заходят в бота", value: "900", sub: "≈60% доходят", bar: "bg-mint", width: 40 },
  { icon: IconRuble, label: "оплачивают доступ", value: "≈45", sub: "≈5% зашедших", bar: "bg-amber", width: 24 },
];

export default function Hero() {
  const title = useScramble("выбери нишу.", 300);
  const [revenueRef, revenueText] = useCountUp(34650, 1600);

  return (
    <header className="relative overflow-hidden">
      <div className="grid-layer absolute inset-0 opacity-70" aria-hidden />
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-amber/12 blur-[120px]" />
        <div className="absolute top-20 right-[-140px] w-[480px] h-[480px] rounded-full bg-coral/10 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-14 grid lg:grid-cols-2 gap-14 items-center">
        <div className="reveal">
          <div className="inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.18em] text-amber border border-amber/35 bg-amber/8 px-3.5 py-2 rounded-full mb-7">
            <span className="w-2 h-2 rounded-full bg-amber animate-pulse" />
            PDF-ПРОДУКТ · RILS-ВОРОНКА · 2026
          </div>
          <h1 className="font-display font-extrabold tracking-tight leading-[1.04] text-[clamp(2.1rem,4.8vw,3.9rem)]">
            Не можешь решить, <br />
            <span className="text-amber">{title}</span>
          </h1>
          <p className="mt-6 text-mute text-[15px] leading-relaxed max-w-lg">
            «Нишевед» сканирует 12 ниш под воронку <span className="text-fog font-semibold">рилсы → кодовое слово → телеграм-бот → PDF</span>:
            оценки, готовый текст гайда, сценарий бота, 10 рилсов, промпты и айдентика Instagram.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#matrix"
              className="group inline-flex items-center gap-2.5 bg-amber text-ink font-display font-bold text-[13.5px] px-6 py-4 rounded-lg transition-all duration-300 hover:bg-coral hover:-translate-y-0.5 shadow-[0_12px_40px_-10px_var(--color-amber)]"
            >
              Сканировать 12 ниш
              <IconArrow size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href="#quiz" className="font-mono text-[12px] text-mute hover:text-fog transition-colors duration-200 border-b border-line pb-0.5">
              или пройти квиз за 60 секунд
            </a>
          </div>
        </div>

        <div className="reveal relative">
          <div className="panel rounded-2xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/60 to-transparent" />
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center gap-3">
                <span className="text-amber flex items-center justify-center w-9 h-9 rounded-lg bg-amber/12 border border-amber/25">
                  <IconFunnel size={18} />
                </span>
                <div>
                  <div className="font-display font-bold text-[14px]">живая симуляция воронки</div>
                  <div className="font-mono text-[10px] text-dim mt-0.5">данные обновляются при твоих цифрах в калькуляторе</div>
                </div>
              </div>
            </div>

            <div className="relative space-y-3">
              {FUNNEL.map((f, i) => (
                <div key={f.label} className="group flex items-center gap-4">
                  <span className="w-9 h-9 shrink-0 rounded-lg border border-line bg-ink flex items-center justify-center text-mute group-hover:text-amber group-hover:border-amber/40 transition-colors duration-300">
                    <f.icon size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3 mb-1.5">
                      <span className="font-mono text-[10.5px] tracking-wide text-mute truncate">{f.label}</span>
                      <span className="font-display font-bold text-[13.5px] text-fog tabular-nums shrink-0">
                        {f.value} <span className="font-mono font-normal text-[9px] text-dim">{f.sub}</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-line/50 overflow-hidden relative">
                      <div className={`h-full rounded-full ${f.bar} score-bar`} style={{ width: `${f.width}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 pt-6 border-t border-line flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="font-mono text-[10px] text-dim tracking-[0.15em] mb-1.5">ВЫРУЧКА / МЕСЯЦ</div>
                <div className="font-display font-extrabold text-[clamp(1.9rem,3.5vw,2.6rem)] leading-none text-amber tabular-nums flex items-baseline gap-1">
                  <span ref={revenueRef}>{revenueText}</span>
                  <span className="text-[0.55em] text-mute">₽</span>
                </div>
              </div>
              <div className="font-mono text-[9.5px] text-dim leading-relaxed sm:text-right sm:max-w-[160px]">
                чек 770 ₽ · без лица, без опыта, ~60 мин/день
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
