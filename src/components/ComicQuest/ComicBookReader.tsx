import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Sparkles, ChevronRight, ChevronLeft, RotateCcw, HelpCircle, CheckCircle2 } from 'lucide-react';
import { WordCapturePopUp } from './WordCapturePopUp';
import { UserSpeechFeedbackBox } from './UserSpeechFeedbackBox';
import { soundEngine } from '../../utils/soundEngine';
import { speechService } from '../../utils/speech';
import { evaluateUtterance, calculateTextSimilarity } from '../../utils/scoring';
import { UserChildProfile } from '../../types';

interface ComicBookReaderProps {
  currentQuestId: string;
  profile: UserChildProfile;
  onUpdateProfile: (updated: UserChildProfile) => void;
  onOpenHelp: () => void;
}

const COMIC_PANELS = [
  {
    id: 0,
    sentence: 'Liam enters the jungle.',
    sentenceKo: '리암이 신비로운 안개 정글로 들어갑니다.',
    keyWord: 'jungle',
  },
  {
    id: 1,
    sentence: 'If we explore, now bring an explore!',
    sentenceKo: '우리가 탐험(EXPLORE)을 시작하면, 모험이 열려!',
    keyWord: 'explore',
  },
  {
    id: 2,
    sentence: 'Leah, the hidden section, where is danger?',
    sentenceKo: '리아, 숨겨진 구역에서 위험(DANGER)이 어디 있어?',
    keyWord: 'danger',
  },
  {
    id: 3,
    sentence: 'Careful with danger! Let us find what is hidden!',
    sentenceKo: '위험을 조심하며 숨겨진(HIDDEN) 신비의 사원으로 뛰어가자!',
    keyWord: 'hidden',
  },
];

