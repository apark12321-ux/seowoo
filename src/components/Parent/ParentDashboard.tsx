import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Mic,
  Clock,
  BookOpen,
  Volume2,
  Calendar,
  Settings,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { UserChildProfile, UtteranceRecord } from '../../types';
import { soundEngine } from '../../utils/soundEngine';
import { speechService } from '../../utils/speech';

interface ParentDashboardProps {
  profile: UserChildProfile;
  onUpdateProfile: (p: UserChildProfile) => void;
  onClose: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  profile,
  onUpdateProfile,
  onClose,
}) => {
  const [pinEntered, setPinEntered] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'report' | 'phonemes' | 'recordings' | 'settings'>('report');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinEntered === '1234' || pinEntered.length === 4) {
      soundEngine.playClick();
      setIsUnlocked(true);
    } else {
      alert('4자리 PIN 번호를 입력해주세요. (기본: 1234)');
    }
  };

  // Mock audio recordings list
  const mockRecordings = [
    { id: '1', word: 'courage', date: '오늘 16:42', score: 92, ipa: '/ˈkɜːr.ɪdʒ/' },
    { id: '2', word: 'crystal', date: '오늘 16:38', score: 88, ipa: '/ˈkrɪs.təl/' },
    { id: '3', word: 'whisper', date: '어제 17:15', score: 95, ipa: '/ˈwɪs.pər/' },
    { id: '4', word: 'pathway', date: '어제 17:10', score: 85, ipa: '/ˈpæθ.weɪ/' },
  ];

  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center space-y-5 animate-fadeIn">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-black text-white">학부모 안심 모드 (Parent Gate)</h3>
            <p className="text-xs text-slate-400 mt-1">
              학습 리포트 및 설정을 확인하려면 PIN 번호를 입력하세요.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-3">
            <input
              type="password"
              maxLength={4}
              value={pinEntered}
              onChange={(e) => setPinEntered(e.target.value)}
              placeholder="PIN 번호 4자리 (예: 1234)"
              className="w-full text-center tracking-widest text-lg font-mono py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              autoFocus
            />

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all"
            >
              확인
            </button>
          </form>

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            아이 화면으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {profile.nickname} 마법사 학습 리포트
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            원서 리딩 완독 진도, 음소별 정밀 발음 분석, 실시간 음성 녹음 기록을 확인하세요.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('report')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'report' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              주간 종합
            </button>
            <button
              onClick={() => setActiveTab('phonemes')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'phonemes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              음소 분석
            </button>
            <button
              onClick={() => setActiveTab('recordings')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'recordings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              녹음 다시듣기
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
          >
            닫기
          </button>
        </div>
      </div>

      {/* Tab 1: Weekly Report */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          {/* Key KPI Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> 총 학습 시간
              </span>
              <p className="text-xl sm:text-2xl font-black text-white">4시간 20분</p>
              <p className="text-[10px] text-emerald-400 font-bold">▲ 전주 대비 +35분</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Mic className="w-3.5 h-3.5 text-amber-400" /> 총 발화 횟수
              </span>
              <p className="text-xl sm:text-2xl font-black text-amber-400">142회</p>
              <p className="text-[10px] text-emerald-400 font-bold">목표(100회) 142% 달성</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> 완독 챕터
              </span>
              <p className="text-xl sm:text-2xl font-black text-emerald-400">8개</p>
              <p className="text-[10px] text-slate-400">총 3권의 원서 탐험</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-purple-400" /> 수집 스펠 카드
              </span>
              <p className="text-xl sm:text-2xl font-black text-purple-400">
                {Object.keys(profile.collectedCards).length}장
              </p>
              <p className="text-[10px] text-purple-300 font-bold">SSR 1장 / SR 2장 보유</p>
            </div>
          </div>

          {/* AI Growth Summary Brief */}
          <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/30 rounded-3xl p-6 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-indigo-300 font-extrabold text-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>루멘 AI 학부모 코칭 리포트</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              "{profile.nickname} 어린이는 이번 주에 <strong>/r/</strong> 발음과 <strong>/θ/</strong> 번데기 발음에서 괄목할 만한 성장을 보였습니다!
              스토리 분기 선택 시 주저하지 않고 <strong>영어 문장을 온전히 소리 내어 말하는 자신감</strong>이 크게 향상되었습니다.
              가정에서도 '오늘 녹스 배틀에서 어떤 마법 카드를 썼어?'라고 가볍게 물어봐 주시면 학습 몰입감이 2배로 높아집니다."
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Phoneme Analysis */}
      {activeTab === 'phonemes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div>
            <h3 className="text-lg font-black text-white">음소별 발음 정확도 분석</h3>
            <p className="text-xs text-slate-400">
              한국 아동이 혼동하기 쉬운 핵심 자음 및 모음의 정밀 발음 데이터입니다.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { phoneme: '/r/', label: 'courage, brave, tree', score: 88, status: '우수', color: 'bg-emerald-500' },
              { phoneme: '/θ/', label: 'pathway, think, truth', score: 78, status: '성장 중', color: 'bg-amber-500' },
              { phoneme: '/v/', label: 'cave, village, voice', score: 92, status: '완벽', color: 'bg-emerald-400' },
              { phoneme: '/ʃ/', label: 'shadow, shine, wish', score: 85, status: '우수', color: 'bg-emerald-500' },
              { phoneme: '/æ/', label: 'path, shadow, apple', score: 90, status: '완벽', color: 'bg-emerald-400' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-300 text-sm">{item.phoneme}</span>
                    <span className="text-slate-400">({item.label})</span>
                  </div>
                  <span className="font-bold text-slate-200">{item.score}점 · {item.status}</span>
                </div>
                <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Audio Recordings Archive */}
      {activeTab === 'recordings' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div>
            <h3 className="text-lg font-black text-white">아이 음성 녹음 기록 (스펠 포획 아카이브)</h3>
            <p className="text-xs text-slate-400">
              아이가 실제로 발화했던 생생한 목소리를 직접 들어보세요.
            </p>
          </div>

          <div className="space-y-2.5">
            {mockRecordings.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    🎙
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white">{rec.word}</span>
                      <span className="font-mono text-xs text-amber-400">{rec.ipa}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{rec.date} · 발음 일치율 {rec.score}%</p>
                  </div>
                </div>

                <button
                  onClick={() => speechService.speak(rec.word, 0.8)}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>원음 듣기</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
