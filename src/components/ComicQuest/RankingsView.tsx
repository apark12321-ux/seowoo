import React from 'react';
import { Trophy, Medal, Flame, Sparkles } from 'lucide-react';
import { UserChildProfile } from '../../types';

interface RankingsViewProps {
  profile: UserChildProfile;
}

const LEADERBOARD_USERS = [
  { rank: 1, name: 'Liam (나)', score: 2450, gems: 28, avatar: '👦🏽', isMe: true, league: 'Diamond' },
  { rank: 2, name: 'Leah', score: 2320, gems: 25, avatar: '👧🏽', isMe: false, league: 'Diamond' },
  { rank: 3, name: 'Sparky Champion', score: 2180, gems: 22, avatar: '🤖', isMe: false, league: 'Platinum' },
  { rank: 4, name: 'Emma Star', score: 1950, gems: 19, avatar: '👧🏼', isMe: false, league: 'Platinum' },
  { rank: 5, name: 'Lucas Quest', score: 1820, gems: 18, avatar: '👦🏻', isMe: false, league: 'Gold' },
];

export const RankingsView: React.FC<RankingsViewProps> = ({ profile }) => {
  return (
    <div className="flex-1 bg-[#0b3353] p-4 sm:p-6 overflow-y-auto select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-[#10436b] border-4 border-sky-400/40 rounded-3xl p-5 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                퀘스트 모험 주간 랭킹
              </h2>
              <p className="text-xs text-sky-200 mt-0.5">
                이번 주 스피킹 완독과 단어 보석 획득 랭킹
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-full shadow">
            다이아몬드 리그 👑
          </span>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-3xl border-4 border-[#124974] p-5 shadow-2xl space-y-3">
          {LEADERBOARD_USERS.map((user) => (
            <div
              key={user.rank}
              className={`p-3.5 rounded-2xl flex items-center justify-between border-2 transition-all ${
                user.isMe
                  ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-300'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                    user.rank === 1
                      ? 'bg-amber-400 text-slate-950 shadow'
                      : user.rank === 2
                      ? 'bg-slate-300 text-slate-900'
                      : user.rank === 3
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {user.rank}
                </div>
                <span className="text-3xl">{user.avatar}</span>
                <div>
                  <span className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    {user.name}
                    {user.isMe && (
                      <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-extrabold">
                        나 (ME)
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500">
                    {user.league} 티어
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-sm font-black text-[#124974] block">
                    {user.score.toLocaleString()} XP
                  </span>
                  <span className="text-[11px] font-bold text-amber-600">
                    💎 보석 {user.gems}개
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
