import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { IconArrow, IconCheck, IconCopy, IconDoc, IconInstagram, IconSpark, IconTelegram } from "./icons";

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

interface Brand {
  id: string;
  name: string;
  handle: string;
  tagline: string;
  niches: string;
  bio1: string;
  bio2: string;
  avatarConcept: string;
  accent: string;
  mark: ReactNode;
}

const BRANDS: Brand[] = [
  {
    id: "gaidlab",
    name: "ГайдЛаб",
    handle: "gaid.lab",
    tagline: "Лаборатория рабочих гайдов",
    niches: "универсальный — под любую нишу",
    bio1: "Рабочие гайды без воды 🧪",
    bio2: "Скачал → применил → результат",
    avatarConcept: "open book morphing into a rising bar chart",
    accent: "#ffb224",
    mark: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
        <path d="M8 34V14l8 4 8-4v20l-8 4-8-4z" fill="#ffb224" />
        <path d="M24 14l8-4 8 4v20l-8 4-8-4V14z" fill="#ffb224" opacity=".45" />
      </svg>
    ),
  },
  {
    id: "koddohoda",
    name: "КодДохода",
    handle: "kod.dohoda",
    tagline: "Доход на навыках и нейросетях",
    niches: "нейросети, удалёнка, финансы",
    bio1: "Доход на навыках и ИИ 💡",
    bio2: "Без лица · по шагам · с цифрами",
    avatarConcept: "abstract key unlocking a glowing coin",
    accent: "#3fd68f",
    mark: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
        <circle cx="18" cy="18" r="9" stroke="#3fd68f" strokeWidth="4" />
        <path d="M24 25l14 14M32 33l5-5M37 38l5-5" stroke="#3fd68f" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "matrix",
    name: "Матрица.Ты",
    handle: "matrix.ty",
    tagline: "Разборы по дате рождения",
    niches: "матрица судьбы, таро, эзотерика",
    bio1: "Твой код судьбы по дате рождения ✨",
    bio2: "Разбор за 5 минут — пиши МАТРИЦА",
    avatarConcept: "geometric life-matrix mandala grid with a glowing center",
    accent: "#58b7ff",
    mark: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
        <circle cx="24" cy="24" r="16" stroke="#58b7ff" strokeWidth="3" />
        <circle cx="24" cy="24" r="8" stroke="#58b7ff" strokeWidth="3" opacity=".55" />
        <circle cx="24" cy="24" r="3" fill="#58b7ff" />
        <path d="M24 8v8M24 32v8M8 24h8M32 24h8" stroke="#58b7ff" strokeWidth="3" strokeLinecap="round" opacity=".55" />
      </svg>
    ),
  },
  {
    id: "sistema30",
    name: "Система 30",
    handle: "sistema.30",
    tagline: "Результат за 30 дней",
    niches: "универсальный — метод + план",
    bio1: "Результат за 30 дней ⏱",
    bio2: "Метод + план + трекер в одном PDF",
    avatarConcept: "circular 30-day loop arrow forming the number 30",
    accent: "#ff6a5c",
    mark: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
        <path d="M24 8a16 16 0 1 1-11.3 4.7" stroke="#ff6a5c" strokeWidth="4" strokeLinecap="round" />
        <path d="M12 6l1 8 8-2" stroke="#ff6a5c" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "tihiy",
    name: "ТихийДоход",
    handle: "tihiy.dohod",
    tagline: "Зарабатывай без лица",
    niches: "воронки, контент без съёмок",
    bio1: "Зарабатывай без лица 🌙",
    bio2: "Воронки, что продают, пока ты спишь",
    avatarConcept: "crescent moon over a quietly rising graph",
    accent: "#ffb224",
    mark: (
      <svg viewBox="0 0 48 48" fill="none" className="w-9 h-9">
        <path d="M30 8a14 14 0 1 0 10 22 16 16 0 0 1-10-22z" fill="#ffb224" />
        <path d="M8 38l8-6 6 4 10-12" stroke="#ffb224" strokeWidth="3" strokeLinecap="round" opacity=".5" />
      </svg>
    ),
  },
];

const HIGHLIGHTS = ["Гайды", "Отзывы", "Как купить", "Бесплатно"];

