import React, { useState } from 'react';
import { Volume2, Sparkles, Heart, Star, Wand2, Smile, Award } from 'lucide-react';
import { speechService } from '../../utils/speech';
import { soundEngine } from '../../utils/soundEngine';

export type LumenMood =
  | 'idle'
  | 'happy'
  | 'thinking'
  | 'cheer'
  | 'hint'
  | 'excited'
  | 'celebrating'
  | 'proud';

interface LumenSpriteProps {
  mood?: LumenMood;
  message?: string;
  subMessage?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  canSpeak?: boolean;
  onTap?: () => void;
  accessory?: 'wizard_hat' | 'crown' | 'star' | 'leaf' | 'none';
  showCostumeToggle?: boolean;
}

export const LumenSprite: React.FC<LumenSpriteProps> = ({
  mood = 'idle',
  message = '안녕 친구야! 오늘도 신나는 마법 모험을 떠나볼까? ✨',
  subMessage,
  size = 'md',
  canSpeak = true,
  onTap,
  accessory = 'wizard_hat',
  showCostumeToggle = false,
}) => {
  const [currentAcc, setCurrentAcc] = useState<'wizard_hat' | 'crown' | 'star' | 'leaf' | 'none'>(accessory);
  const [isBouncing, setIsBouncing] = useState(false);
  const [heartPop, setHeartPop] = useState(false);

  const funQuotes = [
    '우와! 네 목소리는 최고의 마법 에너지야! 🌟',
    '틀려도 괜찮아! 다시 도전하면 마법이 두 배로 강해져! 💪',
    '오늘 모은 스펠 카드로 배틀에서 멋지게 영창해보자! 🪄',
    '마법 도감에 카드가 가득 차고 있어! 정말 멋지다! 📖✨',
    '영어 발음이 점점 마법사처럼 유창해지고 있어! 🧙‍♂️',
  ];

  const handleSpriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playLevelUp();
    setIsBouncing(true);
    setHeartPop(true);
    setTimeout(() => setIsBouncing(false), 800);
    setTimeout(() => setHeartPop(false), 1200);

    if (onTap) {
      onTap();
    } else if (canSpeak && message) {
      speechService.speak(message, 1.0);
    }
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playMicBeep();
    if (message) {
      speechService.speak(message, 1.0);
    }
  };

  const cycleAccessory = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playClick();
    const list: Array<'wizard_hat' | 'crown' | 'star' | 'leaf' | 'none'> = [
      'wizard_hat',
      'crown',
      'star',
      'leaf',
      'none',
    ];
    const nextIdx = (list.indexOf(currentAcc) + 1) % list.length;
    setCurrentAcc(list[nextIdx]);
  };

  const getMoodAura = () => {
    switch (mood) {
      case 'happy':
      case 'celebrating':
        return 'from-amber-300 via-pink-400 to-rose-500 shadow-pink-400/60 ring-4 ring-pink-300/40';
      case 'cheer':
      case 'excited':
        return 'from-yellow-300 via-amber-400 to-orange-500 shadow-yellow-400/60 ring-4 ring-yellow-300/40';
      case 'thinking':
        return 'from-cyan-300 via-sky-400 to-indigo-500 shadow-cyan-400/50 ring-4 ring-sky-300/30';
      case 'hint':
      case 'proud':
        return 'from-emerald-300 via-teal-400 to-emerald-500 shadow-emerald-400/50 ring-4 ring-emerald-300/30';
      default:
        return 'from-amber-200 via-yellow-300 to-amber-400 shadow-amber-300/40 ring-2 ring-amber-300/20';
    }
  };

  const sizeClasses = {
    sm: 'w-11 h-11',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  return (
    <div className="flex items-start gap-3.5 select-none relative group">
      {/* Lumen Body Container */}
      <div className="relative flex-shrink-0 flex flex-col items-center">
        {/* Heart Pop Animation on Click */}
        {heartPop && (
          <div className="absolute -top-6 text-pink-400 animate-bounce flex items-center gap-1 z-30 font-bold text-xs bg-slate-900/90 px-2 py-0.5 rounded-full border border-pink-400/50 shadow-lg">
            <Heart className="w-3.5 h-3.5 fill-pink-400" />
            <span>최고야!</span>
          </div>
        )}

        {/* Costume Accessory Icon on Head */}
        {currentAcc === 'wizard_hat' && (
          <span
            className={`absolute z-20 transition-transform ${
              size === 'xl' ? '-top-6 text-3xl' : size === 'lg' ? '-top-4 text-2xl' : '-top-3 text-lg'
            } filter drop-shadow-md animate-wiggle`}
          >
            🧙‍♂️
          </span>
        )}
        {currentAcc === 'crown' && (
          <span
            className={`absolute z-20 transition-transform ${
              size === 'xl' ? '-top-5 text-2xl' : size === 'lg' ? '-top-4 text-xl' : '-top-3 text-sm'
            } filter drop-shadow-md animate-bounce`}
          >
            👑
          </span>
        )}
        {currentAcc === 'star' && (
          <span
            className={`absolute z-20 transition-transform ${
              size === 'xl' ? '-top-4 text-2xl' : size === 'lg' ? '-top-3 text-xl' : '-top-2.5 text-sm'
            } filter drop-shadow-md animate-spin text-amber-300`}
          >
            ⭐
          </span>
        )}
        {currentAcc === 'leaf' && (
          <span
            className={`absolute z-20 transition-transform ${
              size === 'xl' ? '-top-4 text-2xl' : size === 'lg' ? '-top-3 text-xl' : '-top-2.5 text-sm'
            } filter drop-shadow-md`}
          >
            🌱
          </span>
        )}

        {/* Main Sprite Orb */}
        <button
          type="button"
          onClick={handleSpriteClick}
          aria-label="마법 요정 루멘과 대화하기"
          className={`relative rounded-full bg-gradient-to-br ${getMoodAura()} p-1 shadow-xl ${
            sizeClasses[size]
          } flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
            isBouncing ? 'animate-bounce' : 'animate-pulse'
          }`}
        >
          {/* Angelic/Magical Wings */}
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-5 bg-white/70 rounded-full blur-[0.5px] rotate-[-25deg] pointer-events-none animate-pulse" />
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-5 bg-white/70 rounded-full blur-[0.5px] rotate-[25deg] pointer-events-none animate-pulse" />

          {/* Inner Glowing Body Face */}
          <div className="w-full h-full bg-gradient-to-b from-white/30 to-slate-950/20 rounded-full flex flex-col items-center justify-center backdrop-blur-xs relative overflow-hidden">
            {/* Sparkle particle */}
            <Sparkles className="w-3 h-3 text-amber-100 absolute top-1 right-1 animate-spin" />

            {/* Cute Cartoon Eyes */}
            <div className="flex items-center gap-2 mt-0.5">
              {mood === 'happy' || mood === 'celebrating' || mood === 'cheer' ? (
                // Happy curved eyes (^_^)
                <>
                  <div className="w-2.5 h-1.5 border-t-2 border-slate-900 rounded-t-full font-black scale-110" />
                  <div className="w-2.5 h-1.5 border-t-2 border-slate-900 rounded-t-full font-black scale-110" />
                </>
              ) : mood === 'excited' ? (
                // Star eyes (*_*)
                <>
                  <Star className="w-2.5 h-2.5 fill-slate-900 text-slate-900 animate-spin" />
                  <Star className="w-2.5 h-2.5 fill-slate-900 text-slate-900 animate-spin" />
                </>
              ) : mood === 'thinking' ? (
                // Thinking wink (o_~)
                <>
                  <div className="w-2 h-2.5 bg-slate-900 rounded-full" />
                  <div className="w-2.5 h-1 bg-slate-900 rounded-full" />
                </>
              ) : (
                // Big shiny anime eyes (ㅇ_ㅇ)
                <>
                  <div className="w-2 h-3 bg-slate-950 rounded-full flex items-start justify-end p-0.5">
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                  <div className="w-2 h-3 bg-slate-950 rounded-full flex items-start justify-end p-0.5">
                    <div className="w-1 h-1 bg-white rounded-full" />
                  </div>
                </>
              )}
            </div>

            {/* Cute rosy cheeks & little mouth */}
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-1.5 h-1 bg-pink-400/90 rounded-full" />
              <div className="w-1 h-1 bg-rose-950 rounded-full" />
              <div className="w-1.5 h-1 bg-pink-400/90 rounded-full" />
            </div>
          </div>
        </button>

        {/* Cute Name badge with accessory change button */}
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-md flex items-center gap-1">
            <span>루멘</span>
            <Sparkles className="w-2.5 h-2.5 text-amber-900" />
          </span>
          {showCostumeToggle && (
            <button
              onClick={cycleAccessory}
              title="루멘 모자 바꾸기"
              className="text-[9px] bg-slate-800 text-amber-300 px-1 py-0.5 rounded-md hover:bg-slate-700 transition-colors border border-amber-400/30"
            >
              모자🎨
            </button>
          )}
        </div>
      </div>

      {/* Cheerful Speech Bubble */}
      {message && (
        <div className="flex-1 bg-gradient-to-br from-slate-900/95 via-indigo-950/90 to-slate-900/95 border-2 border-amber-400/50 rounded-3xl rounded-tl-sm p-3.5 shadow-2xl backdrop-blur-md relative transform transition-transform hover:-translate-y-0.5">
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 inline-flex items-center gap-1">
                  <Wand2 className="w-2.5 h-2.5 text-amber-300" />
                  요정 친구의 마법 팁
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-amber-100 leading-snug">
                {message}
              </p>
            </div>

            {canSpeak && (
              <button
                type="button"
                onClick={handleSpeak}
                className="p-2 text-amber-300 bg-amber-400/20 hover:bg-amber-400/30 active:scale-90 rounded-2xl transition-all border border-amber-400/40 flex-shrink-0 shadow-sm"
                title="루멘 목소리 듣기"
                aria-label="루멘 목소리 듣기"
              >
                <Volume2 className="w-4 h-4 text-amber-300" />
              </button>
            )}
          </div>

          {subMessage && (
            <div className="mt-2 text-[11px] sm:text-xs text-amber-200/90 font-medium bg-amber-950/40 rounded-xl p-2 border border-amber-500/20 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 fill-amber-400" />
              <span>{subMessage}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

