import type { Niche } from "../data/niches";
import { chapterWords, fullChapters } from "../data/content";
import type { Block, Chapter } from "../data/content";

/* ------------------------------------------------------------------ */
/*  Рукописный PDF-writer: без библиотек генерирует настоящий          */
/*  многостраничный A4-файл. Кириллица — через Type1-шрифт Helvetica   */
/*  с кастомной кодировкой (afii-имена глифов в Differences).          */
/* ------------------------------------------------------------------ */

const CYR: [string, string][] = [
  ["А", "afii10017"], ["Б", "afii10018"], ["В", "afii10019"], ["Г", "afii10020"], ["Д", "afii10021"],
  ["Е", "afii10022"], ["Ж", "afii10024"], ["З", "afii10025"], ["И", "afii10026"], ["Й", "afii10027"],
  ["К", "afii10028"], ["Л", "afii10029"], ["М", "afii10030"], ["Н", "afii10031"], ["О", "afii10032"],
  ["П", "afii10033"], ["Р", "afii10034"], ["С", "afii10035"], ["Т", "afii10036"], ["У", "afii10037"],
  ["Ф", "afii10038"], ["Х", "afii10039"], ["Ц", "afii10040"], ["Ч", "afii10041"], ["Ш", "afii10042"],
  ["Щ", "afii10043"], ["Ъ", "afii10044"], ["Ы", "afii10045"], ["Ь", "afii10046"], ["Э", "afii10047"],
  ["Ю", "afii10048"], ["Я", "afii10049"], ["Ё", "afii10023"],
  ["а", "afii10065"], ["б", "afii10066"], ["в", "afii10067"], ["г", "afii10068"], ["д", "afii10069"],
  ["е", "afii10070"], ["ж", "afii10072"], ["з", "afii10073"], ["и", "afii10074"], ["й", "afii10075"],
  ["к", "afii10076"], ["л", "afii10077"], ["м", "afii10078"], ["н", "afii10079"], ["о", "afii10080"],
  ["п", "afii10081"], ["р", "afii10082"], ["с", "afii10083"], ["т", "afii10084"], ["у", "afii10085"],
  ["ф", "afii10086"], ["х", "afii10087"], ["ц", "afii10088"], ["ч", "afii10089"], ["ш", "afii10090"],
  ["щ", "afii10091"], ["ъ", "afii10092"], ["ы", "afii10093"], ["ь", "afii10094"], ["э", "afii10095"],
  ["ю", "afii10096"], ["я", "afii10097"], ["ё", "afii10071"],
  ["«", "guillemotleft"], ["»", "guillemotright"], ["„", "quotedblbase"], ["“", "quotedblleft"],
  ["—", "emdash"], ["–", "endash"], ["…", "ellipsis"], ["№", "afii61352"], ["·", "periodcentered"],
  ["°", "degree"], ["•", "bullet"],
];

const CHAR_CODE = new Map<string, number>();
CYR.forEach(([ch], i) => CHAR_CODE.set(ch, 128 + i));
const DIFFS = `[128 ${CYR.map(([, g]) => `/${g}`).join(" ")}]`;

function encodeText(s: string): string {
  const out: number[] = [];
  const src = s.replace(/₽/g, "руб.");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (ch === "\\") { out.push(92, 92); continue; }
    if (ch === "(") { out.push(92, 40); continue; }
    if (ch === ")") { out.push(92, 41); continue; }
    const mapped = CHAR_CODE.get(ch);
    if (mapped !== undefined) { out.push(mapped); continue; }
    const code = src.charCodeAt(i);
    if (code >= 32 && code <= 126) out.push(code);
    else out.push(63);
  }
  let r = "";
  for (const b of out) r += String.fromCharCode(b);
  return r;
}

const strBytes = (s: string): number[] => {
  const a: number[] = new Array(s.length);
  for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i) & 0xff;
  return a;
};

