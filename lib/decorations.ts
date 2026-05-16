/**
 * Standalone graphic decorations users can drop onto any slide.
 * Each renders SVG inside a generic 200x120 viewBox; scaled by the slide
 * canvas via the UploadedImage box. Recolored from theme.
 *
 * Curated for real presentation use: charts, processes, comparisons,
 * KPI tiles, layout accents, conceptual diagrams.
 */

import type { Theme } from "./themes";

export type DecorationCategory =
  | "Charts"
  | "Process"
  | "Compare"
  | "Infographic"
  | "Layout"
  | "Concept"
  | "Icons";

export type Decoration = {
  id: string;
  name: string;
  category: DecorationCategory;
  /** Suggested width/height in slide inches when first dropped. */
  defaultW: number;
  defaultH: number;
  render: (theme: Theme) => string;
};

const VW = 200;
const VH = 120;

function svgWrap(inner: string, vw = VW, vh = VH) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vw} ${vh}" preserveAspectRatio="xMidYMid meet">${inner}</svg>`;
}

function alpha(hex: string, a: number) {
  const v = Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0");
  return `${hex}${v}`;
}

/* =========================================================================
 *                                CHARTS
 * ========================================================================= */

const donut: Decoration = {
  id: "donut", name: "Donut chart", category: "Charts",
  defaultW: 3.5, defaultH: 3.5,
  render: (t) => {
    const cx = 100, cy = 60, r = 42, rIn = 26;
    function seg(start: number, end: number, color: string) {
      const a1 = (start / 100) * Math.PI * 2 - Math.PI / 2;
      const a2 = (end / 100) * Math.PI * 2 - Math.PI / 2;
      const large = end - start > 50 ? 1 : 0;
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
      const x3 = cx + rIn * Math.cos(a2), y3 = cy + rIn * Math.sin(a2);
      const x4 = cx + rIn * Math.cos(a1), y4 = cy + rIn * Math.sin(a1);
      return `<path d="M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 ${large} 0 ${x4} ${y4} Z" fill="${color}"/>`;
    }
    return svgWrap(`
      ${seg(0, 55, t.accent)}
      ${seg(55, 85, alpha(t.muted, 0.9))}
      ${seg(85, 100, alpha(t.fg, 0.5))}
    `);
  },
};

const pieChart: Decoration = {
  id: "pie", name: "Pie chart", category: "Charts",
  defaultW: 3.5, defaultH: 3.5,
  render: (t) => {
    const cx = 100, cy = 60, r = 50;
    function seg(start: number, end: number, color: string) {
      const a1 = (start / 100) * Math.PI * 2 - Math.PI / 2;
      const a2 = (end / 100) * Math.PI * 2 - Math.PI / 2;
      const large = end - start > 50 ? 1 : 0;
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
      return `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z" fill="${color}"/>`;
    }
    return svgWrap(`
      ${seg(0, 40, t.accent)}
      ${seg(40, 70, alpha(t.muted, 0.9))}
      ${seg(70, 90, alpha(t.fg, 0.55))}
      ${seg(90, 100, alpha(t.accent, 0.4))}
    `);
  },
};

const barChart: Decoration = {
  id: "bar-chart", name: "Bar chart", category: "Charts",
  defaultW: 5, defaultH: 3,
  render: (t) => {
    const heights = [50, 75, 40, 90, 60, 80];
    const bars = heights.map((h, i) => {
      const x = 20 + i * 28;
      const y = 100 - h;
      const c = i === 3 ? t.accent : alpha(t.muted, 0.7);
      return `<rect x="${x}" y="${y}" width="20" height="${h}" fill="${c}"/>`;
    }).join("");
    return svgWrap(bars + `<line x1="14" y1="100" x2="190" y2="100" stroke="${alpha(t.fg, 0.4)}" stroke-width="1"/>`);
  },
};

const stackedBar: Decoration = {
  id: "stacked-bar", name: "Stacked bar", category: "Charts",
  defaultW: 5, defaultH: 3,
  render: (t) => {
    const cols = [
      [40, 25, 15], [55, 20, 10], [30, 35, 20], [60, 15, 25], [45, 25, 20], [50, 30, 10],
    ];
    let svg = "";
    cols.forEach((stack, i) => {
      const x = 20 + i * 28;
      let yTop = 100;
      const colors = [t.accent, alpha(t.muted, 0.85), alpha(t.fg, 0.5)];
      stack.forEach((h, j) => {
        yTop -= h;
        svg += `<rect x="${x}" y="${yTop}" width="20" height="${h}" fill="${colors[j]}"/>`;
      });
    });
    return svgWrap(svg + `<line x1="14" y1="100" x2="190" y2="100" stroke="${alpha(t.fg, 0.4)}" stroke-width="1"/>`);
  },
};

