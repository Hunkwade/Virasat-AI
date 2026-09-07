import { useState, type FormEvent } from "react";
import { LocateFixed, Loader2 } from "lucide-react";

import { Aurora } from "./Aurora";
import { BrandMark } from "./Brand";

export type Profile = { name: string; location: string };

export function Onboarding({ onDone }: { onDone: (p: Profile) => void }) {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [locating, setLocating] = useState(false);

  const detect = () => {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`,
          );
          const data = (await res.json()) as {
            address?: Record<string, string>;
          };
          const a = data.address ?? {};
          const place = [a["city"] ?? a["town"] ?? a["village"] ?? a["state_district"], a["state"]]
            .filter(Boolean)
            .join(", ");
          setLocation(place || `${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`);
        } catch {
          setLocation(`${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`);
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false),
      { timeout: 8000 },
    );
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onDone({ name: name.trim(), location: location.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-background px-4 py-10">
      <Aurora />
      <div className="lift relative w-full max-w-md rounded-3xl border border-border bg-card/95 p-6 backdrop-blur sm:p-8">
        <div className="flex items-center gap-2.5">
          <BrandMark />
          <span className="font-display text-[20px] font-semibold">Virasat AI</span>
        </div>
        <h1 className="mt-5 font-display text-[clamp(1.7rem,6vw,2.2rem)] leading-tight font-semibold">
          Namaste — who's travelling?
        </h1>
        <p className="mt-2 text-[14.5px] leading-relaxed text-muted-foreground">
          Your name and where you're starting from let me plan travel time, seasons and budget
          around you.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-[12px] font-bold tracking-[0.1em] uppercase">Your name</span>
            <input
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-[15px] outline-none focus:border-primary/60"
            />
          </label>

          <label className="block">
            <span className="text-[12px] font-bold tracking-[0.1em] uppercase">
              Current location
            </span>
            <div className="mt-1.5 flex gap-2">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Delhi"
                className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3 text-[15px] outline-none focus:border-primary/60"
              />
              <button
                type="button"
                onClick={detect}
                aria-label="Detect my location"
                className="grid size-[50px] shrink-0 place-items-center rounded-xl border border-border transition-colors hover:bg-accent"
              >
                {locating ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <LocateFixed className="size-4 text-primary" />
                )}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full rounded-xl bg-foreground px-4 py-3.5 text-[15px] font-semibold text-background transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
          >
            Start planning
          </button>
        </form>
      </div>
    </div>
  );
}
