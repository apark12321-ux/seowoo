import React, { useState, useEffect, useRef } from 'react';
import {
  Swords,
  Shield,
  Flame,
  Clock,
  Mic,
  Volume2,
  Sparkles,
  Zap,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  SpellCard,
  UserChildProfile,
  PronunciationVerdict,
  CardRarity,
} from '../../types';
import { ALL_SPELL_CARDS } from '../../data/spellCards';
import { soundEngine } from '../../utils/soundEngine';
import { speechService } from '../../utils/speech';
import { calculateBattleDamage, evaluateUtterance } from '../../utils/scoring';
import { LumenSprite } from '../Companion/LumenSprite';

interface SpeakingBattleProps {
  chapterId: string;
  profile: UserChildProfile;
  onBattleComplete: (result: 'win' | 'lose', damageTotal: number, maxCombo: number) => void;
  onExit: () => void;
}

export const SpeakingBattle: React.FC<SpeakingBattleProps> = ({
  chapterId,
  profile,
  onBattleComplete,
  onExit,
}) => {
  // Nox Villain Specs
  const [noxMaxHp] = useState<number>(250);
  const [noxHp, setNoxHp] = useState<number>(250);
  const [wizardMaxHp] = useState<number>(100);
  const [wizardHp, setWizardHp] = useState<number>(100);

  // Deck of 5 Spell Cards
  const battleCards: SpellCard[] = profile.deckCardIds
    .map((id) => ALL_SPELL_CARDS[id])
    .filter(Boolean);

  const [selectedCardIdx, setSelectedCardIdx] = useState<number>(0);
  const currentCard = battleCards[selectedCardIdx] || battleCards[0];

  // Battle State
  const [timeLeft, setTimeLeft] = useState<number>(8);
  const [comboLevel, setComboLevel] = useState<number>(1);
  const [maxCombo, setMaxCombo] = useState<number>(1);
  const [damageTotal, setDamageTotal] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [lastDamage, setLastDamage] = useState<{ amount: number; verdict: PronunciationVerdict } | null>(null);
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [noxReaction, setNoxReaction] = useState<'idle' | 'hit' | 'taunt'>('idle');
  const [noxQuote, setNoxQuote] = useState<string>('으악! 대마법사 박서우(Seowoo)의 발음은 너무 강력해요!');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Nox comical quips addressing Seowoo
  const noxQuotes = [
    '으악! 박서우 마법사의 완벽한 영어 발음이라니... 눈부셔요!',
    '서우야 봐줘~! 카드를 돌려줄게!',
    '대마법사 Seowoo의 목소리가 너무 강렬합니다!',
    '박서우 마법사의 스피킹 마법은 당해낼 수가 없어요!',
    '그 카드의 마법은 제 발음보다 서툴걸요?!',
    '잠깐만요! 혀를 그렇게 유창하게 굴리는 건 반칙입니다!',
  ];

  // 8-second countdown loop
  useEffect(() => {
    if (noxHp <= 0 || wizardHp <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeOut();
          return 8;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [noxHp, wizardHp, selectedCardIdx]);

  const handleTimeOut = () => {
    // Time out counts as a MISS
    handleSpellResult(0, 'MISS');
  };

  const handleStartMic = () => {
    soundEngine.playMicBeep();
    setIsListening(true);
    setLastDamage(null);

    speechService.startListening(
      (transcript, isFinal) => {
        if (isFinal) {
          evaluateSpokenSpell(transcript);
        }
      },
      () => {
        setIsListening(false);
        simulateSpellCast();
      }
    );
  };

  const handleStopMic = () => {
    speechService.stopListening();
    setIsListening(false);
    simulateSpellCast();
  };

  const evaluateSpokenSpell = (spokenText: string) => {
    speechService.stopListening();
    setIsListening(false);
    if (!currentCard) return;

    const result = evaluateUtterance(currentCard.word, spokenText, currentCard.phonemes);
    const score = result.displayScore;
    const verdict = result.verdict;

    handleSpellResult(score, verdict);
  };

  const simulateSpellCast = () => {
    if (!currentCard) return;
    const score = 85 + Math.floor(Math.random() * 15); // 85 ~ 100
    const verdict: PronunciationVerdict = score >= 95 ? 'PERFECT' : 'GREAT';
    handleSpellResult(score, verdict);
  };

  const handleSpellResult = (score: number, verdict: PronunciationVerdict) => {
    if (!currentCard) return;
    setTimeLeft(8);

    if (verdict !== 'MISS') {
      // Calculate damage with combo multiplier
      const { damage } = calculateBattleDamage(currentCard.baseAttack, score, comboLevel);
      const newNoxHp = Math.max(0, noxHp - damage);

      setNoxHp(newNoxHp);
      setDamageTotal((prev) => prev + damage);
      setLastDamage({ amount: damage, verdict });

      // Combo up
      const nextCombo = Math.min(4, comboLevel + 1);
      setComboLevel(nextCombo);
      setMaxCombo((prev) => Math.max(prev, nextCombo));

      // Audio & VFX
      soundEngine.playSpellCast();
      soundEngine.playHit();
      soundEngine.playCombo(nextCombo);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);

      // Nox reaction
      setNoxReaction('hit');
      setNoxQuote(noxQuotes[Math.floor(Math.random() * noxQuotes.length)]);
      setTimeout(() => setNoxReaction('idle'), 1500);

      // Check Win Condition
      if (newNoxHp <= 0) {
        soundEngine.playVictory();
        try {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
          });
        } catch {
          // ignore
        }
        setTimeout(() => {
          onBattleComplete('win', damageTotal + damage, maxCombo);
        }, 1200);
      }
    } else {
      // Failed utterance: drop combo by 1, wizard takes 20 dmg
      setComboLevel((prev) => Math.max(1, prev - 1));
      const newWizardHp = Math.max(0, wizardHp - 20);
      setWizardHp(newWizardHp);
      setLastDamage({ amount: 0, verdict: 'MISS' });
      soundEngine.playHit();

      setNoxReaction('taunt');
      setNoxQuote('하하! 방금 주문은 살짝 빗나갔군요!');
      setTimeout(() => setNoxReaction('idle'), 1500);

      if (newWizardHp <= 0) {
        setTimeout(() => {
          onBattleComplete('lose', damageTotal, maxCombo);
        }, 1000);
      }
    }

    // Move to next card in deck
    setSelectedCardIdx((prev) => (prev + 1) % battleCards.length);
  };

  return (
    <div className={`min-h-[92vh] flex flex-col justify-between bg-slate-950 text-slate-100 p-4 sm:p-6 ${isShaking ? 'shake-hit' : ''}`}>
      {/* Battle Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-rose-900/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-rose-500/20 text-rose-400">
            <Swords className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg md:text-xl font-black text-white">
              ⚔️ 스피킹 배틀: 어둠의 도둑 녹스 (Nox)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-bold">
              제한 시간 내에 카드의 주문을 외쳐 녹스를 물리치세요!
            </p>
          </div>
        </div>

        {/* Combo Multiplier Flame */}
        <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-2 rounded-2xl border border-amber-500/40 shadow-sm">
          <Flame className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounce" />
          <span className="font-black text-amber-300 text-sm sm:text-base">
            COMBO x{comboLevel === 1 ? '1.0' : comboLevel === 2 ? '1.3' : comboLevel === 3 ? '1.6' : '2.0 MAX'}
          </span>
        </div>
      </header>

      {/* Main Battle Arena: Nox Villain & Wizard Visual */}
      <main className="max-w-5xl mx-auto w-full my-auto py-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Nox Shadow Villain (Left) */}
        <div className="bg-gradient-to-b from-purple-950/40 to-slate-900/90 border border-purple-800/40 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col items-center text-center space-y-4 relative overflow-hidden">
          {/* Nox HP Bar */}
          <div className="w-full space-y-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm font-black">
              <span className="text-purple-300 flex items-center gap-1.5">
                <span>😈</span> 그림자 도둑 녹스
              </span>
              <span className="text-rose-400 font-black text-sm">
                {noxHp} / {noxMaxHp} HP
              </span>
            </div>
            <div className="h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${(noxHp / noxMaxHp) * 100}%` }}
              />
            </div>
          </div>

          {/* Nox Animated Sprite */}
          <div className="relative py-4">
            <div
              className={`w-36 h-36 rounded-full bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 border-2 border-purple-500/40 p-3 shadow-2xl shadow-purple-500/20 flex items-center justify-center relative transition-transform duration-300 ${
                noxReaction === 'hit'
                  ? 'scale-90 rotate-12 border-rose-500 bg-rose-950'
                  : 'nox-floating'
              }`}
            >
              {/* Comical Eyes */}
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-5 bg-amber-400 rounded-full shadow-md shadow-amber-400 animate-pulse" />
                <div className="w-3.5 h-5 bg-amber-400 rounded-full shadow-md shadow-amber-400 animate-pulse" />
              </div>
              <span className="absolute bottom-2 text-3xl">
                {noxReaction === 'hit' ? '😵' : noxReaction === 'taunt' ? '😏' : '😈'}
              </span>
            </div>

            {/* Damage Number Popup */}
            {lastDamage && lastDamage.amount > 0 && (
              <div className="absolute -top-2 right-2 font-black text-3xl text-amber-300 animate-bounce drop-shadow-md">
                -{lastDamage.amount} DMG!
              </div>
            )}
          </div>

          {/* Nox Dialog Bubble */}
          <div className="bg-slate-950/90 p-3.5 rounded-2xl border border-purple-900/60 text-xs sm:text-sm text-purple-200 w-full font-bold leading-relaxed">
            "{noxQuote}"
          </div>
        </div>

        {/* Wizard Player & Active Spell Card (Right) */}
        <div className="bg-gradient-to-b from-indigo-950/40 to-slate-900/90 border border-indigo-800/40 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between space-y-4">
          {/* Wizard HP Bar */}
          <div className="w-full space-y-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm font-black">
              <span className="text-amber-300 flex items-center gap-1.5">
                <span>👑</span> 대마법사 {profile.nickname} (Seowoo Park)
              </span>
              <span className="text-emerald-400 font-black text-sm">
                {wizardHp} / {wizardMaxHp} HP
              </span>
            </div>
            <div className="h-4 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${(wizardHp / wizardMaxHp) * 100}%` }}
              />
            </div>
          </div>

          {/* Lumen Cheering Companion In Battle */}
          <div className="bg-slate-950/60 p-3 rounded-2xl border border-indigo-400/30">
            <LumenSprite
              mood={isListening ? 'cheer' : comboLevel > 2 ? 'excited' : 'happy'}
              message={
                isListening
                  ? `서우야! '${currentCard?.word}' 주문을 큰 목소리로 외쳐봐!`
                  : comboLevel > 1
                  ? `대마법사 서우의 ${comboLevel}연속 콤보 마법 발동 중! 🔥`
                  : `루멘: 서우가 "${currentCard?.word}" 주문을 외치면 강력한 황금빛 마법 탄환이 발사돼!`
              }
              size="sm"
            />
          </div>

          {/* Active Spell Card Spotlight */}
          {currentCard ? (
            <div className="bg-slate-950/90 rounded-2xl p-5 border-2 border-amber-500/40 shadow-xl space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-black bg-amber-400 text-slate-950">
                    {currentCard.rarity}
                  </span>
                  <span className="text-xs sm:text-sm font-bold uppercase text-amber-300">
                    {currentCard.element} 속성
                  </span>
                </div>

                {/* Countdown Timer */}
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-rose-400 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-500/30">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>00:0{timeLeft}</span>
                </div>
              </div>

              <div className="text-center py-2 space-y-1.5">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wider">
                  {currentCard.word}
                </h3>
                <p className="text-sm sm:text-base font-mono text-amber-400 font-bold">
                  {currentCard.ipa}
                </p>
                <p className="text-sm sm:text-base text-slate-200 font-bold">
                  마법 뜻: <span className="text-amber-300">{currentCard.meaningKo}</span>
                </p>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-300 font-bold">기본 마법 공격력</span>
                <span className="font-black text-amber-400 text-sm sm:text-base">
                  ⚡ {currentCard.baseAttack} ATK
                </span>
              </div>
            </div>
          ) : (
            <p className="text-center text-slate-400">카드가 없습니다.</p>
          )}

          {/* Attack Action Button */}
          <div className="pt-2">
            <button
              onMouseDown={handleStartMic}
              onMouseUp={handleStopMic}
              onTouchStart={handleStartMic}
              onTouchEnd={handleStopMic}
              className={`w-full py-4.5 px-6 rounded-2xl font-black text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 shadow-xl transition-all ${
                isListening
                  ? 'bg-rose-600 text-white ring-4 ring-rose-500/40 animate-pulse'
                  : 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-amber-500/25'
              }`}
            >
              {isListening ? (
                <>
                  <Mic className="w-6 h-6 animate-bounce" />
                  <span>주문을 외치는 중...! (손을 떼면 발사)</span>
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6 fill-current" />
                  <span>🎙 꾹 누르고 주문 '{currentCard?.word}' 외치기!</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Deck Card Tray (Bottom) */}
      <footer className="max-w-5xl mx-auto w-full bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-extrabold text-slate-300">
            배틀 장착 덱 (5장)
          </span>
          <span className="text-[11px] text-slate-400">
            정확히 발음할수록 콤보 데미지가 증폭됩니다!
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {battleCards.map((card, idx) => {
            const isSelected = idx === selectedCardIdx;
            return (
              <div
                key={card.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedCardIdx(idx);
                }}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 shadow-md scale-105'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-black text-amber-400">
                  {card.rarity}
                </span>
                <span className="text-xs font-bold text-white line-clamp-1">
                  {card.word}
                </span>
              </div>
            );
          })}
        </div>
      </footer>
    </div>
  );
};