const lineChart: Decoration = {
  id: "line-chart", name: "Line chart", category: "Charts",
  defaultW: 5, defaultH: 3,
  render: (t) => {
    const points = "20,90 50,70 80,75 110,45 140,55 170,25";
    const dots = [[20,90],[50,70],[80,75],[110,45],[140,55],[170,25]];
    return svgWrap(`
      <line x1="14" y1="100" x2="190" y2="100" stroke="${alpha(t.fg, 0.3)}" stroke-width="1"/>
      <polyline points="${points}" fill="none" stroke="${t.accent}" stroke-width="3"/>
      ${dots.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${t.accent}"/>`).join("")}
    `);
  },
};

const areaChart: Decoration = {
  id: "area-chart", name: "Area chart", category: "Charts",
  defaultW: 5, defaultH: 3,
  render: (t) => {
    const a = t.accent;
    return svgWrap(`
      <line x1="14" y1="100" x2="190" y2="100" stroke="${alpha(t.fg, 0.3)}" stroke-width="1"/>
      <polygon points="20,100 20,80 50,60 80,72 110,40 140,55 170,30 190,40 190,100" fill="${alpha(a, 0.35)}"/>
      <polyline points="20,80 50,60 80,72 110,40 140,55 170,30 190,40" fill="none" stroke="${a}" stroke-width="2"/>
    `);
  },
};

const radarShape: Decoration = {
  id: "radar", name: "Radar chart", category: "Charts",
  defaultW: 4, defaultH: 4,
  render: (t) => {
    const m = alpha(t.fg, 0.3);
    return svgWrap(`
      <polygon points="100,15 167,55 145,105 55,105 33,55" fill="none" stroke="${m}" stroke-width="1"/>
      <polygon points="100,30 152,58 137,98 63,98 48,58" fill="none" stroke="${m}" stroke-width="1"/>
      <polygon points="100,45 137,62 130,90 70,90 63,62" fill="none" stroke="${m}" stroke-width="1"/>
      <polygon points="100,25 150,72 130,98 60,90 50,55" fill="${alpha(t.accent, 0.4)}" stroke="${t.accent}" stroke-width="2"/>
    `);
  },
};

const sparkline: Decoration = {
  id: "sparkline", name: "Sparkline", category: "Charts",
  defaultW: 4, defaultH: 1.4,
  render: (t) => {
    return svgWrap(`
      <polyline points="10,50 30,40 50,55 70,30 90,45 110,20 130,35 150,15 170,28 190,10"
        fill="none" stroke="${t.accent}" stroke-width="2.5"/>
    `, 200, 60);
  },
};

const progressRing: Decoration = {
  id: "progress-ring", name: "Progress ring", category: "Charts",
  defaultW: 3, defaultH: 3,
  render: (t) => {
    const c = 100, cy = 60, r = 42;
    const circ = 2 * Math.PI * r;
    const dash = circ * 0.72;
    return svgWrap(`
      <circle cx="${c}" cy="${cy}" r="${r}" fill="none" stroke="${alpha(t.muted, 0.3)}" stroke-width="10"/>
      <circle cx="${c}" cy="${cy}" r="${r}" fill="none" stroke="${t.accent}" stroke-width="10"
        stroke-dasharray="${dash} ${circ}" transform="rotate(-90 ${c} ${cy})" stroke-linecap="round"/>
      <text x="${c}" y="${cy + 6}" text-anchor="middle" font-size="22" font-weight="700" fill="${t.fg}">72%</text>
    `);
  },
};

/* =========================================================================
 *                                PROCESS
 * ========================================================================= */

const numberedSteps: Decoration = {
  id: "numbered-steps", name: "Numbered steps", category: "Process",
  defaultW: 6, defaultH: 1.6,
  render: (t) => {
    function step(x: number, n: string) {
      return `
        <circle cx="${x}" cy="40" r="18" fill="${t.accent}"/>
        <text x="${x}" y="46" font-size="16" font-weight="700" text-anchor="middle" fill="${t.bg}">${n}</text>
        <line x1="${x + 18}" y1="40" x2="${x + 42}" y2="40" stroke="${alpha(t.fg, 0.4)}" stroke-width="2"/>
      `;
    }
    return svgWrap(`
      ${step(25, "1")}
      ${step(85, "2")}
      ${step(145, "3")}
      <circle cx="180" cy="40" r="18" fill="${alpha(t.accent, 0.5)}"/>
      <text x="180" y="46" font-size="16" font-weight="700" text-anchor="middle" fill="${t.bg}">4</text>
    `, 200, 90);
  },
};

const arrowFlow: Decoration = {
  id: "arrow-flow", name: "Arrow chevrons", category: "Process",
  defaultW: 7, defaultH: 1.5,
  render: (t) => {
    const m = alpha(t.muted, 0.85);
    function chev(x: number, color: string) {
      return `<path d="M ${x} 30 L ${x + 30} 30 L ${x + 40} 50 L ${x + 30} 70 L ${x} 70 L ${x + 10} 50 Z" fill="${color}"/>`;
    }
    return svgWrap(chev(10, t.accent) + chev(55, m) + chev(100, t.accent) + chev(145, m), 200, 100);
  },
};

const timeline: Decoration = {
  id: "timeline", name: "Timeline", category: "Process",
  defaultW: 7, defaultH: 1.5,
  render: (t) => {
    return svgWrap(`
      <line x1="20" y1="60" x2="180" y2="60" stroke="${alpha(t.fg, 0.4)}" stroke-width="1"/>
      <circle cx="35"  cy="60" r="9" fill="${t.accent}"/>
      <circle cx="80"  cy="60" r="9" fill="${t.muted}"/>
      <circle cx="125" cy="60" r="9" fill="${t.accent}"/>
      <circle cx="170" cy="60" r="9" fill="${t.muted}"/>
      <text x="35"  y="85" font-size="9" text-anchor="middle" fill="${t.fg}">2022</text>
      <text x="80"  y="85" font-size="9" text-anchor="middle" fill="${t.fg}">2023</text>
      <text x="125" y="85" font-size="9" text-anchor="middle" fill="${t.fg}">2024</text>
      <text x="170" y="85" font-size="9" text-anchor="middle" fill="${t.fg}">2025</text>
    `, 200, 100);
  },
};

const verticalProcess: Decoration = {
  id: "vertical-process", name: "Vertical steps", category: "Process",
  defaultW: 3, defaultH: 4.5,
  render: (t) => {
    function row(y: number, n: string) {
      return `
        <circle cx="30" cy="${y}" r="14" fill="${t.accent}"/>
        <text x="30" y="${y + 5}" font-size="13" font-weight="700" text-anchor="middle" fill="${t.bg}">${n}</text>
        <line x1="55" y1="${y}" x2="170" y2="${y}" stroke="${alpha(t.fg, 0.18)}" stroke-width="2"/>
      `;
    }
    return svgWrap(`
      ${row(20, "1")}
      ${row(50, "2")}
      ${row(80, "3")}
      ${row(110, "4")}
      <line x1="30" y1="34" x2="30" y2="96" stroke="${alpha(t.fg, 0.2)}" stroke-width="1.5"/>
    `);
  },
};

const funnel: Decoration = {
  id: "funnel", name: "Funnel", category: "Process",
  defaultW: 4, defaultH: 3.5,
  render: (t) => {
    const a = t.accent;
    return svgWrap(`
      <polygon points="20,15 180,15 160,40 40,40" fill="${alpha(a, 0.9)}"/>
      <polygon points="42,46 158,46 140,71 60,71" fill="${alpha(a, 0.7)}"/>
      <polygon points="62,77 138,77 122,102 78,102" fill="${alpha(a, 0.5)}"/>
    `);
  },
};

/* =========================================================================
 *                                COMPARE
 * ========================================================================= */

const venn: Decoration = {
  id: "venn", name: "Venn (2-set)", category: "Compare",
  defaultW: 4, defaultH: 3,
  render: (t) => svgWrap(`
    <circle cx="80"  cy="60" r="38" fill="${alpha(t.accent, 0.7)}"/>
    <circle cx="120" cy="60" r="38" fill="${alpha(t.muted, 0.7)}"/>
  `),
};

const venn3: Decoration = {
  id: "venn-3", name: "Venn (3-set)", category: "Compare",
  defaultW: 4, defaultH: 4,
  render: (t) => svgWrap(`
    <circle cx="85"  cy="55"  r="36" fill="${alpha(t.accent, 0.65)}"/>
    <circle cx="115" cy="55"  r="36" fill="${alpha(t.muted, 0.65)}"/>
    <circle cx="100" cy="82"  r="36" fill="${alpha(t.fg, 0.55)}"/>
  `),
};

const splitColumns: Decoration = {
  id: "split-columns", name: "Two-column compare", category: "Compare",
  defaultW: 6, defaultH: 3,
  render: (t) => {
    const a = t.accent;
    const m = alpha(t.muted, 0.85);
    return svgWrap(`
      <rect x="10"  y="10" width="80" height="100" fill="${alpha(a, 0.12)}" stroke="${a}" stroke-width="1.5"/>
      <rect x="10"  y="10" width="80" height="22" fill="${a}"/>
      <text x="50" y="26" font-size="11" font-weight="700" text-anchor="middle" fill="${t.bg}">Option A</text>
      <line x1="20" y1="48" x2="80" y2="48" stroke="${alpha(t.fg, 0.3)}"/>
      <line x1="20" y1="62" x2="80" y2="62" stroke="${alpha(t.fg, 0.3)}"/>
      <line x1="20" y1="76" x2="80" y2="76" stroke="${alpha(t.fg, 0.3)}"/>

      <rect x="110" y="10" width="80" height="100" fill="${alpha(t.fg, 0.05)}" stroke="${m}" stroke-width="1.5"/>
      <rect x="110" y="10" width="80" height="22" fill="${m}"/>
      <text x="150" y="26" font-size="11" font-weight="700" text-anchor="middle" fill="${t.bg}">Option B</text>
      <line x1="120" y1="48" x2="180" y2="48" stroke="${alpha(t.fg, 0.3)}"/>
      <line x1="120" y1="62" x2="180" y2="62" stroke="${alpha(t.fg, 0.3)}"/>
      <line x1="120" y1="76" x2="180" y2="76" stroke="${alpha(t.fg, 0.3)}"/>
    `);
  },
};

const prosCons: Decoration = {
  id: "pros-cons", name: "Pros vs cons", category: "Compare",
  defaultW: 5, defaultH: 3,
  render: (t) => {
    const a = t.accent;
    const m = alpha(t.muted, 0.85);
    function check(x: number, y: number) {
      return `<path d="M ${x} ${y} l 3 3 l 6 -6" stroke="${a}" stroke-width="2" fill="none"/>`;
    }
    function cross(x: number, y: number) {
      return `<g stroke="${m}" stroke-width="2"><line x1="${x}" y1="${y - 4}" x2="${x + 8}" y2="${y + 4}"/><line x1="${x + 8}" y1="${y - 4}" x2="${x}" y2="${y + 4}"/></g>`;
    }
    return svgWrap(`
      <text x="20" y="22" font-size="12" font-weight="700" fill="${a}">Pros</text>
      ${check(20, 38)} <text x="34" y="42" font-size="9" fill="${t.fg}">Faster delivery</text>
      ${check(20, 56)} <text x="34" y="60" font-size="9" fill="${t.fg}">Lower cost</text>
      ${check(20, 74)} <text x="34" y="78" font-size="9" fill="${t.fg}">Better fit</text>
      ${check(20, 92)} <text x="34" y="96" font-size="9" fill="${t.fg}">Easier to scale</text>

      <line x1="100" y1="14" x2="100" y2="106" stroke="${alpha(t.fg, 0.2)}"/>

      <text x="115" y="22" font-size="12" font-weight="700" fill="${m}">Cons</text>
      ${cross(115, 38)} <text x="129" y="42" font-size="9" fill="${t.fg}">Higher risk</text>
      ${cross(115, 56)} <text x="129" y="60" font-size="9" fill="${t.fg}">Setup time</text>
      ${cross(115, 74)} <text x="129" y="78" font-size="9" fill="${t.fg}">Learning curve</text>
    `);
  },
};

const beforeAfter: Decoration = {
  id: "before-after", name: "Before / after", category: "Compare",
  defaultW: 6, defaultH: 2.4,
  render: (t) => {
    const a = t.accent;
    const m = alpha(t.muted, 0.85);
    return svgWrap(`
      <rect x="10"  y="20" width="80" height="80" fill="${alpha(t.fg, 0.06)}"/>
      <text x="50" y="14" font-size="9" font-weight="700" text-anchor="middle" fill="${m}">BEFORE</text>
      <text x="50" y="68" font-size="22" font-weight="700" text-anchor="middle" fill="${m}">42%</text>

      <path d="M 95 60 L 110 60 L 105 55 M 110 60 L 105 65" fill="none" stroke="${a}" stroke-width="2"/>

      <rect x="115" y="20" width="80" height="80" fill="${alpha(a, 0.15)}" stroke="${a}" stroke-width="1.5"/>
      <text x="155" y="14" font-size="9" font-weight="700" text-anchor="middle" fill="${a}">AFTER</text>
      <text x="155" y="68" font-size="22" font-weight="700" text-anchor="middle" fill="${a}">87%</text>
    `, 200, 110);
  },
};

/* =========================================================================
 *                              INFOGRAPHIC
 * ========================================================================= */

const numberedHero: Decoration = {
  id: "numbered-hero", name: "Big number block", category: "Infographic",
  defaultW: 3, defaultH: 2.5,
  render: (t) => svgWrap(`
    <rect x="6" y="20" width="4" height="80" fill="${t.accent}"/>
    <text x="22" y="60" font-size="46" font-weight="800" fill="${t.accent}">85%</text>
    <text x="22" y="86" font-size="11" fill="${alpha(t.fg, 0.7)}">retention</text>
  `),
};

const kpiTriple: Decoration = {
  id: "kpi-triple", name: "Three KPIs", category: "Infographic",
  defaultW: 7, defaultH: 2.4,
  render: (t) => {
    function kpi(x: number, value: string, label: string) {
      return `
        <text x="${x + 30}" y="50" font-size="26" font-weight="800" text-anchor="middle" fill="${t.accent}">${value}</text>
        <text x="${x + 30}" y="76" font-size="9" text-anchor="middle" fill="${alpha(t.fg, 0.7)}">${label}</text>
      `;
    }
    return svgWrap(`
      ${kpi(0,   "$4.2M", "ARR")}
      <line x1="68" y1="20" x2="68" y2="90" stroke="${alpha(t.fg, 0.18)}"/>
      ${kpi(60,  "124%",  "Net retention")}
      <line x1="128" y1="20" x2="128" y2="90" stroke="${alpha(t.fg, 0.18)}"/>
      ${kpi(120, "38%",   "QoQ growth")}
    `);
  },
};

const iconRow: Decoration = {
  id: "icon-row", name: "Icon row", category: "Infographic",
  defaultW: 7, defaultH: 1.6,
  render: (t) => {
    const a = t.accent;
    function tile(x: number, label: string) {
      return `
        <rect x="${x}" y="20" width="34" height="34" rx="8" fill="${alpha(a, 0.15)}" stroke="${a}" stroke-width="1"/>
        <circle cx="${x + 17}" cy="37" r="6" fill="${a}"/>
        <text x="${x + 17}" y="76" font-size="9" text-anchor="middle" fill="${t.fg}">${label}</text>
      `;
    }
    return svgWrap(`
      ${tile(15,  "Plan")}
      ${tile(63,  "Build")}
      ${tile(111, "Launch")}
      ${tile(159, "Grow")}
    `);
  },
};

const quoteCard: Decoration = {
  id: "quote-card", name: "Testimonial card", category: "Infographic",
  defaultW: 5, defaultH: 2.4,
  render: (t) => {
    const a = t.accent;
    return svgWrap(`
      <rect x="10" y="10" width="180" height="100" fill="${alpha(t.fg, 0.05)}"/>
      <text x="22" y="46" font-size="40" font-weight="800" fill="${a}">"</text>
      <text x="48" y="48" font-size="12" font-weight="600" fill="${t.fg}">Game-changer for our team.</text>
      <text x="48" y="68" font-size="9" fill="${alpha(t.fg, 0.6)}">It saved us ten hours a week.</text>
      <circle cx="22" cy="92" r="6" fill="${a}"/>
      <text x="34" y="96" font-size="9" font-weight="600" fill="${t.fg}">— Alex Carter, CEO</text>
    `);
  },
};

const keyInsight: Decoration = {
  id: "key-insight", name: "Key insight", category: "Infographic",
  defaultW: 5, defaultH: 1.8,
  render: (t) => {
    const a = t.accent;
    return svgWrap(`
      <rect x="0" y="0" width="6" height="120" fill="${a}"/>
      <text x="20" y="30" font-size="9" font-weight="700" letter-spacing="1" fill="${alpha(a, 0.9)}">KEY INSIGHT</text>
      <text x="20" y="60" font-size="13" font-weight="600" fill="${t.fg}">Customers churn most</text>
      <text x="20" y="78" font-size="13" font-weight="600" fill="${t.fg}">in the first 30 days.</text>
      <text x="20" y="100" font-size="9" fill="${alpha(t.fg, 0.6)}">Onboarding is the highest-leverage fix.</text>
    `);
  },
};

/* =========================================================================
 *                                 LAYOUT
 * ========================================================================= */

const sectionBlock: Decoration = {
  id: "section-block", name: "Section block", category: "Layout",
  defaultW: 4, defaultH: 4,
  render: (t) => svgWrap(`
    <rect x="0" y="0" width="200" height="120" fill="${t.accent}"/>
    <text x="20" y="46" font-size="22" font-weight="700" fill="${t.bg}">01</text>
    <text x="20" y="78" font-size="13" fill="${t.bg}" opacity="0.85">Section</text>
    <text x="20" y="94" font-size="13" fill="${t.bg}" opacity="0.85">divider</text>
  `),
};

const corneredFrame: Decoration = {
  id: "cornered-frame", name: "Cornered frame", category: "Layout",
  defaultW: 5, defaultH: 3,
  render: (t) => svgWrap(`
    <rect x="6" y="6" width="36" height="3" fill="${t.accent}"/>
    <rect x="6" y="6" width="3" height="36" fill="${t.accent}"/>
    <rect x="158" y="6"  width="36" height="3"  fill="${t.accent}"/>
    <rect x="191" y="6"  width="3"  height="36" fill="${t.accent}"/>
    <rect x="6"  y="111" width="36" height="3"  fill="${t.accent}"/>
    <rect x="6"  y="78"  width="3"  height="36" fill="${t.accent}"/>
    <rect x="158" y="111" width="36" height="3"  fill="${t.accent}"/>
    <rect x="191" y="78"  width="3"  height="36" fill="${t.accent}"/>
  `),
};

const accentBlock: Decoration = {
  id: "accent-block", name: "Accent block", category: "Layout",
  defaultW: 1.4, defaultH: 4,
  render: (t) => svgWrap(`<rect x="0" y="0" width="200" height="120" fill="${t.accent}"/>`),
};

const rule: Decoration = {
  id: "rule", name: "Divider line", category: "Layout",
  defaultW: 5, defaultH: 0.4,
  render: (t) => svgWrap(`<rect x="0" y="55" width="200" height="3" fill="${t.accent}"/>`, 200, 120),
};

const archShape: Decoration = {
  id: "arch", name: "Arch panel", category: "Layout",
  defaultW: 4, defaultH: 4.5,
  render: (t) => svgWrap(`
    <path d="M 30 110 L 30 60 A 70 70 0 0 1 170 60 L 170 110 Z" fill="${alpha(t.accent, 0.85)}"/>
  `),
};

const ribbon: Decoration = {
  id: "ribbon", name: "Header ribbon", category: "Layout",
  defaultW: 7, defaultH: 1.2,
  render: (t) => svgWrap(`
    <polygon points="0,30 200,30 195,55 200,80 0,80 5,55" fill="${t.accent}"/>
    <text x="100" y="62" font-size="14" font-weight="700" text-anchor="middle" fill="${t.bg}" letter-spacing="2">CHAPTER ONE</text>
  `, 200, 110),
};

/* =========================================================================
 *                                CONCEPT
 * ========================================================================= */

const dotConstellation: Decoration = {
  id: "constellation", name: "Dot constellation", category: "Concept",
  defaultW: 4, defaultH: 3,
  render: (t) => {
    const points: [number, number, number, string][] = [
      [40,  40, 12, t.accent],
      [120, 30, 8,  t.muted],
      [80,  70, 16, t.accent],
      [160, 80, 10, t.muted],
      [55,  95, 7,  t.accent],
    ];
    const lines = `
      <line x1="40" y1="40" x2="80" y2="70" stroke="${alpha(t.fg, 0.3)}"/>
      <line x1="80" y1="70" x2="120" y2="30" stroke="${alpha(t.fg, 0.3)}"/>
      <line x1="80" y1="70" x2="160" y2="80" stroke="${alpha(t.fg, 0.3)}"/>
      <line x1="80" y1="70" x2="55" y2="95" stroke="${alpha(t.fg, 0.3)}"/>
    `;
    const dots = points.map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join("");
    return svgWrap(lines + dots);
  },
};

const capsuleCluster: Decoration = {
  id: "capsules", name: "Capsule cluster", category: "Concept",
  defaultW: 5, defaultH: 3,
  render: (t) => svgWrap(`
    <g transform="rotate(-25 100 60)">
      <rect x="40"  y="40" rx="14" ry="14" width="100" height="20" fill="${t.accent}"/>
      <rect x="20"  y="65" rx="12" ry="12" width="120" height="18" fill="${alpha(t.muted, 0.85)}"/>
      <rect x="55"  y="86" rx="10" ry="10" width="80"  height="16" fill="${alpha(t.fg, 0.55)}"/>
      <circle cx="35"  cy="50" r="11" fill="${alpha(t.accent, 0.85)}"/>
      <circle cx="160" cy="50" r="9"  fill="${alpha(t.fg, 0.7)}"/>
    </g>
  `),
};

const mosaicBlocks: Decoration = {
  id: "mosaic-blocks", name: "Mosaic blocks", category: "Concept",
  defaultW: 5, defaultH: 3,
  render: (t) => {
    const a = t.accent;
    const m = alpha(t.muted, 0.85);
    const f = alpha(t.fg, 0.85);
    return svgWrap(`
      <rect x="10"  y="10" width="40" height="40" fill="${a}"/>
      <circle cx="80" cy="30" r="20" fill="${m}"/>
      <rect x="110" y="10" width="40" height="40" fill="${f}"/>
      <path d="M 160 10 a 20 20 0 0 1 40 0 L 200 50 L 160 50 Z" fill="${a}"/>
      <circle cx="30"  cy="80" r="20" fill="${f}"/>
      <rect x="60"  y="60" width="40" height="40" fill="${a}"/>
      <path d="M 110 100 a 20 20 0 0 1 40 0 Z" fill="${m}"/>
      <rect x="160" y="60" width="40" height="40" fill="${m}"/>
    `);
  },
};

const ringStack: Decoration = {
  id: "ring-stack", name: "Ring stack", category: "Concept",
  defaultW: 4, defaultH: 4,
  render: (t) => svgWrap(`
    <circle cx="100" cy="60" r="50" fill="none" stroke="${alpha(t.accent, 0.25)}" stroke-width="6"/>
    <circle cx="100" cy="60" r="38" fill="none" stroke="${alpha(t.accent, 0.5)}"  stroke-width="6"/>
    <circle cx="100" cy="60" r="26" fill="none" stroke="${alpha(t.accent, 0.85)}" stroke-width="6"/>
    <circle cx="100" cy="60" r="12" fill="${t.muted}"/>
  `),
};

const worldMapDot: Decoration = {
  id: "world-map", name: "World map (dotted)", category: "Concept",
  defaultW: 6, defaultH: 3,
  render: (t) => {
    const c = alpha(t.fg, 0.55);
    const dots: string[] = [];
    function row(xs: number[], y: number) {
      for (const x of xs) dots.push(`<circle cx="${x}" cy="${y}" r="1.4" fill="${c}"/>`);
    }
    row([18, 22, 26, 32, 36, 42, 50, 58, 70, 82, 96, 108, 124, 140, 158, 172, 184], 30);
    row([16, 20, 26, 34, 42, 50, 60, 70, 80, 92, 106, 120, 138, 154, 170, 184], 38);
    row([18, 24, 32, 42, 52, 64, 76, 90, 104, 118, 132, 146, 162, 176], 46);
    row([22, 30, 40, 52, 64, 78, 90, 102, 118, 132, 148, 162, 176], 54);
    row([28, 38, 50, 62, 76, 90, 106, 120, 134, 150, 166], 62);
    row([34, 46, 60, 74, 90, 106, 122, 138, 154, 168], 70);
    row([40, 56, 72, 88, 106, 124, 140, 156], 78);
    row([46, 64, 84, 106, 128, 150], 86);
    return svgWrap(dots.join("") + `
      <circle cx="60" cy="46"  r="3.4" fill="${t.accent}"/>
      <circle cx="110" cy="62" r="3.4" fill="${t.accent}"/>
      <circle cx="150" cy="54" r="3.4" fill="${t.accent}"/>
    `);
  },
};

const quoteMark: Decoration = {
  id: "quote-mark", name: "Quote mark", category: "Concept",
  defaultW: 2.2, defaultH: 2.2,
  render: (t) => svgWrap(`<text x="50" y="100" font-size="120" font-weight="700" fill="${t.accent}">"</text>`),
};

