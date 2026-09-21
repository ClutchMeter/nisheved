import { useCallback, useState } from "react";
import Hero from "./components/Hero";
import Library from "./components/Library";
import NicheMatrix from "./components/NicheMatrix";
import Quiz from "./components/Quiz";
import Factory from "./components/Factory";
import Calculator from "./components/Calculator";
import ScalePlan from "./components/ScalePlan";
import Roadmap from "./components/Roadmap";
import LaunchKit from "./components/LaunchKit";
import AccessGate from "./components/AccessGate";
import { useRoute } from "./lib/router";
import { Privacy, Terms } from "./components/LegalPages";
import { IconFunnel, IconArrow, IconTelegram } from "./components/icons";
import { useRevealObserver } from "./lib/hooks";

export default function App() {
  useRevealObserver();
  const route = useRoute();
  const [pickedNiche, setPickedNiche] = useState<string | null>(null);
  const [locked, setLocked] = useState<boolean>(() => {
    try {
      return !localStorage.getItem("nisheved-unlocked");
    } catch {
      return true;
    }
  });
  const [demoMode, setDemoMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem("nisheved-unlocked") === "demo";
    } catch {
      return false;
    }
  });

  const exitDemo = useCallback(() => {
    try {
      localStorage.removeItem("nisheved-unlocked");
    } catch {
      /* приватный режим — работаем без сохранения */
    }
    setLocked(true);
  }, []);

  const handleUnlock = useCallback((mode: "code" | "demo") => {
    try {
      localStorage.setItem("nisheved-unlocked", mode);
    } catch {
      /* приватный режим — работаем без сохранения */
    }
    setDemoMode(mode === "demo");
    setLocked(false);
  }, []);

  const handlePick = useCallback((id: string) => {
    setPickedNiche(id);
    document.getElementById("matrix")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Роутинг для юридических страниц
  if (route === "#/privacy") return <Privacy />;
  if (route === "#/terms") return <Terms />;

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
            <a href="#library" className="nav-link font-mono text-[12px] tracking-wide text-mute hover:text-fog transition-colors duration-200">
              Библиотека
            </a>
            <a href="#matrix" className="nav-link font-mono text-[12px] tracking-wide text-mute hover:text-fog transition-colors duration-200">
              Матрица
            </a>
            <a href="#quiz" className="nav-link font-mono text-[12px] tracking-wide text-mute hover:text-fog transition-colors duration-200">
              Квиз
            </a>
            <a href="#factory" className="nav-link font-mono text-[12px] tracking-wide text-mute hover:text-fog transition-colors duration-200">
              Фабрика
            </a>
            <a href="#calculator" className="nav-link font-mono text-[12px] tracking-wide text-mute hover:text-fog transition-colors duration-200">
              Калькулятор
            </a>
            <a href="#scale" className="nav-link font-mono text-[12px] tracking-wide text-mute hover:text-fog transition-colors duration-200">
              100к+
            </a>
            <a href="#roadmap" className="nav-link font-mono text-[12px] tracking-wide text-mute hover:text-fog transition-colors duration-200">
              План
            </a>
            <a href="#prompts" className="nav-link font-mono text-[12px] tracking-wide text-mute hover:text-fog transition-colors duration-200">
              Промпты
            </a>
            <a href="#instagram" className="nav-link font-mono text-[12px] tracking-wide text-mute hover:text-fog transition-colors duration-200">
              Instagram
            </a>
          </div>

          <a
            href="#quiz"
            className="group inline-flex items-center gap-2 rounded-lg bg-fog text-ink font-display font-bold text-[12.5px] px-4 py-2.5 transition-all duration-300 hover:bg-amber hover:-translate-y-0.5"
          >
            Подобрать нишу
            <IconArrow size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>
      </nav>

      <main id="top">
        <Hero />
        <Library demo={demoMode} />
        <NicheMatrix preselectedId={pickedNiche} />
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
