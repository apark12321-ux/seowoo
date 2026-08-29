import React from 'react';
import { Volume2, RefreshCw, Sparkles, CheckCircle2, AlertCircle, Award } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';
import { speechService } from '../../utils/speech';
import { evaluateWords, WordEvaluation } from '../../utils/scoring';

interface UserSpeechFeedbackBoxProps {
  spokenText: string;
  targetSentence: string;
  accuracyScore: number;
  feedbackStatus: 'idle' | 'listening' | 'analyzing' | 'try_again' | 'great_job' | 'perfect';
  onRetry: () => void;
  onSelectSentence?: (sentence: string) => void;
}

export const UserSpeechFeedbackBox: React.FC<UserSpeechFeedbackBoxProps> = ({
  spokenText,
  targetSentence,
  accuracyScore,
  feedbackStatus,
  onRetry,
}) => {
  const words: WordEvaluation[] = React.useMemo(() => {
    const textToCompare = targetSentence || 'I explore the jungle.';
    return evaluateWords(textToCompare, spokenText || '');
  }, [targetSentence, spokenText]);

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
        return accuracyScore > 0 ? '조금만 더 또렷하게 발음해볼까요? 💪' : '빨간 마이크를 누르고 영어로 말해보세요!';
      default:
        return '빨간색 마이크를 누르고 영어로 말해보세요!';
    }
  };

  const handlePlayReference = () => {
    soundEngine.playClick();
    speechService.speak(targetSentence || 'I explore the jungle.', 0.85);
  };

  const handlePlayWord = (word: string) => {
    soundEngine.playClick();
    speechService.speak(word, 0.8);
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-3xl border-4 border-[#1b88dd] shadow-2xl p-3 sm:p-4 relative select-none animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header Pill */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-black text-[#124974] tracking-wide flex items-center gap-1.5">
            <span>스피킹 분석 리포트</span>
            {feedbackStatus === 'listening' && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
            )}
          </span>
          {accuracyScore > 0 && feedbackStatus !== 'listening' && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                accuracyScore >= 90
                  ? 'bg-emerald-100 text-emerald-700'
                  : accuracyScore >= 75
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {accuracyScore}점 (정확도)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePlayReference}
            className="p-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#1b88dd] transition-colors flex items-center gap-1 text-[11px] font-bold"
            title="문장 전체 원어민 발음 듣기"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">전체 듣기</span>
          </button>
          <button
            onClick={onRetry}
            className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
            title="다시 말하기"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target & Spoken Word Evaluation Display */}
      <div className="min-h-[58px] bg-slate-50/70 border border-slate-200/80 rounded-2xl p-2.5 flex flex-col justify-center gap-1.5">
        <div className="flex items-center justify-start flex-wrap gap-x-2 gap-y-1.5 text-base sm:text-lg font-bold text-slate-800">
          {words.map((item, idx) => {
            if (item.status === 'correct') {
              return (
                <button
                  key={idx}
                  onClick={() => handlePlayWord(item.cleanWord)}
                  className="text-[#10b981] font-black underline decoration-4 decoration-[#10b981] underline-offset-4 hover:scale-105 transition-transform cursor-pointer"
                  title={`${item.cleanWord} (발음 우수 - 클릭 시 발음 듣기)`}
                >
                  {item.word}
                </button>
              );
            } else if (item.status === 'practice') {
              return (
                <button
                  key={idx}
                  onClick={() => handlePlayWord(item.cleanWord)}
                  className="border-2 border-[#f59e0b] text-[#d97706] rounded-full px-2.5 py-0.5 font-black bg-amber-50/90 shadow-sm hover:scale-105 transition-transform cursor-pointer text-sm sm:text-base"
                  title={`${item.cleanWord} (발음 연습 필요 - 클릭 시 발음 듣기)`}
                >
                  {item.word}
                </button>
              );
            } else {
              return (
                <button
                  key={idx}
                  onClick={() => handlePlayWord(item.cleanWord)}
                  className="border-2 border-rose-300 text-rose-600 rounded-xl px-2 py-0.5 font-black bg-rose-50/70 hover:scale-105 transition-transform cursor-pointer text-sm sm:text-base"
                  title={`${item.cleanWord} (발음 미인식 - 클릭 시 발음 듣기)`}
                >
                  {item.word}
                </button>
              );
            }
          })}
        </div>

        {/* Live speech feedback if different from target */}
        {spokenText && (
          <div className="text-[11px] font-semibold text-slate-500 pt-1 border-t border-slate-200/60 flex items-center gap-1.5">
            <span className="text-[#124974] font-black shrink-0">인식된 음성:</span>
            <span className="text-slate-700 italic truncate font-mono">
              "{spokenText}"
            </span>
          </div>
        )}
      </div>

      {/* Robot Assistant "Sparky" with Speech Bubble */}
      <div className="mt-2.5 flex items-center justify-end gap-2.5 pt-1">
        {/* Sparky's Encouraging Speech Bubble */}
        <div className="relative bg-[#fef3c7] border-2 border-[#f59e0b] rounded-2xl px-3.5 py-1.5 shadow-sm text-xs sm:text-sm font-black text-[#78350f]">
          {getFeedbackMessage()}
          {/* Bubble tail */}
          <div className="absolute right-[-7px] top-1/2 -translate-y-1/2 w-3 h-3 bg-[#fef3c7] border-t-2 border-r-2 border-[#f59e0b] transform rotate-45" />
        </div>

        {/* 3D-styled Robot Avatar */}
        <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 border-2 border-sky-300 shadow-md flex items-center justify-center relative shrink-0">
          <span className="text-2xl sm:text-3xl animate-bounce" style={{ animationDuration: '2s' }}>
            🤖
          </span>
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border border-white animate-ping" />
        </div>
      </div>
    </div>
  );
};