const networkHub: Decoration = {
  id: "network-hub", name: "Hub & spokes", category: "Concept",
  defaultW: 4, defaultH: 4,
  render: (t) => {
    const a = t.accent;
    const m = t.muted;
    const lines = `
      <line x1="100" y1="60" x2="40"  y2="20" stroke="${alpha(t.fg, 0.3)}"/>
      <line x1="100" y1="60" x2="160" y2="20" stroke="${alpha(t.fg, 0.3)}"/>
      <line x1="100" y1="60" x2="30"  y2="80" stroke="${alpha(t.fg, 0.3)}"/>
      <line x1="100" y1="60" x2="170" y2="80" stroke="${alpha(t.fg, 0.3)}"/>
      <line x1="100" y1="60" x2="100" y2="110" stroke="${alpha(t.fg, 0.3)}"/>
    `;
    return svgWrap(`
      ${lines}
      <circle cx="40"  cy="20" r="10" fill="${m}"/>
      <circle cx="160" cy="20" r="10" fill="${m}"/>
      <circle cx="30"  cy="80" r="10" fill="${m}"/>
      <circle cx="170" cy="80" r="10" fill="${m}"/>
      <circle cx="100" cy="110" r="10" fill="${m}"/>
      <circle cx="100" cy="60" r="22" fill="${a}"/>
    `);
  },
};

