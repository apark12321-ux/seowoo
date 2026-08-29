import React from 'react';
import { HelpCircle, Sparkles } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

export interface QuestNode {
  id: string;
  name: string;
  nameKo: string;
  icon: string;
  gradeRange: string;
  status: 'locked' | 'current' | 'completed';
  bgGradient: string;
}

interface QuestMapHeaderProps {
  currentQuestId: string;
  onSelectQuest: (questId: string) => void;
  onOpenHelp: () => void;
}

export const QUEST_NODES: QuestNode[] = [
  {
    id: 'snowy_peak',
    name: 'Snowy Peak',
    nameKo: '눈꽃 빙산',
    icon: '🏔️',
    gradeRange: '초등 2-3학년',
    status: 'completed',
    bgGradient: 'from-sky-400 to-indigo-500',
  },
  {
    id: 'dragon_peak',
    name: 'Dragon Peak',
    nameKo: '드래곤 봉우리',
    icon: '🐉',
    gradeRange: '초등 3-4학년',
    status: 'completed',
    bgGradient: 'from-amber-500 to-red-500',
  },
  {
    id: 'misty_jungle',
    name: 'Misty Jungle',
    nameKo: '안개 정글',
    icon: '🌿',
    gradeRange: '초등 4-6학년',
    status: 'current',
    bgGradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'crystal_cave',
    name: 'Crystal Cave',
    nameKo: '수정 동굴',
    icon: '🔮',
    gradeRange: '초등 5-6학년',
    status: 'locked',
    bgGradient: 'from-purple-500 to-fuchsia-600',
  },
  {
    id: 'volcano_peak',
    name: 'Volcano Peak',
    nameKo: '화염 화산',
    icon: '🌋',
    gradeRange: '초등 6학년+',
    status: 'locked',
    bgGradient: 'from-orange-500 to-rose-600',
  },
];

export const QuestMapHeader: React.FC<QuestMapHeaderProps> = ({
  currentQuestId,
  onSelectQuest,
  onOpenHelp,
}) => {
  return (
    <div className="w-full bg-[#1b649d] border-b-4 border-[#124974] px-4 py-2.5 flex items-center justify-between shadow-md relative z-20 select-none">
      {/* Title Logo: ENGLISH ADVENTURE QUEST */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative group cursor-pointer" onClick={() => onSelectQuest('misty_jungle')}>
          <div className="flex flex-col items-start">
            <span className="text-[10px] sm:text-xs font-black tracking-wider text-amber-300 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] uppercase">
              ✨ 마법 주문서 · SPELLBOOK
            </span>
            <div className="relative">
              <h1 className="text-lg sm:text-2xl font-black italic tracking-wide text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-sky-300 drop-shadow-[0_3px_3px_rgba(0,0,0,0.9)] uppercase transform -rotate-1">
                잉글리시 어드벤처 퀘스트
              </h1>
              <div className="absolute -inset-0.5 bg-sky-400/20 blur-sm rounded-lg -z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Quest World Map Trail */}
      <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl mx-4">
        <div className="flex items-center gap-1 sm:gap-3 relative">
          {/* Connecting Trail Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1.5 bg-[#fbd14b] border border-[#b88c1b] rounded-full border-dashed -z-0" />

          {QUEST_NODES.map((node) => {
            const isCurrent = node.id === currentQuestId;
            const isLocked = node.status === 'locked';

            return (
              <div key={node.id} className="relative z-10 flex flex-col items-center">
                {isCurrent ? (
                  /* Active Highlighted Wooden Frame */
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      onSelectQuest(node.id);
                    }}
                    className="flex flex-col items-center bg-[#f7eed4] border-2 border-[#8c592b] rounded-2xl px-3 py-1 shadow-lg ring-2 ring-amber-400 hover:scale-105 transition-all transform -translate-y-1"
                  >
                    <div className="flex items-center gap-1 text-[10px] font-black text-[#8c592b] uppercase tracking-wider">
                      <span>진행 챕터</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{node.icon}</span>
                      <span className="text-xs sm:text-sm font-black text-[#422206] whitespace-nowrap">
                        {node.nameKo}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full mt-0.5">
                      {node.gradeRange}
                    </span>
                  </button>
                ) : (
                  /* Normal / Completed / Locked Node */
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      onSelectQuest(node.id);
                    }}
                    className={`flex flex-col items-center p-1.5 rounded-2xl transition-all ${
                      isLocked
                        ? 'opacity-70 hover:opacity-100 hover:scale-105'
                        : 'hover:scale-110'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-md border-2 ${
                        node.status === 'completed'
                          ? 'bg-[#89c540] border-[#4d8216] text-white ring-2 ring-emerald-300'
                          : isLocked
                          ? 'bg-slate-700 border-slate-600 text-slate-300'
                          : 'bg-amber-400 border-amber-600 text-slate-900'
                      }`}
                    >
                      {node.icon}
                    </div>
                    <span className="text-[10px] font-extrabold text-white drop-shadow-md mt-1 whitespace-nowrap">
                      {node.nameKo}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Controls: Help Button */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden sm:flex items-center gap-1 bg-[#10436b] px-2.5 py-1 rounded-xl text-sky-200 text-xs font-bold border border-sky-400/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>초등 4~6학년</span>
        </div>
        <button
          onClick={() => {
            soundEngine.playClick();
            onOpenHelp();
          }}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1b88dd] hover:bg-[#2fa0f7] border-2 border-white/60 text-white flex items-center justify-center font-black text-sm shadow-md hover:scale-105 active:scale-95 transition-all"
          title="도움말 & 퀘스트 가이드"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
