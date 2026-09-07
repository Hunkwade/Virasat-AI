export function BrandMark({ size = 34 }: { size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-[10px] text-primary-foreground"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(140deg, var(--ember), var(--primary) 60%, var(--orchid))",
        boxShadow: "0 6px 18px -6px color-mix(in oklab, var(--ember) 70%, transparent)",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ width: size * 0.52, height: size * 0.52 }}
      >
        <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6" />
      </svg>
    </span>
  );
}
