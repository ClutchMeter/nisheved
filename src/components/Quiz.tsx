import { NICHES } from "../data/niches";
import { useState } from "react";
import { IconArrow } from "./icons";

export default function Quiz({ onPick }: { onPick: (id: string) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = [
    { q: "Что тебе ближе?", opts: ["Деньги и заработок", "Мистика и психология", "Красота и здоровье", "Навыки и учёба"] },
    { q: "Сколько часов в неделю готов уделять?", opts: ["До 5 часов", "5–10 часов", "10+ часов"] },
    { q: "Есть ли опыт в теме?", opts: ["Нет, я с нуля", "Да, есть опыт"] },
    { q: "Какой чек комфортнее?", opts: ["До 600 ₽", "600–1200 ₽", "1200+ ₽"] },
    { q: "Какой формат рилсов ближе?", opts: ["Экран + ИИ-озвучка", "Атмосферные видео", "Сток + субтитры"] },
  ];

  const handleAnswer = (optIdx: number) => {
    const newAnswers = [...answers, optIdx];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Простая логика выбора ниши на основе ответов
      const nicheIdx = newAnswers.reduce((a, b) => a + b, 0) % NICHES.length;
      onPick(NICHES[nicheIdx].id);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
  };

  return (
    <section id="quiz" className="py-20 px-5 sm:px-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono text-mint text-[11px] tracking-[0.22em] uppercase">02 · квиз-подбор</span>
        <span className="h-px w-10 bg-mint/50" />
      </div>
      <h2 className="font-display font-extrabold text-3xl mb-4">Не можешь выбрать? Ответь на 5 вопросов</h2>
      <p className="text-mute mb-8">Сканер назовёт твою нишу</p>
      <div className="panel p-6">
        <div className="mb-6">
          <div className="font-mono text-[10.5px] text-dim tracking-[0.15em] mb-2">
            вопрос {step + 1} / {questions.length}
          </div>
          <div className="h-1.5 rounded-full bg-line/60 overflow-hidden">
            <div className="h-full rounded-full bg-mint" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
          </div>
        </div>
        <h3 className="font-display font-bold text-[18px] mb-6">{questions[step].q}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {questions[step].opts.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="text-left rounded-xl border border-line bg-ink p-5 transition-all duration-300 hover:border-mint/50 hover:-translate-y-1 cursor-pointer"
            >
              <span className="font-display font-bold text-[13.5px] text-fog">{opt}</span>
            </button>
          ))}
        </div>
        {step > 0 && (
          <button onClick={reset} className="mt-5 font-mono text-[10.5px] text-dim hover:text-fog transition-colors cursor-pointer">
            ← начать заново
          </button>
        )}
      </div>
    </section>
  );
}
