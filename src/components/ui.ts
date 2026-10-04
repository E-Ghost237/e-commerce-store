/** Shared class names so every control looks and behaves the same. */
export const ui = {
  container: "mx-auto w-full max-w-7xl px-4 sm:px-8",
  card: "border-2 border-ink bg-paper",
  buttonPrimary:
    "inline-flex items-center justify-center gap-2 border-2 border-ink bg-ink px-5 py-3 text-sm font-black text-paper hover:bg-coral hover:text-ink disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-600",
  buttonAccent:
    "inline-flex items-center justify-center gap-2 border-2 border-ink bg-coral px-5 py-3 text-sm font-black text-ink hover:bg-ink hover:text-paper disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-600",
  buttonGhost: "inline-flex items-center justify-center gap-2 border-2 border-ink bg-paper px-4 py-2 text-sm font-bold hover:bg-sand disabled:opacity-50",
  input: "w-full border-2 border-ink bg-white px-3 py-2.5 text-base text-ink placeholder:text-stone-500",
  label: "mb-1 block text-sm font-bold",
  eyebrow: "text-xs font-bold uppercase tracking-[.18em]",
  h1: "text-4xl font-black leading-[.95] tracking-[-.06em] sm:text-6xl",
  h2: "text-3xl font-black tracking-[-.05em]",
  error: "mt-1 text-sm font-bold text-red-700",
} as const;
