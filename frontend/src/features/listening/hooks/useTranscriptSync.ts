import { useEffect, useRef, useState } from "react";
import type { Segment } from "../../../shared/types/demo";
export function useTranscriptSync(segments: Segment[]) {
  const mediaRef = useRef<HTMLMediaElement | null>(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState<Segment | null>(null);
  const active = segments.find(
    (s) => s.startMs <= time * 1000 && time * 1000 < s.endMs,
  );
  useEffect(() => {
    let frame: number;
    const tick = () => {
      const media = mediaRef.current;
      if (media) {
        if (loop && media.currentTime * 1000 >= loop.endMs)
          media.currentTime = loop.startMs / 1000;
        setTime(media.currentTime);
        setPlaying(!media.paused);
        if (Number.isFinite(media.duration)) setDuration(media.duration);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [loop]);
  const seek = (seconds: number) => {
    if (mediaRef.current)
      mediaRef.current.currentTime = Math.max(
        0,
        Math.min(duration || seconds, seconds),
      );
  };
  const toggle = async () => {
    const media = mediaRef.current;
    if (!media) return;
    if (media.paused) await media.play();
    else media.pause();
  };
  return {
    mediaRef,
    time,
    duration,
    playing,
    loop,
    setLoop,
    active,
    seek,
    toggle,
  };
}