export default function LaunchKit() {
  const [openPrompt, setOpenPrompt] = useState<string | null>("content");
  const [brandId, setBrandId] = useState<string>(BRANDS[0].id);
  const [codeword, setCodeword] = useState("ГАЙД");
  const [customHandle, setCustomHandle] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const brand = useMemo(() => BRANDS.find((b) => b.id === brandId) ?? BRANDS[0], [brandId]);
  const handle = customHandle.trim().replace(/^@/, "") || brand.handle;
  const kw = codeword.trim().toUpperCase() || "ГАЙД";

  const bio = useMemo(
    () => [brand.bio1, brand.bio2, `Пиши «${kw}» в Директ — пришлю гайд 📄`, `⬇ @${handle}`].join("\n"),
    [brand, kw, handle],
  );

  const avatarPrompt = useMemo(
    () =>
      `Minimal flat vector illustration, ${brand.avatarConcept},\ndeep navy background #0F1522, ${brand.accent} accent, geometric shapes,\nclean modern style, high contrast, no text, centered composition,\nsuitable for a small circular avatar crop --ar 1:1 --style raw`,
    [brand],
  );

  const firstReel = useMemo(
    () =>
      `Хук на видео: «Я собрал(а) гайд, который заменяет месяц поисков — и отдаю его за кодовое слово»\n` +
      `В описании: «Пиши «${kw}» в комментариях — пришлю в Директ 📄»\n` +
      `В шапке профиля: ссылка на бота @${handle}`,
    [kw, handle],
  );

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
                      onClick={() => setOpenPrompt(isOpen ? null : p.id)}
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

            {/* brand picker */}
            <div className="panel p-4 flex flex-wrap gap-2">
              {BRANDS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBrandId(b.id)}
                  className={`font-mono text-[11px] px-3 py-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                    b.id === brandId
                      ? "text-ink font-bold border-transparent shadow-[0_4px_18px_-4px_var(--color-amber)]"
                      : "border-line text-mute hover:border-line2 hover:text-fog hover:-translate-y-0.5"
                  }`}
                  style={b.id === brandId ? { background: b.accent } : undefined}
                >
                  {b.name}
                </button>
              ))}
            </div>

            {/* profile mock */}
            <div key={brand.id} className="anim-in panel overflow-hidden">
              <div className="h-16 relative" style={{ background: `linear-gradient(120deg, ${brand.accent}22, transparent 60%)` }}>
                <div className="absolute inset-x-0 bottom-0 h-px bg-line" />
              </div>
              <div className="px-5 pb-5">
                <div className="flex items-end gap-4 -mt-9">
                  <div
                    className="w-[74px] h-[74px] rounded-full flex items-center justify-center border-4 border-ink shrink-0 transition-transform duration-300 hover:rotate-6"
                    style={{ background: "radial-gradient(circle at 30% 30%, #1d2739, #0f1522)", boxShadow: `0 0 0 2px ${brand.accent}66` }}
                  >
                    {brand.mark}
                  </div>
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-[14px] truncate">@{handle}</span>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: brand.accent }} />
                    </div>
                    <div className="font-mono text-[10px] text-dim mt-0.5 truncate">{brand.tagline}</div>
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
                  <span className="flex-1 text-center font-display font-bold text-[11.5px] rounded-lg bg-sky/15 text-sky border border-sky/30 py-2">
                    Подписаться
                  </span>
                  <span className="flex-1 text-center font-display font-bold text-[11.5px] rounded-lg bg-line/50 text-fog py-2">
                    Написать
                  </span>
                </div>

                <div className="flex gap-4 mt-5">
                  {HIGHLIGHTS.map((h) => (
                    <div key={h} className="flex flex-col items-center gap-1.5">
                      <span
                        className="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-transform duration-300 hover:scale-110"
                        style={{ borderColor: `${brand.accent}66` }}
                      >
                        <IconSpark size={14} className="text-mute" />
                      </span>
                      <span className="font-mono text-[8.5px] text-dim">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* inputs + copyables */}
            <div className="panel p-4 flex flex-col gap-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9.5px] tracking-[0.15em] text-dim uppercase">Кодовое слово</span>
                  <input
                    value={codeword}
                    onChange={(e) => setCodeword(e.target.value)}
                    maxLength={14}
                    className="rounded-lg bg-ink border border-line px-3 py-2.5 font-mono text-[12.5px] text-amber tracking-[0.15em] outline-none focus:border-amber/60 transition-colors"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9.5px] tracking-[0.15em] text-dim uppercase">Твой ник (необязательно)</span>
                  <input
                    value={customHandle}
                    onChange={(e) => setCustomHandle(e.target.value)}
                    placeholder={`@${brand.handle}`}
                    maxLength={24}
                    className="rounded-lg bg-ink border border-line px-3 py-2.5 font-mono text-[12.5px] text-fog outline-none focus:border-amber/60 transition-colors placeholder:text-dim"
                  />
                </label>
              </div>

              <div className="font-mono text-[9.5px] text-dim leading-relaxed">
                {brand.name} · {brand.niches}
              </div>

              {[
                { key: "bio", label: "Био для Instagram", text: bio },
                { key: "avatar", label: "Промпт для аватара", text: avatarPrompt },
                { key: "reel", label: "Сценарий первого рилса", text: firstReel },
              ].map((c) => (
                <button
                  key={c.key}
                  onClick={() => copy(c.text, c.key)}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-line bg-ink px-4 py-3 text-left transition-all duration-200 hover:border-amber/40 hover:translate-x-1 cursor-pointer"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    {c.key === "bio" ? (
                      <IconInstagram size={15} className="text-coral shrink-0" />
                    ) : c.key === "avatar" ? (
                      <IconSpark size={15} className="text-amber shrink-0" />
                    ) : (
                      <IconTelegram size={15} className="text-sky shrink-0" />
                    )}
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
              Порядок: аватар → био → 3 хайлайтса → первый рилс с кодовым словом → ссылка на бота в шапке.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
