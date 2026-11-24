import { describe, expect, it } from "vitest";
import {
  formatBlend,
  parseBlend,
  percentages,
  randomMix,
  removeVoice,
} from "../src/mixer/mix";
import {
  LANGUAGE_GROUPS,
  getVoice,
  inGroup,
} from "../src/mixer/voices";

describe("blends", () => {
  it("reads Kokoro blend strings as amounts relative to the loudest voice", () => {
    expect(parseBlend("af_nicole+af_aoede(0.2)")).toEqual([
      { id: "af_nicole", weight: 100 },
      { id: "af_aoede", weight: 20 },
    ]);
    expect(parseBlend("af_nicole(5)+af_aoede(1)")).toEqual(
      parseBlend("af_nicole+af_aoede(0.2)"),
    );
  });

  it("rejects what Kokoro would reject", () => {
    for (const blend of [
      "",
      "af_nope",
      "af_nicole+af_aoede(0)",
      "af_nicole+af_nicole",
      "af_nicole-af_aoede",
    ])
      expect(parseBlend(blend)).toBeNull();
  });

  it("writes a blend that reads back to the same blend", () => {
    for (let i = 0; i < 200; i++) {
      const blend = formatBlend(randomMix(LANGUAGE_GROUPS[0]).voices);
      expect(formatBlend(parseBlend(blend)!)).toBe(blend);
    }
    expect(
      formatBlend([
        { id: "af_nicole", weight: 80 },
        { id: "af_aoede", weight: 20 },
      ]),
    ).toBe("af_nicole+af_aoede(0.25)");
    expect(formatBlend([{ id: "bf_emma", weight: 30 }])).toBe("bf_emma");
  });

  it("shows whole percentages that add up to 100", () => {
    const shares = percentages([
      { id: "a", weight: 1 },
      { id: "b", weight: 1 },
      { id: "c", weight: 1 },
    ]);
    expect(shares.reduce((sum, share) => sum + share, 0)).toBe(100);
  });

  it("keeps random and edited mixes in their language", () => {
    for (const group of LANGUAGE_GROUPS)
      for (let i = 0; i < 20; i++)
        for (const voice of randomMix(group).voices)
          expect(inGroup(getVoice(voice.id)!, group)).toBe(true);

    const mix = {
      voices: parseBlend("af_nicole+jf_alpha(0.5)+bf_emma(0.3)")!,
      speed: 0.9,
    };
    expect(removeVoice(mix, "af_nicole").voices[0].id).toBe("bf_emma");
  });
});
