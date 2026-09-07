import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { buildSystemPrompt } from "./knowledge";
import { offlineAnswer } from "./offline";

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1),
  profile: z.object({
    name: z.string().optional(),
    location: z.string().optional(),
  }),
});

export type ChatReply = {
  text: string;
  engine: "gemini" | "lovable" | "offline";
};

async function callGemini(
  apiKey: string,
  system: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>,
): Promise<string> {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent",
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Gemini ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    candidates?: Array<{
      finishReason?: string;
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };
  const candidate = data.candidates?.[0];
  let text = candidate?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text.trim()) throw new Error("Gemini returned an empty response.");
  if (candidate?.finishReason === "MAX_TOKENS") {
    // Trim a dangling half-sentence / half-row so the reply never looks cut off.
    const lines = text.trimEnd().split("\n");
    if (lines.length > 1) lines.pop();
    text = lines.join("\n").trimEnd() + "\n\n_Ask me to continue for more detail._";
  }
  return text;
}

async function callLovable(
  apiKey: string,
  system: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>,
): Promise<string> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: { "content-type": "application/json", "Lovable-API-Key": apiKey },
    body: JSON.stringify({
      model: "openai/gpt-5.6-sol",
      instructions: system,
      reasoning: { effort: "low" },
      max_output_tokens: 4096,
      input: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) throw new Error("Too many requests right now — try again in a moment.");
    if (res.status === 402)
      throw new Error("AI credits are exhausted for this workspace. Add credits to continue.");
    throw new Error(`AI gateway ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    output_text?: string;
    output?: Array<{ content?: Array<{ text?: string }> }>;
  };
  const text =
    data.output_text ??
    data.output?.flatMap((o) => o.content?.map((c) => c.text ?? "") ?? []).join("") ??
    "";
  if (!text.trim()) throw new Error("The assistant returned an empty response.");
  return text;
}

/** Day-plan tables are allowed only for itinerary requests; elsewhere flatten them to bullets. */
function stripTables(text: string): string {
  if (!text.includes("|")) return text;
  const out: string[] = [];
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (/^\|.*\|$/.test(t)) {
      const cells = t.slice(1, -1).split("|").map((c) => c.trim());
      if (cells.every((c) => /^:?-{2,}:?$/.test(c) || c === "")) continue;
      const body = cells.filter(Boolean).join(" — ");
      if (body) out.push(`- ${body}`);
      continue;
    }
    out.push(line);
  }
  return out.join("\n");
}

const planIntent = (text: string) =>
  /\b(plan|itinerar|day\s*\d|\d+\s*day|schedule|trip)\b/i.test(text);

/** Read an env var across Node, Vercel and Worker-style runtimes. */
function readEnv(name: string): string | undefined {
  const sources: Array<Record<string, string | undefined> | undefined> = [
    typeof process !== "undefined" ? (process.env as Record<string, string | undefined>) : undefined,
    (globalThis as { env?: Record<string, string | undefined> }).env,
    (globalThis as { __env?: Record<string, string | undefined> }).__env,
  ];
  for (const src of sources) {
    const v = src?.[name] ?? src?.[`VITE_${name}`];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

export const askVirasat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }): Promise<ChatReply> => {
    const system = buildSystemPrompt(data.profile);
    const geminiKey = readEnv("GEMINI_API_KEY");
    const lastUserMsg =
      [...data.messages].reverse().find((m) => m.role === "user")?.content ?? "";
    const clean = (text: string) => (planIntent(lastUserMsg) ? text : stripTables(text));

    if (geminiKey) {
      try {
        return {
          text: clean(await callGemini(geminiKey, system, data.messages)),
          engine: "gemini",
        };
      } catch (error) {
        console.error("Gemini call failed, falling back:", error);
      }
    }

    const offline = (): ChatReply => ({
      text: offlineAnswer(lastUserMsg, data.profile),
      engine: "offline",
    });

    const lovableKey = readEnv("LOVABLE_API_KEY");
    if (!lovableKey) return offline();

    try {
      return {
        text: clean(await callLovable(lovableKey, system, data.messages)),
        engine: "lovable",
      };
    } catch (error) {
      console.error("Gateway call failed, using offline dataset engine:", error);
      return offline();
    }
  });
