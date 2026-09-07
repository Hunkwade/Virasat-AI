import { useEffect, useState } from "react";

import type { Profile } from "@/components/Onboarding";

const KEY = "virasat.profile";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setProfile(JSON.parse(raw) as Profile);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const save = (p: Profile) => {
    setProfile(p);
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch {
      /* ignore */
    }
  };

  const clear = () => {
    setProfile(null);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  };

  return { profile, ready, save, clear };
}
