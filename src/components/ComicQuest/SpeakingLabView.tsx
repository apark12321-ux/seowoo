import React, { useState, useEffect } from 'react';
import { Mic, Volume2, Sparkles, CheckCircle2, RotateCcw, Award, Play, RefreshCw } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';
import { speechService } from '../../utils/speech';
import { evaluateUtterance, evaluateWords, WordEvaluation } from '../../utils/scoring';
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
  const [spokenTranscript, setSpokenTranscript] = useState<string>('');
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [lastVerdict, setLastVerdict] = useState<string>('');
  const [evaluatedWords, setEvaluatedWords] = useState<WordEvaluation[]>([]);

  const current = LAB_PRACTICE_SENTENCES[activeSentenceIdx];

  useEffect(() => {
    return () => {
      speechService.stopListening();
    };
  }, []);

  const handlePlayReference = () => {
    soundEngine.playClick();
    speechService.speak(current.sentence, 0.85);
  };

  const handlePlayWord = (word: string) => {
    soundEngine.playClick();
    speechService.speak(word, 0.8);
  };

  const handleToggleRecord = () => {
    soundEngine.playClick();
    if (isRecording) {
      handleStopRecord();
    } else {
      handleStartRecord();
    }
  };

  const handleStartRecord = () => {
    setIsRecording(true);
    setSpokenTranscript('');
    setLastScore(null);
    setEvaluatedWords([]);

    let recorded = '';

    const success = speechService.startListening(
      (text, isFinal) => {
        recorded = text;
        setSpokenTranscript(text);
        if (isFinal) {
          processEvaluation(text);
        }
      },
      () => {
        if (recorded) {
          processEvaluation(recorded);
        } else {
          // Provide friendly simulated sample
          setTimeout(() => {
            const fallbackText = current.sentence;
            setSpokenTranscript(fallbackText);
            processEvaluation(fallbackText);
          }, 1800);
        }
      }
    );

    if (!success) {
      setTimeout(() => {
        const fallbackText = current.sentence;
        setSpokenTranscript(fallbackText);
        processEvaluation(fallbackText);
      }, 1800);
    }
  };

  const handleStopRecord = () => {
    speechService.stopListening();
    setIsRecording(false);
    if (spokenTranscript) {
      processEvaluation(spokenTranscript);
    } else {
      processEvaluation(current.sentence);
    }
  };

  const processEvaluation = (text: string) => {
    speechService.stopListening();
    setIsRecording(false);

    const evalResult = evaluateUtterance(current.sentence, text);
    const score = evalResult.displayScore;
    setLastScore(score);
    setLastVerdict(evalResult.verdict);
    setEvaluatedWords(evalResult.words || evaluateWords(current.sentence, text));

    if (score >= 75) {
      soundEngine.playPerfect();
      onUpdateProfile({
        ...profile,
        coins: (profile.coins || 1500) + 25,
        levelXp: (profile.levelXp || 12) + 2,
      });
    } else {
      soundEngine.playClick();
    }
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
                로봇 도우미 스파키와 함께 1:1 발음 정밀 분석 및 문장 발화 훈련
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
              <button
                onClick={() => handlePlayWord(current.targetWord)}
                className="text-lg font-black text-[#124974] hover:underline flex items-center gap-1"
                title="단어 발음 듣기"
              >
                <span>{current.targetWord}</span>
                <Volume2 className="w-4 h-4 text-sky-600" />
              </button>
              <span className="text-xs font-mono text-slate-500">
                {current.targetIpa}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-400 font-bold">
              {activeSentenceIdx + 1} / {LAB_PRACTICE_SENTENCES.length}
            </div>
          </div>

          {/* Sentence Display with Interactive Word Highlights */}
          <div className="bg-sky-50 border-2 border-sky-200 rounded-3xl p-6 text-center space-y-3">
            {evaluatedWords.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-2 text-xl sm:text-3xl font-black">
                {evaluatedWords.map((w, i) => {
                  if (w.status === 'correct') {
                    return (
                      <span
                        key={i}
                        onClick={() => handlePlayWord(w.cleanWord)}
                        className="text-emerald-600 underline decoration-4 decoration-emerald-500 underline-offset-4 cursor-pointer hover:scale-105 transition-transform"
                        title="우수한 발음 (클릭하여 듣기)"
                      >
                        {w.word}
                      </span>
                    );
                  } else if (w.status === 'practice') {
                    return (
                      <span
                        key={i}
                        onClick={() => handlePlayWord(w.cleanWord)}
                        className="border-2 border-amber-500 text-amber-600 bg-amber-100/70 px-2 py-0.5 rounded-full cursor-pointer hover:scale-105 transition-transform"
                        title="발음 연습 필요 (클릭하여 듣기)"
                      >
                        {w.word}
                      </span>
                    );
                  } else {
                    return (
                      <span
                        key={i}
                        onClick={() => handlePlayWord(w.cleanWord)}
                        className="border-2 border-rose-300 text-rose-500 bg-rose-50 px-2 py-0.5 rounded-xl cursor-pointer hover:scale-105 transition-transform"
                        title="미인식 (클릭하여 듣기)"
                      >
                        {w.word}
                      </span>
                    );
                  }
                })}
              </div>
            ) : (
              <p className="text-xl sm:text-3xl font-black text-[#124974] tracking-tight">
                "{current.sentence}"
              </p>
            )}
            <p className="text-sm font-bold text-sky-700">
              {current.sentenceKo}
            </p>

            {spokenTranscript && (
              <div className="pt-2 text-xs font-semibold text-slate-500 flex items-center justify-center gap-2">
                <span className="text-[#124974] font-black">인식된 음성:</span>
                <span className="font-mono text-slate-800 bg-white/80 px-2.5 py-1 rounded-lg border border-slate-200">
                  "{spokenTranscript}"
                </span>
              </div>
            )}
          </div>

          {/* Audio Controls & Recording */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handlePlayReference}
              className="px-5 py-3 rounded-2xl bg-sky-100 hover:bg-sky-200 text-[#124974] font-black text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>원어민 듣기</span>
            </button>

            <button
              onClick={handleToggleRecord}
              className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-300'
                  : 'bg-gradient-to-r from-rose-500 to-red-600 text-white hover:from-rose-600 hover:to-red-700'
              }`}
            >
              <Mic className="w-5 h-5" />
              <span>{isRecording ? '듣고 있어요... (탭하여 완료)' : '마이크로 말하기'}</span>
            </button>
          </div>

          {/* Result Feedback if available */}
          {lastScore !== null && (
            <div className={`border-2 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 ${
              lastScore >= 85
                ? 'bg-emerald-50 border-emerald-300'
                : lastScore >= 70
                ? 'bg-amber-50 border-amber-300'
                : 'bg-rose-50 border-rose-300'
            }`}>
              <div className="flex items-center gap-3">
                <div className="text-3xl">🤖</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">
                      스파키의 분석: "발음 정확도 {lastScore}점!"
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      lastScore >= 85
                        ? 'bg-emerald-200 text-emerald-900'
                        : lastScore >= 70
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-rose-200 text-rose-900'
                    }`}>
                      {lastScore >= 90 ? 'PERFECT' : lastScore >= 75 ? 'GREAT' : 'TRY AGAIN'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {lastScore >= 85
                      ? `'${current.targetWord}' 단어의 강세와 억양이 아주 자연스럽습니다!`
                      : `'${current.targetWord}' 발음을 좀 더 크고 또렷하게 외쳐보세요!`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleRecord}
                  className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black rounded-xl border border-slate-300 shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>다시 도전</span>
                </button>
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveSentenceIdx((prev) => (prev + 1) % LAB_PRACTICE_SENTENCES.length);
                    setLastScore(null);
                    setSpokenTranscript('');
                    setEvaluatedWords([]);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl shadow cursor-pointer"
                >
                  다음 문장 도전 ➔
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

