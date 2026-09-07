export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden grain ${className}`}
    >
      <div className="mesh animate-drift absolute -top-[35%] right-[-25%] h-[130%] w-[95%] opacity-90" />
      <div className="mesh animate-drift absolute bottom-[-45%] left-[-20%] h-[95%] w-[70%] opacity-40 [animation-delay:-8s]" />
    </div>
  );
}