const stairs: Decoration = {
  id: "stairs", name: "Growth stairs", category: "Concept",
  defaultW: 5, defaultH: 3,
  render: (t) => {
    const a = t.accent;
    return svgWrap(`
      <rect x="20"  y="80" width="35" height="20" fill="${alpha(a, 0.4)}"/>
      <rect x="60"  y="65" width="35" height="35" fill="${alpha(a, 0.6)}"/>
      <rect x="100" y="50" width="35" height="50" fill="${alpha(a, 0.8)}"/>
      <rect x="140" y="35" width="35" height="65" fill="${a}"/>
      <line x1="14" y1="100" x2="190" y2="100" stroke="${alpha(t.fg, 0.4)}" stroke-width="1"/>
    `);
  },
};

/* =========================================================================
 *                                CATALOG
 * ========================================================================= */

export const DECORATIONS: Decoration[] = [
  // Charts
  donut, pieChart, barChart, stackedBar, lineChart, areaChart, radarShape, sparkline, progressRing,
  // Process
  numberedSteps, arrowFlow, timeline, verticalProcess, funnel,
  // Compare
  venn, venn3, splitColumns, prosCons, beforeAfter,
  // Infographic
  numberedHero, kpiTriple, iconRow, quoteCard, keyInsight,
  // Layout
  sectionBlock, corneredFrame, accentBlock, rule, archShape, ribbon,
  // Concept
  dotConstellation, capsuleCluster, mosaicBlocks, ringStack, worldMapDot, quoteMark, networkHub, stairs,
  // Icons populated dynamically by the drawer (Iconify search) — no static set.
];

export const DECORATION_CATEGORIES: DecorationCategory[] = [
  "Charts", "Process", "Compare", "Infographic", "Layout", "Concept", "Icons",
];

export function getDecoration(id?: string): Decoration | undefined {
  return DECORATIONS.find((d) => d.id === id);
}

export function decorationDataUri(id: string, theme: Theme): string {
  const d = getDecoration(id);
  if (!d) return "";
  return `data:image/svg+xml;utf8,${encodeURIComponent(d.render(theme))}`;
}

/** Merge a base theme with optional color overrides for a single decoration. */
export function applyDecorationOverrides(
  theme: Theme,
  overrides?: { accent?: string; muted?: string; fg?: string },
): Theme {
  if (!overrides) return theme;
  return {
    ...theme,
    accent: overrides.accent || theme.accent,
    muted:  overrides.muted  || theme.muted,
    fg:     overrides.fg     || theme.fg,
  };
}
