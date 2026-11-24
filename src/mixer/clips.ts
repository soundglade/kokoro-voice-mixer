import { useEffect, useRef, useState } from "react";
import { speakVoiceMix } from "./speak";

export type SynthesizeRequest = {
  text: string;
  voice: string;
  speed: number;
};

type Clip = { key: string; url: string };

// Plays one clip at a time. Each request is synthesized once and kept as a
// blob URL, so replays and takes play instantly.
export function useClips() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const cache = useRef(new Map<string, Promise<Clip>>());
  const latest = useRef(0);
  const [playing, setPlaying] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    const clips = cache.current;
    return () => {
      audio.current?.pause();
      clips.forEach((clip) =>
        clip.then(({ url }) => URL.revokeObjectURL(url)).catch(() => {}),
      );
      // React also runs this cleanup without unmounting (Strict Mode, hot
      // reloads). Forget the freed clips so they are fetched again.
      clips.clear();
    };
  }, []);

  function load(request: SynthesizeRequest) {
    const key = clipKey(request);
    let clip = cache.current.get(key);
    if (!clip) {
      clip = speakVoiceMix(request).then((blob) => ({
        key,
        url: URL.createObjectURL(blob),
      }));
      clip.catch(() => cache.current.delete(key));
      cache.current.set(key, clip);
    }
    return clip;
  }

  function stop() {
    latest.current++;
    audio.current?.pause();
    setPlaying(null);
    setLoading(null);
  }

  // Plays the clip, or stops it when it is already playing.
  async function toggle(request: SynthesizeRequest) {
    const key = clipKey(request);
    const active = playing === key || loading === key;
    stop();
    if (active) return null;

    const attempt = latest.current;
    setLoading(key);
    try {
      const clip = await load(request);
      if (attempt !== latest.current) return clip;
      setLoading(null);
      const element = (audio.current ??= new Audio());
      element.src = clip.url;
      element.onended = () =>
        setPlaying((current) => (current === key ? null : current));
      setPlaying(key);
      await element.play();
      return clip;
    } catch (error) {
      // Stopping or switching clips interrupts play() with an AbortError.
      if (attempt !== latest.current || (error as Error).name === "AbortError")
        return null;
      setLoading(null);
      setPlaying(null);
      // The browser could not play the audio, so fetch it again next time
      // and show our own message instead of the browser's.
      if (error instanceof DOMException) {
        cache.current.delete(key);
        throw new Error("This clip could not play. Please try again.");
      }
      throw error;
    }
  }

  return { playing, loading, toggle };
}

export function clipKey(request: SynthesizeRequest) {
  return JSON.stringify([request.text, request.voice, request.speed]);
}
