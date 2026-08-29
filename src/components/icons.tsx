import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (p: P) => {
  const { size = 20, ...rest } = p;
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };
};

export const IconFunnel = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 5h16l-6 7.2V18l-4 2.4v-8.2L4 5z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconReel = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M4 9h16M9 4l3 5M15 4l3 5" />
    <path d="M10.5 12.5l4 2.7-4 2.7v-5.4z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconComment = (p: P) => (
  <svg {...base(p)}>
    <path d="M21 12a8 8 0 0 1-11.6 7.2L4 21l1.8-5.4A8 8 0 1 1 21 12z" />
    <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth="2.4" />
  </svg>
);

export const IconDm = (p: P) => (
  <svg {...base(p)}>
    <path d="M21 4L3 11.2l6.6 2.4L12 20.4l3.4-5.2L21 4z" />
    <path d="M9.6 13.6L21 4" />
  </svg>
);

export const IconBot = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="8" width="14" height="11" rx="3" />
    <path d="M12 8V4.5M9 4.5h6" />
    <path d="M9.5 13h.01M14.5 13h.01" strokeWidth="2.6" />
    <path d="M9.5 16.2c.7.5 4.3.5 5 0" />
  </svg>
);

export const IconDoc = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 3h7l4 4v14H7V3z" />
    <path d="M14 3v4h4M9.5 12h6M9.5 15.5h6M9.5 8.5h2.5" />
  </svg>
);

export const IconRuble = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 20V4h5.5a3.75 3.75 0 0 1 0 7.5H9M7 15h7" />
  </svg>
);

export const IconEye = (p: P) => (
  <svg {...base(p)}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconTarget = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const IconFlame = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3s5 4.2 5 9a5 5 0 0 1-10 0c0-2 .8-3.6 1.8-5 .4 1.2 1 2 2.2 2.4C10.6 7.6 11 5 12 3z" />
  </svg>
);

export const IconClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 12.5l5 5L19.5 7" />
  </svg>
);

export const IconCross = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconArrow = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
);

export const IconSort = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 5v14M7 19l-3-3M7 19l3-3M17 19V5M17 5l-3 3M17 5l3 3" />
  </svg>
);

export const IconSpark = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3z" fill="currentColor" stroke="none" />
    <path d="M18.5 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" fill="currentColor" stroke="none" opacity=".6" />
  </svg>
);

export const IconWarn = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4L2.8 19.5h18.4L12 4z" />
    <path d="M12 10v4M12 17h.01" strokeWidth="2.4" />
  </svg>
);

export const IconTelegram = (p: P) => (
  <svg {...base(p)}>
    <path d="M21 4.5L3.4 11.3l5.2 1.9L10.5 19l3-3.6 4.6 3.4L21 4.5z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconInstagram = (p: P) => (
  <svg {...base(p)}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="16.6" cy="7.4" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconCopy = (p: P) => (
  <svg {...base(p)}>
    <rect x="9" y="9" width="11" height="11" rx="2.5" />
    <path d="M6 15H5.5A2.5 2.5 0 0 1 3 12.5v-7A2.5 2.5 0 0 1 5.5 3h7A2.5 2.5 0 0 1 15 5.5V6" />
  </svg>
);
