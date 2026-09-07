import { Plus, Sparkles, X, MapPin, Pencil } from "lucide-react";
import { BrandMark } from "./Brand";
import { cities } from "@/data/jaipur";
import type { Profile } from "./Onboarding";

type Props = {
  open: boolean;
  onClose: () => void;
  onNewChat: () => void;
  activeCity: string;
  onCity: (name: string) => void;
  profile: Profile;
  onEditProfile: () => void;
  engine: "gemini" | "lovable" | "offline" | null;
};

export function Sidebar({
  open,
  onClose,
  onNewChat,
  activeCity,
  onCity,
  profile,
  onEditProfile,
  engine,
}: Props) {
  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-foreground/25 backdrop-blur-[2px] transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[270px] shrink-0 flex-col border-r border-border bg-card px-4 py-5 transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-1 pb-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <BrandMark />
            <span className="truncate font-display text-[19px] font-semibold">Virasat AI</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-secondary lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
        >
          <Plus className="size-4" />
          New trip
        </button>

        <p className="px-1 pt-7 pb-2.5 text-[11px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
          Heritage cities
        </p>
        <ul className="flex flex-col gap-1">
          {cities.map((c) => {
            const active = c.name === activeCity;
            return (
              <li key={c.name}>
                <button
                  onClick={() => onCity(c.name)}
                  className={`grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    active ? "bg-accent text-accent-foreground" : "hover:bg-secondary"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{c.name}</span>
                    <span className="block truncate text-[11.5px] text-muted-foreground">
                      {c.note}
                    </span>
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                      c.status === "live"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {c.status}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto space-y-3 pt-6">
          <div className="rounded-2xl border border-border bg-secondary/60 p-3.5">
            <div className="flex items-center gap-2 text-[12.5px] font-bold">
              <Sparkles className="size-3.5 text-primary" />
              {engine === "gemini"
                ? "Powered by Google Gemini"
                : engine === "offline"
                  ? "Offline mode · built-in Jaipur data"
                  : "Grounded answers"}
            </div>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">
              Every Jaipur stop is retrieved from a verified heritage dataset before the model
              writes a word.
            </p>
          </div>

          <button
            onClick={onEditProfile}
            className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border border-border px-3.5 py-3 text-left transition-colors hover:bg-secondary"
          >
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-bold">{profile.name}</span>
              <span className="flex items-center gap-1 truncate text-[11.5px] text-muted-foreground">
                <MapPin className="size-3" />
                {profile.location || "Location not set"}
              </span>
            </span>
            <Pencil className="size-3.5 shrink-0 text-muted-foreground" />
          </button>
        </div>
      </aside>
    </>
  );
}
