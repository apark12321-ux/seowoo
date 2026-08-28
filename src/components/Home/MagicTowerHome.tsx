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
} from 'lucide-react';
import { UserChildProfile, DailyQuest, Book } from '../../types';
import { LumenSprite } from '../Companion/LumenSprite';
import { soundEngine } from '../../utils/soundEngine';
import { calculateXpForNextRank } from '../../utils/scoring';

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
    `안녕, 멋진 꼬마 마법사 ${profile.nickname}! 오늘도 신나게 영어 마법을 외쳐보자! 🪄✨`
  );
  const [starCandies, setStarCandies] = useState<number>(profile.manaStars || 12);
  const [rewardClaimed, setRewardClaimed] = useState<boolean>(false);
  const [showGiftAnimation, setShowGiftAnimation] = useState<boolean>(false);

  const currentBook = books[0]; // The Dark Forest & The Crystal Key
  const currentChapter = currentBook.chapters[0];
  const nextRankXp = calculateXpForNextRank(profile.wizardRank);
  const xpProgress = Math.min(100, Math.round((profile.xp / nextRankXp) * 100));

  const allQuestsDone = quests.every((q) => q.completed);

  const handleClaimDailyGift = () => {
    if (rewardClaimed) return;
    soundEngine.playLevelUp();
    setShowGiftAnimation(true);
    setRewardClaimed(true);
    setStarCandies((prev) => prev + 5);
    setTimeout(() => setShowGiftAnimation(false), 2000);
  };

  const mascotGreetings = [
    `우와! ${profile.nickname}의 마법 지팡이에 황금빛 에너지가 깃들었어! 🌟`,
    `오늘의 추천 마법: 용기의 주문 'courage'를 큰 목소리로 외쳐봐! 🔥`,
    `소리 내어 읽으면 마법 주문이 두 배로 강해진대! 📖🪄`,
    `별사탕을 모아서 멋진 마법 모자와 스펠 카드를 모아보자! 🎁`,
  ];

  const handlePokeLumen = () => {
    const randomQuote =
      mascotGreetings[Math.floor(Math.random() * mascotGreetings.length)];
    setSelectedMascotQuote(randomQuote);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner: Cheerful Elementary Magic Campus Greeting */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Lumen & Wizard Pet Camp Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-900/90 via-purple-950/90 to-slate-900/95 border-2 border-indigo-400/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          {/* Playful background glows and stars */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />

          <div>
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-md flex items-center gap-1">
                  <span>✨ 꼬마 마법 학교</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  초등 맞춤 레벨 AR {profile.arLevel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Streak flame badge */}
                <div className="flex items-center gap-1.5 text-xs text-amber-300 font-black bg-slate-950/70 px-3 py-1 rounded-full border border-amber-400/30 shadow">
                  <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-bounce" />
                  <span>{profile.streakDays}일 연속 출석! 🔥</span>
                </div>

                {/* Star Candy counter */}
                <div className="flex items-center gap-1 text-xs text-yellow-300 font-black bg-slate-950/70 px-2.5 py-1 rounded-full border border-yellow-400/30 shadow">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span>별사탕 {starCandies}개</span>
                </div>
              </div>
            </div>

            {/* Interactive Lumen Fairy Companion */}
            <div className="bg-slate-950/40 p-4 rounded-3xl border border-indigo-400/20 backdrop-blur-xs">
              <LumenSprite
                mood="excited"
                message={selectedMascotQuote}
                subMessage="💡 루멘을 콕! 찌르면 신나는 마법 응원과 꿀팁을 들려줘요!"
                size="md"
                showCostumeToggle={true}
                onTap={handlePokeLumen}
              />
            </div>
          </div>

          {/* Quick Action & XP Progress Bar */}
          <div className="mt-5 pt-4 border-t border-indigo-800/40 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg flex items-center justify-center text-2xl animate-pulse">
                🧙‍♂️
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-amber-300">
                    Lv.{profile.wizardRank} {profile.rankTitle}
                  </span>
                  <span className="text-[10px] text-indigo-300 bg-indigo-900/60 px-1.5 py-0.2 rounded-md">
                    {profile.nickname}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-36 sm:w-52 h-3 bg-slate-950 rounded-full p-0.5 border border-amber-500/30 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${xpProgress}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-amber-300 font-extrabold">
                    {profile.xp} / {nextRankXp} XP
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Daily gift reward box */}
              <button
                type="button"
                onClick={handleClaimDailyGift}
                disabled={rewardClaimed}
                className={`px-3.5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md ${
                  rewardClaimed
                    ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default'
                    : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white animate-bounce'
                }`}
                title="매일 마법 선물 상자 열기"
              >
                <Gift className="w-4 h-4" />
                <span>{rewardClaimed ? '선물 받음 🎁' : '출석 선물 🎁'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onStartReading(currentBook.id, currentChapter.id);
                }}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 border-2 border-amber-300"
              >
                <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>오늘의 모험 시작! 🚀</span>
              </button>
            </div>
          </div>
        </div>

        {/* Continue Reading Adventure Book Card */}
        <div className="bg-gradient-to-b from-slate-900 via-indigo-950/60 to-slate-900 border-2 border-slate-800 hover:border-indigo-500/40 rounded-3xl p-5 flex flex-col justify-between shadow-xl relative overflow-hidden transition-all">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                <span>📖 읽고 있던 마법 동화</span>
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
        <div className="lg:col-span-2 bg-slate-900/90 border-2 border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center text-xl shadow">
                🎯
              </div>
              <div>
                <h3 className="font-black text-base text-slate-100 flex items-center gap-1.5">
                  <span>오늘의 마법 퀘스트 3종</span>
                  <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                    보너스 +5 별사탕
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  매일 3개의 퀘스트를 완료하고 강력한 스펠 파워를 얻으세요!
                </p>
              </div>
            </div>

            {allQuestsDone && (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 shadow-md animate-bounce">
                🎉 오늘의 퀘스트 모두 완료!
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                  quest.completed
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-100 hover:border-indigo-400/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-bold shadow ${
                      quest.completed
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                    }`}
                  >
                    {quest.completed ? '⭐' : '🪄'}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-100">
                      {quest.titleKo}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">{quest.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs font-black text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-500/20">
                      +{quest.rewardMana} 마나
                    </span>
                    <p className="text-[11px] text-slate-400 font-bold mt-0.5">
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
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-md transition-all active:scale-95"
                    >
                      출발 🏃‍♂️
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-300 font-black px-2.5 py-1 bg-emerald-500/20 rounded-xl border border-emerald-400/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      완료!
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kid-Friendly Magic Centers */}
        <div className="space-y-3 flex flex-col justify-between">
          {/* Grimoire Spell Deck */}
          <div
            onClick={() => {
              soundEngine.playClick();
              onNavigateTab('grimoire');
            }}
            className="p-4 rounded-3xl bg-gradient-to-br from-purple-900/70 via-slate-900 to-indigo-950/80 border-2 border-purple-500/30 hover:border-purple-400 cursor-pointer group transition-all shadow-xl hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl group-hover:scale-125 transition-transform">
                  🃏
                </span>
                <h4 className="font-black text-sm text-purple-200">
                  스펠 카드 앨범 (도감)
                </h4>
              </div>
              <span className="text-xs font-black text-purple-200 bg-purple-900/80 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                {Object.keys(profile.collectedCards).length}장 모음 ✨
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              내가 모은 마법 카드를 구경하고 발음을 신나게 연습해보세요!
            </p>
          </div>

          {/* Arena League */}
          <div
            onClick={() => {
              soundEngine.playClick();
              onNavigateTab('arena');
            }}
            className="p-4 rounded-3xl bg-gradient-to-br from-rose-900/70 via-slate-900 to-amber-950/80 border-2 border-rose-500/30 hover:border-rose-400 cursor-pointer group transition-all shadow-xl hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl group-hover:scale-125 transition-transform">
                  ⚔️
                </span>
                <h4 className="font-black text-sm text-rose-200">
                  마법사 랭킹 아레나
                </h4>
              </div>
              <span className="text-xs font-black text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                골드 리그 2위 🏆
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              친구들과 스피킹 랭킹을 겨루고 멋진 챔피언 트로피를 얻으세요!
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
                  마법 원서 도서관
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
    </div>
  );
};
