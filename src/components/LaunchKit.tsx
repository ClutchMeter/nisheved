import { useState } from "react";
import { IconDoc, IconInstagram, IconSpark, IconTelegram, IconCopy, IconCheck } from "./icons";

const PROMPTS = [
  {
    id: "content",
    tool: "Claude / ChatGPT",
    badge: "шаг 1 · контент",
    title: "Превратить тезисы в полный текст гайда",
    text: `Ты — опытный редактор цифровых продуктов. Напиши полный текст PDF-гайда на тему «[ТЕМА]» для аудитории «[АУДИТОРИЯ]», 40–60 страниц. Структура из 8 глав: введение, метод по шагам, справочная таблица, ускорители, ошибки, план на 30 дней, бонусы, следующий уровень. Пиши на «ты», без воды, каждый шаг — с примером и цифрой, таблицу — в Markdown, в конце каждой главы чек-лист из 3 пунктов. Верни в Markdown.`,
  },
  {
    id: "canva",
    tool: "Canva Magic Design",
    badge: "шаг 2 · вёрстка",
    title: "Собрать свёрстанный PDF в Canva",
    text: `Создай PDF-гайд в формате A4 (210×297 мм) на тему «[НАЗВАНИЕ ГАЙДА]». Стиль: минимализм, тёмно-синий фон #0F1522, светлый текст #E9EEF6, один жёлтый акцент #FFB224. Шрифты: Manrope для основного текста, Montserrat для заголовков. Структура: обложка, оглавление, 8 глав, справочные таблицы, финальная страница с контактом.`,
  },
  {
    id: "gamma",
    tool: "Gamma.app",
    badge: "шаг 2 · альтернатива",
    title: "Сгенерировать документ в Gamma и выгрузить PDF",
    text: `Создай документ-руководство на тему «[ТЕМА]» для аудитории «[АУДИТОРИЯ]». Формат: гайд, около 40 страниц, тёмная тема, чистый минималистичный стиль. Структура из 8 карточек-глав. Добавляй таблицы, нумерованные списки и выделенные блоки «совет». Готовый документ экспортируй в PDF.`,
  },
  {
    id: "html",
    tool: "Claude → HTML → PDF",
    badge: "максимальный контроль",
    title: "Получить готовую вёрстку и распечатать в PDF",
    text: `Напиши одностраничный HTML+CSS документ для печати в PDF (формат A4). Тема гайда: «[НАЗВАНИЕ]». Контент: [ВСТАВЬ MARKDOWN]. Требования: @page { size: A4; margin: 20mm; }, шрифты Manrope и Montserrat, цвета: фон #FFFFFF, текст #141B28, акцент #FFB224. Каждая глава начинается с новой страницы.`,
  },
  {
    id: "cover",
    tool: "Midjourney / DALL·E / Canva AI",
    badge: "графика",
    title: "Сгенерировать обложку и аватар бренда",
    text: `Minimal flat vector illustration, [КОНЦЕПЦИЯ БРЕНДА], deep navy background #0F1522, single amber accent #FFB224, geometric shapes, clean modern style, high contrast, no text, centered composition, suitable for a small circular avatar crop --ar 1:1 --style raw`,
  },
];

const HANDLES = ["vash_nik", "brand_lab", "guide_pro"];

const BIO_VARIANTS = [
  { id: "funnel", label: "Воронка", build: (kw: string, h: string) => `Нишевед · PDF-гайды без воды 🔎\nРилсы без лица → бот → доступ за 60 сек\nПиши «${kw}» в Директ — пришлю код 🔑\n⬇ @${h}` },
  { id: "expert", label: "Эксперт", build: (kw: string, h: string) => `Запуск PDF-продукта за 7 дней 🧭\n12 ниш · квиз · план · калькулятор\nСлово «${kw}» в Директ → гайд 📄\n⬇ @${h}` },
  { id: "bold", label: "Дерзкий", build: (kw: string, h: string) => `Пока ты листаешь — кто-то продаёт PDF ⚡\nРилсы → ключ → бот → деньги\n«${kw}» в Директ — пришлю гайд 📄\n⬇ @${h}` },
];

