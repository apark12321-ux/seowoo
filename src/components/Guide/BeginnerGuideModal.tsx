import React from 'react';
import {
  BookOpen,
  Mic,
  Swords,
  Sparkles,
  Trophy,
  CheckCircle2,
  X,
  Volume2,
  Zap,
  Star,
  Flame,
  ArrowRight,
} from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';
import { speechService } from '../../utils/speech';

interface BeginnerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartAdventure: () => void;
}

export const BeginnerGuideModal: React.FC<BeginnerGuideModalProps> = ({
  isOpen,
  onClose,
  onStartAdventure,
}) => {
  if (!isOpen) return null;

  const handlePlayVoiceIntro = () => {
    soundEngine.playSeowooMagic();
    speechService.speakKorean(
      '안녕하세요 꼬마 마법사님! 스펠북에 오신 것을 환영해요. 소리 내어 영어 원서를 읽고, 스펠 카드를 모아 어둠의 도둑 녹스를 물리쳐보세요!'
    );
  };

  const steps = [
    {
      step: '01',
      title: '마법 원서 소리 내어 읽기',
      titleEn: 'Read Aloud with Magic Cursor',
      desc: '신비로운 마법 동화를 눈으로 보고, 문장 커서를 따라 큰 목소리로 또박또박 읽어보세요.',
      icon: <BookOpen className="w-6 h-6 text-emerald-400" />,
      tag: '원서 리딩',
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300',
    },
    {
      step: '02',
      title: '스펠 단어 터치 & 발음 포획',
      titleEn: 'Voice Capture Spell Cards',
      desc: '본문 속 빛나는 황금 단어를 터치한 후, 마이크에 대고 정확한 발음으로 영창하여 카드를 획득하세요.',
      icon: <Mic className="w-6 h-6 text-amber-400" />,
      tag: '음소 단위 피드백',
      color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-300',
    },
    {
      step: '03',
      title: '보스 녹스와 8초 스피킹 배틀',
      titleEn: 'Real-time Voice Battle',
      desc: '수집한 스펠 카드로 8초 안에 주문을 외쳐 마법 탄환을 발사! 어둠의 도둑 녹스를 격퇴하세요.',
      icon: <Swords className="w-6 h-6 text-rose-400" />,
      tag: '실시간 배틀',
      color: 'from-rose-500/20 to-purple-500/20 border-rose-500/40 text-rose-300',
    },
    {
      step: '04',
      title: '스펠 도감 완성 & 주간 리그 랭킹',
      titleEn: 'Grimoire & Arena Champion',
      desc: '모은 카드로 나만의 마법 덱을 구성하고, 전국의 마법 친구들과 스피킹 랭킹 대결을 펼치세요.',
      icon: <Trophy className="w-6 h-6 text-purple-400" />,
      tag: '도감 & 챔피언',
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-500/40 text-purple-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl shadow-amber-500/10 my-8 relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 mb-6 relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center text-2xl">
              🪄
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  초보 마법사 입문 가이드
                </span>
                <span className="text-xs text-slate-400 font-semibold">How to Play</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                SPELLBOOK 마법 모험 완벽 가이드 ✨
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Audio Guide Quick Button */}
        <div className="mb-6 bg-slate-950/70 p-3.5 rounded-2xl border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🧚‍♂️</span>
            <div>
              <p className="text-xs font-black text-indigo-200">요정 루멘의 음성 가이드</p>
              <p className="text-[11px] text-slate-400 font-medium">루멘이 친절한 한국어 음성으로 모험 규칙을 설명해줘요!</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handlePlayVoiceIntro}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Volume2 className="w-4 h-4" />
            <span>음성으로 듣기 🎵</span>
          </button>
        </div>

        {/* 4 Core Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {steps.map((item) => (
            <div
              key={item.step}
              className={`p-4 rounded-2xl bg-gradient-to-br ${item.color} border flex flex-col justify-between space-y-2.5 transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-950/80 shadow-md">
                    {item.icon}
                  </div>
                  <span className="font-black text-xs px-2 py-0.5 rounded-md bg-slate-950/60">
                    STEP {item.step}
                  </span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-80">
                  {item.tag}
                </span>
              </div>

              <div>
                <h4 className="font-black text-sm text-white">
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-300 font-mono mt-0.5">
                  {item.titleEn}
                </p>
                <p className="text-xs text-slate-200 font-medium mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tips Box */}
        <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <div className="text-xl">💡</div>
          <div className="text-xs space-y-1">
            <p className="font-bold text-amber-300">대마법사가 되기 위한 꿀팁!</p>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li>마이크 버튼을 누르고 <span className="text-amber-200 font-bold">1초 뒤</span>에 큰 목소리로 말하면 인식률이 100%가 돼요!</li>
              <li>틀린 발음은 초록색(완벽), 노란색(보통), 빨간색(주의) 음소 가이드로 쉽게 교정할 수 있어요.</li>
              <li>매일 출석하면 <span className="text-yellow-300 font-bold">별사탕 5개</span>와 연속 학습 불꽃 스트릭이 유지됩니다.</li>
            </ul>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm transition-colors"
          >
            닫기
          </button>
          <button
            onClick={() => {
              soundEngine.playLevelUp();
              onClose();
              onStartAdventure();
            }}
            className="flex-2 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] border-2 border-amber-300"
          >
            <span>지금 마법 원서 읽으러 가기!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
