import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertTriangle } from "lucide-react";

import { BrandMark } from "./Brand";
import { ItineraryCard } from "./ItineraryCard";

export type Message =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "ai";
      text: string;
      itinerary?: boolean;
      outro?: string;
      error?: boolean;
    };

export function ChatStream({ messages, typing }: { messages: Message[]; typing: boolean }) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6">
      {messages.map((m) =>
        m.role === "user" ? (
          <div key={m.id} className="animate-rise flex justify-end">
            <p className="max-w-[85%] rounded-[18px] rounded-br-md bg-foreground px-4 py-2.5 text-[14.5px] leading-relaxed whitespace-pre-wrap text-background sm:max-w-[70%]">
              {m.text}
            </p>
          </div>
        ) : (
          <div key={m.id} className="animate-rise flex items-start gap-3">
            <BrandMark size={30} />
            <div className="min-w-0 flex-1">
              {m.error ? (
                <p className="flex items-start gap-2 rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-[14px] leading-relaxed">
                  <AlertTriangle className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>{m.text}</span>
                </p>
              ) : (
                <div className="prose-chat text-[14.8px] leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                </div>
              )}
              {m.itinerary && (
                <div className="mt-4">
                  <ItineraryCard />
                </div>
              )}
              {m.outro && (
                <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
                  {m.outro}
                </p>
              )}
            </div>
          </div>
        ),
      )}

      {typing && (
        <div className="flex items-start gap-3">
          <BrandMark size={30} />
          <div className="flex gap-1.5 rounded-2xl border border-border bg-card px-4 py-3.5">
            <span className="animate-blink size-1.5 rounded-full bg-muted-foreground" />
            <span className="animate-blink size-1.5 rounded-full bg-muted-foreground [animation-delay:0.15s]" />
            <span className="animate-blink size-1.5 rounded-full bg-muted-foreground [animation-delay:0.3s]" />
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
