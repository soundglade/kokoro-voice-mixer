import * as SliderPrimitive from "@radix-ui/react-slider";
import { clsx, type ClassValue } from "clsx";
import { Loader2, Pause, Play } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { parseBlend } from "./mix";
import {
  LANGUAGE_GROUPS,
  PRESETS,
  VOICES,
  inGroup,
} from "./voices";

// Each Kokoro voice keeps one color everywhere. Colors are spread within each
// language, the voices of its presets first, so the voices people mix
// together get clearly different colors. Hues step by the golden angle, and
// the first voice of each language, such as Nicole, gets the accent gold.
const PRESET_VOICE_IDS = PRESETS.flatMap((preset) =>
  parseBlend(preset.voice)!.map((voice) => voice.id),
);
const VOICE_COLORS = new Map(
  LANGUAGE_GROUPS.flatMap((group) => {
    const ids = VOICES.filter((voice) => inGroup(voice, group)).map(
      (voice) => voice.id,
    );
    const ordered = [
      ...new Set([
        ...PRESET_VOICE_IDS.filter((id) => ids.includes(id)),
        ...ids,
      ]),
    ];
    return ordered.map((id, index) => {
      const hue = Math.round((38 + index * 137.508) % 360);
      return [id, `hsl(${hue} 38% 60%)`] as const;
    });
  }),
);

export function voiceColor(id: string) {
  return VOICE_COLORS.get(id)!;
}

const ACCENT_CLASS = "bg-accent-gradient font-medium text-white contrast-110";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ClipState = "idle" | "loading" | "playing";

export function PlayIcon({ state }: { state: ClipState }) {
  if (state === "loading") return <Loader2 className="size-4 animate-spin" />;
  if (state === "playing") return <Pause className="size-4 fill-current" />;
  return <Play className="size-4 fill-current" />;
}

export function Section({
  title,
  aside,
  children,
  className,
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "space-y-4 rounded bg-card p-4 text-card-foreground shadow-xs sm:p-6",
        className,
      )}
    >
      <div className="flex min-h-9 items-center justify-between gap-3">
        <h2 className="text-lg whitespace-nowrap">{title}</h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function Button({
  variant = "default",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: "default" | "outline" }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded px-5 whitespace-nowrap outline-none select-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none has-[>svg]:px-4",
        variant === "default"
          ? `${ACCENT_CLASS} shadow-[0px_8px_20px_-12px_rgba(150,110,40,0.7)] transition-[filter] hover:contrast-125 disabled:opacity-60`
          : "border border-border bg-background transition-colors hover:bg-muted disabled:text-muted-foreground/80",
        className,
      )}
      {...props}
    />
  );
}

export function Slider({
  color,
  className,
  ...props
}: ComponentProps<typeof SliderPrimitive.Root> & { color?: string }) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex h-5 w-full touch-none items-center select-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 grow overflow-hidden rounded-full bg-muted">
        <SliderPrimitive.Range
          className="absolute h-full bg-muted-foreground/60"
          style={color ? { background: color } : undefined}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-label={props["aria-label"]}
        className="block size-4 rounded-full bg-background shadow-md transition-shadow dark:bg-foreground outline-none hover:ring-4 hover:ring-ring/40 focus-visible:ring-4 focus-visible:ring-ring/60"
      />
    </SliderPrimitive.Root>
  );
}

export function Chip({
  active,
  className,
  ...props
}: ComponentProps<"button"> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
        active ? ACCENT_CLASS : "bg-background shadow-xs hover:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export function IconButton({
  label,
  title = label,
  className,
  children,
  ...props
}: ComponentProps<"button"> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TextButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className={cn(
        "text-sm text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:underline",
        className,
      )}
      {...props}
    />
  );
}
