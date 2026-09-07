import { jaipurDays, cities, classify, type Stop } from "@/data/jaipur";

/**
 * Offline engine — the original prototype behaviour.
 * Answers are composed from the verified Jaipur dataset with zero network calls,
 * so the app stays fully usable when no AI key is configured.
 */

const allStops = (): Stop[] =>
  (Object.keys(jaipurDays) as Array<"1" | "2" | "3">).flatMap((d) => jaipurDays[d].stops);

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function dayBlock(d: "1" | "2" | "3") {
  const day = jaipurDays[d];
  const total = day.stops.reduce((s, x) => s + x.cost, 0);
  const rows = day.stops.map(
    (s) => `| ${s.time} | **${s.place}** | ${s.tag} | ${money(s.cost)} | ${s.crowd} | ${s.why} |`,
  );
  return `### Day ${d} · ${day.heading}\n_${day.sub}_\n\n| Time | Place | Type | Cost/person | Crowd | Why now |\n| --- | --- | --- | --- | --- | --- |\n${rows.join(
    "\n",
  )}\n\n**Day ${d} total:** ~${money(total)} per person`;
}

function itinerary(name?: string, location?: string) {
  const hello = name ? `Here's your Jaipur plan, ${name}.` : "Here's your Jaipur plan.";
  const from = location
    ? `\n\nComing from **${location}**? Arrive the night before if you can — Day 1 starts at 6 AM at Amer Fort for the soft light and thin crowds.`
    : "";
  const grand = allStops().reduce((s, x) => s + x.cost, 0);
  return `${hello} Everything below is timed around sunrise, sunset, shop hours and crowd levels.${from}\n\n${dayBlock("1")}\n\n${dayBlock("2")}\n\n${dayBlock("3")}\n\n**3-day total:** ~${money(grand)} per person (entries, food and experiences — excludes hotels and travel).`;
}

function budget() {
  const per = (d: "1" | "2" | "3") => jaipurDays[d].stops.reduce((s, x) => s + x.cost, 0);
  const grand = per("1") + per("2") + per("3");
  return `Three days in Jaipur come to about **${money(grand)} per person** for entries, food and experiences — roughly ${money(per("1"))} on day 1 (${jaipurDays["1"].heading}), ${money(per("2"))} on day 2 (${jaipurDays["2"].heading}) and ${money(per("3"))} on day 3 (${jaipurDays["3"].heading}).\n\nAdd around ₹1,500–3,500 a night for a mid-range hotel and ₹600–900 a day for autos or a cab. Skipping **Chokhi Dhani** and the Amer light show trims about ₹1,100.`;
}

function food() {
  const stops = allStops().filter((s) => s.tag === "Food");
  const lines = stops.map(
    (s) => `- **${s.place}** (${s.time}, about ${money(s.cost)}) — ${s.about}`,
  );
  return `The old city eats best early. Here's where I'd go:\n\n${lines.join(
    "\n",
  )}\n\nKachori and lassi counters are freshest in the morning and often sell out by noon.`;
}

function guides() {
  const withGuide = allStops().filter((s) => s.guide);
  if (!withGuide.length) return "No verified guides are listed for these stops yet.";
  const lines = withGuide.map(
    (s) =>
      `- **${s.guide!.name}** at ${s.place} — ${s.guide!.speciality}, ${s.guide!.rating}★, ${s.guide!.price} · ${s.guide!.phone}`,
  );
  return `These are the verified guides on your Jaipur stops:\n\n${lines.join(
    "\n",
  )}\n\nCall a day ahead in peak season (October–March).`;
}

function relaxed() {
  const lines = (["1", "2", "3"] as const).map((d) => {
    const easy = jaipurDays[d].stops.filter((s) => s.crowd !== "High").slice(0, 3);
    return `- **Day ${d}** — ${easy.map((s) => `${s.place} (${s.time})`).join(", ")}, about ${money(
      easy.reduce((t, s) => t + s.cost, 0),
    )} per person`;
  });
  return `Here's a gentler Jaipur — the light, high-reward stops, without the long walks:\n\n${lines.join(
    "\n",
  )}\n\nRest between 1 and 4 PM; the heat peaks then and most bazaars are quiet anyway.`;
}



function otherCity(text: string) {
  const hit = cities.find((c) => text.toLowerCase().includes(c.name.toLowerCase()));
  if (hit && hit.status === "live") return itinerary();
  const name = hit?.name ?? "that city";
  return `I have a fully verified, hour-by-hour dataset for **Jaipur** today — ${name} is next in line (${
    hit?.note ?? "coming soon"
  }).\n\nAsk me for **3 days in Jaipur** and I'll plan it around sunrise, sunset and shop hours. Add your own Gemini key in settings and I can also answer freely about other cities.`;
}

export function offlineAnswer(
  text: string,
  profile: { name?: string | undefined; location?: string | undefined },
): string {
  switch (classify(text)) {
    case "itinerary":
    case "day-switch":
      return itinerary(profile.name, profile.location);
    case "budget":
      return budget();
    case "food":
      return food();
    case "guide":
      return guides();
    case "relax":
      return relaxed();
    case "other-city":
      return otherCity(text);
    default:
      return `I'm temporarily offline, so I can only answer from my built-in Jaipur heritage dataset:\n\n- **3 days in Jaipur** — a full timed plan\n- **Budget** — costs per day and per person\n- **Food** — the classic old-city stops\n- **Guides** — verified names, rates and numbers\n\nFor general questions on any topic, I answer through Gemini — please try again in a moment.`;
  }
}
