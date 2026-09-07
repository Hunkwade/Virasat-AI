import { Database, Compass, Clock3, HandHeart, MapPin } from "lucide-react";
import { Aurora } from "./Aurora";
import { Composer } from "./Composer";

const pillars = [
  {
    icon: Clock3,
    title: "Timed to the hour",
    body: "Every stop sits in its best light and least crowded window.",
  },
  {
    icon: Database,
    title: "Grounded, not guessed",
    body: "Answers come from a verified heritage dataset, not open web scraps.",
  },
  {
    icon: HandHeart,
    title: "Local guides built in",
    body: "Verified artisans and storytellers attached to the stops that need them.",
  },
];

type Props = { onSend: (text: string) => void; name: string; location?: string };

export function HomeHero({ onSend, name, location }: Props) {
  const chips = [
    "I am visiting Jaipur for 3 days.",
    "Best food near Hawa Mahal",
    "Find a guide for Amer Fort",
    location ? `How do I reach Jaipur from ${location}?` : "What's the budget for 3 days?",
  ];

  return (
    <div className="relative isolate min-h-full overflow-hidden">
      <Aurora />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col justify-center px-5 py-14 sm:px-8 sm:py-20">
        <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-[11.5px] font-bold tracking-[0.12em] uppercase backdrop-blur">
          <Compass className="size-3.5 text-primary" />
          Heritage & culture companion
        </p>

        <h1 className="mt-6 font-display text-[clamp(2.6rem,9vw,4.75rem)] leading-[0.95] font-semibold">
          Namaste, {name}.
          <br />
          <span className="text-gradient">Where to today?</span>
        </h1>

        {location && (
          <p className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-semibold text-accent-foreground">
            <MapPin className="size-3.5" />
            Planning from {location}
          </p>
        )}

        <p className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-muted-foreground">
          Tell me the city and how many days you have. I'll plan the forts, food and culture around
          sunrise, sunset and shop hours — with a verified local guide wherever it helps.
        </p>

        <div className="mt-8">
          <Composer
            large
            onSend={onSend}
            placeholder="e.g. I am visiting Jaipur for 3 days."
          />
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => onSend(c)}
                className="shrink-0 rounded-full border border-border bg-card/80 px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap backdrop-blur transition-colors hover:border-primary/40 hover:bg-accent"
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-3">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-card/85 p-4 backdrop-blur"
            >
              <p.icon className="size-4 text-primary" />
              <p className="mt-2.5 text-[13.5px] font-bold">{p.title}</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
