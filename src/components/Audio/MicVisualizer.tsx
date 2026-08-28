import React from 'react';
import { Mic, Volume2, Sparkles } from 'lucide-react';

interface MicVisualizerProps {
  isListening: boolean;
  micLevel: number;
  interimTranscript?: string;
  targetWord?: string;
  hintText?: string;
  onStop?: () => void;
}

export const MicVisualizer: React.FC<MicVisualizerProps> = ({
  isListening,
  micLevel,
  interimTranscript,
  targetWord,
  hintText = '목소리를 듣고 있어요! 큰 목소리로 말해보세요 ✨',
  onStop,
}) => {
  if (!isListening) return null;

  // Calculate 5 dynamic equalizer bar heights based on micLevel
  const normalizedLevel = Math.max(15, Math.min(100, micLevel));
  const barHeights = [
    Math.max(20, Math.round(normalizedLevel * 0.7)),
    Math.max(35, Math.round(normalizedLevel * 0.95)),
    Math.max(45, Math.round(normalizedLevel * 1.0)),
    Math.max(30, Math.round(normalizedLevel * 0.85)),
    Math.max(15, Math.round(normalizedLevel * 0.6)),
  ];

  return (
    <div className="w-full bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-2 border-rose-500/60 rounded-3xl p-4 sm:p-5 shadow-2xl animate-fadeIn relative overflow-hidden space-y-3">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-40 h-40 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />

      {/* Top Status Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping absolute" />
            <span className="w-3 h-3 rounded-full bg-rose-500" />
          </div>
          <span className="text-xs sm:text-sm font-black text-rose-400">
            마이크 작동 중 (음성 수신 ON)
          </span>
        </div>

        {/* Volume Level Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/80 border border-rose-500/30 text-[11px] sm:text-xs font-mono font-black text-amber-300">
          <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>입력 볼륨: {normalizedLevel}%</span>
        </div>
      </div>

      {/* Center Waveform & Mic Icon */}
      <div className="flex items-center justify-center gap-4 py-2">
        {/* Left Equalizer Bars */}
        <div className="flex items-end gap-1.5 h-12">
          {barHeights.map((h, idx) => (
            <div
              key={`l-${idx}`}
              className="w-1.5 sm:w-2 bg-gradient-to-t from-rose-500 to-amber-400 rounded-full transition-all duration-100 ease-out"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        {/* Center Glowing Mic */}
        <div className="relative">
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-rose-500/30 ring-4 ring-rose-400/40 animate-pulse cursor-pointer hover:scale-105 transition-transform"
            onClick={onStop}
            title="클릭하면 채점 완료"
          >
            <Mic className="w-7 h-7 animate-bounce" />
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-950 text-[10px] font-black text-amber-300 border border-amber-400/50 whitespace-nowrap shadow">
            말하기 완료시 터치!
          </span>
        </div>

        {/* Right Equalizer Bars */}
        <div className="flex items-end gap-1.5 h-12">
          {barHeights.slice().reverse().map((h, idx) => (
            <div
              key={`r-${idx}`}
              className="w-1.5 sm:w-2 bg-gradient-to-t from-rose-500 to-amber-400 rounded-full transition-all duration-100 ease-out"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Live Transcript / Hearing Box */}
      <div className="bg-slate-950/80 rounded-2xl p-3 border border-indigo-500/30 text-center space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>실시간 마이크 인식 내용:</span>
        </div>

        {interimTranscript ? (
          <p className="text-sm sm:text-base md:text-lg font-black text-amber-300 tracking-wide animate-fadeIn">
            "{interimTranscript}"
          </p>
        ) : (
          <p className="text-xs sm:text-sm font-semibold text-slate-300">
            {targetWord ? (
              <>
                <span className="text-amber-400 font-bold">"{targetWord}"</span> 단어를 또박또박 소리 내어 말해보세요!
              </>
            ) : (
              hintText
            )}
          </p>
        )}
      </div>
    </div>
  );
};
