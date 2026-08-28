import React from 'react';
import {
  Award,
  Sparkles,
  Zap,
  Flame,
  CheckCircle2,
  ArrowRight,
  Share2,
  RotateCcw,
  BookOpen,
  Volume2,
  Crown,
} from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';
import { speechService } from '../../utils/speech';

interface BattleResultProps {
  result: 'win' | 'lose';
  damageTotal: number;
  maxCombo: number;
  chapterTitle: string;
  onContinue: () => void;
  onRetry: () => void;
  onGoHome: () => void;
}

export const BattleResult: React.FC<BattleResultProps> = ({
  result,
  damageTotal,
  maxCombo,
  chapterTitle,
  onContinue,
  onRetry,
  onGoHome,
}) => {
  const isWin = result === 'win';

  const handlePlayVictoryCheer = () => {
    soundEngine.playSeowooCheerFanfare();
    speechService.speakKorean('대마법사 박서우님! 완벽한 영어 스펠로 어둠의 도둑 녹스를 격퇴하고 마법 세계를 구하셨어요! 축하해요 서우야!');
  };

  const handleShare = () => {
    soundEngine.playClick();
    if (navigator.share) {
      navigator.share({
        title: '대마법사 박서우의 SPELLBOOK 승리 리포트',
        text: `대마법사 박서우(Seowoo)가 ${damageTotal} 데미지와 ${maxCombo}연속 콤보로 녹스를 물리쳤어요! 🔥`,
      }).catch(() => {});
    } else {
      alert('승리 인증 카드가 클립보드에 복사되었습니다! (친구에게 자랑해보세요 ✨)');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 bg-slate-950">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-6 relative overflow-hidden animate-fadeIn">
        {/* Shimmer aura */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Victory/Defeat Icon */}
        <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 p-0.5 shadow-xl shadow-amber-500/30 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-4xl">
            {isWin ? '👑' : '🛡️'}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-400/30">
            Park Seowoo Victory
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isWin ? '박서우 대마법사의 대승리! 🏆' : '마법 에너지가 부족해요'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            {isWin
              ? `서우 마법사의 완벽한 발음으로 ${chapterTitle}의 어둠을 걷어냈습니다!`
              : '서우야, 다시 도전하면 훔쳐간 카드를 완전히 되찾을 수 있어! 파이팅!'}
          </p>
        </div>

        {/* Reward Stats Grid */}
        {isWin && (
          <div className="grid grid-cols-3 gap-2.5 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-center">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-semibold">경험치 (XP)</span>
              <p className="text-base font-black text-amber-400">+50 XP</p>
            </div>
            <div className="space-y-0.5 border-x border-slate-800">
              <span className="text-[10px] text-slate-400 font-semibold">마나 (Mana)</span>
              <p className="text-base font-black text-indigo-400">+5 ⚡</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-semibold">최대 콤보</span>
              <p className="text-base font-black text-rose-400">x{maxCombo} 🔥</p>
            </div>
          </div>
        )}

        {/* Next Chapter Unlocked notice */}
        {isWin && (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>다음 챕터가 해금되었습니다!</span>
            </div>

            {/* Audio Praise Button */}
            <button
              type="button"
              onClick={handlePlayVictoryCheer}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-400/40 text-pink-300 text-xs font-black flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Volume2 className="w-4 h-4 text-pink-400" />
              <span>🔊 서우 승리 축하 음성 듣기 (클릭)</span>
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          {isWin ? (
            <>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onContinue();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
              >
                <span>서재로 이동하여 다음 챕터 읽기</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>승리 카드 자랑하기 (공유)</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                soundEngine.playClick();
                onRetry();
              }}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>다시 도전하기</span>
            </button>
          )}

          <button
            onClick={() => {
              soundEngine.playClick();
              onGoHome();
            }}
            className="w-full py-2 text-xs text-slate-400 hover:text-slate-200"
          >
            마법탑 홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
