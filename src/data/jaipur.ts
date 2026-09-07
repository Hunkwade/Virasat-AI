export type Guide = {
  name: string;
  rating: string;
  price: string;
  phone: string;
  speciality: string;
};

export type Stop = {
  time: string;
  place: string;
  why: string;
  about: string;
  tag: "Fort" | "Food" | "Bazaar" | "Museum" | "Temple" | "Culture" | "Viewpoint";
  cost: number;
  crowd: "Low" | "Medium" | "High";
  guide?: Guide;
};

export type Day = {
  heading: string;
  sub: string;
  stops: Stop[];
};

export const jaipurDays: Record<"1" | "2" | "3", Day> = {
  "1": {
    heading: "Sunrise forts & the old city",
    sub: "5 stops · early start, evening culture finish",
    stops: [
      {
        time: "6:00 – 8:00 AM",
        place: "Amer Fort",
        tag: "Fort",
        cost: 200,
        crowd: "Low",
        why: "Soft sunrise light and thin crowds make early morning the best time to see the fort and its courtyards.",
        about:
          "Built in the late 1500s by Raja Man Singh I, Amer Fort blends Rajput and Mughal architecture across its courtyards, the mirrored Sheesh Mahal, and views over Maota Lake below.",
        guide: {
          name: "Rakesh Singh",
          rating: "4.8",
          price: "₹800 for 2 hrs",
          phone: "+91 98XXX XX210",
          speciality: "Rajput military architecture",
        },
      },
      {
        time: "8:30 – 9:30 AM",
        place: "Local Kachori Stall",
        tag: "Food",
        cost: 120,
        crowd: "Medium",
        why: "Freshest right after it opens — most stalls wind down by late morning once the day's batch sells out.",
        about:
          "Pyaaz and mawa kachori are Jaipur's signature breakfast — a flaky, spiced pastry that locals eat standing at the counter, often with a side of tamarind chutney.",
      },
      {
        time: "10:00 AM – 1:00 PM",
        place: "City Palace + Jantar Mantar",
        tag: "Museum",
        cost: 700,
        crowd: "High",
        why: "Cooler late-morning hours are ideal for walking between these two adjoining sites before the midday heat.",
        about:
          "City Palace has been home to Jaipur's royal family since the 1730s. Next door, Jantar Mantar is an 18th-century stone observatory built by Sawai Jai Singh II, a UNESCO World Heritage Site.",
        guide: {
          name: "Meena Verma",
          rating: "4.9",
          price: "₹1,000 for 3 hrs",
          phone: "+91 98XXX XX477",
          speciality: "Astronomy & court history",
        },
      },
      {
        time: "5:00 – 6:30 PM",
        place: "Nahargarh Fort",
        tag: "Viewpoint",
        cost: 200,
        crowd: "Medium",
        why: "Best known for its sunset view — arrive by 5 to get a spot along the ramparts before the light fades.",
        about:
          "Perched on the Aravalli hills, Nahargarh formed a defense ring with Amer and Jaigarh forts and offers a full panorama of the Pink City below.",
      },
      {
        time: "7:30 – 9:30 PM",
        place: "Chokhi Dhani",
        tag: "Culture",
        cost: 1100,
        crowd: "High",
        why: "An evening-only experience — folk dance, puppet shows, and dinner run after dark.",
        about:
          "A recreated Rajasthani village experience with live folk performances, camel rides, and a traditional thali dinner served on the floor in the old style.",
      },
    ],
  },
  "2": {
    heading: "Bazaars, museums & the lake palace",
    sub: "7 stops · shopping-heavy with an afternoon indoors",
    stops: [
      {
        time: "6:30 – 7:30 AM",
        place: "Hawa Mahal (outside view)",
        tag: "Viewpoint",
        cost: 0,
        crowd: "Low",
        why: "Morning light hits the pink sandstone facade directly, and the street outside is still quiet for photos.",
        about:
          "Built in 1799 by Maharaja Sawai Pratap Singh, the 'Palace of Winds' has 953 small windows, or jharokhas, designed so royal women could watch street life without being seen.",
      },
      {
        time: "8:00 – 9:00 AM",
        place: "Lassiwalla, Johari Bazaar",
        tag: "Food",
        cost: 80,
        crowd: "Medium",
        why: "A classic old-city breakfast stop before the bazaars get crowded.",
        about:
          "Serving thick, creamy lassi in clay kulhads since the 1940s — one of Jaipur's oldest and most consistent food institutions.",
      },
      {
        time: "9:30 AM – 12:30 PM",
        place: "Johari & Bapu Bazaar",
        tag: "Bazaar",
        cost: 0,
        crowd: "High",
        why: "Cooler late-morning hours suit a slower shopping walk before the afternoon heat sets in.",
        about:
          "Johari Bazaar is Jaipur's historic jewelry and gem market; Bapu Bazaar nearby is known for block-print textiles, juttis, and leather goods.",
      },
      {
        time: "1:00 – 2:00 PM",
        place: "Rajasthani Thali Lunch",
        tag: "Food",
        cost: 450,
        crowd: "Medium",
        why: "A sit-down midday meal to rest before the museum visit.",
        about:
          "A classic thali brings together dal baati churma, gatte ki sabzi, and ker sangri — dishes shaped by Rajasthan's arid climate and royal kitchens.",
      },
      {
        time: "3:00 – 4:30 PM",
        place: "Albert Hall Museum",
        tag: "Museum",
        cost: 300,
        crowd: "Medium",
        why: "A shaded, indoor option during the hottest part of the afternoon.",
        about:
          "Completed in 1887 in the Indo-Saracenic style, it's Rajasthan's oldest museum, housing miniature paintings, metalwork, and an Egyptian mummy.",
      },
      {
        time: "5:30 – 7:00 PM",
        place: "Jal Mahal Viewpoint",
        tag: "Viewpoint",
        cost: 0,
        crowd: "Medium",
        why: "Sunset over Man Sagar Lake, with the palace silhouette lit in golden light.",
        about:
          "Renovated in the 18th century under Maharaja Madho Singh I, this five-storey palace sits in the middle of the lake, with four floors submerged beneath the water line.",
        guide: {
          name: "Imran Qureshi",
          rating: "4.7",
          price: "₹600 for 1.5 hrs",
          phone: "+91 98XXX XX833",
          speciality: "Lake ecology & photography spots",
        },
      },
      {
        time: "8:00 – 9:30 PM",
        place: "Rooftop Dinner, Walled City",
        tag: "Food",
        cost: 900,
        crowd: "Medium",
        why: "An evening slot for a relaxed dinner with a view over the illuminated old city.",
        about:
          "Several havelis in the walled city have converted their rooftops into restaurants, pairing Rajasthani food with live folk music and fort views.",
      },
    ],
  },
  "3": {
    heading: "Forts, stepwells & a farewell",
    sub: "7 stops · craft workshop & a slower finish",
    stops: [
      {
        time: "6:00 – 7:30 AM",
        place: "Jaigarh Fort",
        tag: "Fort",
        cost: 150,
        crowd: "Low",
        why: "Sunrise over the Aravalli hills, with far fewer visitors than Amer next door.",
        about:
          "Built in 1726 by Sawai Jai Singh II, Jaigarh houses Jaivana — the largest cannon on wheels in the world — and overlooks Amer Fort below.",
      },
      {
        time: "8:00 – 9:00 AM",
        place: "Mishri Mawa Kachori Stop",
        tag: "Food",
        cost: 100,
        crowd: "Low",
        why: "Best eaten fresh and warm before the shop's morning batch runs out.",
        about:
          "A sweeter cousin of the classic kachori, stuffed with a mawa-and-nut filling — a Jaipur specialty found mostly around the old city.",
      },
      {
        time: "9:30 – 11:00 AM",
        place: "Panna Meena ka Kund",
        tag: "Viewpoint",
        cost: 0,
        crowd: "Low",
        why: "Soft morning light works best for photographing the symmetrical stepwell staircases.",
        about:
          "A centuries-old stepwell near Amer with a striking double-staircase design, historically used for water storage and as a cool retreat in summer.",
      },
      {
        time: "11:30 AM – 1:00 PM",
        place: "Birla Mandir",
        tag: "Temple",
        cost: 0,
        crowd: "Medium",
        why: "Late-morning light suits the white marble exterior, and it's cooler than a midday visit.",
        about:
          "Completed in 1988, this Lakshmi Narayan temple in white marble features carved panels depicting figures from multiple faiths and philosophies.",
      },
      {
        time: "2:00 – 3:30 PM",
        place: "Craft Workshop with a Local Guide",
        tag: "Culture",
        cost: 1200,
        crowd: "Low",
        why: "A quieter afternoon slot, ideal for a hands-on session instead of more walking.",
        about:
          "Try a short blue pottery or block-printing workshop with a verified local artisan-guide — a hands-on way to understand Jaipur's craft traditions.",
        guide: {
          name: "Sunita Devi",
          rating: "5.0",
          price: "₹1,200 for 2 hrs",
          phone: "+91 98XXX XX056",
          speciality: "Blue pottery & block printing",
        },
      },
      {
        time: "4:30 – 6:00 PM",
        place: "Chandpole Bazaar",
        tag: "Bazaar",
        cost: 0,
        crowd: "Medium",
        why: "Late-afternoon light and cooler temperatures suit a final heritage shopping walk.",
        about:
          "Known for marble idols, temple carvings, and traditional handicrafts, this bazaar has supplied artisans' work across Rajasthan for generations.",
      },
      {
        time: "7:00 – 9:00 PM",
        place: "Farewell Dinner & Folk Music",
        tag: "Culture",
        cost: 1000,
        crowd: "Medium",
        why: "A closing evening slot to wind down the trip with live music.",
        about:
          "A final Rajasthani meal paired with live folk singing — a fitting close to a trip built around the city's food, forts, and traditions.",
      },
    ],
  },
};

export const cities = [
  { name: "Jaipur", status: "live", note: "Pink City · 3-day plan ready" },
  { name: "Udaipur", status: "soon", note: "City of Lakes" },
  { name: "Jodhpur", status: "soon", note: "The Blue City" },
  { name: "Varanasi", status: "soon", note: "Ghats & rituals" },
];

export function classify(text: string) {
  const q = text.toLowerCase();
  if (/(udaipur|jodhpur|varanasi|agra|delhi|goa|kerala|manali)/.test(q)) return "other-city";
  if (/(budget|cost|price|cheap|money|₹)/.test(q)) return "budget";
  if (/(guide|contact|book|hire)/.test(q)) return "guide";
  if (/(food|kachori|eat|lassi|thali|breakfast)/.test(q)) return "food";
  if (/(relax|slow|less walking|easy|light|gentle)/.test(q)) return "relax";
  if (
    /(jaipur|hawa mahal|amer fort|nahargarh|city palace|jantar mantar|jaigarh|chokhi dhani|pink city)/.test(
      q,
    )
  )
    return "itinerary";
  if (/day/.test(q) && /[123]/.test(q)) return "day-switch";
  return "fallback";
}
