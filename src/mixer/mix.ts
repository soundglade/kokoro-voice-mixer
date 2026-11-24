import {
  DEFAULT_SPEED,
  MAX_MIX_VOICES,
  SPEED_MAX,
  SPEED_MIN,
  SPEED_STEP,
  VOICES,
  getLanguageGroup,
  getVoice,
  inGroup,
  type LanguageCode,
  type LanguageGroup,
} from "./voices";

const PART_PATTERN = /^([a-z]{2}_[a-z]+)(?:\((\d*\.?\d+)\))?$/;
const RANDOM_SPEEDS = [0.8, 0.85, 0.9, 0.95, 1];

// Weights are amounts from 1 to 100. Kokoro divides each by their sum, so
// only the proportions matter.
type MixVoice = { id: string; weight: number };
export type Mix = { voices: MixVoice[]; speed: number };

// Reads Kokoro blend strings such as "af_nicole+af_aoede(0.2)". A voice
// without a weight counts as 1. Returns null for anything Kokoro would reject.
export function parseBlend(blend: string): MixVoice[] | null {
  const parts = blend.split("+").map((part) => part.trim());
  if (parts.length > MAX_MIX_VOICES) return null;

  const voices: MixVoice[] = [];
  for (const part of parts) {
    const match = PART_PATTERN.exec(part);
    if (!match || !getVoice(match[1])) return null;
    if (voices.some((voice) => voice.id === match[1])) return null;
    const weight = match[2] === undefined ? 1 : Number(match[2]);
    if (!(weight > 0)) return null;
    voices.push({ id: match[1], weight });
  }

  const max = Math.max(...voices.map((voice) => voice.weight));
  return voices.map((voice) => ({
    id: voice.id,
    weight: Math.max(1, Math.round((voice.weight / max) * 100)),
  }));
}

// Writes the blend base voice first, with weights relative to the loudest
// voice, which needs none: "af_nicole+af_aoede(0.2)". Reading the result back
// with parseBlend gives the same blend. Kokoro rejects a weight on a single
// voice, so a single voice is just its ID.
export function formatBlend(voices: MixVoice[]) {
  if (voices.length === 1) return voices[0].id;
  const max = Math.max(...voices.map((voice) => voice.weight));
  return voices
    .map((voice) => {
      const weight = Math.max(0.01, Number((voice.weight / max).toFixed(2)));
      return weight === 1 ? voice.id : `${voice.id}(${weight})`;
    })
    .join("+");
}

export function mixFromSettings(settings: {
  voice: string;
  speed?: number;
}): Mix | null {
  const voices = parseBlend(settings.voice);
  if (!voices) return null;
  return { voices, speed: clampSpeed(settings.speed ?? DEFAULT_SPEED) };
}

export function mixToSettings(mix: Mix) {
  return { voice: formatBlend(mix.voices), speed: mix.speed };
}

export function sameMix(a: Mix, b: Mix) {
  return a.speed === b.speed && formatBlend(a.voices) === formatBlend(b.voices);
}

// Whole percentages that always add up to 100.
export function percentages(voices: MixVoice[]) {
  const total = voices.reduce((sum, voice) => sum + voice.weight, 0);
  const exact = voices.map((voice) => (voice.weight / total) * 100);
  const rounded = exact.map(Math.floor);
  let missing = 100 - rounded.reduce((sum, value) => sum + value, 0);
  const byRemainder = exact
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder);
  for (const { index } of byRemainder) {
    if (missing <= 0) break;
    rounded[index]++;
    missing--;
  }
  return rounded;
}

// The base voice, the first one, sets the pronunciation for the whole mix.
export function mixLanguage(mix: Mix): LanguageCode | null {
  return mix.voices.length ? getVoice(mix.voices[0].id)!.language : null;
}

export function describeMix(mix: Mix) {
  const shares = percentages(mix.voices);
  return mix.voices
    .map((voice, index) => `${getVoice(voice.id)!.name} ${shares[index]}%`)
    .join(" · ");
}

export function clampSpeed(speed: number) {
  const stepped = Math.round(speed / SPEED_STEP) * SPEED_STEP;
  return Number(Math.min(SPEED_MAX, Math.max(SPEED_MIN, stepped)).toFixed(2));
}

export function addVoice(mix: Mix, id: string): Mix {
  const weight = mix.voices.length ? 40 : 100;
  return { ...mix, voices: [...mix.voices, { id, weight }] };
}

// Removing the base voice hands its place to the next voice of the same
// language, so the mix keeps its language.
export function removeVoice(mix: Mix, id: string): Mix {
  const rest = {
    ...mix,
    voices: mix.voices.filter((voice) => voice.id !== id),
  };
  if (mix.voices[0]?.id !== id) return rest;
  const group = getLanguageGroup(getVoice(id)!.language);
  const next = rest.voices.find((voice) => inGroup(getVoice(voice.id)!, group));
  return next ? makeBase(rest, next.id) : rest;
}

export function makeBase(mix: Mix, id: string): Mix {
  const voice = mix.voices.find((item) => item.id === id)!;
  return {
    ...mix,
    voices: [voice, ...mix.voices.filter((item) => item.id !== id)],
  };
}

export function setWeight(mix: Mix, id: string, weight: number): Mix {
  return {
    ...mix,
    voices: mix.voices.map((voice) =>
      voice.id === id ? { ...voice, weight } : voice,
    ),
  };
}

// A playful random blend of voices from one language. The base voice is one
// of the better graded voices when the language has any.
export function randomMix(group: LanguageGroup): Mix {
  const voices = VOICES.filter((voice) => inGroup(voice, group));
  const graded = voices.filter((voice) => gradeScore(voice.grade) >= 2);
  const base = pick(graded.length ? graded : voices);
  const others = shuffle(voices.filter((voice) => voice !== base)).slice(
    0,
    randomInt(1, 2),
  );

  return {
    voices: [
      { id: base.id, weight: randomInt(70, 100) },
      ...others.map((voice) => ({ id: voice.id, weight: randomInt(15, 60) })),
    ],
    speed: pick(RANDOM_SPEEDS),
  };
}

// A, B, C, D and F map to 4 to 0, with a third of a step for + and -.
// Ungraded voices sit between C and D.
export function gradeScore(grade: string | null) {
  if (!grade) return 1.5;
  const base = { A: 4, B: 3, C: 2, D: 1, F: 0 }[grade[0]] ?? 0;
  if (grade[1] === "+") return base + 0.3;
  if (grade[1] === "-") return base - 0.3;
  return base;
}

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function shuffle<T>(items: T[]) {
  return items
    .map((item) => ({ item, order: Math.random() }))
    .sort((a, b) => a.order - b.order)
    .map(({ item }) => item);
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
