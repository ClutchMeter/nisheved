import { useCallback, useEffect, useState } from "react";
import NicheMatrix from "./components/NicheMatrix";
import Quiz from "./components/Quiz";
import Factory from "./components/Factory";
import Calculator from "./components/Calculator";
import ScalePlan from "./components/ScalePlan";
import Roadmap from "./components/Roadmap";
import LaunchKit from "./components/LaunchKit";
import AccessGate from "./components/AccessGate";
import Library from "./components/Library";
import Privacy from "./components/Privacy";
import Terms from "./components/Terms";
import { IconArrow, IconBot, IconComment, IconCross, IconDm, IconFunnel, IconLock, IconReel, IconRuble, IconTelegram } from "./components/icons";
import { useCountUp, useRevealObserver, useScramble } from "./lib/hooks";

const NAV = [
  { href: "#library", label: "Библиотека" },
  { href: "#matrix", label: "Матрица" },
  { href: "#quiz", label: "Квиз" },
  { href: "#factory", label: "Фабрика" },
  { href: "#calculator", label: "Калькулятор" },
  { href: "#scale", label: "100к+" },
  { href: "#roadmap", label: "План" },
  { href: "#prompts", label: "Промпты" },
  { href: "#instagram", label: "Instagram" },
];

const FUNNEL = [
  { icon: IconReel, label: "рилсы без лица", value: "100 000", sub: "просмотров/мес", bar: "bg-fog/70", width: 100 },
  { icon: IconComment, label: "пишут кодовое слово", value: "1 500", sub: "≈1,5% зрителей", bar: "bg-sky", width: 62 },
  { icon: IconDm, label: "ссылка в личку", value: "1 500", sub: "автоответ бота", bar: "bg-sky", width: 56 },
  { icon: IconBot, label: "заходят в бота", value: "900", sub: "≈60% доходят", bar: "bg-mint", width: 40 },
  { icon: IconRuble, label: "оплачивают доступ", value: "≈45", sub: "≈5% зашедших", bar: "bg-amber", width: 24 },
];

const WORDS = ["НЕЙРО", "МАТРИЦА", "РИЛС", "УДАЛЁНКА", "ФРАЗЫ", "БЮДЖЕТ", "ТАБЛИЦА", "СОН", "МАНИКЮР", "СПИНА", "РЕЦЕПТ", "ЕВРОПА", "ГАЙД"];