/* ------------------------- геометрия ------------------------------ */

const W = 595.28;
const H = 841.89;
const M = 58;
const CW = W - M * 2;
const BOTTOM = 92;

const INK: [number, number, number] = [0.1, 0.12, 0.17];
const GRAY: [number, number, number] = [0.34, 0.38, 0.45];
const LGRAY: [number, number, number] = [0.55, 0.59, 0.65];
const AMBER: [number, number, number] = [0.86, 0.58, 0.05];
const MINT: [number, number, number] = [0.11, 0.62, 0.44];
const CORAL: [number, number, number] = [0.85, 0.3, 0.25];

interface Doc {
  pages: { ops: string[] }[];
  cur: string[];
  y: number;
}

const rgb = (c: [number, number, number]) => `${c[0]} ${c[1]} ${c[2]}`;

function wrap(text: string, size: number, maxW = CW, factor = 0.52): string[] {
  const maxChars = Math.max(20, Math.floor(maxW / (size * factor)));
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (let w of words) {
    while (w.length > maxChars) {
      if (line) { lines.push(line); line = ""; }
      lines.push(w.slice(0, maxChars));
      w = w.slice(maxChars);
    }
    if ((line + " " + w).trim().length > maxChars) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = (line ? line + " " : "") + w;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

/* ------------------------- примитивы ------------------------------ */

function text(doc: Doc, x: number, y: number, font: "F1" | "F2", size: number, s: string, color: [number, number, number] = INK) {
  doc.cur.push(`${rgb(color)} rg`, `BT /${font} ${size} Tf 1 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)} Tm (${encodeText(s)}) Tj ET`);
}

function rectFill(doc: Doc, x: number, y: number, w: number, h: number, color: [number, number, number]) {
  doc.cur.push(`${rgb(color)} rg`, `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)} re f`);
}

function line(doc: Doc, x1: number, y1: number, x2: number, y2: number, color: [number, number, number], width = 0.8) {
  doc.cur.push(`${rgb(color)} RG`, `${width} w`, `${x1.toFixed(1)} ${y1.toFixed(1)} m ${x2.toFixed(1)} ${y2.toFixed(1)} l S`);
}

function newPage(doc: Doc) {
  doc.pages.push({ ops: [] });
  doc.cur = doc.pages[doc.pages.length - 1].ops;
  doc.y = H - 70;
}

function ensure(doc: Doc, h: number) {
  if (doc.y - h < BOTTOM) newPage(doc);
}

/* ------------------------- блоки ---------------------------------- */

function drawParagraph(doc: Doc, textStr: string, size: number, lead: number, color: [number, number, number], font: "F1" | "F2" = "F1") {
  const lines = wrap(textStr, size);
  ensure(doc, lines.length * lead + 4);
  for (const ln of lines) {
    text(doc, M, doc.y, font, size, ln, color);
    doc.y -= lead;
  }
}

function drawHeading(doc: Doc, s: string) {
  ensure(doc, 46);
  doc.y -= 8;
  rectFill(doc, M, doc.y - 3, 3, 14, AMBER);
  text(doc, M + 12, doc.y, "F2", 13, s, INK);
  doc.y -= 26;
}

function drawList(doc: Doc, items: string[], numbered: boolean) {
  items.forEach((item, i) => {
    const size = 10.5;
    const lead = 14.5;
    const indent = numbered ? 22 : 16;
    const lines = wrap(item, size, CW - indent);
    ensure(doc, lines.length * lead + 3);
    if (numbered) {
      text(doc, M, doc.y, "F2", size, `${i + 1}.`, AMBER);
    } else {
      text(doc, M + 1, doc.y, "F1", size, "•", AMBER);
    }
    lines.forEach((ln, k) => {
      if (k > 0) ensure(doc, lead + 3);
      text(doc, M + indent, doc.y, "F1", size, ln, GRAY);
      doc.y -= lead;
    });
    doc.y -= 3;
  });
}

function drawCallout(doc: Doc, label: string, body: string, bar: [number, number, number], tint: [number, number, number]) {
  const size = 10;
  const lead = 13.5;
  const lines = wrap(body, size, CW - 34);
  const h = lines.length * lead + 34;
  ensure(doc, h + 8);
  rectFill(doc, M, doc.y - h + 16, CW, h, tint);
  rectFill(doc, M, doc.y - h + 16, 3.5, h, bar);
  text(doc, M + 16, doc.y, "F2", 7.5, label, bar);
  doc.y -= 16;
  for (const ln of lines) {
    text(doc, M + 16, doc.y, "F1", size, ln, INK);
    doc.y -= lead;
  }
  doc.y -= 10;
}

function drawQuote(doc: Doc, s: string) {
  const lines = wrap(s, 11, CW - 26);
  ensure(doc, lines.length * 15 + 10);
  rectFill(doc, M, doc.y - (lines.length - 1) * 15 - 4, 2.5, lines.length * 15 + 8, [0.78, 0.8, 0.84]);
  for (const ln of lines) {
    text(doc, M + 16, doc.y, "F2", 11, ln, GRAY);
    doc.y -= 15;
  }
  doc.y -= 8;
}

function drawTable(doc: Doc, head: [string, string], rows: [string, string][]) {
  const c1 = 170;
  const c2 = CW - c1;
  const size = 9.3;
  const lead = 12;
  ensure(doc, 60);

  // шапка
  rectFill(doc, M, doc.y - 18, CW, 22, [0.99, 0.9, 0.63]);
  text(doc, M + 8, doc.y - 11, "F2", size, head[0], INK);
  text(doc, M + c1 + 8, doc.y - 11, "F2", size, head[1], INK);
  doc.y -= 18;

  rows.forEach((row, ri) => {
    const l1 = wrap(row[0], size, c1 - 16);
    const l2 = wrap(row[1], size, c2 - 16);
    const rh = Math.max(l1.length, l2.length) * lead + 9;
    ensure(doc, rh + 2);
    if (ri % 2 === 1) rectFill(doc, M, doc.y - rh + 12, CW, rh, [0.965, 0.97, 0.98]);
    line(doc, M, doc.y + 12, W - M, doc.y + 12, [0.88, 0.9, 0.92], 0.5);
    l1.forEach((ln, k) => text(doc, M + 8, doc.y - k * lead, "F2", size, ln, INK));
    l2.forEach((ln, k) => text(doc, M + c1 + 8, doc.y - k * lead, "F1", size, ln, GRAY));
    doc.y -= rh;
  });
  line(doc, M, doc.y + 12, W - M, doc.y + 12, [0.88, 0.9, 0.92], 0.5);
  doc.y -= 14;
}

function drawBlock(doc: Doc, b: Block) {
  switch (b.kind) {
    case "lead":
      drawParagraph(doc, b.text ?? "", 11.5, 16.5, INK);
      doc.y -= 4;
      break;
    case "p":
      drawParagraph(doc, b.text ?? "", 10.5, 15, GRAY);
      doc.y -= 4;
      break;
    case "h":
      drawHeading(doc, b.text ?? "");
      break;
    case "list":
      drawList(doc, b.items ?? [], false);
      break;
    case "num":
      drawList(doc, b.items ?? [], true);
      break;
    case "tip":
      drawCallout(doc, "СОВЕТ", b.text ?? "", MINT, [0.94, 0.98, 0.95]);
      break;
    case "warn":
      drawCallout(doc, "НЮАНС НИШИ", b.text ?? "", CORAL, [0.99, 0.95, 0.94]);
      break;
    case "quote":
      drawQuote(doc, b.text ?? "");
      break;
    case "table":
      if (b.head && b.rows) drawTable(doc, b.head, b.rows);
      break;
  }
}

/* ------------------------- титул и главы -------------------------- */

function titlePage(doc: Doc, n: Niche, chapters: Chapter[], totalPages: number) {
  newPage(doc);
  // воронка-логотип
  rectFill(doc, M, H - 150, 66, 10, AMBER);
  rectFill(doc, M + 9, H - 136, 48, 10, [0.98, 0.78, 0.36]);
  rectFill(doc, M + 18, H - 122, 30, 10, [0.99, 0.86, 0.55]);
  rectFill(doc, M + 27, H - 108, 12, 16, AMBER);

  text(doc, M, H - 190, "F2", 10, "НИШЕВЕД · PDF-ГАЙД", AMBER);

  let ty = H - 235;
  for (const ln of wrap(n.product.name, 27, CW, 0.55)) {
    text(doc, M, ty, "F2", 27, ln, INK);
    ty -= 36;
  }

  text(doc, M, ty - 14, "F1", 12.5, `Ниша: «${n.title}»`, AMBER);
  text(doc, M, ty - 40, "F1", 10.5, `Формат: ${n.product.format} · ${n.product.volume}`, GRAY);
  text(doc, M, ty - 57, "F1", 10.5, `Для кого: ${n.audience}`, GRAY);
  text(doc, M, ty - 74, "F1", 10.5, `Кодовое слово под рилсами: «${n.keyword}» · чек ${n.price} руб.`, GRAY);

  line(doc, M, ty - 100, W - M, ty - 100, [0.85, 0.87, 0.9], 0.7);

  text(doc, M, ty - 126, "F2", 10, "ВНУТРИ", AMBER);
  chapters.forEach((c, i) => {
    const yy = ty - 148 - i * 19;
    text(doc, M, yy, "F2", 10, `${i + 1}.`, AMBER);
    text(doc, M + 20, yy, "F1", 10.5, `${c.title} — ${chapterWords(c)} слов`, GRAY);
  });

  const by = 170;
  rectFill(doc, M, by - 14, CW, 52, [0.97, 0.975, 0.985]);
  text(doc, M + 14, by + 22, "F2", 10, "КАК ПОЛЬЗОВАТЬСЯ", INK);
  text(doc, M + 14, by + 5, "F1", 9.5, "Одна глава — один день. Чек-листы и таблицы применяй сразу: знание без", GRAY);
  text(doc, M + 14, by - 8, "F1", 9.5, "действия — дорогое хобби. Справочные цифры — ориентиры, сверяй со своей нишей.", GRAY);

  text(doc, M, 108, "F1", 9, "Собрано на платформе «Нишевед» · @nisheved · доступ к библиотеке гайдов", LGRAY);
}

function chapterPages(doc: Doc, chapters: Chapter[]) {
  chapters.forEach((c, ci) => {
    newPage(doc);
    text(doc, M, doc.y + 4, "F2", 9.5, `ГЛАВА ${ci + 1} ИЗ ${chapters.length}`, AMBER);
    doc.y -= 26;
    for (const ln of wrap(c.title, 18, CW, 0.55)) {
      text(doc, M, doc.y, "F2", 18, ln, INK);
      doc.y -= 24;
    }
    line(doc, M, doc.y + 6, M + 46, doc.y + 6, AMBER, 2.4);
    doc.y -= 24;
    c.blocks.forEach((b) => drawBlock(doc, b));
  });
}

/* ------------------------- сборка файла --------------------------- */

function buildPdf(n: Niche): Uint8Array {
  const chapters = fullChapters(n);
  const doc: Doc = { pages: [], cur: [], y: 0 };

  titlePage(doc, n, chapters, chapters.length);
  chapterPages(doc, chapters);

  const fontA = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding << /Type /Encoding /Differences ${DIFFS} >> >>`;
  const fontB = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding << /Type /Encoding /Differences ${DIFFS} >> >>`;

  // порядок объектов: 1 каталог, 2 страницы, 3-4 шрифты, далее пары (контент, страница)
  const objects: (string | number[])[] = [];
  const addObj = (c: string | number[]): number => { objects.push(c); return objects.length; };

  addObj(`<< /Type /Catalog /Pages 2 0 R >>`);
  const pagesIdx = objects.length;
  objects.push(""); // placeholder
  addObj(fontA);
  addObj(fontB);

  const kids: number[] = [];
  doc.pages.forEach((pg, i) => {
    pg.ops.push(`${rgb(LGRAY)} rg`, `BT /F1 8 Tf 1 0 0 1 ${M} 56 Tm (${encodeText("Нишевед · фабрика PDF-продуктов")}) Tj ET`);
    const right = `стр. ${i + 1}`;
    const rw = right.length * 8 * 0.52;
    pg.ops.push(`BT /F1 8 Tf 1 0 0 1 ${(W - M - rw).toFixed(1)} 56 Tm (${encodeText(right)}) Tj ET`);
    pg.ops.push(`${rgb([0.85, 0.87, 0.9])} RG 0.6 w ${M} 70 m ${W - M} 70 l S`);

    const opsStr = pg.ops.join("\n");
    const contentNo = objects.length + 1;
    addObj(`<< /Length ${strBytes(opsStr).length} >>\nstream\n${opsStr}\nendstream`);
    const pageNo = addObj(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentNo} 0 R >>`,
    );
    kids.push(pageNo);
  });
  objects[pagesIdx] = `<< /Type /Pages /Kids [${kids.map((k) => `${k} 0 R`).join(" ")}] /Count ${kids.length} >>`;

  // сериализация + xref
  const out: number[] = [];
  const pushStr = (s: string) => { for (let i = 0; i < s.length; i++) out.push(s.charCodeAt(i) & 0xff); };
  const pushBytes = (a: number[]) => { for (const b of a) out.push(b & 0xff); };

  pushStr("%PDF-1.4\n");
  pushBytes([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]);

  const offsets: number[] = [0];
  objects.forEach((o, i) => {
    offsets.push(out.length);
    pushStr(`${i + 1} 0 obj\n`);
    if (typeof o === "string") pushStr(o);
    else pushBytes(o);
    pushStr("\nendobj\n");
  });

  const xrefPos = out.length;
  pushStr(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  for (let i = 1; i <= objects.length; i++) pushStr(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
  pushStr(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`);

  return new Uint8Array(out);
}

/* ------------------------- скачивание ----------------------------- */

export function downloadNichePdf(n: Niche): void {
  const bytes = buildPdf(n);
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${n.product.name.replace(/[«»"]/g, "")} — Нишевед.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function downloadNicheMd(n: Niche): void {
  const chapters = fullChapters(n);
  const parts = [
    `# ${n.product.name}`,
    ``,
    `Ниша: ${n.title} · Формат: ${n.product.format} · Чек: ${n.price} руб.`,
    `Для кого: ${n.audience} · Кодовое слово: «${n.keyword}»`,
    ``,
  ];
  chapters.forEach((c, i) => {
    parts.push(`## ГЛАВА ${i + 1}. ${c.title}`, "");
    c.blocks.forEach((b) => {
      if (b.text) parts.push(b.kind === "h" ? `### ${b.text}` : b.text, "");
      if (b.items) {
        b.items.forEach((it, k) => parts.push(b.kind === "num" ? `${k + 1}. ${it}` : `- ${it}`));
        parts.push("");
      }
      if (b.head && b.rows) {
        parts.push(`| ${b.head[0]} | ${b.head[1]} |`, "| --- | --- |");
        b.rows.forEach((r) => parts.push(`| ${r[0]} | ${r[1]} |`));
        parts.push("");
      }
    });
  });
  const blob = new Blob([parts.join("\n")], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${n.product.name.replace(/[«»"]/g, "")} — Нишевед.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export { fullChapters, chapterWords };
export type { Chapter };
