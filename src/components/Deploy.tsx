import { useRef, useState } from "react";
import { IconArrow, IconCheck, IconClock, IconCopy, IconGlobe } from "./icons";

const PLATFORMS = [
  {
    id: "netlify",
    name: "Netlify Drop",
    badge: "самый быстрый",
    accent: "#3fd68f",
    time: "2 минуты",
    cost: "0 ₽",
    level: "перетащить папку",
    url: "app.netlify.com/drop",
    steps: [
      "Найди папку dist (внутри index.html и assets). Если её нет — собери: npm install, затем npm run build.",
      "Открой app.netlify.com/drop в браузере.",
      "Перетащи именно папку dist (не корень проекта!) прямо в окно браузера — сайт опубликуется мгновенно.",
      "Зарегистрируйся (иначе сайт живёт ~1 час): войди через GitHub или почту и «прикрепи» сайт к аккаунту.",
      "Готово: ссылка вида nisheved.netlify.app — её уже можно ставить в био @nisheved.",
    ],
  },
  {
    id: "vercel",
    name: "Vercel + GitHub",
    badge: "без консоли",
    accent: "#e9eef6",
    time: "10 минут",
    cost: "0 ₽",
    level: "авто-сборка в облаке",
    url: "vercel.com",
    steps: [
      "Выгрузи проект в репозиторий на GitHub (кнопка «Sync / Push to GitHub» в интерфейсе или вручную).",
      "Зайди на vercel.com → «Add New → Project» → выбери репозиторий.",
      "Vercel сам определит Vite: команда сборки npm run build, результат — папка dist. Ничего менять не нужно.",
      "Жми Deploy: через минуту сайт живёт по адресу nisheved.vercel.app.",
      "Каждый следующий push в GitHub будет обновлять сайт автоматически.",
    ],
  },
  {
    id: "cfpages",
    name: "Cloudflare Pages",
    badge: "самый быстрый CDN",
    accent: "#ffb224",
    time: "10 минут",
    cost: "0 ₽",
    level: "авто-сборка в облаке",
    url: "pages.cloudflare.com",
    steps: [
      "Выгрузи проект в GitHub-репозиторий.",
      "pages.cloudflare.com → «Create a project» → подключи GitHub и выбери репозиторий.",
      "Framework preset: Vite. Build command: npm run build. Output: dist.",
      "Deploy — сайт на nisheved.pages.dev с бесплатным SSL и глобальным CDN.",
    ],
  },
  {
    id: "ghpages",
    name: "GitHub Pages",
    badge: "всё в одном месте",
    accent: "#58b7ff",
    time: "15 минут",
    cost: "0 ₽",
    level: "нужна пара команд",
    url: "github.com",
    steps: [
      "Собери локально: npm install && npm run build.",
      "Установи пакет для публикации: npm install -D gh-pages.",
      "В package.json добавь \"homepage\": \"https://ТВОЙ-НИК.github.io/НИШЕВЕД\" и скрипт \"deploy\": \"gh-pages -d dist\".",
      "Выполни npm run deploy — папка dist уедет в ветку gh-pages.",
      "В настройках репозитория: Settings → Pages → branch: gh-pages. Сайт на ТВОЙ-НИК.github.io/НИШЕВЕД.",
    ],
  },
];

const CMDS = [
  { cmd: "npm install", note: "один раз — ставит зависимости" },
  { cmd: "npm run build", note: "собирает сайт в папку dist" },
];

