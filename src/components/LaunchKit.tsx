import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { IconArrow, IconCheck, IconCopy, IconDoc, IconFlame, IconInstagram, IconLock, IconSpark, IconTarget, IconTelegram } from "./icons";

/* ---------------- prompts ---------------- */

interface Prompt {
  id: string;
  tool: string;
  title: string;
  desc: string;
  badge?: string;
  text: string;
}

const PROMPTS: Prompt[] = [
  {
    id: "content",
    tool: "Claude / ChatGPT",
    badge: "шаг 1 · контент",
    title: "Превратить тезисы в полный текст гайда",
    desc: "Кормишь нейросеть структурой из «Фабрики» — получаешь живой текст на 40–60 страниц в Markdown.",
    text: `Ты — опытный редактор цифровых продуктов. Я дам тебе структуру и тезисы PDF-гайда на тему «[ТЕМА]».
Напиши полный текст гайда на 40–60 страниц для аудитории «[АУДИТОРИЯ]».

Требования:
1. Сохрани структуру из 8 глав: введение, основной метод по шагам, справочная таблица, ускорители, типичные ошибки, план на 30 дней, бонусы, следующий уровень.
2. Пиши разговорным живым языком, на «ты». Без воды, мотивации и общих фраз.
3. Каждый шаг метода — конкретный: что сделать, как, с примером и цифрой.
4. Справочную таблицу оформи как Markdown-таблицу (| колонка | колонка |).
5. Добавляй блоки «СОВЕТ» и «НЮАНС НИШИ» — короткие цитаты-плашки.
6. В конце каждой главы — мини-чек-лист из 3 пунктов.
7. Тон: дружелюбный эксперт, который делится проверенным, а не вдохновляет.
8. Верни результат в Markdown.

Вот тезисы:
[ВСТАВЬ СЮДА СКОПИРОВАННЫЙ ТЕКСТ ИЗ «ФАБРИКИ»]`,
  },
  {
    id: "canva",
    tool: "Canva Magic Design",
    badge: "шаг 2 · вёрстка",
    title: "Собрать свёрстанный PDF в Canva",
    desc: "Для Magic Design / Magic Write: нейросеть Canva раскладывает твой текст по фирменному шаблону.",
    text: `Создай PDF-гайд в формате A4 (210×297 мм) на тему «[НАЗВАНИЕ ГАЙДА]».

Стиль: минимализм, тёмно-синий фон #0F1522, светлый текст #E9EEF6, один жёлтый акцент #FFB224.
Шрифты: Manrope для основного текста, Montserrat для заголовков.

Структура:
— Обложка: крупное название, обещание «[ОБЕЩАНИЕ С ЦИФРОЙ]», строка «для кого», автор @[НИК].
— Оглавление с номерами глав.
— 8 глав, каждая с нового листа: крупный номер, заголовок, короткое вступление.
— Справочные таблицы с жёлтой шапкой (15–20% opacity).
— Блоки «СОВЕТ» и «НЮАНС НИШИ» — плашки с цветной рамкой слева.
— Финальная страница: контакт @[НИК] и призыв написать кодовое слово.

Правила: поля от 20 мм, текст 11–12 pt, заголовки 16–20 pt, межстрочный 1,4.
Вставь текст: [ВСТАВЬ MARKDOWN ИЗ ШАГА 1]`,
  },
  {
    id: "gamma",
    tool: "Gamma.app",
    badge: "шаг 2 · альтернатива",
    title: "Сгенерировать документ в Gamma и выгрузить PDF",
    desc: "Gamma делает свёрстанный документ из промпта за минуту, экспорт в PDF — в один клик.",
    text: `Создай документ-руководство на тему «[ТЕМА]» для аудитории «[АУДИТОРИЯ]».
Формат: гайд, около 40 страниц, тёмная тема, чистый минималистичный стиль.

Структура из 8 карточек-глав:
1. Введение — зачем это работает
2. Основной метод — пошагово, с примерами и цифрами
3. Справочная таблица [опиши, какая]
4. Ускорители — 10 рабочих приёмов
5. Типичные ошибки — 7 штук
6. План на 30 дней — по неделям
7. Бонусы и шаблоны
8. Следующий уровень — монетизация

Добавляй таблицы, нумерованные списки и выделенные блоки «совет».
В конце — контакты. Готовый документ экспортируй в PDF.

Тезисы: [ВСТАВЬ СЮДА]`,
  },
  {
    id: "html",
    tool: "Claude → HTML → PDF",
    badge: "максимальный контроль",
    title: "Получить готовую вёрстку и распечатать в PDF",
    desc: "Claude пишет HTML+CSS под печать. Открываешь в браузере → Печать → Сохранить как PDF.",
    text: `Напиши одностраничный HTML+CSS документ для печати в PDF (формат A4).
Тема гайда: «[НАЗВАНИЕ]». Контент: [ВСТАВЬ MARKDOWN ИЗ ШАГА 1].

Требования к вёрстке:
— @page { size: A4; margin: 20mm; }
— Шрифты Manrope (текст) и Montserrat (заголовки), подключить через Google Fonts.
— Цвета: фон #FFFFFF, текст #141B28, акцент #FFB224, тёмные плашки #0F1522.
— Каждая глава <h2> начинается с новой страницы (page-break-before: always).
— Обложка на первой странице: название ~40pt, обещание, автор.
— Таблицы с border-collapse, шапка залита акцентом.
— Блоки .advice и .warning — с цветной рамкой слева 4px.
— Номера страниц через CSS counters.

Дальше я открою файл в браузере и сделаю «Печать → Сохранить как PDF».`,
  },
  {
    id: "cover",
    tool: "Midjourney / DALL·E / Canva AI",
    badge: "графика",
    title: "Сгенерировать обложку и аватар бренда",
    desc: "Единый визуал для обложки PDF и круглой аватарки Instagram — в цветах бренда.",
    text: `Minimal flat vector illustration, [КОНЦЕПЦИЯ БРЕНДА: например "open book morphing into a rising bar chart"],
deep navy background #0F1522, single amber accent #FFB224, geometric shapes,
clean modern style, high contrast, no text, centered composition,
suitable for a small circular avatar crop, --ar 1:1 --style raw

Вариант для обложки PDF (вертикальный):
Dark minimal ebook cover, [НАЗВАНИЕ] theme, navy #0F1522 background,
amber #FFB224 geometric accent, generous whitespace, premium feel, --ar 2:3`,
  },
];

