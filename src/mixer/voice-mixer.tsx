import { Download, Shuffle, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { clipKey, useClips, type SynthesizeRequest } from "./clips";
import {
  describeMix,
  makeBase,
  mixFromSettings,
  mixLanguage,
  mixToSettings,
  percentages,
  randomMix,
  removeVoice,
  sameMix,
  setWeight,
  clampSpeed,
  type Mix,
} from "./mix";
import {
  Button,
  Chip,
  IconButton,
  PlayIcon,
  Section,
  Slider,
  TextButton,
  cn,
  voiceColor,
  type ClipState,
} from "./ui";
import { LanguageSelect } from "./language-select";
import { VoicePicker, voiceLabel } from "./voice-picker";
import {
  MAX_TEXT_LENGTH,
  PRESETS,
  SAMPLE_TEXTS,
  SPEED_MAX,
  SPEED_MIN,
  SPEED_STEP,
  VOICES,
  getLanguageGroup,
  getVoice,
  inGroup,
  type LanguageGroup,
} from "./voices";

const MAX_TAKES = 10;
const PRESET_MIXES = PRESETS.map((preset) => ({
  preset,
  mix: mixFromSettings(preset)!,
}));
// Texts the mixer writes itself. Any other text is the person's own, and
// loading a preset keeps it.
const SAMPLES = new Set([
  ...PRESETS.map((preset) => preset.text),
  ...Object.values(SAMPLE_TEXTS),
]);

type VoiceMixerProps = {
  mix: Mix;
  onMixChange: (mix: Mix) => void;
  text: string;
  onTextChange: (text: string) => void;
  // Shown next to Play Mix, such as Save or Share.
  actions?: ReactNode;
};

type Take = {
  number: number;
  mix: Mix;
  request: SynthesizeRequest;
  url: string;
};

export function VoiceMixer({
  mix,
  onMixChange,
  text,
  onTextChange,
  actions,
}: VoiceMixerProps) {
  const clips = useClips();
  const baseLanguage = mixLanguage(mix);
  // The chosen language stays when the mix is empty, and follows the base
  // voice when a mix from another language is loaded.
  const [group, setGroup] = useState(() =>
    getLanguageGroup(baseLanguage ?? "a"),
  );
  if (baseLanguage && !group.codes.includes(baseLanguage))
    setGroup(getLanguageGroup(baseLanguage));
  const [takes, setTakes] = useState<Take[]>([]);
  const [error, setError] = useState("");

  const presetsOf = (item: LanguageGroup) =>
    PRESET_MIXES.filter((presetMix) =>
      item.codes.includes(mixLanguage(presetMix.mix)!),
    );

  // Loads a mix, with its own sample text unless the person wrote their own.
  // Returns the text to read.
  function load(next: Mix, sample: string) {
    onMixChange(next);
    if (!SAMPLES.has(text)) return text;
    onTextChange(sample);
    return sample;
  }

  function chooseLanguage(next: LanguageGroup) {
    setGroup(next);
    const first = presetsOf(next)[0];
    const nextMix = first?.mix ?? randomMix(next);
    void playMix(
      nextMix,
      load(nextMix, first?.preset.text ?? sampleFor(nextMix)),
    );
  }

  const requestFor = (
    target: Mix,
    targetText = text,
  ): SynthesizeRequest | null =>
    target.voices.length && targetText.trim()
      ? {
          text: targetText.trim(),
          voice: mixToSettings(target).voice,
          speed: target.speed,
        }
      : null;
  const request = requestFor(mix);

  const playState = request ? clipState(clips, clipKey(request)) : "idle";

  async function play(request: SynthesizeRequest) {
    setError("");
    try {
      return await clips.toggle(request);
    } catch (cause) {
      setError((cause as Error).message);
      return null;
    }
  }

  // Takes the mix and text to play, so a newly picked preset can play right
  // away.
  async function playMix(playedMix = mix, playedText = text) {
    const request = requestFor(playedMix, playedText);
    if (!request) return;
    const clip = await play(request);
    if (!clip) return;
    setTakes((current) =>
      current.some((take) => clipKey(take.request) === clip.key)
        ? current
        : [
            {
              number: (current[0]?.number ?? 0) + 1,
              mix: playedMix,
              request,
              url: clip.url,
            },
            ...current,
          ].slice(0, MAX_TAKES),
    );
  }

  return (
    <div className="space-y-5">
      <section className="space-y-5 rounded bg-card p-4 text-card-foreground shadow-xs sm:p-6">
        <div className="flex items-center gap-3">
          <h2 className="text-sm text-muted-foreground">Language</h2>
          <LanguageSelect
            value={group}
            onChange={(item) => item !== group && chooseLanguage(item)}
          />
        </div>
        <ChipGroup title="Start From a Voice">
          {presetsOf(group).map((item) => (
            <Chip
              key={item.preset.name}
              active={sameMix(item.mix, mix)}
              onClick={() =>
                void playMix(item.mix, load(item.mix, item.preset.text))
              }
              title={describeMix(item.mix)}
            >
              {item.preset.name}
            </Chip>
          ))}
          {VOICES.filter((voice) => inGroup(voice, group)).length > 1 && (
            <Chip
              onClick={() => {
                const surprise = randomMix(group);
                void playMix(surprise, load(surprise, sampleFor(surprise)));
              }}
            >
              <Shuffle className="size-3.5" />
              Surprise Me
            </Chip>
          )}
        </ChipGroup>
      </section>

      <div className="sticky top-4 z-10 flex items-center gap-3 rounded-xl bg-background/90 py-2 pr-2 pl-5 shadow-lg backdrop-blur-md dark:bg-muted/95">
        <div className="min-w-0 flex-1 space-y-1.5">
          <ProportionBar mix={mix} className="h-1.5" />
          <p
            className={cn(
              "truncate text-xs",
              error ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {error ||
              (mix.voices.length
                ? `${describeMix(mix)} · ${mix.speed.toFixed(2)}×`
                : "Add a voice to play the mix")}
          </p>
        </div>
        <PlayMixButton
          state={playState}
          disabled={!request}
          onClick={() => void playMix()}
        />
      </div>

      {/* Two columns on desktop: the mix and Listen on the left, the voices
          to add on the right. Phones stack them as mix, voices, Listen. */}
      <div className="space-y-5 lg:grid lg:grid-cols-[2fr_1fr] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-5 lg:space-y-0">
        <Section title="Your Mix" className="lg:col-start-1">
          <MixEditor mix={mix} group={group} onMixChange={onMixChange} />

          <div className="space-y-3 px-3 pt-4 sm:px-4">
            <GroupHeading title="Speed" hint="How fast the voice reads." />
            <div className="flex items-center gap-4">
              <Slider
                aria-label="Speed"
                min={SPEED_MIN}
                max={SPEED_MAX}
                step={SPEED_STEP}
                value={[mix.speed]}
                onValueChange={([speed]) =>
                  onMixChange({ ...mix, speed: clampSpeed(speed) })
                }
              />
              <span className="w-12 shrink-0 text-right text-sm tabular-nums">
                {mix.speed.toFixed(2)}×
              </span>
            </div>
          </div>
        </Section>

        <VoicePicker
          className="lg:col-start-2 lg:row-span-2 lg:row-start-1"
          mix={mix}
          group={group}
          onMixChange={onMixChange}
          previewState={(request) => clipState(clips, clipKey(request))}
          onPreview={(request) => void play(request)}
        />

        <Section title="Listen" className="lg:col-start-1">
          <div className="space-y-2">
            {!SAMPLES.has(text) && (
              <div className="flex justify-end">
                <TextButton onClick={() => onTextChange(sampleFor(mix))}>
                  Use Sample Text
                </TextButton>
              </div>
            )}
            <textarea
              aria-label="Text to read"
              value={text}
              maxLength={MAX_TEXT_LENGTH}
              rows={3}
              onChange={(event) => onTextChange(event.target.value)}
              className="field-sizing-content w-full resize-y rounded bg-background px-3 py-2 text-base leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PlayMixButton
              state={playState}
              disabled={!request}
              onClick={() => void playMix()}
            />
            {actions}
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          {takes.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-sm text-muted-foreground">Takes</h3>
              <ol className="-mx-2 space-y-1">
                {takes.map((take) => (
                  <TakeRow
                    key={take.number}
                    take={take}
                    state={clipState(clips, clipKey(take.request))}
                    current={sameMix(take.mix, mix)}
                    onPlay={() => void play(take.request)}
                    onRestore={() => {
                      onMixChange(take.mix);
                      onTextChange(take.request.text);
                    }}
                  />
                ))}
              </ol>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

function PlayMixButton({
  state,
  disabled,
  onClick,
}: {
  state: ClipState;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      aria-busy={state === "loading"}
      className="shrink-0"
    >
      <PlayIcon state={state} />
      Play Mix
    </Button>
  );
}

function ProportionBar({ mix, className }: { mix: Mix; className?: string }) {
  const shares = percentages(mix.voices);
  return (
    <div
      className={cn("flex gap-0.5 overflow-hidden rounded-full", className)}
      aria-hidden
    >
      {mix.voices.map((voice, index) => (
        <div
          key={voice.id}
          className="h-full shrink-0 transition-[width] duration-300"
          style={{
            width: `${shares[index]}%`,
            background: voiceColor(voice.id),
          }}
        />
      ))}
    </div>
  );
}

function clipState(
  clips: { playing: string | null; loading: string | null },
  key: string,
): ClipState {
  if (clips.loading === key) return "loading";
  if (clips.playing === key) return "playing";
  return "idle";
}

function ChipGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <h2 className="text-sm text-muted-foreground">{title}</h2>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function MixEditor({
  mix,
  group,
  onMixChange,
}: {
  mix: Mix;
  group: LanguageGroup;
  onMixChange: (mix: Mix) => void;
}) {
  const shares = percentages(mix.voices);

  if (!mix.voices.length)
    return (
      <p className="rounded bg-background px-4 py-6 text-center text-muted-foreground">
        Pick a starting voice above, or add a voice below.
      </p>
    );

  const row = (index: number) => {
    const item = mix.voices[index];
    const voice = getVoice(item.id)!;
    return (
      <li key={item.id} className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          <span
            className="size-3 shrink-0 rounded-full"
            style={{ background: voiceColor(item.id) }}
          />
          <div className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2">
            <span>{voice.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {voiceLabel(voice, group)}
            </span>
          </div>
          <span className="w-10 text-right text-sm tabular-nums">
            {shares[index]}%
          </span>
          {index > 0 && inGroup(voice, group) && (
            <button
              type="button"
              onClick={() => onMixChange(makeBase(mix, item.id))}
              className="h-7 shrink-0 rounded-full bg-background px-2.5 text-xs shadow-xs text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              Make Base
            </button>
          )}
          <IconButton
            label={`Remove ${voice.name}`}
            onClick={() => onMixChange(removeVoice(mix, item.id))}
          >
            <X />
          </IconButton>
        </div>
        {mix.voices.length > 1 && (
          <div className="pl-5.5">
            <Slider
              aria-label={`${voice.name} amount`}
              color={voiceColor(item.id)}
              min={1}
              max={100}
              step={1}
              value={[item.weight]}
              onValueChange={([weight]) =>
                onMixChange(setWeight(mix, item.id, weight))
              }
            />
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3 rounded bg-background p-3 shadow-xs sm:p-4">
        <GroupHeading
          title="Base Voice"
          hint="Sets the pronunciation and adds its tone."
        />
        <ul>{row(0)}</ul>
      </div>

      {mix.voices.length > 1 && (
        <div className="space-y-3 px-3 sm:px-4">
          <GroupHeading
            title="Blended In"
            hint="Each slider sets that voice's share of the mix."
          />
          <ul className="space-y-4">
            {mix.voices.slice(1).map((_, index) => row(index + 1))}
          </ul>
        </div>
      )}
    </div>
  );
}

function GroupHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2">
      <h3 className="text-xs tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  );
}

function TakeRow({
  take,
  state,
  current,
  onPlay,
  onRestore,
}: {
  take: Take;
  state: ClipState;
  current: boolean;
  onPlay: () => void;
  onRestore: () => void;
}) {
  return (
    <li className="flex items-center gap-2 px-2 py-2">
      <IconButton
        label={
          state === "playing"
            ? `Pause Take ${take.number}`
            : `Play Take ${take.number}`
        }
        onClick={onPlay}
        className="bg-background text-foreground shadow-xs"
      >
        <PlayIcon state={state} />
      </IconButton>
      <div className="min-w-0 flex-1">
        <div className="text-sm">Take {take.number}</div>
        <div className="truncate text-xs text-muted-foreground">
          {describeMix(take.mix)} · {take.mix.speed.toFixed(2)}×
        </div>
      </div>
      {current ? (
        <span className="px-2 text-xs text-muted-foreground">Current</span>
      ) : (
        <button
          type="button"
          onClick={onRestore}
          className="h-8 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Use Mix
        </button>
      )}
      <a
        href={take.url}
        download={`kokoro-mix-take-${take.number}.mp3`}
        aria-label={`Download Take ${take.number}`}
        title={`Download Take ${take.number}`}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Download className="size-4" />
      </a>
    </li>
  );
}

// A preset's own text, or the language's sample text for any other mix.
export function sampleFor(mix: Mix) {
  const preset = PRESET_MIXES.find((item) => sameMix(item.mix, mix));
  return preset?.preset.text ?? SAMPLE_TEXTS[mixLanguage(mix) ?? "a"];
}
