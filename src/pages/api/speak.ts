import type { NextApiRequest, NextApiResponse } from "next";
import { formatBlend, parseBlend } from "../../mixer/mix";
import { MAX_TEXT_LENGTH, SPEED_MAX, SPEED_MIN } from "../../mixer/voices";

// Together AI and Kokoro-FastAPI both serve Kokoro through the OpenAI speech
// API and accept the same blend strings. KOKORO_URL names your own server;
// without it, speech comes from Together AI.
const SELF_HOSTED_URL = process.env.KOKORO_URL?.replace(/\/+$/, "");
const SPEECH_URL = SELF_HOSTED_URL
  ? `${SELF_HOSTED_URL}/v1/audio/speech`
  : "https://api.together.ai/v1/audio/speech";
const MODEL = SELF_HOSTED_URL ? "kokoro" : "hexgrad/Kokoro-82M";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") return res.status(405).end();
  if (!SELF_HOSTED_URL && !process.env.TOGETHER_API_KEY)
    return res.status(500).json({
      error: "Set TOGETHER_API_KEY or KOKORO_URL in .env.local, then restart.",
    });

  const { text, voice, speed } = req.body;
  if (
    typeof text !== "string" ||
    !text.trim() ||
    text.length > MAX_TEXT_LENGTH
  )
    return res.status(400).json({
      error: `Write between 1 and ${MAX_TEXT_LENGTH} characters of text.`,
    });
  const voices = typeof voice === "string" ? parseBlend(voice) : null;
  if (!voices)
    return res.status(400).json({ error: "This voice mix is not valid." });
  if (typeof speed !== "number" || speed < SPEED_MIN || speed > SPEED_MAX)
    return res.status(400).json({
      error: `Speed must be between ${SPEED_MIN} and ${SPEED_MAX}.`,
    });

  try {
    const response = await fetch(SPEECH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(SELF_HOSTED_URL
          ? {}
          : { Authorization: `Bearer ${process.env.TOGETHER_API_KEY}` }),
      },
      body: JSON.stringify({
        model: MODEL,
        input: text.trim(),
        voice: formatBlend(voices),
        speed,
        response_format: "mp3",
      }),
    });
    if (!response.ok)
      throw new Error(`${response.status}: ${await response.text()}`);

    res.setHeader("Content-Type", "audio/mpeg");
    res.send(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error("Kokoro speech failed:", error);
    res
      .status(502)
      .json({ error: "Kokoro could not read this text. Please try again." });
  }
}
