/**
 * Shared class vocabulary so every control looks and behaves the same across the storefront and the back office.
 * Colours come from the design tokens in globals.css.
 */
export const ui = {
  container: "mx-auto w-full max-w-7xl px-5 sm:px-8",
  narrow: "mx-auto w-full max-w-3xl px-5 sm:px-8",
  /** Full-bleed section with breathing room. */
  section: "py-16 sm:py-24",

  card: "rounded-3xl border border-ink/10 bg-white shadow-soft",
  cardSoft: "rounded-3xl border border-ink/5 bg-linen",
  cardHover: "transition duration-500 hover:-translate-y-1 hover:shadow-lift",

  buttonPrimary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper shadow-soft hover:bg-ember disabled:cursor-not-allowed disabled:bg-ink/25 disabled:shadow-none",
  buttonAccent:
    "inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-sm font-semibold text-white shadow-glow hover:bg-ember disabled:cursor-not-allowed disabled:bg-ink/25 disabled:shadow-none",
  buttonGhost:
    "inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white/70 px-5 py-3 text-sm font-semibold text-ink backdrop-blur hover:border-ink/35 hover:bg-white disabled:opacity-50",
  buttonSmall: "px-4 py-2 text-xs",
  buttonQuiet: "inline-flex items-center gap-1.5 text-sm font-semibold text-ember hover:gap-2.5",

  input:
    "w-full rounded-2xl border border-ink/15 bg-white px-4 py-3 text-base text-ink shadow-[inset_0_1px_2px_rgb(33_29_26/0.04)] placeholder:text-ink/35 focus:border-terracotta/60 focus:outline-none focus:ring-4 focus:ring-terracotta/12",
  label: "mb-1.5 block text-[13px] font-semibold text-ink/70",
  hint: "mt-1.5 text-xs text-ink/50",

  eyebrow: "text-[11px] font-semibold uppercase tracking-[0.28em] text-ember",
  eyebrowMuted: "text-[11px] font-semibold uppercase tracking-[0.28em] text-ink/40",
  h1: "font-display text-[2.6rem] font-medium leading-[0.98] tracking-[-0.03em] sm:text-6xl lg:text-[4.25rem]",
  h2: "font-display text-3xl font-medium leading-[1.05] tracking-[-0.025em] sm:text-5xl",
  h3: "font-display text-xl font-medium tracking-[-0.015em] sm:text-2xl",
  lede: "text-lg leading-relaxed text-ink/70 sm:text-xl",
  body: "text-[15px] leading-relaxed text-ink/70",

  badge: "inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/70 backdrop-blur",
  error: "mt-1.5 text-sm font-medium text-red-700",
  pill: "inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-2 text-xs font-semibold text-ink/75 backdrop-blur",
} as const;
