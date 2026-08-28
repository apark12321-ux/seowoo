import React, { useState } from 'react';
import {
  Play,
  Flame,
  Star,
  Gift,
  BookOpen,
  Sparkles,
  Swords,
  ChevronRight,
  CheckCircle2,
  Trophy,
  Zap,
  Volume2,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserChildProfile, DailyQuest, Book } from '../../types';
import { soundEngine } from '../../utils/soundEngine';
import { speechService } from '../../utils/speech';
import { LumenSprite } from '../Companion/LumenSprite';
import { BeginnerGuideModal } from '../Guide/BeginnerGuideModal';

interface MagicTowerHomeProps {
  profile: UserChildProfile;
  quests: DailyQuest[];
  books: Book[];
  onStartReading: (bookId: string, chapterId: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenPaywall: () => void;
  onClaimDailyReward?: () => void;
}

export const MagicTowerHome: React.FC<MagicTowerHomeProps> = ({
  profile,
  quests,
  books,
  onStartReading,
  onNavigateTab,
  onOpenPaywall,
  onClaimDailyReward,
}) => {
  const [rewardClaimed, setRewardClaimed] = useState<boolean>(false);
  const [starCandies, setStarCandies] = useState<number>(25);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [lumenMessage, setLumenMessage] = useState<string>(
    '서우야 반가워! 오늘 읽을 마법 동화가 준비되었어 ✨'
  );

  const currentBook = books[0]; // The Dark Forest & The Crystal Key
  const currentChapter = currentBook.chapters[0];
  const allQuestsDone = quests.every((q) => q.completed);

  // Daily Gift Box Claim
  const handleClaimDailyGift = () => {
    if (rewardClaimed) return;
    soundEngine.playLevelUp();
    setRewardClaimed(true);
    setStarCandies((prev) => prev + 5);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f59e0b', '#ec4899', '#8b5cf6'],
    });

    setLumenMessage('와! 출석 선물로 별사탕 5개와 마나를 얻었어! 🎁');
    speechService.speakKorean('출석 선물이 도착했어요! 오늘도 멋지게 마법을 외쳐봐요!');