function Hero() {
  const title = useScramble("выбери нишу.", 300);
  const [revenueRef, revenueText] = useCountUp(34650, 1600);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <header className="relative overflow-hidden">
      <div className="hidden xl:flex absolute top-44 right-[5%] z-10 pointer-events-none" aria-hidden>
        <span className="floaty inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-amber border border-amber/30 bg-ink/85 backdrop-blur px-4 py-2.5 rounded-full shadow-[0_10px_36px_-10px_rgba(0,0,0,0.7)]">
          «МАТРИЦА» <span className="text-amber text-[9px]">✦</span> 1 500 ключей
        </span>
      </div>
      <div className="hidden xl:flex absolute bottom-52 right-[22%] z-10 pointer-events-none" aria-hidden>
        <span className="floaty inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-mint border border-mint/30 bg-ink/85 backdrop-blur px-4 py-2.5 rounded-full shadow-[0_10px_36px_-10px_rgba(0,0,0,0.7)]" style={{ animationDelay: "1.6s" }}>
          «НЕЙРО» <span className="text-mint text-[9px]">✦</span> в боте
        </span>
      </div>
      <div className="grid-layer absolute inset-0 opacity-70" aria-hidden />
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -left-32 w-[520px] h-[520px] rounded-full bg-amber/12 blur-[120px]" />
        <div className="absolute top-20 right-[-140px] w-[480px] h-[480px] rounded-full bg-coral/10 blur-[120px]" />
        <div className="absolute bottom-[-180px] left-1/3 w-[560px] h-[560px] rounded-full bg-mint/8 blur-[140px]" />
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

          <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
            {[
              { v: "12", l: "проверенных ниш" },
              { v: "36", l: "хуков для рилсов" },
              { v: "5", l: "минут до плана" },
            ].map((s) => (
              <div key={s.l} className="border-l-2 border-line pl-4">
                <div className="font-display font-extrabold text-2xl text-fog">{s.v}</div>
                <div className="font-mono text-[10px] text-dim mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* живая воронка */}
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
              <span className="font-mono text-[10px] text-mint border border-mint/30 bg-mint/8 px-2.5 py-1.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
                live
              </span>
            </div>

            <div className="relative space-y-3">
              {FUNNEL.map((f, i) => (
                <div key={f.label} className="group flex items-center gap-4">
                  <span className="w-9 h-9 shrink-0 rounded-lg border border-line bg-ink flex items-center justify-center text-mute group-hover:text-amber group-hover:border-amber/40 transition-colors duration-300">
                    <f.icon size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 mb-1.5">
                      <span className="font-mono text-[10.5px] tracking-wide text-mute min-w-0">{f.label}</span>
                      <span className="font-display font-bold text-[13.5px] text-fog tabular-nums shrink-0">
                        {f.value} <span className="font-mono font-normal text-[9px] text-dim">{f.sub}</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-line/50 overflow-hidden relative">
                      <div
                        className={`h-full rounded-full ${f.bar} score-bar`}
                        style={{ width: mounted ? `${f.width}%` : "0%", transitionDelay: `${i * 120}ms` }}
                      />
                      <span
                        className="funnel-dot absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-fog shadow-[0_0_8px_rgba(233,238,246,0.9)]"
                        style={{ animationDelay: `${i * 0.45}s` }}
                      />
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

      <div className="relative border-y border-line bg-ink2/70 overflow-hidden py-4">
        <div className="marquee-track flex w-max gap-0 font-mono text-[13px] tracking-[0.22em] text-mute">
          {[...WORDS, ...WORDS].map((w, i) => (
            <span key={i} className="flex items-center whitespace-nowrap">
              <span className="mx-5">«{w}»</span>
              <span className="text-amber text-[9px]">✦</span>
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

export default function App() {
  useRevealObserver();
  const [pickedNiche, setPickedNiche] = useState<string | null>(null);
  const [locked, setLocked] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem("nisheved-unlocked");
    } catch {
      return true;
    }
  });
  const [demoMode, setDemoMode] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem("nisheved-unlocked") === "demo";
    } catch {
      return false;
    }
  });

  const exitDemo = useCallback(() => {
    try {
      sessionStorage.removeItem("nisheved-unlocked");
    } catch {
      /* приватный режим — работаем без сохранения */
    }
    setLocked(true);
  }, []);

  const handleUnlock = useCallback((mode: "code" | "demo") => {
    try {
      sessionStorage.setItem("nisheved-unlocked", mode);
    } catch {
      /* приватный режим — работаем без сохранения */
    }
    setDemoMode(mode === "demo");
    setLocked(false);
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePick = useCallback((id: string) => {
    setPickedNiche(id);
    document.getElementById("matrix")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Проверка параметра logout в URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("logout") === "true") {
        exitDemo();
        // Удаляем параметр из URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [exitDemo]);

  // Роутинг для юридических страниц
  if (typeof window !== "undefined") {
    if (window.location.hash === "#/privacy") return <Privacy />;
    if (window.location.hash === "#/terms") return <Terms />;
  }

  return (
    <div className="relative min-h-screen bg-ink text-fog font-body">
      <div className="noise-layer" aria-hidden />
      {locked && <AccessGate onUnlock={handleUnlock} />}

      {demoMode && !locked && (
        <div className="fixed bottom-4 inset-x-0 z-[70] flex justify-center px-4 pointer-events-none">
          <button
            onClick={exitDemo}
            className="group pointer-events-auto inline-flex items-center gap-2.5 rounded-full bg-amber text-ink font-display font-extrabold text-[13px] px-6 py-3.5 shadow-[0_12px_44px_-8px_rgba(255,178,36,0.65)] transition-all duration-300 hover:bg-coral hover:-translate-y-1 cursor-pointer"
          >
            <IconLock size={15} className="transition-transform duration-300 group-hover:rotate-12" />
            Получить полный доступ
            <span className="w-2 h-2 rounded-full bg-ink/80 animate-pulse" aria-hidden />
          </button>
        </div>
      )}

      <div
        aria-hidden={locked}
        className={`transition-all duration-700 ${locked ? "blur-[10px] opacity-40 pointer-events-none select-none scale-[0.995]" : ""}`}
      >
      <nav className="sticky top-0 z-50 border-b border-line/80 bg-ink/85 backdrop-blur-md">
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-amber to-coral"
          style={{ width: `${progress}%`, transition: "width 0.12s linear" }}
          aria-hidden
        />
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-2.5 group">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber text-ink transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
              <IconFunnel size={19} />
            </span>
            <span className="font-display font-extrabold tracking-tight text-[15px]">
              НИШЕ<span className="text-amber">ВЕД</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-6">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="nav-link font-mono text-[12px] tracking-wide text-mute hover:text-fog transition-colors duration-200">
                {n.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="#quiz"
              className="group hidden sm:inline-flex items-center gap-2 rounded-lg bg-fog text-ink font-display font-bold text-[12.5px] px-4 py-2.5 transition-all duration-300 hover:bg-amber hover:-translate-y-0.5"
            >
              Подобрать нишу
              <IconArrow size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="меню"
              className={`lg:hidden flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 cursor-pointer ${
                menuOpen ? "border-amber/60 text-amber bg-amber/10" : "border-line text-fog hover:border-amber/40"
              }`}
            >
              {menuOpen ? (
                <IconCross size={16} />
              ) : (
                <span className="flex flex-col gap-[5px]">
                  <span className="block w-[17px] h-[1.5px] bg-current rounded-full" />
                  <span className="block w-[13px] h-[1.5px] bg-current rounded-full" />
                  <span className="block w-[17px] h-[1.5px] bg-current rounded-full" />
                </span>
              )}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden anim-in border-t border-line bg-ink/95 backdrop-blur-md px-5 py-4">
            <div className="grid grid-cols-2 gap-2">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-mono text-[12px] text-mute hover:text-amber px-3.5 py-3 rounded-lg border border-line/70 hover:border-amber/40 transition-colors duration-200"
                >
                  {n.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main id="top">
        <Hero />
        <Library demo={demoMode} />
        <NicheMatrix preselectedId={pickedNiche} demo={demoMode} />
        <Quiz onPick={handlePick} />
        <Factory preselectedId={pickedNiche} demo={demoMode} onUpgrade={exitDemo} />
        <Calculator />
        <ScalePlan />
        <Roadmap demo={demoMode} />
        <LaunchKit demo={demoMode} />
      </main>

      <footer className="border-t border-line bg-ink2/60">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber text-ink">
              <IconFunnel size={16} />
            </span>
            <div>
              <div className="font-display font-bold text-[13px]">
                НИШЕ<span className="text-amber">ВЕД</span>
              </div>
              <div className="font-mono text-[10px] text-dim">рилсы → ключ → бот → PDF · запуск 2026</div>
            </div>
          </div>
          <p className="font-mono text-[10.5px] text-dim text-center sm:text-right max-w-md leading-relaxed">
            Цифры калькулятора и справочников — модель для планирования, не гарантия дохода. Итог зависит от
            регулярности публикаций и качества продукта.
          </p>
          <a href="#top" className="group inline-flex items-center gap-2 font-mono text-[11px] text-mute hover:text-amber transition-colors duration-200">
            наверх
            <IconArrow size={13} className="-rotate-90 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
        <div className="border-t border-line/60">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center font-mono text-[10px] text-dim">
            <IconTelegram size={12} className="text-sky shrink-0" />
            воронка: рилс с кодовым словом → автоответ → бот → оплата Stars → PDF в чат
          </div>
        </div>
        <div className="border-t border-line/60">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center font-mono text-[10px]">
            <a href="#/privacy" className="text-mute hover:text-amber transition-colors duration-200">
              Политика конфиденциальности
            </a>
            <a href="#/terms" className="text-mute hover:text-amber transition-colors duration-200">
              Условия использования
            </a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
