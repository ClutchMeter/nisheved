import LaunchKit from "./components/LaunchKit";
import { IconBot, IconComment, IconDm, IconDoc, IconFunnel, IconReel } from "./components/icons";
import { useCountUp, useRevealObserver, useScramble } from "./lib/hooks";

const STAGES = [
  { icon: IconReel, label: "Рилс без лица", sub: "цепляет за 3 секунды", accent: "text-coral" },
  { icon: IconComment, label: "Кодовое слово", sub: "пишут в комментариях", accent: "text-amber" },
  { icon: IconDm, label: "Ссылка в Директ", sub: "автоматом на бота", accent: "text-sky" },
  { icon: IconBot, label: "Telegram-бот", sub: "продаёт и выдаёт", accent: "text-mint" },
  { icon: IconDoc, label: "PDF + оплата", sub: "файл после платежа", accent: "text-amber" },
];

function Hero() {
  const title = useScramble("ЗАПУСК PDF-ПРОДУКТА", 250);
  const [r1, v1] = useCountUp(5, 900);
  const [r2, v2] = useCountUp(5, 900);
  const [r3, v3] = useCountUp(60, 1100);

  return (
    <header className="relative overflow-hidden">
      <div className="grid-layer absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-32 left-[20%] w-[480px] h-[480px] rounded-full bg-amber/10 blur-[120px]" />
        <div className="absolute top-20 right-[5%] w-[360px] h-[360px] rounded-full bg-sky/8 blur-[110px]" />
      </div>

      <div className="reveal max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-16 relative">
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.22em] uppercase text-amber border border-amber/35 bg-amber/8 rounded-full px-3.5 py-1.5">
            <IconFunnel size={13} />
            воронка Reels → бот → PDF
          </span>
          <span className="hidden sm:block h-px flex-1 max-w-[120px] bg-line" />
        </div>

        <h1 className="font-display font-extrabold text-[clamp(2rem,5.2vw,4.2rem)] leading-[1.04] tracking-tight max-w-3xl">
          {title}
          <span className="block text-amber mt-1">за один вечер</span>
        </h1>

        <p className="mt-6 text-[15px] leading-relaxed text-mute max-w-xl">
          Всё, что нужно, чтобы собрать продаваемый PDF-гайд нейросетями и запустить воронку в Instagram:
          готовые промпты для текста и вёрстки плюс имя, аватар и био для аккаунта.
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-9">
          <a
            href="#prompts"
            className="group inline-flex items-center gap-2.5 rounded-lg bg-amber text-ink font-display font-bold text-[13.5px] px-6 py-3.5 transition-all duration-300 hover:bg-coral hover:-translate-y-0.5 shadow-[0_10px_36px_-10px_var(--color-amber)]"
          >
            <IconDoc size={16} />
            Промпты для PDF
          </a>
          <a
            href="#instagram"
            className="group inline-flex items-center gap-2.5 rounded-lg border border-line text-fog font-display font-bold text-[13.5px] px-6 py-3.5 transition-all duration-300 hover:border-coral/60 hover:text-coral hover:-translate-y-0.5"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="4" y="4" width="16" height="16" rx="4.5" />
              <circle cx="12" cy="12" r="3.6" />
              <circle cx="16.6" cy="7.4" r="1" fill="currentColor" stroke="none" />
            </svg>
            Instagram-айдентика
          </a>
        </div>

        {/* funnel pipeline */}
        <div className="mt-14 panel p-5 sm:p-6 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-3 min-w-[760px]">
            {STAGES.map((s, i) => (
              <div key={s.label} className="flex items-center gap-3 flex-1">
                <div className="lift group flex flex-col items-start gap-2.5 rounded-xl border border-line bg-ink px-4 py-4 flex-1 min-w-0 hover:border-amber/40">
                  <span className={`flex items-center justify-center w-9 h-9 rounded-lg bg-line/50 ${s.accent} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6`}>
                    <s.icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-[12.5px] text-fog truncate">{s.label}</div>
                    <div className="font-mono text-[9.5px] text-dim mt-0.5 truncate">{s.sub}</div>
                  </div>
                </div>
                {i < STAGES.length - 1 && (
                  <span className="relative flex items-center shrink-0 w-6" aria-hidden>
                    <span className="h-px w-full bg-line" />
                    <span className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* stats */}
        <div className="flex flex-wrap gap-x-12 gap-y-6 mt-12">
          <div>
            <div ref={r1} className="font-display font-extrabold text-3xl text-amber tabular-nums">{v1}</div>
            <div className="font-mono text-[10px] text-dim mt-1">готовых промптов</div>
          </div>
          <div>
            <div ref={r2} className="font-display font-extrabold text-3xl text-amber tabular-nums">{v2}</div>
            <div className="font-mono text-[10px] text-dim mt-1">концепций бренда</div>
          </div>
          <div>
            <div ref={r3} className="font-display font-extrabold text-3xl text-amber tabular-nums">{v3} мин</div>
            <div className="font-mono text-[10px] text-dim mt-1">до первого черновика</div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function App() {
  useRevealObserver();

  return (
    <div className="relative min-h-screen bg-ink text-fog font-body">
      <div className="noise-layer" aria-hidden />

      <nav className="sticky top-0 z-50 border-b border-line/80 bg-ink/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-2.5 group">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber text-ink transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
              <IconFunnel size={19} />
            </span>
            <span className="font-display font-extrabold tracking-tight text-[15px]">
              PDF<span className="text-amber">·</span>ЗАПУСК
            </span>
          </a>

          <div className="hidden md:flex items-center gap-7">
            <a href="#prompts" className="nav-link font-mono text-[12px] tracking-wide text-mute hover:text-fog transition-colors duration-200">
              Промпты
            </a>
            <a href="#instagram" className="nav-link font-mono text-[12px] tracking-wide text-mute hover:text-fog transition-colors duration-200">
              Айдентика
            </a>
          </div>

          <a
            href="#prompts"
            className="group inline-flex items-center gap-2 rounded-lg bg-fog text-ink font-display font-bold text-[12.5px] px-4 py-2.5 transition-all duration-300 hover:bg-amber hover:-translate-y-0.5"
          >
            Начать
          </a>
        </div>
      </nav>

      <main id="top">
        <Hero />
        <LaunchKit />
      </main>

      <footer className="border-t border-line bg-ink2/60">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber text-ink">
              <IconFunnel size={16} />
            </span>
            <div>
              <div className="font-display font-bold text-[13px]">
                PDF<span className="text-amber">·</span>ЗАПУСК
              </div>
              <div className="font-mono text-[10px] text-dim">рилсы → ключ → бот → PDF</div>
            </div>
          </div>
          <p className="font-mono text-[10.5px] text-dim text-center sm:text-right max-w-md leading-relaxed">
            Промпты и айдентика — заготовки. Наполни гайд своей экспертизой и проверь цифры перед продажей.
          </p>
          <a href="#top" className="group inline-flex items-center gap-2 font-mono text-[11px] text-mute hover:text-amber transition-colors duration-200">
            наверх
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