export default function LaunchKit({ demo }: { demo?: boolean }) {
  const [openPrompt, setOpenPrompt] = useState<string | null>(demo ? null : "content");
  const [handleIdx, setHandleIdx] = useState(0);
  const [bioId, setBioId] = useState("funnel");
  const [codeword, setCodeword] = useState("ГАЙД");
  const [customHandle, setCustomHandle] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const handle = customHandle.trim().replace(/^@/, "") || HANDLES[handleIdx];
  const kw = codeword.trim().toUpperCase() || "ГАЙД";
  const bioVariant = BIO_VARIANTS.find((b) => b.id === bioId) || BIO_VARIANTS[0];
  const bio = bioVariant.build(kw, handle);

  const copy = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1600);
    }
  };

  return (
    <section id="launch" className="py-20 px-5 sm:px-8 max-w-7xl mx-auto">
      <h2 className="font-display font-extrabold text-3xl mb-4">Запуск</h2>
      <p className="text-mute mb-8">Промпты для PDF и Instagram-айдентика</p>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <IconDoc size={18} className="text-amber" />
            <h3 className="font-display font-bold text-[15px]">Промпты: текст → свёрстанный PDF</h3>
          </div>

          <div className="flex flex-col gap-3">
            {PROMPTS.map((p) => {
              const isOpen = openPrompt === p.id;
              return (
                <div key={p.id} className={`panel overflow-hidden transition-all duration-300 ${isOpen ? "border-amber/40" : ""}`}>
                  <button
                    onClick={() => demo ? null : setOpenPrompt(isOpen ? null : p.id)}
                    className="w-full flex items-start gap-3 px-4 py-3.5 text-left cursor-pointer group"
                  >
                    <span className="font-mono text-[9px] px-2 py-1 rounded bg-line/60 text-mute tracking-wide shrink-0 mt-0.5">
                      {p.tool}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-display font-bold text-[13.5px] text-fog group-hover:text-amber transition-colors">
                        {p.title}
                      </span>
                      {p.badge && <span className="block font-mono text-[9.5px] text-dim mt-0.5">{p.badge}</span>}
                    </span>
                    <span className={`text-dim transition-transform duration-300 shrink-0 mt-1 ${isOpen ? "rotate-90" : ""}`}>▸</span>
                  </button>

                  {isOpen && !demo && (
                    <div className="px-4 pb-4">
                      <div className="relative">
                        <pre className="rounded-lg bg-ink border border-line p-4 pr-14 font-mono text-[10.5px] leading-relaxed text-fog/80 whitespace-pre-wrap break-words max-h-72 overflow-y-auto">
                          {p.text}
                        </pre>
                        <button
                          onClick={() => copy(p.text, p.id)}
                          className="absolute top-2.5 right-2.5 flex items-center gap-1.5 font-mono text-[9.5px] px-2.5 py-1.5 rounded-md border border-line bg-ink2 text-mute hover:border-amber/50 hover:text-amber transition-all cursor-pointer"
                        >
                          {copied === p.id ? <IconCheck size={12} className="text-mint" /> : <IconCopy size={12} />}
                          {copied === p.id ? "готово" : "копировать"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5">
            <IconInstagram size={18} className="text-coral" />
            <h3 className="font-display font-bold text-[15px]">Instagram-айдентика</h3>
          </div>

          <div className="panel p-4 flex flex-col gap-3">
            <div>
              <span className="font-mono text-[9.5px] tracking-[0.15em] text-dim uppercase block mb-2.5">Тон био — три варианта</span>
              <div className="flex flex-wrap gap-2">
                {BIO_VARIANTS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBioId(b.id)}
                    className={`font-mono text-[11px] px-3.5 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                      bioId === b.id
                        ? "bg-coral text-ink border-coral font-bold"
                        : "border-line text-mute hover:border-coral/40 hover:text-fog"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="font-mono text-[9.5px] tracking-[0.15em] text-dim uppercase">Кодовое слово</span>
              <input
                value={codeword}
                onChange={(e) => setCodeword(e.target.value)}
                maxLength={14}
                className="rounded-lg bg-ink border border-line px-3.5 py-2.5 font-mono text-[13px] text-amber tracking-[0.15em] outline-none focus:border-amber/60 transition-colors"
              />
            </label>
          </div>

          <div className="panel p-4 flex flex-col gap-2.5">
            <button
              onClick={() => copy(bio, "bio")}
              className="group flex items-center justify-between gap-3 rounded-lg border border-line bg-ink px-4 py-3 text-left transition-all duration-200 hover:border-amber/40 hover:translate-x-1 cursor-pointer"
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <IconInstagram size={15} className="text-coral shrink-0" />
                <span className="font-display font-bold text-[12px] text-fog truncate">Био для Instagram</span>
              </span>
              <span className="font-mono text-[9.5px] text-dim group-hover:text-amber shrink-0 transition-colors">
                {copied === "bio" ? "✓ скопировано" : "копировать"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
