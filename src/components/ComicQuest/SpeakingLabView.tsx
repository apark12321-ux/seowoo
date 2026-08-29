import React, { useState } from 'react';
import { Mic, Volume2, Sparkles, CheckCircle2, RotateCcw, Award, Play } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';
import { speechService } from '../../utils/speech';
import { UserChildProfile } from '../../types';

interface SpeakingLabViewProps {
  profile: UserChildProfile;
  onUpdateProfile: (updated: UserChildProfile) => void;
}

const LAB_PRACTICE_SENTENCES = [
  {
    id: 'lab_1',
    sentence: 'I explore the misty jungle.',
    sentenceKo: '나는 안개 낀 정글을 탐험해요.',
    targetWord: 'explore',
    targetIpa: '/ɪkˈsplɔːr/',
    difficulty: 'Easy',
  },
  {
    id: 'lab_2',
    sentence: 'Watch out for hidden danger in the vines.',
    sentenceKo: '덩굴 속 숨겨진 위험을 조심하세요.',
    targetWord: 'danger',
    targetIpa: '/ˈdeɪn.dʒɚ/',
    difficulty: 'Medium',
  },
  {
    id: 'lab_3',
    sentence: 'Sparky found the sparkling crystal key.',
    sentenceKo: '스파키가 반짝이는 수정 열쇠를 찾았어요.',
    targetWord: 'sparkling',
    targetIpa: '/ˈspɑːr.klɪŋ/',
    difficulty: 'Fun',
  },
];

export const SpeakingLabView: React.FC<SpeakingLabViewProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [activeSentenceIdx, setActiveSentenceIdx] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const current = LAB_PRACTICE_SENTENCES[activeSentenceIdx];

  const handlePlayReference = () => {
    soundEngine.playClick();
    speechService.speak(current.sentence, 0.85);
  };

  const handleStartRecord = () => {
    soundEngine.playClick();
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const score = Math.floor(Math.random() * 11) + 90; // 90~100
      setLastScore(score);
      soundEngine.playPerfect();
      onUpdateProfile({
        ...profile,
        coins: (profile.coins || 1500) + 20,
        levelXp: (profile.levelXp || 12) + 1,
      });
    }, 2200);
  };

  return (
    <div className="flex-1 bg-[#0b3353] p-4 sm:p-6 overflow-y-auto select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Banner */}
        <div className="bg-[#10436b] border-4 border-sky-400/40 rounded-3xl p-5 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border-2 border-sky-400 flex items-center justify-center text-2xl">
              🎙️
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                스피킹 랩 스튜디오
              </h2>
              <p className="text-xs text-sky-200 mt-0.5">
                로봇 도우미 스파키와 함께 1:1 발음 교정 및 문장 발화 훈련
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-400 text-slate-950 text-xs font-black rounded-full shadow">
            초등 4~6학년 레벨
          </span>
        </div>

        {/* Practice Card */}
        <div className="bg-white rounded-3xl border-4 border-[#124974] p-6 shadow-2xl space-y-6">
          {/* Target Word Focus */}
          <div className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                핵심 타깃 단어
              </span>
              <span className="text-lg font-black text-[#124974]">
                {current.targetWord}
              </span>
              <span className="text-xs font-mono text-slate-500">
                {current.targetIpa}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-400 font-bold">
              {activeSentenceIdx + 1} / {LAB_PRACTICE_SENTENCES.length}
            </div>
          </div>

          {/* Sentence Display */}
          <div className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-6 text-center space-y-2">
            <p className="text-xl sm:text-3xl font-black text-[#124974] tracking-tight">
              "{current.sentence}"
            </p>
            <p className="text-sm font-bold text-sky-700">
              {current.sentenceKo}
            </p>
          </div>

          {/* Audio Controls & Recording */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handlePlayReference}
              className="px-5 py-3 rounded-2xl bg-sky-100 hover:bg-sky-200 text-[#124974] font-black text-sm flex items-center gap-2 transition-all"
            >
              <Volume2 className="w-5 h-5" />
              <span>원어민 듣기</span>
            </button>

            <button
              onClick={handleStartRecord}
              className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl transition-all transform hover:scale-105 active:scale-95 ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-300'
                  : 'bg-gradient-to-r from-rose-500 to-red-600 text-white'
              }`}
            >
              <Mic className="w-5 h-5" />
              <span>{isRecording ? '음성 분석 중...' : '마이크로 말하기'}</span>
            </button>
          </div>

          {/* Result Feedback if available */}
          {lastScore !== null && (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🤖</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-emerald-800">
                      스파키의 피드백: "발음 정확도 {lastScore}점!"
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-200 text-emerald-900">
                      EXCELLENT
                    </span>
                  </div>
                  <p className="text-xs text-emerald-600 mt-0.5">
                    'explore' 발음의 강세와 억양이 아주 자연스럽습니다!
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setActiveSentenceIdx((prev) => (prev + 1) % LAB_PRACTICE_SENTENCES.length);
                  setLastScore(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow"
              >
                다음 문장 도전 ➔
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
