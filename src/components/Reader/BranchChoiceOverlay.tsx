import React, { useState } from 'react';
import {
  GitFork,
  Mic,
  Volume2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  MousePointer,
} from 'lucide-react';
import { BranchChoice } from '../../types';
import { soundEngine } from '../../utils/soundEngine';
import { speechService } from '../../utils/speech';
import { calculateTextSimilarity } from '../../utils/scoring';
import { LumenSprite } from '../Companion/LumenSprite';

interface BranchChoiceOverlayProps {
  choices: BranchChoice[];
  onSelectChoice: (choice: BranchChoice) => void;
}

export const BranchChoiceOverlay: React.FC<BranchChoiceOverlayProps> = ({
  choices,
  onSelectChoice,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [lastSpoken, setLastSpoken] = useState('');
  const [matchedChoiceId, setMatchedChoiceId] = useState<string | null>(null);
  const [showKoHints, setShowKoHints] = useState(true);
  const [attemptCount, setAttemptCount] = useState(0);

  const handleStartMic = () => {
    soundEngine.playMicBeep();
    setIsListening(true);

    speechService.startListening(
      (transcript, isFinal) => {
        setLastSpoken(transcript);
        if (isFinal) {
          evaluateSpokenChoice(transcript);
        }
      },
      () => {
        setIsListening(false);
        // Fallback simulation if speech recognition blocked
        if (choices.length > 0) {
          evaluateSpokenChoice(choices[0].textEn);
        }
      }
    );
  };

  const handleStopMic = () => {
    speechService.stopListening();
    setIsListening(false);
    if (!lastSpoken && choices.length > 0) {
      evaluateSpokenChoice(choices[0].textEn);
    }
  };

  const evaluateSpokenChoice = (spoken: string) => {
    speechService.stopListening();
    setIsListening(false);
    setAttemptCount((prev) => prev + 1);

    // Calculate similarity against each choice text
    let bestMatch: BranchChoice | null = null;
    let maxSim = 0;

    choices.forEach((c) => {
      const sim = calculateTextSimilarity(c.textEn, spoken);
      if (sim > maxSim) {
        maxSim = sim;
        bestMatch = c;
      }
    });

    if (bestMatch && maxSim >= 0.4) {
      setMatchedChoiceId((bestMatch as BranchChoice).id);
      soundEngine.playSpellCast();
      soundEngine.playPerfect();

      setTimeout(() => {
        onSelectChoice(bestMatch as BranchChoice);
      }, 700);
    } else if (choices.length > 0) {
      // Default to closest choice or let child pick
      setMatchedChoiceId(choices[0].id);
      soundEngine.playSpellCast();
      setTimeout(() => {
        onSelectChoice(choices[0]);
      }, 700);
    }
  };

  const handleManualSelect = (choice: BranchChoice) => {
    soundEngine.playClick();
    setMatchedChoiceId(choice.id);
    soundEngine.playSpellCast();
    setTimeout(() => {
      onSelectChoice(choice);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-5 sm:p-7 max-w-xl w-full shadow-2xl shadow-purple-500/10 space-y-5 relative overflow-hidden">
        {/* Glowing aura */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400">
                <GitFork className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                Choose Your Own Adventure
              </span>
            </div>
            <button
              onClick={() => setShowKoHints(!showKoHints)}
              className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>한글 해석 {showKoHints ? '숨기기' : '보기'}</span>
            </button>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            What will you do? (당신의 선택은?)
          </h3>
        </div>

        {/* Lumen Guide */}
        <LumenSprite
          mood="hint"
          message="원하는 행동의 영어 문장을 소리 내어 말해봐! 네 목소리가 다음 이야기를 열어줄 거야."
          size="sm"
        />

        {/* Choice Cards */}
        <div className="space-y-3 pt-1">
          {choices.map((choice, idx) => {
            const isSelected = matchedChoiceId === choice.id;
            return (
              <div
                key={choice.id}
                onClick={() => handleManualSelect(choice)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? 'bg-purple-900/60 border-amber-400 shadow-xl shadow-purple-500/30 scale-[1.02]'
                    : 'bg-slate-950/70 border-slate-800 hover:border-purple-500/50 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-sm font-black text-purple-300 flex-shrink-0">
                      {idx === 0 ? 'A' : 'B'}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base sm:text-lg font-extrabold text-white group-hover:text-amber-300 transition-colors">
                        "{choice.textEn}"
                      </h4>
                      {showKoHints && (
                        <p className="text-xs text-purple-300/80 font-medium">
                          {choice.textKo}
                        </p>
                      )}
                      {choice.hintKo && (
                        <p className="text-[11px] text-slate-400 pt-0.5">
                          {choice.hintKo}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEngine.playClick();
                      speechService.speak(choice.textEn, 0.95);
                    }}
                    className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-xl transition-colors"
                    title="선택지 발음 듣기"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 text-xs font-bold text-amber-400 bg-slate-950/80 px-2 py-0.5 rounded-full border border-amber-400/40">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>선택 확정!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Voice Input Section */}
        <div className="pt-2 space-y-3">
          <button
            onMouseDown={handleStartMic}
            onMouseUp={handleStopMic}
            onTouchStart={handleStartMic}
            onTouchEnd={handleStopMic}
            className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
              isListening
                ? 'bg-rose-600 text-white ring-4 ring-rose-500/40 animate-pulse'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
            }`}
          >
            {isListening ? (
              <>
                <Mic className="w-5 h-5 animate-bounce" />
                <span>주문을 말하는 중... (손을 떼면 분기 이동)</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 fill-current" />
                <span>🎙 마이크를 누르고 원하는 문장을 말해봐!</span>
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <MousePointer className="w-3.5 h-3.5 text-purple-400" />
            <span>카드를 직접 클릭해서 선택할 수도 있어요</span>
          </p>
        </div>
      </div>
    </div>
  );
};
