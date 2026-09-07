import { useMemo, useState } from "react";
import {
  Clock,
  MapPin,
  Users,
  Phone,
  Star,
  Wallet,
  Footprints,
  Share2,
  Check,
  ChevronDown,
} from "lucide-react";
import { jaipurDays, type Stop } from "@/data/jaipur";

const paces = [
  { id: "gentle", label: "Gentle" },
  { id: "balanced", label: "Balanced" },
  { id: "packed", label: "Packed" },
] as const;
type Pace = (typeof paces)[number]["id"];

const bonusStop: Record<string, Stop> = {
  "1": {
    time: "9:45 – 10:45 PM",
    place: "Night walk: Jaleb Chowk",
    tag: "Culture",
    cost: 0,
    crowd: "Low",
    why: "Added for a packed pace — the walled city is floodlit and calm after dinner.",
    about:
      "The old courtyard square in front of the City Palace complex is lit through the night, and street chai stalls stay open for the last of the crowd.",
  },
  "2": {
    time: "12:45 – 1:00 PM",
    place: "Gem-cutting workshop peek",
    tag: "Bazaar",
    cost: 0,
    crowd: "Low",
    why: "Added for a packed pace — a 15 minute detour inside Johari Bazaar.",
    about:
      "Family workshops behind the jewelry shopfronts still cut and polish stones by hand, a craft Jaipur has practised for close to three centuries.",
  },
  "3": {
    time: "3:45 – 4:15 PM",
    place: "Statue Circle chai break",
    tag: "Food",
    cost: 60,
    crowd: "Low",
    why: "Added for a packed pace — a short refuel between the workshop and the bazaar.",
    about:
      "A local evening hangout with kulhad chai and snack carts circling the marble statue of Sawai Jai Singh II.",
  },
};

const tagStyles: Record<Stop["tag"], string> = {
  Fort: "bg-accent text-accent-foreground",
  Food: "bg-[color-mix(in_oklab,var(--saffron)_22%,white)] text-[color-mix(in_oklab,var(--saffron)_65%,black)]",
  Bazaar:
    "bg-[color-mix(in_oklab,var(--orchid)_18%,white)] text-[color-mix(in_oklab,var(--orchid)_65%,black)]",
  Museum: "bg-secondary text-secondary-foreground",
  Temple: "bg-secondary text-secondary-foreground",
  Culture:
    "bg-[color-mix(in_oklab,var(--orchid)_18%,white)] text-[color-mix(in_oklab,var(--orchid)_65%,black)]",
  Viewpoint: "bg-accent text-accent-foreground",
};

function applyPace(stops: Stop[], pace: Pace, day: string) {
  if (pace === "balanced") return stops;
  if (pace === "packed") return [...stops, bonusStop[day]!];
  let dropped = 0;
  return stops.filter((s) => {
    if (s.crowd === "High" && dropped < 2) {
      dropped += 1;
      return false;
    }
    return true;
  });
}

