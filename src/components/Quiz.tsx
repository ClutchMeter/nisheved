import { useMemo, useState } from "react";
import { ACCENT_TEXT, NICHES, QUIZ, VERDICT_META } from "../data/niches";
import type { Niche } from "../data/niches";
import { IconArrow, IconCheck, IconSpark } from "./icons";

interface Answer {
  tags: Record<string, number>;
  modifiers?: Record<string, number>;
}

export default function Quiz({ onPick }: { onPick: (id: string) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [done, setDone] = useState(false);

  const results = useMemo(() => {
    if (!done) return [];
    const scored = NICHES.map((n) => {
      let score = 0;
      answers.forEach((a) => {
        Object.entries(a.tags).forEach(([tag, w]) => {
          if (n.tags.includes(tag)) score += w;
        });
        if (a.modifiers?.[n.id]) score += a.modifiers[n.id];
      });
      return { n, score };
    });
    const max = Math.max(...scored.map((s) => s.score), 1);
    return scored.sort((a, b) => b.score - a.score).slice(0, 3).map((s) => ({ ...s, pct: Math.round((s.score / max) * 100) }));
  }, [done, answers]);

  const pick = (opt: Answer) => {
    const next = [...answers, opt];
    if (step + 1 >= QUIZ.length) {
      setAnswers(next);
      setDone(true);
    } else {
      setAnswers(next);
      setStep(step + 1);
    }
  };

  const reset = () => {
    setAnswers([]);
    setStep(0);
    setDone(false);
  };

  const q = QUIZ[step];
  const progress = done ? 100 : Math.round((step / QUIZ.length) * 100);

  return (
    <section id="quiz" className="relative scroll-mt-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-0 right-[15%] w-[380px] h-[380px] rounded-full bg-mint/8 blur-[110px]" />
      </div>
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-24 relative">
        <div className="reveal text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-px w-10 bg-mint/50" />
            <span className="font-mono text-mint text-[11px] tracking-[0.22em] uppercase">02 · квиз-подбор</span>
            <span className="h-px w-10 bg-mint/50" />
          </div>
          <h2 className="font-display font-extrabold text-[clamp(1.7rem,3.6vw,2.9rem)] leading-[1.08] tracking-tight">
            Не можешь выбрать? Ответь <span className="text-mint">на 5 вопросов</span>
          </h2>
        </div>

        <div className="reveal panel rounded-2xl p-6 sm:p-10">
          {/* progress */}
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-[10.5px] text-dim tracking-[0.15em]">
              {done ? "результат сканирования" : `вопрос ${step + 1} / ${QUIZ.length}`}
            </span>
            <span className="font-mono text-[10.5px] text-mint tabular-nums">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-line/60 overflow-hidden mb-8">
            <div className="h-full rounded-full bg-mint score-bar" style={{ width: `${progress}%` }} />
          </div>

          {!done ? (
            <div key={step} className="anim-in">
              <h3 className="font-display font-bold text-[clamp(1.1rem,2.2vw,1.5rem)] leading-snug mb-2">{q.title}</h3>
              {q.hint && <p className="font-mono text-[11px] text-dim leading-relaxed mb-6">{q.hint}</p>}
              <div className="grid sm:grid-cols-2 gap-3 mt-6">
                {q.options.map((o, k) => (
                  <button
                    key={k}
                    onClick={() => pick(o)}
                    className="group text-left rounded-xl border border-line bg-ink p-5 transition-all duration-300 hover:border-mint/50 hover:-translate-y-1 hover:shadow-[0_14px_36px_-14px_rgba(63,214,143,0.35)] cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-display font-bold text-[13.5px] text-fog group-hover:text-mint transition-colors duration-200">{o.label}</span>
                      <IconArrow size={14} className="text-dim group-hover:text-mint group-hover:translate-x-1 transition-all duration-200 shrink-0 mt-1" />
                    </div>
                    {o.sub && <div className="font-mono text-[10.5px] text-dim mt-1.5">{o.sub}</div>}
                  </button>
                ))}
              </div>
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="mt-5 font-mono text-[10.5px] text-dim hover:text-fog transition-colors cursor-pointer">
                  ← назад
                </button>
              )}
            </div>
          ) : (
            <div className="anim-in">
              <div className="flex items-center gap-2.5 mb-6">
                <IconSpark size={18} className="text-mint" />
                <h3 className="font-display font-bold text-[clamp(1.1rem,2.2vw,1.5rem)]">Твои топ-3 ниши</h3>
              </div>
              <div className="space-y-3">
                {results.map((r, i) => {
                  const meta = VERDICT_META[r.n.verdict];
                  return (
                    <div key={r.n.id} className={`rounded-xl border p-5 transition-all duration-300 hover:-translate-y-0.5 ${i === 0 ? "border-mint/50 bg-mint/5" : "border-line bg-ink"}`}>
                      <div className="flex items-center gap-4">
                        <span className={`font-display font-extrabold text-2xl w-9 ${i === 0 ? "text-mint" : "text-dim"}`}>{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-display font-bold text-[14.5px]">{r.n.title}</span>
                            <span className={`inline-flex items-center gap-1.5 font-mono text-[9px] px-2 py-0.5 rounded-full border ${meta.cls}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                              {meta.label}
                            </span>
                          </div>
                          <div className={`font-mono text-[10.5px] mt-1 ${ACCENT_TEXT[r.n.accent]}`}>
                            ключ «{r.n.keyword}» · чек {r.n.price} ₽ · совпадение {r.pct}%
                          </div>
                        </div>
                        <button
                          onClick={() => onPick(r.n.id)}
                          className="group inline-flex items-center gap-2 font-display font-bold text-[11.5px] px-4 py-2.5 rounded-lg bg-fog text-ink transition-all duration-300 hover:bg-mint hover:-translate-y-0.5 cursor-pointer shrink-0"
                        >
                          в матрицу
                          <IconArrow size={13} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-6">
                <button onClick={reset} className="font-mono text-[10.5px] text-dim hover:text-fog transition-colors cursor-pointer">
                  ← пройти заново
                </button>
                <a href="#factory" className="inline-flex items-center gap-2 font-mono text-[11px] text-mint hover:text-fog transition-colors">
                  <IconCheck size={13} />
                  сразу к тексту гайда
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
