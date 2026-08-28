import React, { useState } from 'react';
import {
  Flame,
  Zap,
  BookOpen,
  Sparkles,
  Swords,
  User,
  Shield,
  Sliders,
  Sparkle,
  Volume2,
  VolumeX,
  Type,
  Calendar,
  X,
} from 'lucide-react';
import { UserChildProfile } from '../../types';
import { soundEngine } from '../../utils/soundEngine';

interface NavbarProps {
  currentTab?: string;
  activeTab?: string;
  onSelectTab: (tab: string) => void;
  appMode?: 'student' | 'parent' | 'admin' | 'onboarding';
  onSelectMode?: (mode: 'student' | 'parent' | 'admin' | 'onboarding') => void;
  profile: UserChildProfile;
  onUpdateProfile?: (p: UserChildProfile) => void;
  onOpenPaywall: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  activeTab,
  onSelectTab,
  appMode,
  onSelectMode,
  profile,
  onUpdateProfile,
  onOpenPaywall,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);

  const selectedTab = activeTab || currentTab || 'home';
  const effectiveMode = appMode || (selectedTab === 'parent' ? 'parent' : 'student');

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
  };

  const toggleDyslexia = () => {
    soundEngine.playClick();
    if (onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        settings: {
          ...profile.settings,
          dyslexiaFont: !profile.settings.dyslexiaFont,
        },
      });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-indigo-900/40 px-4 lg:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundEngine.playClick();
                onSelectTab('home');
                if (onSelectMode) onSelectMode('student');
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-indigo-600 to-purple-700 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                    SPELLBOOK
                  </span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    v2.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  네 목소리가 마법이 되는 곳
                </p>
              </div>
            </button>

            {/* Mode Switcher Pill */}
            <div className="hidden md:flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800 text-xs">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onSelectTab(selectedTab === 'parent' ? 'home' : selectedTab);
                  if (onSelectMode) onSelectMode('student');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  effectiveMode === 'student'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>🧙‍♂️</span>
                <span>마법 학교</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onSelectTab('parent');
                  if (onSelectMode) onSelectMode('parent');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  effectiveMode === 'parent'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>👨‍👩‍👧</span>
                <span>학부모 리포트</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setShowStreakModal(true);
                  if (onSelectMode) onSelectMode('onboarding');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  effectiveMode === 'onboarding'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>✨</span>
                <span>입문식</span>
              </button>
            </div>
          </div>

          {/* Student Tabs (when in student mode) */}
          {effectiveMode === 'student' && (
            <nav className="hidden lg:flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onSelectTab('home');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedTab === 'home'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>🏰</span>
                <span>마법탑 홈</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onSelectTab('library');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedTab === 'library'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>📚</span>
                <span>원서 도서관</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onSelectTab('grimoire');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedTab === 'grimoire'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>🃏</span>
                <span>스펠 도감</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onSelectTab('arena');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedTab === 'arena'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>⚔️</span>
                <span>랭킹 아레나</span>
              </button>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  onSelectTab('parent');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                  selectedTab === 'parent' || selectedTab === 'my'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>📊</span>
                <span>성장 리포트</span>
              </button>
            </nav>
          )}

          {/* Right Status Bars & Controls */}
          <div className="flex items-center gap-2">
            {/* Streak Button */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setShowStreakModal(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all text-xs font-bold shadow-sm"
              title="스트릭 연속 학습"
            >
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{profile.streakDays}일</span>
            </button>

            {/* Mana Gauge */}
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenPaywall();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 transition-all text-xs font-bold shadow-sm"
              title="마나 충전 / 구독 관리"
            >
              <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>{profile.mana}</span>
              <span className="text-[10px] text-indigo-400 bg-indigo-900/60 px-1 py-0.5 rounded">
                +충전
              </span>
            </button>

            {/* Quick Tools: Sound, Dyslexia Font */}
            <div className="flex items-center gap-1 pl-1 border-l border-slate-800">
              <button
                onClick={toggleDyslexia}
                className={`p-1.5 rounded-lg border transition-colors ${
                  profile.settings.dyslexiaFont
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="난독증/가독성 폰트 토글"
              >
                <Type className="w-4 h-4" />
              </button>
              <button
                onClick={toggleMute}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isMuted
                    ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title={isMuted ? '음소거 해제' : '음소거'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sub Navigation bar */}
        {effectiveMode === 'student' && (
          <div className="lg:hidden flex items-center justify-around pt-2 mt-2 border-t border-slate-800/60 text-xs">
            <button
              onClick={() => onSelectTab('home')}
              className={`flex flex-col items-center gap-0.5 py-1 ${
                selectedTab === 'home' ? 'text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Sparkle className="w-4 h-4" />
              <span>마법탑</span>
            </button>
            <button
              onClick={() => onSelectTab('library')}
              className={`flex flex-col items-center gap-0.5 py-1 ${
                selectedTab === 'library' ? 'text-emerald-400 font-bold' : 'text-slate-400'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>서재</span>
            </button>
            <button
              onClick={() => onSelectTab('grimoire')}
              className={`flex flex-col items-center gap-0.5 py-1 ${
                selectedTab === 'grimoire' ? 'text-purple-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>그리모어</span>
            </button>
            <button
              onClick={() => onSelectTab('arena')}
              className={`flex flex-col items-center gap-0.5 py-1 ${
                selectedTab === 'arena' ? 'text-rose-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>아레나</span>
            </button>
            <button
              onClick={() => onSelectTab('parent')}
              className={`flex flex-col items-center gap-0.5 py-1 ${
                selectedTab === 'parent' || selectedTab === 'my' ? 'text-amber-400 font-bold' : 'text-slate-400'
              }`}
            >
              <User className="w-4 h-4" />
              <span>학부모</span>
            </button>
          </div>
        )}
      </header>

      {/* Streak Details Modal */}
      {showStreakModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl shadow-amber-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-400">
                  <Flame className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-100">
                    {profile.streakDays}일 연속 마법 수련 중! 🔥
                  </h3>
                  <p className="text-xs text-slate-400">
                    매일 유효 발화 10회 이상 시 스트릭이 유지돼요.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowStreakModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 7-Day Flame Track */}
            <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 mb-4">
              <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center justify-between">
                <span>이번 주 수련 불꽃</span>
                <span className="text-amber-400 font-bold">7일 완주 시 SSR 뽑기권</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {['월', '화', '수', '목', '금', '토', '일'].map((day, idx) => {
                  const isDone = idx < 6;
                  const isToday = idx === 6;
                  return (
                    <div
                      key={day}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${
                        isDone
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : isToday
                          ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 animate-pulse'
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span className="text-[11px] font-medium">{day}</span>
                      <Flame
                        className={`w-5 h-5 ${
                          isDone
                            ? 'text-amber-400 fill-amber-400'
                            : isToday
                            ? 'text-indigo-400'
                            : 'text-slate-700'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Streak Freezes Info */}
            <div className="flex items-center justify-between bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 mb-5 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-base">🧊</span>
                <span>스트릭 프리즈 (결석 방패):</span>
              </div>
              <span className="font-bold text-sky-400">{profile.freezeCount}개 보유</span>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                setShowStreakModal(false);
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
            >
              오늘도 마법 수련 계속하기
            </button>
          </div>
        </div>
      )}
    </>
  );
};
