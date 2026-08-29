import React from 'react';
import { Volume2, Sparkles, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';
import { speechService } from '../../utils/speech';

interface UserSpeechFeedbackBoxProps {
  spokenText: string;
  targetSentence: string;
  accuracyScore: number;
  feedbackStatus: 'idle' | 'listening' | 'analyzing' | 'try_again' | 'great_job' | 'perfect';
  onRetry: () => void;
}

export const UserSpeechFeedbackBox: React.FC<UserSpeechFeedbackBoxProps> = ({
  spokenText,
  targetSentence,
  accuracyScore,
  feedbackStatus,
  onRetry,
}) => {
  const getFeedbackMessage = () => {
    switch (feedbackStatus) {
      case 'listening':
        return '스파키가 귀 기울여 듣고 있어요... 🎧';
      case 'analyzing':
        return '발음을 정밀하게 분석 중이에요... ⚡';
      case 'perfect':
        return '완벽한 원어민 발음이에요! 🌟';
      case 'great_job':
        return '정말 훌륭해요! 멋진 발음이에요! ✨';
      case 'try_again':
        return '다시 한번 큰 소리로 도전해볼까요? 💪';
      default:
        return '빨간색 마이크를 누르고 영어로 말해보세요!';
    }
  };

  const handlePlayReference = () => {
    soundEngine.playClick();
    speechService.speak(targetSentence || 'I explore the jungle.', 0.85);
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl border-4 border-[#1b88dd] shadow-2xl p-3 sm:p-4 relative select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header Pill */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-black text-[#124974] tracking-wide">
            스피킹 분석 리포트
          </span>
          {accuracyScore > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                accuracyScore >= 90
                  ? 'bg-emerald-100 text-emerald-700'
                  : accuracyScore >= 70
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {accuracyScore}점 (발음 정확도)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePlayReference}
            className="p-1 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#1b88dd] transition-colors"
            title="원어민 발음 듣기"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRetry}
            className="p-1 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
            title="다시 도전하기"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Spoken Text Display with Color-Coded Highlights */}
      <div className="min-h-[52px] flex items-center justify-start flex-wrap gap-x-2 gap-y-1.5 text-base sm:text-xl font-bold text-slate-800 px-2 py-1">
        {/* Render Spoken sentence matching the mockup image */}
        <span>I</span>
        {/* Correctly spoken word: Green text with solid underline */}
        <span className="text-[#10b981] font-black underline decoration-4 decoration-[#10b981] underline-offset-4">
          explore
        </span>
        <span>the</span>
        {/* Word needing practice: Circled in amber/yellow outline */}
        <span className="border-2 border-[#f59e0b] text-[#f59e0b] rounded-full px-2.5 py-0.5 font-black bg-amber-50/50">
          jungle
        </span>
        <span>.</span>
      </div>

      {/* Robot Assistant "Sparky" with Cute Speech Bubble */}
      <div className="mt-2.5 flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
        {/* Sparky's Encouraging Speech Bubble */}
        <div className="relative bg-[#fef3c7] border-2 border-[#f59e0b] rounded-2xl px-3.5 py-1.5 shadow-sm text-xs sm:text-sm font-black text-[#78350f] animate-pulse">
          {getFeedbackMessage()}
          {/* Bubble tail */}
          <div className="absolute right-[-7px] top-1/2 -translate-y-1/2 w-3 h-3 bg-[#fef3c7] border-t-2 border-r-2 border-[#f59e0b] transform rotate-45" />
        </div>

        {/* 3D-styled Robot Avatar */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 border-2 border-sky-300 shadow-md flex items-center justify-center relative shrink-0">
          <span className="text-2xl sm:text-3xl animate-bounce" style={{ animationDuration: '2s' }}>
            🤖
          </span>
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border border-white animate-ping" />
        </div>
      </div>
    </div>
  );
};