/* ---------------- brands ---------------- */

interface BioVariant {
  id: string;
  label: string;
  build: (kw: string, handle: string) => string;
}

const HANDLES = ["vash_nik", "brand_lab", "guide_pro"];

const BIO_VARIANTS: BioVariant[] = [
  {
    id: "funnel",
    label: "Воронка",
    build: (kw, h) =>
      `Нишевед · PDF-гайды без воды 🔎\nРилсы без лица → бот → доступ за 60 сек\nПиши «${kw}» в Директ — пришлю код 🔑\n⬇ @${h}`,
  },
  {
    id: "expert",
    label: "Эксперт",
    build: (kw, h) =>
      `Запуск PDF-продукта за 7 дней 🧭\n12 ниш · квиз · план · калькулятор\nСлово «${kw}» в Директ → гайд 📄\n⬇ @${h}`,
  },
  {
    id: "bold",
    label: "Дерзкий",
    build: (kw, h) =>
      `Пока ты листаешь — кто-то продаёт PDF ⚡\nРилсы → ключ → бот → деньги\n«${kw}» в Директ — пришлю гайд 📄\n⬇ @${h}`,
  },
];

const headerRows = (handle: string) => [
  { k: "Имя (виден в поиске)", v: "Нишевед · PDF-гайды" },
  { k: "Категория", v: "Цифровой автор" },
  { k: "Ссылка в шапке", v: `https://t.me/${handle}_bot` },
  { k: "Кнопка действия", v: "Написать" },
];

const HIGHLIGHTS = [
  { label: "Гайды", icon: IconDoc },
  { label: "Ниши", icon: IconTarget },
  { label: "Отзывы", icon: IconSpark },
  { label: "Старт", icon: IconFlame },
];

