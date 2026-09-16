import { useEffect, useRef, useState } from "react";
import { useMediaUrl } from "../../../shared/hooks/useMediaUrl";
import { formatTime } from "../../../shared/components/ui";
export function MediaPreview({
  source,
  video = false,
  onDuration,
  onTime,
  seekTo,
}: {
  source: string;
  video?: boolean;
  onDuration?: (n: number) => void;
  onTime?: (n: number) => void;
  seekTo?: number;
}) {
  const { url, error } = useMediaUrl(source);
  const ref = useRef<HTMLMediaElement | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failure, setFailure] = useState("");
  useEffect(() => {
    if (seekTo !== undefined && ref.current) {
      ref.current.currentTime = seekTo;
      ref.current.play().catch(() => {});
    }
  }, [seekTo]);
  useEffect(() => {
    let cancelled = false;
    setFailure("");
    if (!url || video) return;
    const context = new AudioContext();
    fetch(url)
      .then((r) => r.arrayBuffer())
      .then((b) => context.decodeAudioData(b))
      .then((audio) => {
        if (cancelled) return;
        const ctx = canvas.current?.getContext("2d");
        if (!ctx) return;
        const values = audio.getChannelData(0);
        ctx.clearRect(0, 0, 600, 70);
        ctx.fillStyle = "#16a34a";
        for (let i = 0; i < 150; i++) {
          const start = Math.floor((i * values.length) / 150),
            end = Math.floor(((i + 1) * values.length) / 150);
          let max = 0;
          for (let j = start; j < end; j += 20)
            max = Math.max(max, Math.abs(values[j]));
          const height = Math.max(2, max * 65);
          ctx.fillRect(i * 4, 35 - height / 2, 2, height);
        }
      })
      .catch(() => {})
      .finally(() => {
        void context.close();
      });
    return () => {
      cancelled = true;
    };
  }, [url, video]);
  const props = {
    src: url || undefined,
    controls: true,
    onLoadedMetadata: () => {
      if (ref.current && Number.isFinite(ref.current.duration))
        onDuration?.(ref.current.duration);
    },
    onTimeUpdate: () => onTime?.(ref.current?.currentTime || 0),
    onError: () =>
      setFailure(
        "Tệp không phát được. Dùng URL trực tiếp .mp4/.mp3 hoặc tải tệp lên.",
      ),
  };
  return (
    <div className="media-preview">
      {video ? (
        <video
          ref={(el) => {
            ref.current = el;
          }}
          {...props}
        />
      ) : (
        <>
          <canvas
            ref={canvas}
            width={600}
            height={70}
            aria-label="Dạng sóng âm thanh"
          />
          <audio
            ref={(el) => {
              ref.current = el;
            }}
            {...props}
          />
        </>
      )}
      {(error || failure) && <p className="error">{error || failure}</p>}
    </div>
  );
}
