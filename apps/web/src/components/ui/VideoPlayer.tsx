"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  RiPlayLargeLine, RiPauseLargeLine,
  RiVolumeMuteLine, RiVolumeUpLine,
  RiFullscreenLine, RiFullscreenExitLine,
  RiSettings3Line, RiLoader4Line,
} from "react-icons/ri";

function fmtTime(s: number) {
  if (!s || isNaN(s) || !isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function VideoPlayer({ url, poster, onPlay }: { url: string; poster?: string; onPlay?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [speed, setSpeed] = useState(1);

  const revealControls = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false);
    }, 3000);
  }, []);

  useEffect(() => {
    const onFs = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // Pause video (audio+video) when component unmounts
  useEffect(() => {
    return () => {
      const v = videoRef.current;
      if (v) { v.pause(); v.src = ""; v.load(); }
    };
  }, []);

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    if (v.buffered.length > 0)
      setBuffered(v.buffered.end(v.buffered.length - 1) / v.duration);
  };

  const onLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    setDuration(v.duration);
    v.volume = volume;
    setLoading(false);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); setShowControls(true); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    v.muted = val === 0;
    setVolume(val);
    setMuted(val === 0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = val;
    setCurrentTime(val);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) await wrapRef.current?.requestFullscreen();
    else await document.exitFullscreen();
  };

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div
      ref={wrapRef}
      onMouseMove={revealControls}
      onMouseLeave={() => { if (playing) setShowControls(false); }}
      className="relative w-full bg-black aspect-video select-none"
    >
      <video
        ref={videoRef}
        src={url}
        className="absolute inset-0 w-full h-full object-contain"
        preload="none"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onPlay={() => { setPlaying(true); revealControls(); onPlay?.(); }}
        onPause={() => { setPlaying(false); setShowControls(true); }}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onEnded={() => { setPlaying(false); setShowControls(true); }}
      />

      {/* Poster overlay — visible before first play */}
      {poster && !playing && currentTime === 0 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      )}

      <div className="absolute inset-0 cursor-pointer" onClick={togglePlay} />

      {loading && playing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <RiLoader4Line size={52} className="text-white/70 animate-spin" />
        </div>
      )}

      {!playing && showControls && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="size-20 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl">
            <RiPlayLargeLine size={36} className="text-white ms-1" />
          </div>
        </div>
      )}

      <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`} />

      <div className={`absolute inset-x-0 bottom-0 px-5 pb-4 pt-10 pointer-events-none transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}>
        <div dir="ltr" className="relative h-1 mb-4 group/bar pointer-events-auto cursor-pointer">
          <div className="absolute inset-0 bg-white/20 rounded-full" />
          <div className="absolute inset-y-0 left-0 bg-white/40 rounded-full pointer-events-none" style={{ width: `${buffered * 100}%` }} />
          <div className="absolute inset-y-0 left-0 bg-[var(--brand)] rounded-full pointer-events-none" style={{ width: `${progress * 100}%` }} />
          <input type="range" min={0} max={duration || 1} step={0.5} value={currentTime} onChange={handleSeek} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <div className="absolute top-1/2 -translate-y-1/2 size-3.5 rounded-full bg-white shadow-lg opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none" style={{ left: `calc(${progress * 100}% - 7px)` }} />
        </div>

        <div className="flex items-center justify-between gap-x-4 pointer-events-auto">
          <div className="flex items-center gap-x-4">
            <button onClick={togglePlay} className="text-white hover:text-[var(--brand)] transition-colors">
              {playing ? <RiPauseLargeLine size={24} /> : <RiPlayLargeLine size={24} />}
            </button>
            <div className="flex items-center gap-x-2 group/vol">
              <button onClick={toggleMute} className="text-white hover:text-[var(--brand)] transition-colors">
                {muted || volume === 0 ? <RiVolumeMuteLine size={22} /> : <RiVolumeUpLine size={22} />}
              </button>
              <input type="range" min={0} max={1} step={0.02} value={muted ? 0 : volume} onChange={handleVolumeChange} className="w-0 group-hover/vol:w-20 transition-all duration-300 accent-[var(--brand)] cursor-pointer overflow-hidden" />
            </div>
            <span className="text-white/80 text-sm font-mono tabular-nums">{fmtTime(currentTime)} / {fmtTime(duration)}</span>
          </div>
          <div className="flex items-center gap-x-3">
            <div className="relative">
              <button onClick={(e) => { e.stopPropagation(); setShowSettings((s) => !s); }} className={`transition-colors ${showSettings ? "text-[var(--brand)]" : "text-white/60 hover:text-white"}`}>
                <RiSettings3Line size={20} />
              </button>
              {showSettings && (
                <div className="absolute bottom-8 end-0 bg-[#1a1a2e]/95 backdrop-blur rounded-lg border border-white/10 shadow-2xl py-2 min-w-[140px] z-10" onClick={(e) => e.stopPropagation()}>
                  <p className="text-white/50 text-[11px] font-semibold px-3 pb-1.5 border-b border-white/10 mb-1">سرعة التشغيل</p>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
                    <button key={s} onClick={() => { if (videoRef.current) videoRef.current.playbackRate = s; setSpeed(s); setShowSettings(false); }} className={`w-full text-start px-3 py-1.5 text-sm transition-colors ${speed === s ? "text-[var(--brand)] font-semibold" : "text-white/80 hover:text-white hover:bg-white/5"}`}>
                      {s === 1 ? "عادي (1×)" : `${s}×`}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={toggleFullscreen} className="text-white hover:text-[var(--brand)] transition-colors">
              {fullscreen ? <RiFullscreenExitLine size={22} /> : <RiFullscreenLine size={22} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
