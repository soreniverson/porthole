import { StackType } from "../lib/tauri";

const STACK_COLORS: Record<StackType, { bg: string; fg: string; letter: string }> = {
  nextjs: { bg: "#000000", fg: "#ffffff", letter: "N" },
  vite: { bg: "#646cff", fg: "#ffffff", letter: "V" },
  node: { bg: "#3c873a", fg: "#ffffff", letter: "n" },
  python: { bg: "#3776ab", fg: "#ffffff", letter: "Py" },
  rails: { bg: "#cc0000", fg: "#ffffff", letter: "R" },
  postgres: { bg: "#336791", fg: "#ffffff", letter: "Pg" },
  redis: { bg: "#dc382d", fg: "#ffffff", letter: "Re" },
  mongo: { bg: "#47a248", fg: "#ffffff", letter: "M" },
  java: { bg: "#ed8b00", fg: "#ffffff", letter: "J" },
  php: { bg: "#777bb4", fg: "#ffffff", letter: "P" },
  bun: { bg: "#fbf0df", fg: "#b8860b", letter: "B" },
  deno: { bg: "#070707", fg: "#ffffff", letter: "D" },
  unknown: { bg: "#e5e7eb", fg: "#9ca3af", letter: "?" },
};

export function StackIcon({ stack }: { stack: StackType }) {
  const config = STACK_COLORS[stack] || STACK_COLORS.unknown;

  return (
    <div
      className="flex items-center justify-center rounded-md flex-shrink-0"
      style={{
        width: 24,
        height: 24,
        backgroundColor: config.bg,
        color: config.fg,
        fontSize: config.letter.length > 1 ? 9 : 11,
        fontWeight: 700,
        lineHeight: 1,
      }}
    >
      {config.letter}
    </div>
  );
}
