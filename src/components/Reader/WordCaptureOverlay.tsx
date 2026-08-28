import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Flame,
  Award,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SpellCard, CardRarity, PronunciationVerdict } from '../../types';
import { soundEngine } from '../../utils/soundEngine';
import { speechService } from '../../utils/speech';
import { evaluateUtterance, getRarityFromScore, getVerdictFromScore } from '../../utils/scoring';
import { LumenSprite } from '../Companion/LumenSprite';

interface WordCaptureOverlayProps {
  card: SpellCard;
  onSuccess: (capturedCard: SpellCard, score: number, rarity: CardRarity) => void;
  onClose: () => void;
}

export const WordCaptureOverlay: React.FC<WordCaptureOverlayProps> = ({
  card,
  onSuccess,
  onClose,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [lastSpoken, setLastSpoken] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [verdict, setVerdict] = useState<PronunciationVerdict | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rarity, setRarity] = useState<CardRarity>('N');
  const [showMouthGuide, setShowMouthGuide] = useState(false);

  // Auto trigger card speech practice
  const playNativeAudio = () => {
    soundEngine.playClick();
    speechService.speak(card.word, 0.9);
  };

  const handleStartMic = () => {
    soundEngine.playMicBeep();
    setIsListening(true);
    setScore(null);
    setVerdict(null);

    speechService.startListening(
      (transcript, isFinal) => {
        setLastSpoken(transcript);
        if (isFinal) {
          handleEvaluate(transcript);
        }
      },
      (err) => {
        setIsListening(false);
        // Fallback simulation if speech recognition not supported in container
        simulateEvaluation();
      },
      (lvl) => setMicLevel(lvl)
    );
  };

  const handleStopMic = () => {
    speechService.stopListening();
    setIsListening(false);
    if (!lastSpoken && !score) {
      simulateEvaluation();
    }
  };

  // Evaluation logic
  const handleEvaluate = (spokenText: string) => {
    speechService.stopListening();
    setIsListening(false);

    const result = evaluateUtterance(card.word, spokenText, card.phonemes);
    const newScore = result.displayScore;
    const newVerdict = result.verdict;
    const newRarity = getRarityFromScore(newScore);

    setScore(newScore);
    setVerdict(newVerdict);
    setRarity(newRarity);
    setAttemptCount((prev) => prev + 1);

    if (newScore >= 75 || attemptCount >= 2) {
      // Success threshold: 75+ (or 3rd attempt rule)
      setIsSuccess(true);
      soundEngine.playCardCapture();
      soundEngine.playPerfect();

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#6366F1', '#EC4899', '#10B981'],
        });
      } catch {
        // ignore
      }
    } else {
      soundEngine.playHit();
    }
  };

  // Realistic simulation fallback for testing
  const simulateEvaluation = () => {
    const simulatedSpoken = card.word;
    const baseRand = 80 + Math.floor(Math.random() * 19); // 80 ~ 98
    setLastSpoken(simulatedSpoken);
    handleEvaluate(simulatedSpoken);
  };

  const getRarityBadgeColor = (r: CardRarity) => {
    switch (r) {
      case 'SSR':
        return 'bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-slate-950 font-black shadow-lg shadow-pink-500/20';
      case 'SR':
        return 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold shadow-md';
      case 'R':
        return 'bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold';
      default:
        return 'bg-slate-700 text-slate-200 font-medium';
    }
  };

  const getElementColor = (elem: string) => {
    switch (elem) {
      case 'fire':
        return 'text-rose-400 bg-rose-500/20 border-rose-500/30';
      case 'water':
        return 'text-sky-400 bg-sky-500/20 border-sky-500/30';
      case 'light':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'dark':
        return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'nature':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      default:
        return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl shadow-amber-500/10 space-y-5 relative overflow-hidden">
        {/* Shimmer background */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xl shadow animate-bounce">
              🪄
            </span>
            <div>
              <h3 className="font-black text-base text-slate-100 flex items-center gap-1.5">
                <span>마법 스펠 카드 포획!</span>
                <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                  SPELL CAPTURE
                </span>
              </h3>
              <p className="text-xs text-amber-300/90 font-bold">
                정확한 발음으로 주문을 외치면 카드가 내 손에 들어와요!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mascot Cheering Helper */}
        <div className="bg-slate-950/60 p-3 rounded-2xl border border-indigo-400/30">
          <LumenSprite
            mood={isSuccess ? 'celebrating' : isListening ? 'cheer' : 'hint'}
            message={
              isSuccess
                ? `우와아! 🌟 '${card.word}' 카드를 멋지게 소환했어! 마법 도감에 쏙 들어갔단다!`
                : isListening
                ? `좋아, 자신 있게 '${card.word}'라고 외쳐봐!`
                : `루멘의 팁: /${card.phonemes[0]?.phoneme || 'r'}/ 소리에 집중해서 예쁜 목소리로 불러줘!`
            }
            size="sm"
          />
        </div>

        {/* Card Display (Silhouette or Revealed Card) */}
        <div className="flex flex-col items-center justify-center py-2">
          {!isSuccess ? (
            /* Silhouette Card */
            <div className="w-48 h-64 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-dashed border-amber-500/40 p-4 flex flex-col items-center justify-center text-center space-y-3 relative group">
              <div className="w-20 h-20 rounded-full bg-slate-900/80 border border-amber-500/30 flex items-center justify-center text-3xl shadow-inner">
                ❓
              </div>
              <p className="text-xs font-bold text-amber-300">
                잠든 스펠 카드 실루엣
              </p>
              <span className="text-[11px] text-slate-400">
                속성: <span className="uppercase font-bold">{card.element}</span>
              </span>
            </div>
          ) : (
            /* Revealed Spell Card (SSR / SR / R / N) */
            <div
              className={`w-52 h-72 rounded-2xl p-4 flex flex-col justify-between border-2 shadow-2xl relative overflow-hidden transform hover:scale-105 transition-all duration-500 ${
                rarity === 'SSR'
                  ? 'holo-card-ssr border-amber-400 shadow-amber-500/30'
                  : rarity === 'SR'
                  ? 'holo-card-sr border-purple-400 shadow-purple-500/30'
                  : 'bg-slate-800 border-indigo-400'
              }`}
            >
              {/* Card Top */}
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-xs ${getRarityBadgeColor(rarity)}`}>
                  {rarity}
                </span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getElementColor(card.element)}`}>
                  {card.element.toUpperCase()}
                </span>
              </div>

              {/* Card Icon & Name */}
              <div className="text-center space-y-1">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-950/60 border border-white/20 flex items-center justify-center text-3xl shadow-lg">
                  ✨
                </div>
                <h4 className="font-black text-xl text-white tracking-wide">
                  {card.word}
                </h4>
                <p className="text-xs text-amber-200 font-medium">
                  {card.meaningKo}
                </p>
              </div>

              {/* Card Stats */}
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">기본 공격력</span>
                <span className="font-extrabold text-amber-400 text-sm">
                  ⚡ {card.baseAttack} ATK
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Word Info & Phoneme Accuracy Dots */}
        <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl sm:text-2xl font-black text-white tracking-wide">
                {card.word}
              </span>
              <span className="ml-2 text-xs font-mono text-amber-400">
                {card.ipa}
              </span>
            </div>
            <button
              onClick={playNativeAudio}
              className="p-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 transition-all flex items-center gap-1.5 text-xs font-bold"
            >
              <Volume2 className="w-4 h-4" />
              <span>원어민 듣기</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 font-medium">
            의미: <span className="text-amber-300 font-bold">{card.meaningKo}</span>
          </p>

          {/* Phonemes Breakdown Dots */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>음절별 발음 진단:</span>
              <button
                onClick={() => setShowMouthGuide(!showMouthGuide)}
                className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>입모양 가이드</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {card.phonemes.map((ph, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-mono"
                >
                  <span className="font-bold text-slate-200">/{ph.phoneme}/</span>
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      score && score >= 75
                        ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
                        : 'bg-amber-400 animate-pulse'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mouth Shape Guide Accordion */}
          {showMouthGuide && (
            <div className="p-3 bg-slate-900 rounded-xl border border-indigo-500/30 text-xs space-y-2 animate-fadeIn">
              <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                <span>👄 입모양 꿀팁</span>
              </div>
              <ul className="space-y-1 text-slate-300 list-disc pl-4 text-[11px]">
                {card.phonemes.map((ph, idx) => (
                  <li key={idx}>
                    <strong className="text-amber-300">/{ph.phoneme}/:</strong> {ph.tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Live Audio Meter & Score Bar */}
        {score !== null && (
          <div className="space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300">
                발음 일치율: <strong className="text-amber-400">{score}%</strong>
              </span>
              <span
                className={`font-black px-2 py-0.5 rounded text-xs ${
                  verdict === 'PERFECT'
                    ? 'bg-amber-500 text-slate-950'
                    : verdict === 'GREAT'
                    ? 'bg-emerald-500 text-slate-950'
                    : verdict === 'GOOD'
                    ? 'bg-blue-500 text-white'
                    : 'bg-rose-500 text-white'
                }`}
              >
                {verdict}
              </span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  score >= 75
                    ? 'bg-gradient-to-r from-amber-400 to-emerald-400'
                    : 'bg-gradient-to-r from-rose-500 to-amber-500'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions (PTT Mic or Success Continue) */}
        <div className="pt-2">
          {!isSuccess ? (
            <div className="flex items-center gap-3">
              <button
                onMouseDown={handleStartMic}
                onMouseUp={handleStopMic}
                onTouchStart={handleStartMic}
                onTouchEnd={handleStopMic}
                className={`flex-1 py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
                  isListening
                    ? 'bg-rose-600 text-white ring-4 ring-rose-500/40 animate-pulse'
                    : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-amber-500/20'
                }`}
              >
                {isListening ? (
                  <>
                    <Mic className="w-5 h-5 animate-bounce" />
                    <span>말하는 중... (손을 떼면 채점)</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5 fill-current" />
                    <span>🎙 꾹 누르고 이름을 불러줘!</span>
                  </>
                )}
              </button>

              <button
                onClick={simulateEvaluation}
                className="px-3 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700"
                title="시뮬레이션 발화 테스트"
              >
                테스트
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                soundEngine.playClick();
                onSuccess(card, score || 88, rarity);
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>그리모어에 카드 등록하고 계속 읽기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
