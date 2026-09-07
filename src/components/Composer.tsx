import { useState, type FormEvent } from "react";
import { ArrowUp } from "lucide-react";

type Props = {
  onSend: (text: string) => void;
  placeholder?: string;
  large?: boolean;
};

export function Composer({ onSend, placeholder, large }: Props) {
  const [value, setValue] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  return (
    <form
      onSubmit={submit}
      className={`flex w-full items-center gap-2 rounded-2xl border border-border bg-card pl-4 transition-shadow focus-within:border-primary/50 focus-within:shadow-[0_0_0_4px_var(--accent)] ${
        large ? "p-2 pl-5 lift" : "p-1.5 pl-4 shadow-[var(--shadow-soft)]"
      }`}
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder ?? "Ask about a heritage city…"}
        className={`min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground ${
          large ? "py-3 text-[15.5px]" : "py-2.5 text-[14.5px]"
        }`}
      />
      <button
        type="submit"
        aria-label="Send"
        className={`grid shrink-0 place-items-center rounded-xl bg-foreground text-background transition-transform hover:-translate-y-0.5 ${
          large ? "size-11" : "size-9"
        }`}
      >
        <ArrowUp className={large ? "size-5" : "size-4"} />
      </button>
    </form>
  );
}