export const ComicBookReader: React.FC<ComicBookReaderProps> = ({
  currentQuestId,
  profile,
  onUpdateProfile,
  onOpenHelp,
}) => {
  const [selectedPanelIdx, setSelectedPanelIdx] = useState<number>(1);
  const [activeWordPopUp, setActiveWordPopUp] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [spokenTranscript, setSpokenTranscript] = useState<string>('If we explore');
  const [speechAccuracy, setSpeechAccuracy] = useState<number>(92);
  const [feedbackStatus, setFeedbackStatus] = useState<
    'idle' | 'listening' | 'analyzing' | 'try_again' | 'great_job' | 'perfect'
  >('great_job');

  const currentTargetSentence = COMIC_PANELS[selectedPanelIdx]?.sentence || COMIC_PANELS[0].sentence;

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      speechService.stopListening();
    };
  }, []);

  const handleToggleRecord = () => {
    soundEngine.playClick();
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setSpokenTranscript('');
    setFeedbackStatus('listening');

    let accumulatedTranscript = '';

    const success = speechService.startListening(
      (text, isFinal) => {
        accumulatedTranscript = text;
        setSpokenTranscript(text);
        if (isFinal) {
          processSpeechEvaluation(text);
        }
      },
      (error) => {
        // Fallback simulation if speech recognition encounters issues or permission blocked
        if (accumulatedTranscript) {
          processSpeechEvaluation(accumulatedTranscript);
        } else {
          // Provide friendly simulated sample speech
          setTimeout(() => {
            const fallbackText = currentTargetSentence;
            setSpokenTranscript(fallbackText);
            processSpeechEvaluation(fallbackText);
          }, 1500);
        }
      }
    );

    if (!success) {
      // Fallback
      setTimeout(() => {
        const fallbackText = currentTargetSentence;
        setSpokenTranscript(fallbackText);
        processSpeechEvaluation(fallbackText);
      }, 1500);
    }
  };

  const handleStopRecording = () => {
    speechService.stopListening();
    setIsRecording(false);
    if (spokenTranscript) {
      processSpeechEvaluation(spokenTranscript);
    } else {
      setFeedbackStatus('try_again');
    }
  };

  const processSpeechEvaluation = (spokenText: string) => {
    speechService.stopListening();
    setIsRecording(false);
    setFeedbackStatus('analyzing');

    // Smart Matching: check if user read current panel or another panel with higher similarity
    let bestPanelIdx = selectedPanelIdx;
    let bestScore = 0;

    COMIC_PANELS.forEach((panel, idx) => {
      const evaluation = evaluateUtterance(panel.sentence, spokenText);
      if (evaluation.displayScore > bestScore) {
        bestScore = evaluation.displayScore;
        bestPanelIdx = idx;
      }
    });

    // If another panel was clearly spoken, switch to it
    if (bestScore >= 75 && bestPanelIdx !== selectedPanelIdx) {
      setSelectedPanelIdx(bestPanelIdx);
    }

    const currentEval = evaluateUtterance(COMIC_PANELS[bestPanelIdx].sentence, spokenText);
    const finalScore = Math.max(bestScore, currentEval.displayScore);

    setTimeout(() => {
      setSpeechAccuracy(finalScore);
      if (finalScore >= 90) {
        setFeedbackStatus('perfect');
        soundEngine.playPerfect();
        onUpdateProfile({
          ...profile,
          coins: (profile.coins || 1500) + 30,
          levelXp: (profile.levelXp || 12) + 2,
        });
      } else if (finalScore >= 70) {
        setFeedbackStatus('great_job');
        soundEngine.playPerfect();
        onUpdateProfile({
          ...profile,
          coins: (profile.coins || 1500) + 15,
          levelXp: (profile.levelXp || 12) + 1,
        });
      } else {
        setFeedbackStatus('try_again');
        soundEngine.playClick();
      }
    }, 400);
  };

  const handleSelectPanel = (idx: number) => {
    soundEngine.playClick();
    setSelectedPanelIdx(idx);
    setSpokenTranscript('');
    setFeedbackStatus('idle');
  };

  const handleWordClick = (word: string) => {
    soundEngine.playClick();
    setActiveWordPopUp(word.toLowerCase());
  };

  const handleCaptureWord = (word: string) => {
    const updatedGems = {
      ...profile.wordGems,
      sapphire: (profile.wordGems?.sapphire || 14) + 1,
    };
    onUpdateProfile({
      ...profile,
      coins: (profile.coins || 1500) + 50,
      levelXp: (profile.levelXp || 12) + 2,
      wordGems: updatedGems,
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0b3353] p-2 sm:p-4 overflow-y-auto relative select-none">
      {/* Comic Book Strip 4-Panel Grid */}
      <div className="w-full max-w-6xl mx-auto flex-1 bg-[#fefefe] rounded-3xl border-4 border-[#124974] p-3 sm:p-4 shadow-2xl flex flex-col gap-3 relative min-h-[500px]">
        {/* Comic Strip Top Row (2 Panels) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
          {/* PANEL 1: Liam enters the jungle */}
          <div
            onClick={() => handleSelectPanel(0)}
            className={`bg-gradient-to-b from-teal-800 via-emerald-900 to-slate-950 border-4 rounded-2xl overflow-hidden relative p-3 flex flex-col justify-between shadow-md cursor-pointer transition-all duration-200 ${
              selectedPanelIdx === 0
                ? 'border-amber-400 ring-4 ring-amber-300/60 scale-[1.01]'
                : 'border-slate-900 hover:border-sky-400'
            }`}
          >
            {/* Jungle Graphic Background */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute bottom-0 right-0 text-7xl sm:text-8xl opacity-60">🌴🌿</div>
            <div className="absolute bottom-2 left-2 text-5xl sm:text-6xl">🌲</div>

            {/* Target indicator badge */}
            {selectedPanelIdx === 0 && (
              <div className="absolute top-2 right-2 z-20 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>스피킹 타깃</span>
              </div>
            )}

            {/* Speech Bubble: "Liam enters the jungle." with Korean translation */}
            <div className="relative z-10 self-start max-w-[85%] bg-white border-2 border-slate-900 rounded-2xl px-3.5 py-2 shadow-lg">
              <p className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-snug">
                Liam enters the jungle.
              </p>
              <p className="text-[10px] font-bold text-sky-700 mt-0.5">
                리암이 신비로운 안개 정글로 들어갑니다.
              </p>
              {/* Bubble tail */}
              <div className="absolute -bottom-2 left-6 w-3.5 h-3.5 bg-white border-b-2 border-r-2 border-slate-900 transform rotate-45" />
            </div>

            {/* Characters in Panel 1: Liam & Sparky */}
            <div className="relative z-10 flex items-end justify-start gap-2 mt-8">
              {/* Liam */}
              <div className="flex flex-col items-center">
                <span className="text-5xl sm:text-6xl filter drop-shadow-lg">👦🏽</span>
                <span className="text-[10px] font-black text-amber-300 bg-slate-900/80 px-2 py-0.5 rounded-full mt-0.5">
                  리암 (Liam)
                </span>
              </div>
              {/* Sparky */}
              <div className="flex flex-col items-center animate-bounce" style={{ animationDuration: '2.5s' }}>
                <span className="text-3xl sm:text-4xl filter drop-shadow">🤖</span>
                <span className="text-[9px] font-black text-sky-300 bg-slate-900/80 px-1.5 py-0.2 rounded-full mt-0.5">
                  스파키 (Sparky)
                </span>
              </div>
            </div>
          </div>

          {/* PANEL 2: "If we EXPLORE, now bring an EXPLORE" */}
          <div
            onClick={() => handleSelectPanel(1)}
            className={`bg-gradient-to-b from-emerald-800 via-teal-900 to-slate-950 border-4 rounded-2xl overflow-hidden relative p-3 flex flex-col justify-between shadow-md cursor-pointer transition-all duration-200 ${
              selectedPanelIdx === 1
                ? 'border-amber-400 ring-4 ring-amber-300/60 scale-[1.01]'
                : 'border-slate-900 hover:border-sky-400'
            }`}
          >
            {/* Background elements */}
            <div className="absolute bottom-0 right-2 text-7xl opacity-50">🍃🌱</div>

            {/* Target indicator badge */}
            {selectedPanelIdx === 1 && (
              <div className="absolute top-2 right-2 z-20 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>스피킹 타깃</span>
              </div>
            )}

            {/* Speech Bubble with Glowing Highlighted Word: EXPLORE */}
            <div className="relative z-10 self-start max-w-[95%] bg-white border-2 border-slate-900 rounded-2xl px-3.5 py-2 shadow-lg">
              <p className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-snug flex flex-wrap items-center gap-1.5">
                <span>If we,</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWordClick('explore');
                  }}
                  className="bg-amber-300 hover:bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg border-2 border-amber-500 shadow-sm font-black animate-pulse flex items-center gap-1 cursor-pointer transform hover:scale-105 transition-all"
                  title="탭하여 단어 뜻 & 보석 포획"
                >
                  <Sparkles className="w-3 h-3 text-amber-700" />
                  <span>EXPLORE</span>
                </button>
                <span>, now bring an</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWordClick('explore');
                  }}
                  className="bg-cyan-200 hover:bg-cyan-300 text-slate-950 px-2 py-0.5 rounded-lg border-2 border-cyan-400 shadow-sm font-black flex items-center gap-1 cursor-pointer transform hover:scale-105 transition-all"
                  title="탐험하다 (Explore)"
                >
                  <span>EXPLORE</span>
                </button>
                <span>!</span>
              </p>
              <p className="text-[10px] font-bold text-emerald-800 mt-1">
                우리가 <span className="text-amber-600 font-extrabold">탐험(EXPLORE)</span>을 시작하면, 모험이 열려!
              </p>
              <div className="absolute -bottom-2 left-10 w-3.5 h-3.5 bg-white border-b-2 border-r-2 border-slate-900 transform rotate-45" />
            </div>

            {/* Characters: Leah pointing, Sparky, Liam */}
            <div className="relative z-10 flex items-end justify-between mt-6">
              <div className="flex items-end gap-2">
                {/* Liam */}
                <div className="text-4xl sm:text-5xl">👦🏽</div>
                {/* Sparky */}
                <div className="text-3xl animate-pulse">🤖</div>
              </div>

              {/* Leah in pink tee pointing */}
              <div className="flex flex-col items-center">
                <span className="text-5xl sm:text-6xl filter drop-shadow-lg">👧🏽</span>
                <span className="text-[10px] font-black text-pink-300 bg-slate-900/80 px-2 py-0.5 rounded-full mt-0.5">
                  리아 (Leah)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comic Strip Bottom Row (2 Panels) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
          {/* PANEL 3: "Leah, the hidden section, where is DANGER?" */}
          <div
            onClick={() => handleSelectPanel(2)}
            className={`bg-gradient-to-b from-teal-900 via-emerald-950 to-slate-950 border-4 rounded-2xl overflow-hidden relative p-3 flex flex-col justify-between shadow-md cursor-pointer transition-all duration-200 ${
              selectedPanelIdx === 2
                ? 'border-amber-400 ring-4 ring-amber-300/60 scale-[1.01]'
                : 'border-slate-900 hover:border-sky-400'
            }`}
          >
            {/* Target indicator badge */}
            {selectedPanelIdx === 2 && (
              <div className="absolute top-2 right-2 z-20 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>스피킹 타깃</span>
              </div>
            )}

            {/* Speech Bubble */}
            <div className="relative z-10 self-start max-w-[90%] bg-white border-2 border-slate-900 rounded-2xl px-3.5 py-2 shadow-lg">
              <p className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-snug flex flex-wrap items-center gap-1">
                <span>Leah, the hidden section, where is</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWordClick('danger');
                  }}
                  className="bg-rose-300 hover:bg-rose-400 text-rose-950 px-2 py-0.5 rounded-lg border-2 border-rose-500 font-black flex items-center gap-1 cursor-pointer transform hover:scale-105 transition-all"
                  title="위험 (Danger)"
                >
                  <span>DANGER</span>
                </button>
                <span>?</span>
              </p>
              <p className="text-[10px] font-bold text-teal-800 mt-0.5">
                리아, 숨겨진 구역에서 <span className="text-rose-600 font-extrabold">위험(DANGER)</span>이 어디 있어?
              </p>
              <div className="absolute -bottom-2 left-6 w-3.5 h-3.5 bg-white border-b-2 border-r-2 border-slate-900 transform rotate-45" />
            </div>

            {/* Caption & Liam peeking through large leaf with magnifying glass */}
            <div className="relative z-10 flex items-center justify-between mt-4">
              {/* Caption Box */}
              <div className="bg-amber-100 border border-amber-400 rounded-xl px-2.5 py-1 text-[11px] font-bold text-amber-900 max-w-[170px] shadow-sm">
                🔍 큰 나뭇잎 뒤를 살피는 리암
              </div>

              {/* Illustration: Liam with Magnifying Glass behind Leaf */}
              <div className="flex items-center gap-1 relative">
                <span className="text-5xl transform rotate-6">🌿</span>
                <span className="text-4xl absolute left-2 -top-1">👦🏽</span>
                <span className="text-3xl absolute right-0 top-0 animate-pulse">🔍</span>
              </div>
            </div>
          </div>

          {/* PANEL 4: "You can, I don't have... DANGER" & "HIDDEN! HIDDEN!" */}
          <div
            onClick={() => handleSelectPanel(3)}
            className={`bg-gradient-to-b from-indigo-950 via-teal-950 to-slate-950 border-4 rounded-2xl overflow-hidden relative p-3 flex flex-col justify-between shadow-md cursor-pointer transition-all duration-200 ${
              selectedPanelIdx === 3
                ? 'border-amber-400 ring-4 ring-amber-300/60 scale-[1.01]'
                : 'border-slate-900 hover:border-sky-400'
            }`}
          >
            {/* Target indicator badge */}
            {selectedPanelIdx === 3 && (
              <div className="absolute top-2 right-2 z-20 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>스피킹 타깃</span>
              </div>
            )}

            {/* Multiple Interactive Speech Bubbles */}
            <div className="relative z-10 flex flex-col gap-2">
              <div className="self-start max-w-[90%] bg-white border-2 border-slate-900 rounded-2xl px-3 py-1.5 shadow-md">
                <p className="text-[11px] sm:text-xs font-black text-slate-900 flex flex-wrap items-center gap-1">
                  <span>Careful with danger! Let us find what is</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWordClick('hidden');
                    }}
                    className="bg-purple-300 hover:bg-purple-400 text-purple-950 px-1.5 py-0.2 rounded font-black border border-purple-500 animate-pulse"
                  >
                    HIDDEN!
                  </button>
                </p>
                <span className="text-[9px] font-bold text-slate-500 block">
                  위험을 조심하며 숨겨진(HIDDEN) 신비의 사원으로 뛰어가자!
                </span>
              </div>
            </div>

            {/* Characters running towards temple */}
            <div className="relative z-10 flex items-end justify-between mt-2">
              <div className="flex items-end gap-1">
                <span className="text-4xl">👦🏽</span>
                <span className="text-3xl animate-bounce">🤖</span>
                <span className="text-4xl">👧🏽</span>
              </div>
              <span className="text-4xl opacity-80">🏛️✨</span>
            </div>
          </div>
        </div>

        {/* Word Capture Pop-Up Card (When a word is clicked) */}
        {activeWordPopUp && (
          <WordCapturePopUp
            wordKey={activeWordPopUp}
            onClose={() => setActiveWordPopUp(null)}
            onCaptureWord={handleCaptureWord}
          />
        )}

        {/* Bottom Floating Control Bar: Big Red Mic + User Speech Feedback Box */}
        <div className="w-full pt-2 flex flex-col md:flex-row items-center justify-between gap-3 border-t-2 border-slate-200">
          {/* Prominent 'Tap to Speak' Microphone Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleToggleRecord}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-200 transform active:scale-95 ${
                isRecording
                  ? 'bg-rose-600 ring-8 ring-rose-400/50 scale-105 animate-pulse text-white'
                  : 'bg-gradient-to-b from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white hover:scale-105 ring-4 ring-rose-300'
              }`}
              title="마이크를 누르고 영어로 말해보세요"
            >
              <Mic className="w-7 h-7 sm:w-9 sm:h-9 stroke-[2.5]" />
            </button>
            <span className="text-xs sm:text-sm font-black text-slate-800 mt-1 drop-shadow-sm tracking-tight">
              {isRecording ? '듣고 있어요... (탭하여 완료)' : '마이크로 말하기'}
            </span>
          </div>

          {/* User Speech Feedback Box with Sparky Robot Assistant */}
          <div className="flex-1 w-full flex justify-center md:justify-end">
            <UserSpeechFeedbackBox
              spokenText={spokenTranscript}
              targetSentence={currentTargetSentence}
              accuracyScore={speechAccuracy}
              feedbackStatus={feedbackStatus}
              onRetry={handleToggleRecord}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

