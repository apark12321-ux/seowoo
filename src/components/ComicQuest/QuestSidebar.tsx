import React from 'react';
import { BookOpen, Mic, User, Trophy, Settings } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

export type QuestTabType = 'story' | 'speaking-lab' | 'my-room' | 'rankings' | 'settings';

interface QuestSidebarProps {
  activeTab: QuestTabType;
  onSelectTab: (tab: QuestTabType) => void;
}

export const QuestSidebar: React.FC<QuestSidebarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const navItems = [
    {
      id: 'story' as QuestTabType,
      label: '스토리 모험',
      labelEn: 'Story',
      icon: BookOpen,
      color: 'from-amber-400 to-orange-500',
    },
    {
      id: 'speaking-lab' as QuestTabType,
      label: '스피킹 랩',
      labelEn: 'Speaking Lab',
      icon: Mic,
      color: 'from-sky-400 to-blue-500',
    },
    {
      id: 'my-room' as QuestTabType,
      label: '마이룸',
      labelEn: 'My Room',
      icon: User,
      color: 'from-emerald-400 to-teal-500',
    },
    {
      id: 'rankings' as QuestTabType,
      label: '모험 랭킹',
      labelEn: 'Rankings',
      icon: Trophy,
      color: 'from-yellow-400 to-amber-500',
    },
    {
      id: 'settings' as QuestTabType,
      label: '학습 설정',
      labelEn: 'Settings',
      icon: Settings,
      color: 'from-slate-400 to-slate-600',
    },
  ];

  return (
    <aside className="w-18 sm:w-20 md:w-24 bg-[#145388] border-r-4 border-[#0e3b62] flex flex-col items-center py-4 gap-3 shrink-0 select-none z-10">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        const IconComponent = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => {
              soundEngine.playClick();
              onSelectTab(item.id);
            }}
            className={`group w-14 sm:w-16 flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 shadow-lg scale-105 border-2 border-amber-200'
                : 'bg-[#1b649d]/80 hover:bg-[#2072b3] text-sky-100 border-2 border-sky-400/20 hover:scale-102'
            }`}
          >
            <div
              className={`p-2 rounded-xl transition-all ${
                isActive
                  ? 'bg-white/40 text-slate-950 shadow-inner'
                  : 'bg-[#10436b] text-sky-300 group-hover:text-white'
              }`}
            >
              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <span
              className={`text-[10px] sm:text-xs font-black tracking-tight mt-1 text-center whitespace-nowrap leading-tight ${
                isActive ? 'text-slate-950 font-black' : 'text-sky-100 group-hover:text-white'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
};
