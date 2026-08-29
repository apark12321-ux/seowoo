import React, { useState } from 'react';
import { User, Sparkles, Gem, Shirt, Bot, ShieldCheck, Check } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';
import { UserChildProfile } from '../../types';

interface MyRoomViewProps {
  profile: UserChildProfile;
  onUpdateProfile: (updated: UserChildProfile) => void;
}

export const MyRoomView: React.FC<MyRoomViewProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [selectedTab, setSelectedTab] = useState<'outfit' | 'pet' | 'gems'>('outfit');

  return (
    <div className="flex-1 bg-[#0b3353] p-4 sm:p-6 overflow-y-auto select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-[#10436b] border-4 border-sky-400/40 rounded-3xl p-5 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-2xl">
              👦🏽
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                리암의 마이룸
              </h2>
              <p className="text-xs text-sky-200 mt-0.5">
                모은 코인과 단어 보석으로 캐릭터와 로봇 스파키를 꾸며보세요!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#0a2842] px-3 py-1.5 rounded-2xl border border-sky-400/30">
            <span>🪙</span>
            <span className="text-sm font-black text-amber-300">
              {(profile.coins || 1500).toLocaleString()} 코인
            </span>
          </div>
        </div>

        {/* Room Stage & Avatar Preview */}
        <div className="bg-white rounded-3xl border-4 border-[#124974] p-6 shadow-2xl flex flex-col md:flex-row items-center gap-8">
          {/* Avatar & Sparky Stage */}
          <div className="w-full md:w-1/2 aspect-square max-w-[320px] bg-gradient-to-b from-sky-100 to-amber-50 rounded-3xl border-4 border-sky-300 flex flex-col items-center justify-center relative shadow-inner overflow-hidden">
            {/* Stage Backdrop */}
            <div className="absolute top-4 left-4 text-3xl opacity-30">✨</div>
            <div className="absolute top-6 right-6 text-2xl opacity-30">🌟</div>

            {/* Character & Pet */}
            <div className="flex items-end gap-3 relative z-10">
              {/* Liam */}
              <div className="flex flex-col items-center">
                <span className="text-7xl filter drop-shadow-xl">👦🏽</span>
                <span className="text-xs font-black text-slate-800 bg-white/90 px-3 py-0.5 rounded-full mt-1 border border-slate-300">
                  리암 (Lv.{profile.level || 2})
                </span>
              </div>

              {/* Sparky */}
              <div className="flex flex-col items-center animate-bounce" style={{ animationDuration: '2.5s' }}>
                <span className="text-5xl filter drop-shadow-lg">🤖</span>
                <span className="text-[10px] font-black text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full mt-1 border border-sky-300">
                  스파키
                </span>
              </div>
            </div>

            {/* Floor Shadow */}
            <div className="w-48 h-6 bg-slate-900/10 rounded-full blur-sm mt-2" />
          </div>

          {/* Customization Tabs */}
          <div className="flex-1 w-full space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              {[
                { key: 'outfit' as const, label: '의상 코디', icon: Shirt },
                { key: 'pet' as const, label: '펫 로봇', icon: Bot },
                { key: 'gems' as const, label: '단어 보석함', icon: Gem },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedTab(tab.key);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all ${
                      selectedTab === tab.key
                        ? 'bg-[#1b88dd] text-white shadow'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            {selectedTab === 'outfit' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-sky-50 border-2 border-sky-400 rounded-2xl p-3 flex flex-col items-center relative">
                  <div className="text-4xl">👕</div>
                  <span className="text-xs font-black text-slate-800 mt-1">하늘색 티셔츠</span>
                  <span className="text-[10px] text-emerald-600 font-bold mt-0.5">착용 중 ✓</span>
                </div>
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 flex flex-col items-center opacity-80 hover:opacity-100 cursor-pointer">
                  <div className="text-4xl">🦺</div>
                  <span className="text-xs font-black text-slate-800 mt-1">탐험가 조끼</span>
                  <span className="text-[10px] text-amber-600 font-bold mt-0.5">300 코인</span>
                </div>
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 flex flex-col items-center opacity-80 hover:opacity-100 cursor-pointer">
                  <div className="text-4xl">🥋</div>
                  <span className="text-xs font-black text-slate-800 mt-1">히어로 망토</span>
                  <span className="text-[10px] text-amber-600 font-bold mt-0.5">500 코인</span>
                </div>
              </div>
            )}

            {selectedTab === 'pet' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-sky-50 border-2 border-sky-400 rounded-2xl p-3 flex flex-col items-center">
                  <div className="text-4xl">🤖</div>
                  <span className="text-xs font-black text-slate-800 mt-1">스파키 로봇</span>
                  <span className="text-[10px] text-emerald-600 font-bold mt-0.5">장착 중 ✓</span>
                </div>
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 flex flex-col items-center">
                  <div className="text-4xl">🐉</div>
                  <span className="text-xs font-black text-slate-800 mt-1">아기 드래곤</span>
                  <span className="text-[10px] text-purple-600 font-bold mt-0.5">드래곤 봉우리 보상</span>
                </div>
              </div>
            )}

            {selectedTab === 'gems' && (
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💎</span>
                    <div>
                      <span className="text-xs font-black text-slate-900">루비 단어 보석</span>
                      <p className="text-[10px] text-slate-500">캐릭터 의상 해금용 보석</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-rose-600">{profile.wordGems?.ruby || 8}개 보유</span>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-sky-50 border-2 border-sky-200 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔷</span>
                    <div>
                      <span className="text-xs font-black text-slate-900">사파이어 단어 보석</span>
                      <p className="text-[10px] text-slate-500">아이템 및 악세서리 보석</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-sky-600">{profile.wordGems?.sapphire || 14}개 보유</span>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔮</span>
                    <div>
                      <span className="text-xs font-black text-slate-900">자수정 단어 보석</span>
                      <p className="text-[10px] text-slate-500">히든 퀘스트 해금 보석</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-purple-600">{profile.wordGems?.amethyst || 6}개 보유</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
