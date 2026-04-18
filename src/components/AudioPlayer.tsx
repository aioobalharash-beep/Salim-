"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface AudioPlayerProps {
  src: string;
  trackId: string;
  activeTrackId: string | null;
  onPlay: (id: string) => void;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({
  src,
  trackId,
  activeTrackId,
  onPlay,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Pause when another track starts
  useEffect(() => {
    if (activeTrackId !== trackId && playing) {
      audioRef.current?.pause();
      setPlaying(false);
    }
  }, [activeTrackId, trackId, playing]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      onPlay(trackId);
      audio.play();
      setPlaying(true);
    }
  }, [playing, onPlay, trackId]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressRef.current;
    const audio = audioRef.current;
    if (!bar || !audio || !duration) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setCurrentTime(audio.currentTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-5 w-full">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Play / Pause */}
      <button
        onClick={togglePlay}
        className="w-9 h-9 flex items-center justify-center shrink-0 border border-primary/20 hover:border-primary/40 transition-colors duration-300"
      >
        <span className="material-symbols-outlined text-primary/50 text-base">
          {playing ? "pause" : "play_arrow"}
        </span>
      </button>

      <div className="flex-1 flex flex-col gap-1.5">
        <div
          ref={progressRef}
          onClick={handleSeek}
          className="w-full h-[2px] bg-primary/10 cursor-pointer relative group"
        >
          <div
            className="absolute inset-y-0 left-0 bg-primary/35 group-hover:bg-primary/50 transition-colors"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-primary/40 group-hover:bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-none"
            style={{ left: `calc(${progress}% - 4px)` }}
          />
        </div>
        <div className="flex justify-between">
          <span className="font-label text-[9px] tracking-wider text-primary/30">
            {formatTime(currentTime)}
          </span>
          <span className="font-label text-[9px] tracking-wider text-primary/30">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
