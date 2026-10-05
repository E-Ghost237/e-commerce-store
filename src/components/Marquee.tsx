import { Paw } from "./Icons";

/**
 * Infinite scrolling strip. The list is rendered twice inside one track that translates by -50%, so the loop is
 * seamless; the duplicate is hidden from assistive tech.
 */
export function Marquee({ items, className = "" }: { items: readonly string[]; className?: string }) {
  const row = (key: string, hidden: boolean) => (
    <ul key={key} aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li key={item} className="flex items-center gap-6 whitespace-nowrap px-6 text-[11px] font-semibold uppercase tracking-[0.28em]">
          {item}
          <Paw className="h-3 w-3 opacity-35" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className={`marquee flex overflow-hidden ${className}`}>
      <div className="marquee-track">
        {row("a", false)}
        {row("b", true)}
      </div>
    </div>
  );
}
