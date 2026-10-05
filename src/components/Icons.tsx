import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      {children}
    </svg>
  );
}

/** Brand mark: a paw pressed into a rounded tile. */
export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden focusable="false">
      <rect width="40" height="40" rx="13" fill="currentColor" />
      <g fill="var(--color-paper)">
        <ellipse cx="13.6" cy="14.4" rx="3" ry="3.6" />
        <ellipse cx="20" cy="12.4" rx="3" ry="3.9" />
        <ellipse cx="26.4" cy="14.4" rx="3" ry="3.6" />
        <path d="M20 19.6c4.6 0 8.2 2.8 8.2 6.1 0 2.6-2.3 4-5.1 3.8-1.4-.1-2.1-.4-3.1-.4s-1.7.3-3.1.4c-2.8.2-5.1-1.2-5.1-3.8 0-3.3 3.6-6.1 8.2-6.1Z" />
      </g>
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </Icon>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </Icon>
  );
}

export function Check(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </Icon>
  );
}

export function Truck(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2.5 7.5h10v9h-10z" />
      <path d="M12.5 10.5h4l3 3v3h-7z" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="16.5" cy="18" r="1.8" />
    </Icon>
  );
}

export function Shield(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3 5 5.5v5.9c0 4.2 2.9 7.7 7 9.1 4.1-1.4 7-4.9 7-9.1V5.5L12 3Z" />
      <path d="m9 12 2 2 4-4.5" />
    </Icon>
  );
}

export function Refresh(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 11.5A8 8 0 0 0 6.3 6.3L4 8.5" />
      <path d="M4 4v4.5h4.5" />
      <path d="M4 12.5a8 8 0 0 0 13.7 5.2L20 15.5" />
      <path d="M20 20v-4.5h-4.5" />
    </Icon>
  );
}

export function Chat(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20 12.5c0 3.9-3.6 7-8 7-1 0-2-.2-2.9-.5L5 20.5l1.2-3.4A6.7 6.7 0 0 1 4 12.5c0-3.9 3.6-7 8-7s8 3.1 8 7Z" />
    </Icon>
  );
}

export function Leaf(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 19c0-8 5.5-13 14-13 0 8.5-5 14-13 14H5v-1Z" />
      <path d="M9 15c2-2 4.5-3.4 7-4.5" />
    </Icon>
  );
}

export function Menu(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h10" />
    </Icon>
  );
}

export function Close(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </Icon>
  );
}

export function Plus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Icon>
  );
}

export function Minus(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14" />
    </Icon>
  );
}

export function Play(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function Star(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="m12 3.6 2.5 5.3 5.6.7-4.1 3.9 1 5.6-5-2.8-5 2.8 1-5.6L4 9.6l5.6-.7L12 3.6Z" />
    </svg>
  );
}

export function Sparkle(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2.5c.6 4.3 2.7 6.4 7 7-4.3.6-6.4 2.7-7 7-.6-4.3-2.7-6.4-7-7 4.3-.6 6.4-2.7 7-7Z" />
      <path d="M18.5 15.5c.3 2 1.2 2.9 3.2 3.2-2 .3-2.9 1.2-3.2 3.2-.3-2-1.2-2.9-3.2-3.2 2-.3 2.9-1.2 3.2-3.2Z" opacity=".7" />
    </svg>
  );
}

export function Paw(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <ellipse cx="7" cy="9" rx="2.3" ry="2.9" />
      <ellipse cx="12" cy="6.6" rx="2.4" ry="3.1" />
      <ellipse cx="17" cy="9" rx="2.3" ry="2.9" />
      <path d="M12 11.6c3.2 0 5.8 2 5.8 4.4 0 1.9-1.6 2.9-3.6 2.7-1-.1-1.5-.3-2.2-.3s-1.2.2-2.2.3c-2 .2-3.6-.8-3.6-2.7 0-2.4 2.6-4.4 5.8-4.4Z" />
    </svg>
  );
}