    if (onClaimDailyReward) {
      onClaimDailyReward();
    }
  };

  // Lumen Tap Reaction
  const handleTapLumen = () => {
    soundEngine.playSeowooMagic();
    const greetings = [
      '서우의 영어 발음은 언제나 최고야! 🪄',
      '오늘 1챕터 읽고 보스 녹스를 물리쳐보자! ⚔️',
      '소리 내어 크게 말할수록 마법 공격력이 강해져! 💫',
      '대마법사 서우 화이팅! 루멘이 늘 응원해! 👑',
    ];
    const picked = greetings[Math.floor(Math.random() * greetings.length)];
    setLumenMessage(picked);
    speechService.speakKorean(picked);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* 1. TOP BAR: Welcoming Hero & Stats */}
      <div className="bg-gradient-to-r from-slate-900/95 via-indigo-950/90 to-purple-950/95 border-2 border-amber-400/40 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left: Wizard Info & Lumen Greeting */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div
            onClick={handleTapLumen}
            className="cursor-pointer group relative shrink-0"
            title="루멘 요정을 터치해보세요!"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-amber-500 p-0.5 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-3xl sm:text-4xl">
                🧚‍♂️
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow">
              터치! ✨
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm sm:text-base font-black text-amber-300">
                대마법사 {profile.nickname} (Lv.{profile.wizardRank})
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-500/20 text-purple-200 border border-purple-400/40">
                AR {profile.arLevel} 모험
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 font-bold bg-slate-950/60 px-3 py-1.5 rounded-xl border border-indigo-500/30">
              "{lumenMessage}"
            </p>
          </div>
        </div>

        {/* Right: Quick Stats & Daily Gift */}
        <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto justify-end flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-950/80 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black shadow-sm">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-bounce" />
            <span>{profile.streakDays}일 연속</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-950/80 border border-yellow-400/40 text-yellow-300 text-xs sm:text-sm font-black shadow-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>별사탕 {starCandies}</span>
          </div>

          <button
            type="button"
            onClick={handleClaimDailyGift}
            disabled={rewardClaimed}
            className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all shadow-md ${
              rewardClaimed
                ? 'bg-slate-800 text-slate-400 border border-slate-700'
                : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white animate-pulse'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>{rewardClaimed ? '출석완료 🎁' : '출석 선물 🎁'}</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN HERO CARD: One-Click Adventure Start */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Book Cover Image */}
          <div className="lg:col-span-5 relative group">
            <div
              className="rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-video lg:aspect-[4/3] border-2 border-amber-400/40 shadow-2xl cursor-pointer relative"
              onClick={() => onStartReading(currentBook.id, currentChapter.id)}
            >
              <img
                src={currentBook.coverUrl}
                alt={currentBook.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-4">
                <span className="px-3 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow">
                  지금 도전할 동화 📖
                </span>
              </div>
            </div>
          </div>

          {/* Book Info & Play Button */}
          <div className="lg:col-span-7 space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  AR {currentBook.arLevel} • {currentBook.chapters.length}개 챕터
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  제{currentChapter.seq}장: {currentChapter.titleKo}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {currentBook.title}
              </h2>
              <p className="text-sm sm:text-base text-amber-200 font-bold">
                {currentBook.titleKo}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                {currentBook.synopsisKo}
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onStartReading(currentBook.id, currentChapter.id);
                }}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-102 border-2 border-amber-300"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>지금 마법 동화 읽기! 🚀</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onNavigateTab('library');
                }}
                className="py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>다른 책 고르기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. THREE CORE HUBS: Clean, Fun & Big Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Hub 1: Library */}
        <div
          onClick={() => {
            soundEngine.playClick();
            onNavigateTab('library');
          }}
          className="p-5 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/30 hover:border-emerald-400 cursor-pointer group transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📚
            </div>
            <span className="text-xs font-black text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-500/30">
              {books.length}권 보유
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors">
              원서 도서관
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              다양한 레벨의 영어 판타지 동화를 골라 읽어보세요.
            </p>
          </div>
          <div className="text-xs font-black text-emerald-400 flex items-center gap-1">
            <span>도서관 입장하기</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Hub 2: Grimoire (Card Album) */}
        <div
          onClick={() => {
            soundEngine.playClick();
            onNavigateTab('grimoire');
          }}
          className="p-5 rounded-3xl bg-slate-900/90 border-2 border-purple-500/30 hover:border-purple-400 cursor-pointer group transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🃏
            </div>
            <span className="text-xs font-black text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-xl border border-purple-500/30">
              {Object.keys(profile.collectedCards).length}장 수집
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-white group-hover:text-purple-300 transition-colors">
              스펠 도감
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              포획한 황금 마법 카드를 모으고 발음을 연습하세요.
            </p>
          </div>
          <div className="text-xs font-black text-purple-400 flex items-center gap-1">
            <span>도감 앨범 열기</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Hub 3: Arena */}
        <div
          onClick={() => {
            soundEngine.playClick();
            onNavigateTab('arena');
          }}
          className="p-5 rounded-3xl bg-slate-900/90 border-2 border-rose-500/30 hover:border-rose-400 cursor-pointer group transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-300 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              ⚔️
            </div>
            <span className="text-xs font-black text-amber-300 bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-500/30">
              👑 1위 챔피언
            </span>
          </div>
          <div>
            <h3 className="text-base font-black text-white group-hover:text-rose-300 transition-colors">
              랭킹 아레나
            </h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              마법 친구들과 스피킹 점수를 겨루고 리그 우승을 차지하세요!
            </p>
          </div>
          <div className="text-xs font-black text-rose-400 flex items-center gap-1">
            <span>아레나 참가하기</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 4. DAILY MISSIONS (Simple 3-Quest List) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h3 className="text-sm sm:text-base font-black text-slate-100">
              오늘의 마법 퀘스트
            </h3>
          </div>
          <button
            onClick={() => setShowGuideModal(true)}
            className="text-xs text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>플레이 방법</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                quest.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-950/60 border-slate-800 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base">{quest.completed ? '⭐' : '🪄'}</span>
                <span className="text-xs font-black truncate">{quest.titleKo}</span>
              </div>
              <span className="text-xs font-bold text-slate-400 shrink-0">
                {quest.completed ? '완료!' : `${quest.current}/${quest.target}`}
              </span>
            </div>
          ))}
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
