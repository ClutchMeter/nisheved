import { useEffect, useRef, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

export function useRevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export function useCountUp(target: number, duration = 1200): [React.RefObject<HTMLSpanElement>, string] {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return [ref, value.toLocaleString("ru-RU")];
}

export function useScramble(text: string, delay = 0): string {
  const [out, setOut] = useState(text);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) {
      setOut(text);
      return;
    }
    const glyphs = "АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ#@$%&*";
    let frame = 0;
    let raf = 0;
    let started = false;
    const timeout = setTimeout(() => {
      started = true;
      const step = () => {
        frame++;
        const progress = frame / 26;
        const revealed = Math.floor(text.length * progress);
        let s = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === " " || ch === "\n") {
            s += ch;
          } else if (i < revealed) {
            s += ch;
          } else {
            s += glyphs[Math.floor(Math.random() * glyphs.length)];
          }
        }
        setOut(s);
        if (progress < 1) raf = requestAnimationFrame(step);
        else setOut(text);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (started) cancelAnimationFrame(raf);
    };
  }, [text, delay, reduced]);

  return out;
}