export default function Deploy() {
  const [platform, setPlatform] = useState(PLATFORMS[0].id);
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const p = PLATFORMS.find((x) => x.id === platform) ?? PLATFORMS[0];

  const copy = (text: string, key: string) => {
    if (timer.current) clearTimeout(timer.current);
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).catch(() => {});
    setCopied(key);
    timer.current = setTimeout(() => setCopied(null), 1600);
  };

  return (
    <section id="deploy" className="relative scroll-mt-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute top-10 right-[12%] w-[400px] h-[400px] rounded-full bg-sky/8 blur-[110px]" />
        <div className="absolute bottom-0 left-[8%] w-[360px] h-[360px] rounded-full bg-mint/8 blur-[110px]" />
      </div>

      <div className="reveal relative max-w-7xl mx-auto px-5 sm:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-sky text-[11px] tracking-[0.22em] uppercase">08 · хостинг</span>
              <span className="h-px w-10 bg-sky/50" />
            </div>
            <h2 className="font-display font-extrabold text-[clamp(1.7rem,3.6vw,2.9rem)] leading-[1.08] tracking-tight max-w-xl">
              Выгрузить и разместить — <span className="text-amber">10 минут, 0 ₽</span>
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-mute max-w-xl">
              Проект — это обычный сайт: собирается в папку <span className="font-mono text-fog">dist</span> и живёт на
              любом бесплатном хостинге. Ссылку потом ставишь в био <span className="text-fog">@nisheved</span>.
            </p>
          </div>
          <div className="flex gap-8 shrink-0">
            <div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-amber tabular-nums">0 ₽</div>
              <div className="font-mono text-[10px] text-dim mt-0.5">хостинг</div>
            </div>
            <div>
              <div className="font-display font-extrabold text-2xl sm:text-3xl text-amber tabular-nums">HTTPS</div>
              <div className="font-mono text-[10px] text-dim mt-0.5">бесплатно</div>
            </div>
          </div>
        </div>

        {/* аварийный блок: сайт не открывается */}
        <div className="mb-8 rounded-2xl border-2 border-coral/50 bg-coral/6 p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-coral via-amber to-coral" />
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-[38%] shrink-0">
              <div className="font-mono text-[10px] tracking-[0.2em] text-coral mb-2">САЙТ ПУСТОЙ ИЛИ НЕ ОТКРЫВАЕТСЯ?</div>
              <h3 className="font-display font-extrabold text-[16px] leading-snug">
                9 из 10 раз причина одна: на Netlify Drop уехала <span className="text-coral">не та папка</span>
              </h3>
              <p className="font-mono text-[10.5px] text-mute leading-relaxed mt-3">
                Исходники проекта — это «рецепт», а не «блюдо». Netlify умеет раздавать только готовый сайт. Если
                перетащить корень проекта (где лежат src и package.json), страница будет пустой.
              </p>
              <div className="mt-4 rounded-xl border border-line bg-ink p-3.5 font-mono text-[10px] leading-relaxed">
                <div className="text-mint mb-1">✓ правильная папка dist выглядит так:</div>
                <div className="text-fog/80">dist/index.html</div>
                <div className="text-fog/80">dist/assets/index-….js</div>
                <div className="text-fog/80">dist/assets/index-….css</div>
                <div className="text-coral mt-2">✗ если внутри src/, package.json, node_modules — это не она</div>
              </div>
            </div>
            <div className="flex-1 grid sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-line bg-ink p-4 flex flex-col">
                <div className="font-mono text-[9.5px] tracking-[0.15em] text-mint mb-2">СПОСОБ 1 · 2 МИНУТЫ</div>
                <div className="font-display font-bold text-[12.5px] mb-2">Перетащить папку dist</div>
                <p className="font-mono text-[10px] text-mute leading-relaxed">
                  В скачанном и распакованном проекте найди папку <span className="text-fog">dist</span> — готовый сайт
                  уже собран. Удали старый деплой на Netlify и перетащи заново именно её.
                </p>
                <div className="mt-auto pt-3 font-mono text-[9px] text-dim">подходит, если dist есть в выгрузке</div>
              </div>
              <div className="rounded-xl border border-line bg-ink p-4 flex flex-col">
                <div className="font-mono text-[9.5px] tracking-[0.15em] text-sky mb-2">СПОСОБ 2 · БЕЗ NODE.JS</div>
                <div className="font-display font-bold text-[12.5px] mb-2">Netlify соберёт сам из GitHub</div>
                <p className="font-mono text-[10px] text-mute leading-relaxed">
                  Выгрузи проект в GitHub → на Netlify: «Add new site → Import from Git» → выбери репозиторий →
                  Build command: <span className="text-fog">npm run build</span>, Publish directory:{" "}
                  <span className="text-fog">dist</span>. Node на компьютере не нужен — сборка идёт на сервере Netlify.
                </p>
                <div className="mt-auto pt-3 font-mono text-[9px] text-dim">лучший вариант, если dist нет в выгрузке</div>
              </div>
              <div className="rounded-xl border border-line bg-ink p-4 flex flex-col">
                <div className="font-mono text-[9.5px] tracking-[0.15em] text-amber mb-2">СПОСОБ 3 · 10 МИНУТ</div>
                <div className="font-display font-bold text-[12.5px] mb-2">Поставить Node.js</div>
                <p className="font-mono text-[10px] text-mute leading-relaxed">
                  nodejs.org → версия LTS → «Далее-Далее-Готово». Потом в папке проекта:{" "}
                  <span className="text-fog">npm install</span>, затем <span className="text-fog">npm run build</span> —
                  появится dist, и способ 1 сработает.
                </p>
                <div className="mt-auto pt-3 font-mono text-[9px] text-dim">пригодится и для будущих правок</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* левая колонка: шаги 1–2 */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* шаг 1 */}
            <div className="panel p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-display font-extrabold text-amber text-xl leading-none">1</span>
                <h3 className="font-display font-bold text-[14px]">Забрать файлы проекта</h3>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl border border-line bg-ink p-4">
                  <div className="font-mono text-[10px] text-mint tracking-wide mb-1.5">ВАРИАНТ A · ПРОЩЕ</div>
                  <p className="text-[12.5px] leading-relaxed text-fog/90">
                    Скачай проект архивом из интерфейса, в котором мы работали (кнопка Download / Export), и распакуй в
                    папку на компьютере.
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-ink p-4">
                  <div className="font-mono text-[10px] text-sky tracking-wide mb-1.5">ВАРИАНТ B · НАВЫРОСТ</div>
                  <p className="text-[12.5px] leading-relaxed text-fog/90">
                    Отправь проект в репозиторий GitHub (Sync / Push из интерфейса или git push вручную). Тогда Vercel и
                    Cloudflare будут собирать и обновлять сайт сами при каждом изменении.
                  </p>
                </div>
              </div>
            </div>

            {/* команды */}
            <div className="panel overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-line">
                <span className="font-mono text-[10.5px] tracking-[0.18em] text-dim uppercase">Терминал · только для Netlify Drop и GitHub Pages</span>
                <span className="flex gap-1.5" aria-hidden>
                  <span className="w-2.5 h-2.5 rounded-full bg-coral/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-mint/70" />
                </span>
              </div>
              <div className="p-5 space-y-3 font-mono text-[12px]" style={{ background: "#0a0f1a" }}>
                {CMDS.map((c) => (
                  <div key={c.cmd} className="group flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-mint select-none">$ </span>
                      <span className="text-fog/90">{c.cmd}</span>
                      <div className="text-[10px] text-dim mt-0.5">— {c.note}</div>
                    </div>
                    <button
                      onClick={() => copy(c.cmd, c.cmd)}
                      className="shrink-0 inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-md border border-line text-mute hover:border-mint/50 hover:text-mint transition-all duration-200 cursor-pointer"
                    >
                      {copied === c.cmd ? <IconCheck size={11} className="text-mint" /> : <IconCopy size={11} />}
                      {copied === c.cmd ? "✓" : "копировать"}
                    </button>
                  </div>
                ))}
                <p className="text-[10px] text-dim leading-relaxed pt-2 border-t border-line/50">
                  Нужен Node.js 18+ (nodejs.org, ставится за 3 минуты). Vercel и Cloudflare делают это в облаке —
                  команды не нужны.
                </p>
              </div>
            </div>
          </div>

          {/* правая колонка: площадки */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="font-display font-extrabold text-amber text-xl leading-none">2</span>
              <h3 className="font-display font-bold text-[14px]">Выбрать площадку</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-2.5">
              {PLATFORMS.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => setPlatform(pl.id)}
                  className={`text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer ${
                    pl.id === platform
                      ? "border-amber/60 bg-amber/8 shadow-[0_8px_28px_-12px_var(--color-amber)]"
                      : "border-line bg-ink hover:border-line2 hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`font-display font-bold text-[13px] ${pl.id === platform ? "text-fog" : "text-fog/85"}`}>{pl.name}</span>
                    <span className="font-mono text-[8.5px] px-2 py-0.5 rounded-full border" style={{ color: pl.accent, borderColor: `${pl.accent}55` }}>
                      {pl.badge}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[9.5px] text-dim">
                    <span className="inline-flex items-center gap-1"><IconClock size={10} /> {pl.time}</span>
                    <span>{pl.cost}</span>
                    <span>{pl.level}</span>
                  </div>
                </button>
              ))}
            </div>

            <div key={p.id} className="anim-in panel p-5 sm:p-6 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2.5">
                  <IconGlobe size={16} style={{ color: p.accent }} />
                  <span className="font-display font-bold text-[14.5px]">{p.name}</span>
                </div>
                <button
                  onClick={() => copy(`https://${p.url}`, p.url)}
                  className="inline-flex items-center gap-1.5 font-mono text-[10.5px] px-3 py-1.5 rounded-lg border border-line text-mute hover:border-amber/50 hover:text-amber transition-all duration-200 cursor-pointer"
                >
                  {copied === p.url ? <IconCheck size={12} className="text-mint" /> : <IconCopy size={12} />}
                  {copied === p.url ? "скопировано" : p.url}
                </button>
              </div>
              <ol className="space-y-3.5">
                {p.steps.map((s, i) => (
                  <li key={i} className="flex gap-3.5">
                    <span
                      className="flex items-center justify-center w-6 h-6 rounded-full font-mono text-[10.5px] font-bold shrink-0 mt-0.5"
                      style={{ background: `${p.accent}1a`, color: p.accent, border: `1px solid ${p.accent}44` }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-[12.5px] leading-relaxed text-fog/85">{s}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* домен */}
            <div className="rounded-xl border border-dashed border-amber/40 bg-amber/5 p-5">
              <div className="font-mono text-[9.5px] tracking-[0.2em] text-amber mb-2">СВОЙ ДОМЕН — ПО ЖЕЛАНИЮ</div>
              <p className="text-[12.5px] leading-relaxed text-fog/85">
                Для солидности купи домен <span className="font-mono text-amber">nisheved.ru</span> (reg.ru / nic.ru,
                ~200–900 ₽/год) и привяжи его в настройках площадки — SSL дастся бесплатно. Ссылка в био{" "}
                <span className="text-fog">@nisheved</span> станет короче и вызовет больше доверия, чем{" "}
                <span className="font-mono text-dim">.netlify.app</span>. На старте это не обязательно — бесплатного
                поддомена хватит.
              </p>
            </div>
          </div>
        </div>

        <div className="reveal mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 rounded-2xl border border-line bg-ink2/70 px-5 sm:px-7 py-5">
          <IconArrow size={18} className="text-amber shrink-0 rotate-90 sm:rotate-0" />
          <p className="font-mono text-[11.5px] text-mute leading-relaxed">
            Итог: сайт <span className="text-fog">nisheved.netlify.app</span> → ссылка в био{" "}
            <span className="text-amber">@nisheved</span> → рилсы ведут в профиль → бот{" "}
            <span className="text-sky">@nisheved_bot</span> принимает оплату и отдаёт PDF. Круг замкнулся.
          </p>
        </div>
      </div>
    </section>
  );
}
