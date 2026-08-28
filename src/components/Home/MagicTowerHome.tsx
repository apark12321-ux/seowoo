import React, { useState } from 'react';
import {
  Flame,
  Zap,
  Play,
  BookOpen,
  Sparkles,
  Swords,
  Shield,
  Award,
  ChevronRight,
  CheckCircle2,
  Volume2,
  Star,
  Gift,
  Heart,
  Smile,
  Crown,
  Trophy,
  Wand2,
  Megaphone,
  Compass,
  HelpCircle,
  X,
  Mic,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserChildProfile, DailyQuest, Book } from '../../types';
import { LumenSprite } from '../Companion/LumenSprite';
import { soundEngine } from '../../utils/soundEngine';
import { speechService } from '../../utils/speech';
import { calculateXpForNextRank } from '../../utils/scoring';
import { BeginnerGuideModal } from '../Guide/BeginnerGuideModal';

interface MagicTowerHomeProps {
  profile: UserChildProfile;
  quests: DailyQuest[];
  books: Book[];
  onStartReading: (bookId: string, chapterId: string) => void;
  onNavigateTab: (tab: string) => void;
  onClaimQuest: (questId: string) => void;
  onOpenPaywall: () => void;
}

export const MagicTowerHome: React.FC<MagicTowerHomeProps> = ({
  profile,
  quests,
  books,
  onStartReading,
  onNavigateTab,
  onClaimQuest,
  onOpenPaywall,
}) => {
  const [selectedMascotQuote, setSelectedMascotQuote] = useState<string>(
    `안녕, 대마법사 박서우(Seowoo)! 오늘도 신나게 영어 마법을 외쳐보자! 🪄✨`
  );
  const [starCandies, setStarCandies] = useState<number>(profile.manaStars || 24);
  const [rewardClaimed, setRewardClaimed] = useState<boolean>(false);
  const [showGiftAnimation, setShowGiftAnimation] = useState<boolean>(false);
  const [wandSparkling, setWandSparkling] = useState<boolean>(false);
  const [cheerNotice, setCheerNotice] = useState<string | null>(null);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showGuideBanner, setShowGuideBanner] = useState<boolean>(true);

  const currentBook = books[0]; // The Dark Forest & The Crystal Key
  const currentChapter = currentBook.chapters[0];
  const nextRankXp = calculateXpForNextRank(profile.wizardRank);
  const xpProgress = Math.min(100, Math.round((profile.xp / nextRankXp) * 100));

  const allQuestsDone = quests.every((q) => q.completed);

  const handleClaimDailyGift = () => {
    if (rewardClaimed) return;
    soundEngine.playLevelUp();
    speechService.speakKorean('박서우 마법사님, 매일 출석 별사탕 5개가 도착했어요!');
    setShowGiftAnimation(true);
    setRewardClaimed(true);
    setStarCandies((prev) => prev + 5);
    setTimeout(() => setShowGiftAnimation(false), 2000);
  };

  const mascotGreetings = [
    `우와! 대마법사 박서우님의 마법 지팡이에 황금빛 에너지가 가득 찼어! 🌟`,
    `서우야! 오늘의 추천 마법 'radiant'와 'courage'를 큰 목소리로 외쳐봐! 🔥`,
    `소리 내어 영창하면 서우의 마법 주문이 두 배로 강력해진대! 📖🪄`,
    `대마법사 Seowoo의 영어 발음은 오늘도 100점 만점에 100점이야! 👑✨`,
    `서우의 별빛 마법으로 어둠의 도둑 녹스를 물리치러 가볼까? 🚀`,
  ];

  const handlePokeLumen = () => {
    const randomQuote =
      mascotGreetings[Math.floor(Math.random() * mascotGreetings.length)];
    setSelectedMascotQuote(randomQuote);
  };

  // ✨ Interactive Seowoo Magic Wand Wave Action
  const handleWaveSeowooWand = () => {
    soundEngine.playSeowooMagic();
    setWandSparkling(true);
    setCheerNotice('✨ 박서우 대마법사님의 마법력이 +1,000 충전되었습니다! ✨');

    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f43f5e', '#a855f7', '#38bdf8', '#34d399'],
      });
    } catch {
      // ignore
    }

    const praises = [
      '서우야 최고야! 서우의 황금빛 마법력이 온 세상에 환하게 빛나고 있어!',
      '대마법사 박서우님, 오늘도 완벽한 영어 마법을 펼쳐주세요!',
      'Awesome job, Seowoo! Your magical voice is super powerful!',
    ];
    const pickedPraise = praises[Math.floor(Math.random() * praises.length)];
    speechService.cheerSeowoo(pickedPraise);

    setTimeout(() => setWandSparkling(false), 1500);
    setTimeout(() => setCheerNotice(null), 4000);
  };

  // 🔊 Audio Cheer Trigger for Seowoo
  const handlePlayVoiceCheer = () => {
    soundEngine.playSeowooCheerFanfare();
    speechService.cheerSeowoo();
    setCheerNotice('🔊 박서우 마법사를 위한 특별 응원 음성이 흘러나옵니다! 🎵');
    setTimeout(() => setCheerNotice(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Personalized Floating Toast Notice */}
      {cheerNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-600 text-slate-950 font-black text-sm sm:text-base shadow-2xl border-2 border-white animate-bounce flex items-center gap-2">
          <span>👑</span>
          <span>{cheerNotice}</span>
        </div>
      )}

      {/* 💡 FIRST-TIME USER / BEGINNER GUIDE TIPS BANNER */}
      {showGuideBanner && (
        <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900/95 to-purple-950/90 border-2 border-amber-400/40 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-amber-400/20 text-amber-300 shadow-md">
                <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-amber-400 text-slate-950 whitespace-nowrap">
                    처음 오셨나요?
                  </span>
                  <span className="text-xs sm:text-sm font-black text-amber-300 whitespace-nowrap">
                    SPELLBOOK 4단계 마법 모험 가이드 ✨
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 font-medium">
                  영어로 소리 내어 말할 때마다 마법 에너지가 깨어나는 환상적인 학습 모험!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setShowGuideModal(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5 transition-all hover:scale-105 whitespace-nowrap"
              >
                <span>상세 가이드 보기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowGuideBanner(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="가이드 배너 접기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4 Step Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div
              onClick={() => {
                soundEngine.playClick();
                onNavigateTab('library');
              }}
              className="p-3.5 rounded-2xl bg-slate-950/70 border border-emerald-500/30 hover:border-emerald-400 transition-all cursor-pointer group hover:bg-emerald-950/30"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-lg">📖</span>
                <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  STEP 1
                </span>
              </div>
              <h5 className="text-xs font-black text-white group-hover:text-emerald-300 whitespace-nowrap">
                마법 원서 소리 내어 읽기
              </h5>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                커서를 따라 원어민 발음처럼 큰 목소리로 읽어요.
              </p>
            </div>

            <div
              onClick={() => {
                soundEngine.playClick();
                onStartReading(currentBook.id, currentChapter.id);
              }}
              className="p-3.5 rounded-2xl bg-slate-950/70 border border-amber-500/30 hover:border-amber-400 transition-all cursor-pointer group hover:bg-amber-950/30"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-lg">🃏</span>
                <span className="text-[10px] font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                  STEP 2
                </span>
              </div>
              <h5 className="text-xs font-black text-white group-hover:text-amber-300 whitespace-nowrap">
                스펠 단어 터치 & 영창
              </h5>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                빛나는 단어를 눌러 마이크로 발음하고 카드를 포획해요.
              </p>
            </div>

            <div
              onClick={() => {
                soundEngine.playClick();
                onStartReading(currentBook.id, currentChapter.id);
              }}
              className="p-3.5 rounded-2xl bg-slate-950/70 border border-rose-500/30 hover:border-rose-400 transition-all cursor-pointer group hover:bg-rose-950/30"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-lg">⚔️</span>
                <span className="text-[10px] font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">
                  STEP 3
                </span>
              </div>
              <h5 className="text-xs font-black text-white group-hover:text-rose-300 whitespace-nowrap">
                8초 스피킹 보스 배틀
              </h5>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                모은 스펠 카드를 빠르게 외쳐 어둠의 녹스를 쓰러뜨려요!
              </p>
            </div>

            <div
              onClick={() => {
                soundEngine.playClick();
                onNavigateTab('grimoire');
              }}
              className="p-3.5 rounded-2xl bg-slate-950/70 border border-purple-500/30 hover:border-purple-400 transition-all cursor-pointer group hover:bg-purple-950/30"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-lg">👑</span>
                <span className="text-[10px] font-black text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-md">
                  STEP 4
                </span>
              </div>
              <h5 className="text-xs font-black text-white group-hover:text-purple-300 whitespace-nowrap">
                도감 완성 & 랭킹 1위
              </h5>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                SSR 전설 카드를 수집하고 아레나 챔피언에 등극하세요!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner: Cheerful Elementary Magic Campus Greeting */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Lumen & Wizard Pet Camp Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900/95 via-purple-950/95 to-slate-900/95 border-2 border-amber-400/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          {/* Playful background glows and stars */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-md flex items-center gap-1.5 border border-amber-300">
                  <Crown className="w-4 h-4 fill-slate-950 text-slate-950" />
                  <span>대마법사 박서우(Seowoo)의 탑</span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-black bg-purple-500/30 text-purple-200 border border-purple-400/30 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>초등 5학년 맞춤 AR {profile.arLevel}</span>
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Streak flame badge */}
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-amber-300 font-black bg-slate-950/80 px-3.5 py-1.5 rounded-full border border-amber-400/40 shadow">
                  <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-bounce" />
                  <span>서우의 {profile.streakDays}일 연속 출석! 🔥</span>
                </div>

                {/* Star Candy counter */}
                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-yellow-300 font-black bg-slate-950/80 px-3.5 py-1.5 rounded-full border border-yellow-400/40 shadow">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>별사탕 {starCandies}개</span>
                </div>
              </div>
            </div>

            {/* Interactive Lumen Fairy Companion */}
            <div className="bg-slate-950/50 p-4 sm:p-5 rounded-3xl border border-indigo-400/30 backdrop-blur-xs">
              <LumenSprite
                mood="excited"
                message={selectedMascotQuote}
                subMessage="💡 루멘 요정을 콕! 누르면 서우를 위한 마법 응원과 꿀팁을 들려줘요!"
                size="md"
                showCostumeToggle={true}
                onTap={handlePokeLumen}
              />
            </div>

            {/* ✨ SEOWOO'S SPECIAL FUN INTERACTION TOOLBAR ✨ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {/* Magic Wand Wave Button */}
              <button
                type="button"
                onClick={handleWaveSeowooWand}
                className={`p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between shadow-lg ${
                  wandSparkling
                    ? 'bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-slate-950 border-white scale-105 animate-pulse'
                    : 'bg-gradient-to-r from-indigo-900/80 to-purple-900/80 hover:from-indigo-800 hover:to-purple-800 border-amber-400/40 text-amber-200'
                }`}
                title="서우의 마법 지팡이 흔들기"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl animate-spin">🪄</span>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-black text-white flex items-center gap-1">
                      <span>서우의 마법 지팡이 흔들기</span>
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    </p>
                    <p className="text-[11px] text-amber-300/90 font-semibold">
                      터치 시 반짝이는 별빛 효과 & 음성 마법 발동!
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-xl bg-amber-400/20 text-amber-300 text-xs font-black border border-amber-400/30">
                  클릭! ✨
                </span>
              </button>

              {/* Seowoo Audio Cheer Megaphone */}
              <button
                type="button"
                onClick={handlePlayVoiceCheer}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-900/80 to-rose-900/80 hover:from-pink-800 hover:to-rose-800 border-2 border-pink-400/40 text-pink-200 transition-all flex items-center justify-between shadow-lg group hover:scale-[1.02]"
                title="박서우 전용 응원 확성기"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-125 transition-transform">
                    📣
                  </span>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-black text-white flex items-center gap-1">
                      <span>박서우 응원 확성기</span>
                      <Volume2 className="w-3.5 h-3.5 text-pink-300" />
                    </p>
                    <p className="text-[11px] text-pink-300/90 font-semibold">
                      서우만을 위한 생생한 한국어/영어 음성 칭찬
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-xl bg-pink-400/20 text-pink-300 text-xs font-black border border-pink-400/30">
                  듣기 🎵
                </span>
              </button>
            </div>
          </div>

          {/* Quick Action & XP Progress Bar */}
          <div className="mt-5 pt-4 border-t border-indigo-800/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg flex items-center justify-center text-3xl animate-pulse ring-2 ring-amber-300/50">
                🧙‍♂️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-black text-amber-300">
                    Lv.{profile.wizardRank} {profile.rankTitle}
                  </span>
                  <span className="text-xs text-amber-950 bg-amber-400 px-2 py-0.5 rounded-md font-black shadow-sm">
                    {profile.nickname} (Seowoo)
                  </span>
                </div>
                <div className="flex items-center gap-2.5 mt-1.5">
                  <div className="w-40 sm:w-56 h-3.5 bg-slate-950 rounded-full p-0.5 border border-amber-500/30 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-amber-300 font-black">
                    {profile.xp} / {nextRankXp} XP
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Daily gift reward box */}
              <button
                type="button"
                onClick={handleClaimDailyGift}
                disabled={rewardClaimed}
                className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all shadow-md ${
                  rewardClaimed
                    ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white animate-bounce'
                }`}
                title="매일 마법 선물 상자 열기"
              >
                <Gift className="w-5 h-5" />
                <span>{rewardClaimed ? '서우 선물 받음 🎁' : '서우 출석 선물 🎁'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onStartReading(currentBook.id, currentChapter.id);
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/30 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 border-2 border-amber-300"
              >
                <Play className="w-5 h-5 fill-slate-950 text-slate-950" />
                <span>서우의 모험 시작! 🚀</span>
              </button>
            </div>
          </div>
        </div>

        {/* Continue Reading Adventure Book Card */}
        <div className="bg-gradient-to-b from-slate-900 via-indigo-950/60 to-slate-900 border-2 border-slate-800 hover:border-indigo-500/40 rounded-3xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                <span>📖 서우가 읽고 있던 마법 동화</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                초급 모험 (AR {currentBook.arLevel})
              </span>
            </div>

            <div
              className="relative rounded-2xl overflow-hidden aspect-video border-2 border-indigo-500/30 group cursor-pointer shadow-md"
              onClick={() => onStartReading(currentBook.id, currentChapter.id)}
            >
              <img
                src={currentBook.coverUrl}
                alt={currentBook.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-3.5 flex flex-col justify-end">
                <span className="text-xs font-extrabold text-amber-300">
                  {currentChapter.titleKo}
                </span>
                <h4 className="text-sm font-black text-white line-clamp-1">
                  {currentBook.title}
                </h4>
              </div>
            </div>

            <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800">
              {currentBook.synopsisKo}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              onStartReading(currentBook.id, currentChapter.id);
            }}
            className="w-full mt-3 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg border border-indigo-400/40"
          >
            <span>제{currentChapter.seq}장 이어서 읽기</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Daily 3 Quests & Exciting Magic Centers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Daily Quests Box */}
        <div className="lg:col-span-2 bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center text-2xl shadow">
                🎯
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-slate-100 flex items-center gap-2">
                  <span>박서우 마법사의 일일 퀘스트</span>
                  <span className="text-xs sm:text-sm font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                    보너스 +5 별사탕
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  매일 3개의 퀘스트를 완료하고 강력한 스펠 파워를 얻으세요!
                </p>
              </div>
            </div>

            {allQuestsDone && (
              <span className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black bg-amber-400 text-slate-950 shadow-md animate-bounce">
                🎉 오늘의 퀘스트 모두 완료!
              </span>
            )}
          </div>

          <div className="space-y-3">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                  quest.completed
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-100 hover:border-indigo-400/50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl font-bold shadow ${
                      quest.completed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                    }`}
                  >
                    {quest.completed ? '⭐' : '🪄'}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-slate-100">
                      {quest.titleKo}
                    </h4>
                    <p className="text-xs text-slate-300 font-medium">{quest.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-black text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-500/30">
                      +{quest.rewardMana} 마나
                    </span>
                    <p className="text-xs text-slate-300 font-black mt-1">
                      {quest.current} / {quest.target}
                    </p>
                  </div>

                  {!quest.completed ? (
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        onStartReading(currentBook.id, currentChapter.id);
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95"
                    >
                      출발 🏃‍♂️
                    </button>
                  ) : (
                    <span className="text-xs sm:text-sm text-emerald-300 font-black px-3 py-1.5 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      완료!
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kid-Friendly Magic Centers */}
        <div className="space-y-3.5 flex flex-col justify-between">
          {/* Grimoire Spell Deck */}
          <div
            onClick={() => {
              soundEngine.playClick();
              onNavigateTab('grimoire');
            }}
            className="p-5 rounded-3xl bg-gradient-to-br from-purple-900/70 via-slate-900 to-indigo-950/80 border-2 border-purple-500/30 hover:border-purple-400 cursor-pointer group transition-all shadow-xl hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl group-hover:scale-125 transition-transform">
                  🃏
                </span>
                <h4 className="font-black text-base text-purple-200">
                  서우의 스펠 카드 앨범 (도감)
                </h4>
              </div>
              <span className="text-xs sm:text-sm font-black text-purple-200 bg-purple-900/80 px-3 py-1 rounded-full border border-purple-400/30">
                {Object.keys(profile.collectedCards).length}장 모음 ✨
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              서우가 모은 마법 카드를 구경하고 발음을 신나게 연습해보세요!
            </p>
          </div>

          {/* Arena League */}
          <div
            onClick={() => {
              soundEngine.playClick();
              onNavigateTab('arena');
            }}
            className="p-5 rounded-3xl bg-gradient-to-br from-rose-900/70 via-slate-900 to-amber-950/80 border-2 border-rose-500/30 hover:border-rose-400 cursor-pointer group transition-all shadow-xl hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl group-hover:scale-125 transition-transform">
                  👑
                </span>
                <h4 className="font-black text-base text-rose-200">
                  마법사 랭킹 아레나
                </h4>
              </div>
              <span className="text-xs sm:text-sm font-black text-amber-300 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-400/30 animate-pulse">
                박서우 1위 챔피언 🏆
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              전국 마법 학도들과 스피킹 랭킹을 겨루고 1위 챔피언 자리를 지키세요!
            </p>
          </div>

          {/* Library Exploration */}
          <div
            onClick={() => {
              soundEngine.playClick();
              onNavigateTab('library');
            }}
            className="p-4 rounded-3xl bg-gradient-to-br from-emerald-900/70 via-slate-900 to-teal-950/80 border-2 border-emerald-500/30 hover:border-emerald-400 cursor-pointer group transition-all shadow-xl hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl group-hover:scale-125 transition-transform">
                  📚
                </span>
                <h4 className="font-black text-sm text-emerald-200">
                  서우의 마법 원서 도서관
                </h4>
              </div>
              <span className="text-xs font-black text-emerald-200 bg-emerald-900/80 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                {books.length}권의 모험 🧭
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              흥미진진한 판타지 동화를 내 목소리로 실감 나게 탐험하세요!
            </p>
          </div>
        </div>
      </div>

      {/* Beginner Guide Modal */}
      <BeginnerGuideModal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        onStartAdventure={() => onNavigateTab('library')}
      />
    </div>
  );
};

