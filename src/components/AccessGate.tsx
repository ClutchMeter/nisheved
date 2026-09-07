import { useState } from "react";
import { IconArrow, IconBot, IconDoc, IconFunnel, IconLock, IconReel, IconTelegram } from "./icons";

export const ACCESS_CODES = ["NISH2026", "GAID2026", "VIP365", "PDF2026", "DOHOD100"];

const INSIDE = [
  { icon: IconDoc, title: "12 PDF-гайдов", text: "готовые к скачиванию: матрица судьбы, Excel, нейросети, сон, переезд и другие" },
  { icon: IconBot, title: "Сценарии ботов и рилсов", text: "подписочная воронка, 10 рилсов на каждую нишу, кодовые слова" },
  { icon: IconReel, title: "Фабрика продуктов", text: "квиз подбора ниши, калькулятор дохода, план запуска за 7 дней" },
];

interface Props {
  onUnlock: (mode: "code" | "demo") => void;
}

export default function AccessGate({ onUnlock }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  const submit = () => {
    const clean = code.trim().toUpperCase();
    if (ACCESS_CODES.includes(clean)) {
      onUnlock("code");
      return;
    }
    setError(true);
    setShakeKey((k) => k + 1);
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-ink">
      <div className="grid-layer absolute inset-0 opacity-70 pointer-events-none" aria-hidden />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[620px] h-[420px] rounded-full bg-amber/10 blur-[130px]" />
        <div className="absolute bottom-[-160px] left-[12%] w-[420px] h-[420px] rounded-full bg-coral/8 blur-[120px]" />
      </div>

      <div className="relative min-h-full flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div key={shakeKey} className={`anim-in panel overflow-hidden ${error ? "shake border-coral/60" : ""}`}>
            <div className="h-1 bg-gradient-to-r from-amber via-coral to-mint" />
            <div className="p-7 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber text-ink">
                  <IconFunnel size={22} />
                </span>
                <div>
                  <div className="font-display font-extrabold tracking-tight text-[16px] leading-none">
                    НИШЕ<span className="text-amber">ВЕД</span>
                  </div>
                  <div className="font-mono text-[9.5px] text-dim mt-1.5 tracking-[0.18em] uppercase">закрытая библиотека</div>
                </div>
                <span className="ml-auto flex items-center gap-1.5 font-mono text-[9.5px] text-coral border border-coral/35 bg-coral/8 px-2.5 py-1.5 rounded-full">
                  <IconLock size={11} />
                  единоразовая оплата
                </span>
              </div>

              <h1 className="font-display font-extrabold text-[clamp(1.3rem,4vw,1.7rem)] leading-[1.15] tracking-tight">
                Доступ открывается <span className="text-amber">кодом из бота</span>
              </h1>
              <p className="mt-3 text-[12.5px] leading-relaxed text-mute">
                Оплати доступ в <span className="text-fog font-semibold">@nishevedbot</span> — бот пришлёт персональный код.
                Один код = одно место, не передавай его.
              </p>

              <div className="mt-6 space-y-2.5">
                {INSIDE.map((it) => (
                  <div key={it.title} className="group flex items-start gap-3 rounded-xl border border-line bg-ink px-3.5 py-3 transition-all duration-300 hover:border-amber/40 hover:translate-x-1">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber/10 text-amber shrink-0 transition-transform duration-300 group-hover:scale-110">
                      <it.icon size={15} />
                    </span>
                    <div>
                      <div className="font-display font-bold text-[12.5px] text-fog">{it.title}</div>
                      <div className="font-mono text-[9.5px] text-dim leading-relaxed mt-0.5">{it.text}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <label className="font-mono text-[9.5px] tracking-[0.18em] text-dim uppercase">Код доступа</label>
                <div className="flex gap-2.5 mt-2">
                  <input
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      setError(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    placeholder="XXXX2026"
                    maxLength={12}
                    className={`flex-1 min-w-0 rounded-lg bg-ink border px-4 py-3.5 font-mono text-[15px] tracking-[0.28em] text-amber outline-none transition-colors placeholder:text-line2 placeholder:tracking-[0.2em] ${
                      error ? "border-coral/70" : "border-line focus:border-amber/60"
                    }`}
                  />
                  <button
                    onClick={submit}
                    className="group inline-flex items-center gap-2 rounded-lg bg-amber text-ink font-display font-bold text-[12.5px] px-5 transition-all duration-300 hover:bg-coral hover:-translate-y-0.5 cursor-pointer shrink-0"
                  >
                    Войти
                    <IconArrow size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                </div>
                {error && (
                  <p className="anim-in font-mono text-[10px] text-coral mt-2.5 leading-relaxed">
                    Код не найден. Оплати доступ в @nishevedbot — бот выдаст код мгновенно, или войди в демо ниже.
                  </p>
                )}
              </div>

              <div className="mt-6 pt-5 border-t border-line flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <a
                  href="https://t.me/nishevedbot"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-amber text-ink font-display font-extrabold text-[13px] px-5 py-3.5 transition-all duration-300 hover:bg-coral hover:-translate-y-0.5 shadow-[0_8px_28px_-8px_rgba(255,178,36,0.6)]"
                >
                  <IconTelegram size={15} />
                  Оплатить 1 990 ₽
                </a>
                <button
                  onClick={() => onUnlock("demo")}
                  className="font-mono text-[10.5px] text-dim hover:text-amber transition-colors duration-200 underline decoration-line underline-offset-4 cursor-pointer text-center"
                >
                  посмотреть демо-доступ →
                </button>
              </div>
            </div>
          </div>

          <p className="font-mono text-[9.5px] text-dim text-center mt-5 leading-relaxed">
            Единоразовая оплата · Полный доступ навсегда
          </p>
        </div>
      </div>
    </div>
  );
}
