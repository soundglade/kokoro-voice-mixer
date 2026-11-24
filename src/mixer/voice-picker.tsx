import { Plus } from "lucide-react";
import { useState } from "react";
import type { SynthesizeRequest } from "./clips";
import {
  addVoice,
  gradeScore,
  type Mix,
} from "./mix";
import {
  Chip,
  IconButton,
  PlayIcon,
  Section,
  TextButton,
  type ClipState,
} from "./ui";
import {
  MAX_MIX_VOICES,
  VOICES,
  getLanguage,
  getVoice,
  inGroup,
  type BaseVoice,
  type LanguageGroup,
} from "./voices";

const COLLAPSED_COUNT = 6;

type Gender = BaseVoice["gender"];

// The voices people can add to the mix: those of the mix's language, with the
// base voice's gender first. Voices of other languages are one step away.
export function VoicePicker({
  mix,
  group,
  onMixChange,
  previewState,
  onPreview,
  className,
}: {
  mix: Mix;
  group: LanguageGroup;
  onMixChange: (mix: Mix) => void;
  previewState: (request: SynthesizeRequest) => ClipState;
  onPreview: (request: SynthesizeRequest) => void;
  className?: string;
}) {
  const base = mix.voices[0] && getVoice(mix.voices[0].id);
  const [gender, setGender] = useState<Gender>(base?.gender ?? "female");
  const [shownBaseId, setShownBaseId] = useState(base?.id);
  if (base && base.id !== shownBaseId) {
    setShownBaseId(base.id);
    setGender(base.gender);
  }
  const [showAll, setShowAll] = useState(false);
  const [showOtherLanguages, setShowOtherLanguages] = useState(false);

  const available = VOICES.filter(
    (voice) =>
      voice.gender === gender &&
      !mix.voices.some((item) => item.id === voice.id),
  );
  const own = available
    .filter((voice) => inGroup(voice, group))
    .sort((a, b) => gradeScore(b.grade) - gradeScore(a.grade));
  const others = available.filter((voice) => !inGroup(voice, group));
  const full = mix.voices.length >= MAX_MIX_VOICES;

  const card = (voice: BaseVoice) => {
    const request = previewRequest(voice, mix.speed);
    return (
      <VoiceCard
        key={voice.id}
        voice={voice}
        label={voiceLabel(voice, group)}
        previewState={previewState(request)}
        canAdd={!full}
        onPreview={() => onPreview(request)}
        onAdd={() => onMixChange(addVoice(mix, voice.id))}
      />
    );
  };

  return (
    <Section
      title="Add a Voice"
      className={className}
      aside={
        <div className="flex gap-1.5">
          {(["female", "male"] as const).map((item) => (
            <Chip
              key={item}
              active={gender === item}
              onClick={() => setGender(item)}
              className="h-8 px-3"
            >
              {item === "female" ? "Female" : "Male"}
            </Chip>
          ))}
        </div>
      }
    >
      {full && (
        <p className="text-sm text-muted-foreground">
          A mix can have up to {MAX_MIX_VOICES} voices. Remove one to add
          another.
        </p>
      )}

      {own.length > 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {(showAll ? own : own.slice(0, COLLAPSED_COUNT)).map(card)}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          No {gender} voices to add in {group.name}.
        </p>
      )}

      <div className="flex flex-wrap gap-x-5 gap-y-1">
        {own.length > COLLAPSED_COUNT && (
          <TextButton onClick={() => setShowAll(!showAll)}>
            {showAll
              ? "Show Fewer"
              : `Show ${own.length - COLLAPSED_COUNT} More`}
          </TextButton>
        )}
        <TextButton onClick={() => setShowOtherLanguages(!showOtherLanguages)}>
          {showOtherLanguages ? "Hide Other Languages" : "Show Other Languages"}
        </TextButton>
      </div>

      {showOtherLanguages && (
        <div className="space-y-3 pt-2">
          <p className="text-sm text-muted-foreground">
            Voices from other languages lend their tone. Your base voice still
            sets the pronunciation.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {others.map(card)}
          </ul>
        </div>
      )}
    </Section>
  );
}

// US or UK for English voices, and the language for voices of another one.
export function voiceLabel(voice: BaseVoice, group: LanguageGroup) {
  if (!inGroup(voice, group)) return getLanguage(voice.language).shortName;
  if (voice.language === "a") return "US";
  if (voice.language === "b") return "UK";
  return null;
}

function VoiceCard({
  voice,
  label,
  previewState,
  canAdd,
  onPreview,
  onAdd,
}: {
  voice: BaseVoice;
  label: string | null;
  previewState: ClipState;
  canAdd: boolean;
  onPreview: () => void;
  onAdd: () => void;
}) {
  return (
    <li className="space-y-1.5 rounded bg-background p-3">
      <div className="flex items-center gap-3">
        <IconButton
          label={`${previewState === "playing" ? "Pause" : "Hear"} ${voice.name}`}
          onClick={onPreview}
          className="bg-muted text-foreground hover:bg-foreground/10"
        >
          <PlayIcon state={previewState} />
        </IconButton>
        <div className="flex min-w-0 flex-1 items-baseline gap-x-2">
          <span className="truncate">{voice.name}</span>
          {label && (
            <span className="text-xs text-muted-foreground">{label}</span>
          )}
        </div>
        <IconButton
          label={`Add ${voice.name}`}
          onClick={onAdd}
          disabled={!canAdd}
          className="bg-muted text-foreground hover:bg-foreground/10"
        >
          <Plus />
        </IconButton>
      </div>
      <p className="text-sm text-muted-foreground">{voice.description}</p>
    </li>
  );
}

function previewRequest(voice: BaseVoice, speed: number): SynthesizeRequest {
  return { text: voice.preview, voice: voice.id, speed };
}