export function ItineraryCard() {
  const [day, setDay] = useState<"1" | "2" | "3">("1");
  const [pace, setPace] = useState<Pace>("balanced");
  const [openGuide, setOpenGuide] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const data = jaipurDays[day];
  const stops = useMemo(() => applyPace(data.stops, pace, day), [data, pace, day]);
  const total = stops.reduce((n, s) => n + s.cost, 0);

  const share = async () => {
    const text = `Jaipur — Day ${day}: ${data.heading}\n\n${stops
      .map((s) => `${s.time} · ${s.place}`)
      .join("\n")}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card lift">
      {/* header */}
      <div className="relative overflow-hidden border-b border-border px-4 py-4 sm:px-6 sm:py-5">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
              Jaipur · 3 days
            </p>
            <h3 className="mt-1 truncate font-display text-xl font-semibold sm:text-2xl">
              {data.heading}
            </h3>
            <p className="mt-1 text-[12.5px] text-muted-foreground">{data.sub}</p>
          </div>
          <button
            onClick={share}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[12px] font-semibold transition-colors hover:bg-secondary"
          >
            {copied ? <Check className="size-3.5 text-primary" /> : <Share2 className="size-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-[12px] font-semibold">
            <Wallet className="size-3.5 text-primary" />₹{total.toLocaleString("en-IN")} / person
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-[12px] font-semibold">
            <MapPin className="size-3.5 text-primary" />
            {stops.length} stops
          </span>
          <div className="ml-auto inline-flex rounded-full bg-secondary p-1">
            {paces.map((p) => (
              <button
                key={p.id}
                onClick={() => setPace(p.id)}
                className={`rounded-full px-3 py-1 text-[12px] font-semibold transition-colors ${
                  pace === p.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* day tabs */}
      <div className="flex gap-1 border-b border-border bg-secondary/50 p-1.5">
        {(["1", "2", "3"] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={`flex-1 rounded-xl px-2 py-2 text-[13px] font-bold transition-colors ${
              day === d
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:bg-card/60"
            }`}
          >
            Day {d}
          </button>
        ))}
      </div>

      {/* rail */}
      <div className="px-4 py-5 sm:px-6">
        <ol className="relative ml-1.5 border-l border-dashed border-border pl-5 sm:pl-6">
          {stops.map((s, i) => {
            const uid = `${day}-${pace}-${i}`;
            const isOpen = openGuide === uid;
            return (
              <li key={uid} className="animate-rise relative pb-5 last:pb-0">
                <span
                  className="absolute -left-[27px] top-1.5 size-3 rounded-full border-[3px] border-card sm:-left-[31px]"
                  style={{
                    background: "linear-gradient(140deg, var(--ember), var(--orchid))",
                  }}
                />
                <div className="rounded-2xl border border-border bg-background p-4 transition-shadow hover:shadow-[var(--shadow-soft)]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[11.5px] font-bold text-accent-foreground">
                      <Clock className="size-3" />
                      {s.time}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${tagStyles[s.tag]}`}
                    >
                      {s.tag}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-muted-foreground">
                      <Users className="size-3" />
                      {s.crowd} crowd
                    </span>
                    <span className="ml-auto text-[12px] font-bold">
                      {s.cost === 0 ? "Free" : `₹${s.cost}`}
                    </span>
                  </div>

                  <h4 className="mt-2.5 font-display text-[17px] font-semibold">{s.place}</h4>
                  <p className="mt-1 text-[13.5px] leading-relaxed">{s.why}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                    {s.about}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(s.place + " Jaipur")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-[12.5px] font-semibold transition-colors hover:bg-secondary"
                    >
                      <MapPin className="size-3.5" />
                      Directions
                    </a>
                    {s.guide && (
                      <button
                        onClick={() => setOpenGuide(isOpen ? null : uid)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-semibold transition-colors ${
                          isOpen
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:bg-secondary"
                        }`}
                      >
                        <Users className="size-3.5" />
                        Connect with a guide
                        <ChevronDown
                          className={`size-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {s.guide && isOpen && (
                    <div className="animate-rise mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-secondary/60 p-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-bold">{s.guide.name}</p>
                        <p className="truncate text-[12px] text-muted-foreground">
                          {s.guide.speciality}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-semibold">
                          <span className="inline-flex items-center gap-1">
                            <Star className="size-3 fill-current text-primary" />
                            {s.guide.rating}
                          </span>
                          <span>{s.guide.price}</span>
                          <span className="text-muted-foreground">{s.guide.phone}</span>
                        </div>
                      </div>
                      <a
                        href={`tel:${s.guide.phone.replace(/\s|X/g, "")}`}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-foreground px-3 py-2 text-[12.5px] font-semibold text-background"
                      >
                        <Phone className="size-3.5" />
                        Call
                      </a>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3.5 py-2 text-[11.5px] text-muted-foreground">
          <Footprints className="size-3.5 shrink-0 text-primary" />
          Timed around sunrise, sunset and shop hours — retrieved from Virasat AI's Jaipur heritage
          dataset.
        </p>
      </div>
    </div>
  );
}