const AVATAR_PROMPT = `Minimal flat vector logo for a circular Instagram avatar: bold geometric funnel shape with a small four-point spark above it, deep navy background #0F1522, amber #FFB224 funnel, mint #3FD68F spark, thick clean shapes, high contrast, no text, centered composition with safe padding for circular crop --ar 1:1 --style raw`;

const COVER_PROMPT = `Brand set for Instagram: 4 round highlight covers and 9 square post backgrounds, dark navy #0F1522, single amber #FFB224 accent, geometric funnel / arrow / spark shapes, thin grid lines, generous negative space, premium editorial minimalism, no faces, no text --ar 1:1 --style raw`;

const NISHEVED_MARK: ReactNode = (
  <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
    <path d="M9 10h30L28.5 23v11l-9 6V23L9 10z" fill="#ffb224" />
    <path d="M38.5 3.5l1.4 3.1 3.1 1.4-3.1 1.4-1.4 3.1-1.4-3.1-3.1-1.4 3.1-1.4 1.4-3.1z" fill="#3fd68f" />
  </svg>
);



export default function LaunchKit({ demo = false }: { demo?: boolean }) {
  const [openPrompt, setOpenPrompt] = useState<string | null>(demo ? null : "content");
  const [lockedHint, setLockedHint] = useState<string | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [handleIdx, setHandleIdx] = useState(0);
  const [bioId, setBioId] = useState("funnel");
  const [codeword, setCodeword] = useState("ГАЙД");
  const [customHandle, setCustomHandle] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handle = customHandle.trim().replace(/^@/, "") || HANDLES[handleIdx];
  const kw = codeword.trim().toUpperCase() || "ГАЙД";
  const bioVariant = useMemo(() => BIO_VARIANTS.find((b) => b.id === bioId) ?? BIO_VARIANTS[0], [bioId]);
  const bio = useMemo(() => bioVariant.build(kw, handle), [bioVariant, kw, handle]);
  const headerText = useMemo(() => headerRows(handle).map((r) => `${r.k}: ${r.v}`).join("\n"), [handle]);

  const firstReel = useMemo(
    () =>
      `Хук на видео: «Я собрал(а) гайд, который заменяет месяц поисков — и отдаю его за кодовое слово»\n` +
      `В описании: «Пиши «${kw}» в комментариях — пришлю в Директ 📄»\n` +
      `В шапке профиля: ссылка на бота @${handle}`,
    [kw, handle],
  );

  const tryPrompt = (id: string) => {
    if (demo) {
      if (hintTimer.current) clearTimeout(hintTimer.current);
      setLockedHint(id);
      hintTimer.current = setTimeout(() => setLockedHint(null), 2400);
      return;
    }
    setOpenPrompt(openPrompt === id ? null : id);
  };

  const copy = (text: string, key: string) => {
    if (timer.current) clearTimeout(timer.current);
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    timer.current = setTimeout(() => setCopied(null), 1600);
  };

  return (
    <section id="launch" className="relative scroll-mt-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-0 left-[15%] w-[420px] h-[420px] rounded-full bg-sky/8 blur-[110px]" />
        <div className="absolute bottom-0 right-[8%] w-[380px] h-[380px] rounded-full bg-amber/8 blur-[110px]" />
      </div>

      <div className="reveal max-w-7xl mx-auto px-5 sm:px-8 py-24 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-sky text-[11px] tracking-[0.22em] uppercase">07 · запуск</span>
              <span className="h-px w-10 bg-sky/50" />
            </div>
            <h2 className="font-display font-extrabold text-[clamp(1.7rem,3.6vw,2.9rem)] leading-[1.08] tracking-tight max-w-xl">
              Промпты для PDF и <span className="text-amber">Instagram-запуск</span>
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-mute max-w-xl">
              Готовые промпты, чтобы собрать свёрстанный PDF нейросетями, и айдентика аккаунта: имя, аватар, био и
              первый рилс. Всё копируется одной кнопкой.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* -------- prompts -------- */}
          <div id="prompts" className="flex flex-col gap-4 scroll-mt-24">
            <div className="flex items-center gap-2.5">
              <IconDoc size={18} className="text-amber" />
              <h3 className="font-display font-bold text-[15px]">Промпты: текст → свёрстанный PDF</h3>
            </div>

            <div className="flex flex-col gap-3">
              {PROMPTS.map((p) => {
                const isOpen = openPrompt === p.id;
                return (
                  <div
                    key={p.id}
                    className={`panel overflow-hidden transition-all duration-300 ${isOpen ? "border-amber/40" : "hover:border-line2"}`}
                  >
                    <button
                      onClick={() => tryPrompt(p.id)}
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
                      {demo ? (
                        <IconLock size={14} className="text-dim shrink-0 mt-1" />
                      ) : (
                        <span className={`text-dim transition-transform duration-300 shrink-0 mt-1 ${isOpen ? "rotate-90" : ""}`}>▸</span>
                      )}
                    </button>
                    {demo && lockedHint === p.id && (
                      <div className="anim-in px-4 pb-3.5 -mt-1">
                        <span className="inline-flex items-center gap-2 font-mono text-[9.5px] text-amber bg-amber/10 border border-amber/30 rounded-md px-2.5 py-1.5">
                          <IconLock size={11} />
                          промпты открываются в полной версии — забери код в боте
                        </span>
                      </div>
                    )}

                    {isOpen && (
                      <div className="anim-in px-4 pb-4">
                        <p className="text-[12px] leading-relaxed text-mute mb-3">{p.desc}</p>
                        <div className="relative">
                          <pre className="rounded-lg bg-ink border border-line p-4 pr-14 font-mono text-[10.5px] leading-relaxed text-fog/80 whitespace-pre-wrap break-words max-h-72 overflow-y-auto scrollbar-none">
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

          {/* -------- instagram -------- */}
          <div id="instagram" className="flex flex-col gap-4 scroll-mt-24">
            <div className="flex items-center gap-2.5">
              <IconInstagram size={18} className="text-coral" />
              <h3 className="font-display font-bold text-[15px]">Instagram-айдентика</h3>
            </div>

            {/* profile header spec */}
            <div className="panel p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-8 h-8 rounded-lg bg-amber/12 border border-amber/25 flex items-center justify-center text-amber shrink-0">
                    <IconInstagram size={15} />
                  </span>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-[13.5px]">Шапка профиля — что вписать</div>
                    <div className="font-mono text-[9.5px] text-dim mt-0.5">бренд «Нишевед» · имя видно в поиске Instagram</div>
                  </div>
                </div>
                <button
                  onClick={() => copy(headerText, "header")}
                  className="inline-flex items-center gap-1.5 font-mono text-[9.5px] px-2.5 py-1.5 rounded-md border border-line text-mute hover:border-amber/50 hover:text-amber transition-all duration-200 cursor-pointer shrink-0"
                >
                  {copied === "header" ? <IconCheck size={12} className="text-mint" /> : <IconCopy size={12} />}
                  {copied === "header" ? "готово" : "всё"}
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {headerRows(handle).map((r) => (
                  <div key={r.k} className="rounded-lg border border-line bg-ink px-3.5 py-3 transition-colors duration-200 hover:border-line2">
                    <div className="font-mono text-[9px] tracking-[0.15em] text-dim uppercase">{r.k}</div>
                    <div className={`font-display font-bold text-[12.5px] mt-1 break-words ${r.k.startsWith("Ссылка") ? "text-sky" : "text-fog"}`}>{r.v}</div>
                  </div>
                ))}
              </div>
              <p className="font-mono text-[10px] text-dim mt-3 leading-relaxed">
                Займи ник и создай бота <span className="text-amber">@{handle}_bot</span> в BotFather, подключи его к сценарию и оплате из «Фабрики», затем вставь ссылку <span className="text-sky">t.me/{handle}_bot</span> в шапку профиля.
              </p>
            </div>

            {/* handle picker */}
            <div className="panel p-4 flex flex-col gap-3">
              <span className="font-mono text-[9.5px] tracking-[0.15em] text-dim uppercase">Ник — проверь и займи свободный</span>
              <div className="flex flex-wrap gap-2">
                {HANDLES.map((h, i) => (
                  <button
                    key={h}
                    onClick={() => {
                      setHandleIdx(i);
                      setCustomHandle("");
                    }}
                    className={`font-mono text-[11.5px] px-3.5 py-2.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                      !customHandle.trim() && handleIdx === i
                        ? "bg-amber text-ink border-amber font-bold shadow-[0_4px_18px_-4px_var(--color-amber)]"
                        : "border-line text-mute hover:border-amber/40 hover:text-fog hover:-translate-y-0.5"
                    }`}
                  >
                    @{h}
                  </button>
                ))}
              </div>
              <input
                value={customHandle}
                onChange={(e) => setCustomHandle(e.target.value)}
                placeholder="или свой вариант: @..."
                maxLength={24}
                className="rounded-lg bg-ink border border-line px-3.5 py-2.5 font-mono text-[12.5px] text-fog outline-none focus:border-amber/60 transition-colors placeholder:text-dim"
              />
            </div>

            {/* profile mock */}
            <div key={`${handle}-${bioId}`} className="anim-in panel overflow-hidden">
              <div className="h-16 relative" style={{ background: "linear-gradient(120deg, rgba(255,178,36,0.14), transparent 60%)" }}>
                <div className="absolute inset-x-0 bottom-0 h-px bg-line" />
              </div>
              <div className="px-5 pb-5">
                <div className="flex items-end gap-4 -mt-9">
                  <div
                    className="w-[74px] h-[74px] rounded-full flex items-center justify-center border-4 border-ink shrink-0 transition-transform duration-300 hover:rotate-6"
                    style={{ background: "radial-gradient(circle at 30% 30%, #1d2739, #0f1522)", boxShadow: "0 0 0 2px rgba(255,178,36,0.4)" }}
                  >
                    {NISHEVED_MARK}
                  </div>
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-[14px] truncate">Нишевед</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber shrink-0" />
                    </div>
                    <div className="font-mono text-[10.5px] text-amber mt-0.5 truncate">@{handle}</div>
                    <div className="font-mono text-[9.5px] text-dim mt-0.5 truncate">PDF-гайды · ниши · воронки без лица</div>
                  </div>
                </div>

                <div className="flex gap-6 mt-4">
                  {[
                    ["12", "публикаций"],
                    ["0", "подписчиков"],
                    ["0", "подписок"],
                  ].map(([v, l]) => (
                    <div key={l}>
                      <div className="font-display font-bold text-[13px]">{v}</div>
                      <div className="font-mono text-[9.5px] text-dim">{l}</div>
                    </div>
                  ))}
                </div>

                <pre className="mt-4 font-body text-[12px] leading-relaxed text-fog/90 whitespace-pre-wrap">{bio}</pre>

                <div className="flex gap-2 mt-4">
                  <span className="flex-1 text-center font-display font-bold text-[11.5px] rounded-lg bg-sky/15 text-sky border border-sky/30 py-2 transition-colors duration-200 hover:bg-sky/25">
                    Подписаться
                  </span>
                  <span className="flex-1 text-center font-display font-bold text-[11.5px] rounded-lg bg-line/50 text-fog py-2 transition-colors duration-200 hover:bg-line">
                    Гайд 📄
                  </span>
                </div>

                <div className="flex gap-4 mt-5 flex-wrap">
                  {HIGHLIGHTS.map((h) => (
                    <div key={h.label} className="flex flex-col items-center gap-1.5">
                      <span className="w-11 h-11 rounded-full border-2 border-amber/40 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-amber/80">
                        <h.icon size={14} className="text-amber" />
                      </span>
                      <span className="font-mono text-[8.5px] text-dim">{h.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* bio variant + codeword */}
            <div className="panel p-4 sm:p-5 flex flex-col gap-4">
              <div>
                <span className="font-mono text-[9.5px] tracking-[0.15em] text-dim uppercase block mb-2.5">Тон био — три варианта</span>
                <div className="flex flex-wrap gap-2">
                  {BIO_VARIANTS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBioId(b.id)}
                      className={`font-mono text-[11px] px-3.5 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                        bioId === b.id
                          ? "bg-coral text-ink border-coral font-bold shadow-[0_4px_18px_-4px_var(--color-coral)]"
                          : "border-line text-mute hover:border-coral/40 hover:text-fog hover:-translate-y-0.5"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="font-mono text-[9.5px] tracking-[0.15em] text-dim uppercase">Кодовое слово — в био, рилсы и бота</span>
                <input
                  value={codeword}
                  onChange={(e) => setCodeword(e.target.value)}
                  maxLength={14}
                  className="rounded-lg bg-ink border border-line px-3.5 py-2.5 font-mono text-[13px] text-amber tracking-[0.15em] outline-none focus:border-amber/60 transition-colors"
                />
              </label>
              <p className="font-mono text-[10px] text-dim leading-relaxed -mt-1">
                Одно слово везде: под рилсом, в био и как триггер бота. Сменишь — поменяй во всех трёх местах.
              </p>
            </div>

            {/* avatar + covers */}
            <div className="panel p-4 sm:p-5 flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <IconSpark size={16} className="text-amber" />
                <div>
                  <div className="font-display font-bold text-[13.5px]">Аватар и обложки</div>
                  <div className="font-mono text-[9.5px] text-dim mt-0.5">единый визуал бренда — генерируется по промптам ниже</div>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-xl border border-line bg-ink p-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 hover:rotate-6 hover:scale-105"
                  style={{ background: "radial-gradient(circle at 30% 30%, #1d2739, #0f1522)", boxShadow: "0 0 0 2px rgba(255,178,36,0.4)" }}
                >
                  {NISHEVED_MARK}
                </div>
                <ul className="space-y-1.5 min-w-0">
                  {[
                    "Аватар 1080×1080: тёмно-синий фон, воронка + искра",
                    "4 обложки хайлайтсов: гайды · ниши · отзывы · старт",
                    "9 подложек постов: тёмный фон, янтарные фигуры, сетка",
                  ].map((s) => (
                    <li key={s} className="flex gap-2 text-[11px] leading-relaxed text-mute">
                      <span className="text-amber shrink-0">▸</span>
                      <span className="min-w-0">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {[
                  { key: "avatar", label: "Промпт аватара", icon: IconSpark, cls: "text-amber", text: AVATAR_PROMPT },
                  { key: "covers", label: "Промпт обложек", icon: IconInstagram, cls: "text-coral", text: COVER_PROMPT },
                ].map((c) => (
                  <button
                    key={c.key}
                    onClick={() => copy(c.text, c.key)}
                    className="group flex items-center justify-between gap-3 rounded-lg border border-line bg-ink px-4 py-3 text-left transition-all duration-200 hover:border-amber/40 hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <c.icon size={14} className={`${c.cls} shrink-0`} />
                      <span className="font-display font-bold text-[11.5px] text-fog truncate">{c.label}</span>
                    </span>
                    <span className="font-mono text-[9px] text-dim group-hover:text-amber shrink-0 transition-colors">
                      {copied === c.key ? "✓" : "копировать"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* copyables */}
            <div className="panel p-4 flex flex-col gap-2.5">
              {[
                { key: "bio", label: "Био для Instagram", icon: IconInstagram, cls: "text-coral", text: bio },
                { key: "header2", label: "Шапка профиля (все поля)", icon: IconDoc, cls: "text-amber", text: headerText },
                { key: "reel", label: "Сценарий первого рилса", icon: IconTelegram, cls: "text-sky", text: firstReel },
              ].map((c) => (
                <button
                  key={c.key}
                  onClick={() => copy(c.text, c.key)}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-line bg-ink px-4 py-3 text-left transition-all duration-200 hover:border-amber/40 hover:translate-x-1 cursor-pointer"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <c.icon size={15} className={`${c.cls} shrink-0`} />
                    <span className="font-display font-bold text-[12px] text-fog truncate">{c.label}</span>
                  </span>
                  <span className="font-mono text-[9.5px] text-dim group-hover:text-amber shrink-0 transition-colors">
                    {copied === c.key ? "✓ скопировано" : "копировать"}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2.5 font-mono text-[10.5px] text-dim leading-relaxed">
              <IconArrow size={14} className="text-amber shrink-0" />
              Порядок: занять ник → аватар → шапка → хайлайтсы → 9 подложек → первый рилс со словом «{kw}».
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
