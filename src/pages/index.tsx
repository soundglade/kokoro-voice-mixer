import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useState } from "react";
import { mixFromSettings, mixToSettings } from "../mixer/mix";
import { Button, Section } from "../mixer/ui";
import { VoiceMixer, sampleFor } from "../mixer/voice-mixer";
import { LANGUAGE_GROUPS, PRESETS, VOICES } from "../mixer/voices";

const title = "Kokoro Voice Mixer";
const description = `Blend ${VOICES.length} Kokoro voices in ${LANGUAGE_GROUPS.length} languages into a new voice and hear it right away. Copy the blend string for your own Kokoro setup.`;

export default function Page({
  settings,
}: {
  settings: { voice: string; speed: number };
}) {
  const [mix, setMix] = useState(() => mixFromSettings(settings)!);
  const [text, setText] = useState(() => sampleFor(mix));
  const current = mixToSettings(mix);
  const query = new URLSearchParams({
    voice: current.voice,
    speed: String(current.speed),
  });

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>

      <main className="mx-auto w-full max-w-6xl space-y-10 px-4 pt-8 pb-24 sm:px-6 md:space-y-14 md:pt-14 md:pb-40 lg:px-10">
        <header className="space-y-3 text-center">
          <h1 className="font-serif text-4xl font-medium italic md:text-5xl">
            Kokoro Voice Mixer
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-balance text-muted-foreground">
            Blend Kokoro voices into a new voice.
          </p>
        </header>

        <VoiceMixer
          mix={mix}
          onMixChange={setMix}
          text={text}
          onTextChange={setText}
          actions={
            <CopyButton
              label="Copy Link to This Mix"
              copied="Link Copied"
              value={() => `${location.origin}${location.pathname}?${query}`}
              disabled={!mix.voices.length}
            />
          }
        />

        {mix.voices.length > 0 && (
          <Section title="Use It With Your Kokoro">
            <code className="block rounded bg-background px-3 py-2 font-mono text-sm break-all">
              {current.voice}
            </code>
            <p className="text-sm text-muted-foreground">
              Together AI and Kokoro-FastAPI accept this string as the voice.
              The speed of this mix is {current.speed}.
            </p>
            <CopyButton
              label="Copy Blend"
              copied="Blend Copied"
              value={() => current.voice}
            />
          </Section>
        )}
      </main>
    </>
  );
}

// A link to a mix carries it as ?voice=af_nicole+af_aoede(0.2)&speed=0.9.
// A "+" typed by hand in a link arrives as a space.
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const linked =
    typeof query.voice === "string"
      ? mixFromSettings({
          voice: query.voice.replace(/ /g, "+"),
          speed: Number(query.speed) || undefined,
        })
      : null;
  return {
    props: {
      settings: mixToSettings(linked ?? mixFromSettings(PRESETS[0])!),
    },
  };
};

function CopyButton({
  label,
  copied,
  value,
  disabled,
}: {
  label: string;
  copied: string;
  value: () => string;
  disabled?: boolean;
}) {
  const [done, setDone] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value());
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  }

  return (
    <Button variant="outline" onClick={() => void copy()} disabled={disabled}>
      {done ? copied : label}
    </Button>
  );
}
