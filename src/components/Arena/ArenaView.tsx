import React, { useState } from 'react';
import {
  Swords,
  Trophy,
  Flame,
  Award,
  Shield,
  Sparkles,
  ArrowUpRight,
  User,
  Volume2,
} from 'lucide-react';
import { UserChildProfile, LeagueRanker } from '../../types';
import { soundEngine } from '../../utils/soundEngine';
import { speechService } from '../../utils/speech';

interface ArenaViewProps {
  profile: UserChildProfile;
  onStartBattle: (chapterId: string) => void;
}

export const ArenaView: React.FC<ArenaViewProps> = ({ profile, onStartBattle }) => {
  const [mockRankers] = useState<LeagueRanker[]>([
    {
      rank: 1,
      nickname: '👑 박서우 (Park Seowoo)',
      rankTitle: '은하수 수호 대마법사 (Grand Champion)',
      points: 3950,
      favoriteCard: 'radiant (서우의 별빛 마법)',
      avatarEmoji: '🧙‍♂️',
      isUser: true,
    },
    { rank: 2, nickname: '스타위자드 (민우)', rankTitle: '상급 마법사', points: 3240, favoriteCard: 'crystal', avatarEmoji: '🧙‍♀️' },
    { rank: 3, nickname: '드래곤슬레이어 (지호)', rankTitle: '상급 마법사', points: 2850, favoriteCard: 'courage', avatarEmoji: '🐉' },
    { rank: 4, nickname: '매직버니 (서연)', rankTitle: '중급 마법사', points: 2710, favoriteCard: 'whisper', avatarEmoji: '🐰' },
    { rank: 5, nickname: '파이어볼트 (도윤)', rankTitle: '중급 마법사', points: 2540, favoriteCard: 'pathway', avatarEmoji: '⚡' },
    { rank: 6, nickname: '샤이닝클라우드 (하은)', rankTitle: '초급 마법사', points: 2390, favoriteCard: 'torch', avatarEmoji: '☁️' },
  ]);

  const handleCheerChampion = () => {
    soundEngine.playSeowooCheerFanfare();
    speechService.speakKorean('전국 1위 챔피언 대마법사 박서우님! 모두가 서우의 영어 스피킹 마법에 감탄하고 있어요!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-purple-950/80 border-2 border-amber-500/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300">
              <Trophy className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Weekly League #24 • Champion Stage
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            골드 마법사 리그: 박서우(Seowoo) 1위 독주 중! 👑
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            동일한 실력(AR {profile.arLevel})의 마법사 30명이 겨루는 주간 스피킹 리그입니다.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleCheerChampion}
            className="bg-slate-950/90 p-3 rounded-2xl border-2 border-amber-400 text-center hover:scale-105 transition-transform"
            title="박서우 챔피언 응원하기"
          >
            <span className="text-[10px] text-amber-300 font-bold">박서우 현재 순위</span>
            <p className="text-xl font-black text-amber-400 flex items-center justify-center gap-1">
              <span>1위 👑</span>
              <Volume2 className="w-4 h-4 text-amber-300" />
            </p>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              onStartBattle('ch_01');
            }}
            className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-rose-500/20 flex items-center gap-1.5 transition-all transform hover:scale-105"
          >
            <Swords className="w-4 h-4" />
            <span>리그 스피킹 배틀 참가</span>
          </button>
        </div>
      </div>

      {/* Promotion Zone Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3">
          <span className="text-xl">🏆</span>
          <div>
            <p className="font-bold text-emerald-300">1 ~ 3위: 에메랄드 리그 승격</p>
            <p className="text-[11px] text-slate-400">시즌 한정 SSR 카드팩 증정</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <span className="text-xl">🛡️</span>
          <div>
            <p className="font-bold text-slate-200">4 ~ 25위: 골드 리그 잔류</p>
            <p className="text-[11px] text-slate-400">기본 마나 +20 보상</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-bold text-rose-300">26 ~ 30위: 실버 리그 강등</p>
            <p className="text-[11px] text-slate-400">주간 포인트 유지 필요</p>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <h3 className="font-extrabold text-sm text-slate-200">
          실시간 주간 랭킹 (매주 일요일 자정 마감)
        </h3>

        <div className="space-y-2">
          {mockRankers.map((ranker) => (
            <div
              key={ranker.rank}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                ranker.isUser
                  ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/10'
                  : ranker.rank <= 3
                  ? 'bg-slate-950/80 border-slate-800'
                  : 'bg-slate-950/40 border-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
                    ranker.rank === 1
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                      : ranker.rank === 2
                      ? 'bg-slate-300 text-slate-950'
                      : ranker.rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {ranker.rank}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xl">{ranker.avatarEmoji}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-extrabold text-white">
                        {ranker.nickname}
                      </span>
                      {ranker.isUser && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-400 text-slate-950">
                          YOU
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{ranker.rankTitle}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-amber-400">
                    {ranker.points.toLocaleString()} LP
                  </span>
                  <p className="text-[10px] text-slate-400">
                    대표 카드: <strong className="text-slate-300">{ranker.favoriteCard}</strong>
                  </p>
                </div>

                <button
                  onClick={() => speechService.speak(ranker.favoriteCard, 1.0)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                  title="대표 스펠 발음 듣기"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
