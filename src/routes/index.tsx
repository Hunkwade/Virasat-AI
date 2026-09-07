import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Menu, Database, Sparkles } from "lucide-react";

import { Sidebar } from "@/components/Sidebar";
import { HomeHero } from "@/components/HomeHero";
import { ChatStream, type Message } from "@/components/ChatStream";
import { Composer } from "@/components/Composer";
import { Onboarding, type Profile } from "@/components/Onboarding";
import { useProfile } from "@/hooks/useProfile";
import { askVirasat } from "@/lib/chat.functions";
import { classify } from "@/data/jaipur";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Virasat AI — Heritage & Culture Travel Companion" },
      {
        name: "description",
        content:
          "Plan Indian heritage trips hour by hour. Virasat AI builds Jaipur itineraries around sunrise, sunset and shop hours, with verified local guides.",
      },
      { property: "og:title", content: "Virasat AI — Heritage & Culture Travel Companion" },
      {
        property: "og:description",
        content:
          "An AI travel companion for India's heritage cities — timed itineraries, grounded facts and verified local guides, starting with Jaipur.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

const suggestions = [
  "2 days in Udaipur",
  "Best food near Hawa Mahal",
  "Find a guide for Amer Fort",
  "Make day 2 more relaxed",
];

let counter = 0;
const nextId = () => `m${++counter}`;

/** Remove markdown tables (and their separator rows) from a reply, keeping the prose. */
function removeTables(text: string): string {
  if (!text.includes("|")) return text;
  return text
    .split("\n")
    .filter((line) => !/^\s*\|.*\|\s*$/.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function App() {
  const { profile, ready, save, clear } = useProfile();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [city, setCity] = useState("Jaipur");
  const [engine, setEngine] = useState<"gemini" | "lovable" | "offline" | null>(null);
  const ask = useServerFn(askVirasat);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;

    const history = [
      ...messages.map((m) => ({
        role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: m.text,
      })),
      { role: "user" as const, content: text },
    ];

    setMessages((m) => [...m, { id: nextId(), role: "user", text }]);
    setTyping(true);

    try {
      const reply = await ask({
        data: {
          messages: history,
          profile: { name: profile?.name ?? "", location: profile?.location ?? "" },
        },
      });
      setEngine(reply.engine);
      const showPlan = classify(text) === "itinerary";
      // When the rich plan card is shown, drop any markdown table from the text
      // so the plan appears only once (as the card).
      const displayText = showPlan ? removeTables(reply.text) : reply.text;
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          role: "ai",
          text: displayText,
          ...(showPlan
            ? {
                itinerary: true,
                outro:
                  "Want it swapped around? Use the pace dial on the plan, or ask me for more shopping time, a different food focus, or a guide for any stop.",
              }
            : {}),
        },
      ]);
    } catch (error) {
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          role: "ai",
          error: true,
          text:
            error instanceof Error
              ? error.message
              : "I couldn't reach the AI service just now. Please try again.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const inChat = messages.length > 0 || typing;

  if (!ready) return <div className="h-dvh w-full bg-background" />;
  if (!profile) return <Onboarding onDone={(p: Profile) => save(p)} />;

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNewChat={() => {
          setMessages([]);
          setTyping(false);
          setMenuOpen(false);
        }}
        activeCity={city}
        onCity={(n) => {
          setCity(n);
          setMenuOpen(false);
          if (n !== "Jaipur") void send(`What about a trip to ${n}?`);
        }}
        profile={profile}
        onEditProfile={() => {
          clear();
          setMessages([]);
        }}
        engine={engine}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="z-20 grid shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-card/80 px-4 py-3 backdrop-blur sm:px-6">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="grid size-9 shrink-0 place-items-center rounded-xl border border-border lg:hidden"
          >
            <Menu className="size-4" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-primary shadow-[0_0_0_4px_var(--accent)]" />
            <h2 className="truncate text-[14.5px] font-bold">{city} heritage guide</h2>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-2.5 py-1.5 text-[11.5px] font-bold text-accent-foreground">
            {engine === "gemini" ? (
              <Sparkles className="size-3.5" />
            ) : (
              <Database className="size-3.5" />
            )}
            <span className="hidden sm:inline">
              {engine === "gemini"
                ? "Gemini · grounded on local data"
                : engine === "offline"
                  ? "Offline · built-in data"
                  : "Grounded in local data"}
            </span>
          </span>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {inChat ? (
            <ChatStream messages={messages} typing={typing} />
          ) : (
            <HomeHero onSend={send} name={profile.name} location={profile.location} />
          )}
        </div>

        {inChat && (
          <div className="shrink-0 border-t border-border bg-card/85 px-4 pt-3 pb-[calc(0.9rem+env(safe-area-inset-bottom))] backdrop-blur sm:px-6">
            <div className="mx-auto w-full max-w-3xl">
              <div className="no-scrollbar mb-2.5 flex gap-2 overflow-x-auto">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => void send(s)}
                    className="shrink-0 rounded-full border border-border px-3 py-1.5 text-[12.5px] font-semibold whitespace-nowrap transition-colors hover:border-primary/40 hover:bg-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <Composer
                onSend={(t) => void send(t)}
                placeholder="Ask about a heritage city, e.g. 3 days in Jaipur"
              />
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Virasat AI can make mistakes — check timings and prices before you travel.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
