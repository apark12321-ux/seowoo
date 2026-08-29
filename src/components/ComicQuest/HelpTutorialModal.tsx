import React from 'react';
import { X, Sparkles, Mic, Gem, BookOpen, Bot } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface HelpTutorialModalProps {
  onClose: () => void;
}

export const HelpTutorialModal: React.FC<HelpTutorialModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl border-4 border-[#124974] max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <h3 className="text-xl font-black text-[#124974]">
              어드벤처 퀘스트 플레이 가이드
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 flex items-start gap-3">
            <span className="text-2xl mt-0.5">💬</span>
            <div>
              <h4 className="text-xs font-black text-slate-900">
                1. 생생한 만화 말풍선 읽기
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                복잡하고 긴 글 대신, 리암과 스파키의 대화 말풍선을 따라가며 자연스럽게 스토리를 이해하세요.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-start gap-3">
            <span className="text-2xl mt-0.5">✨</span>
            <div>
              <h4 className="text-xs font-black text-slate-900">
                2. 반짝이는 단어 탭 & 보석 포획
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                <span className="font-bold text-amber-700">EXPLORE, DANGER</span> 등 반짝이는 단어를 탭하면 귀여운 그림 팝업과 함께 단어 보석을 획득할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-start gap-3">
            <span className="text-2xl mt-0.5">🎙️</span>
            <div>
              <h4 className="text-xs font-black text-slate-900">
                3. 'Tap to Speak' 마이크로 영어 발화
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                빨간색 마이크를 누르고 큰 소리로 영어 문장을 말해보세요. 정확한 단어는 초록색 밑줄로 표시됩니다!
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-3">
            <span className="text-2xl mt-0.5">🤖</span>
            <div>
              <h4 className="text-xs font-black text-slate-900">
                4. 로봇 스파키의 친절한 실시간 코칭
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                스파키가 "Try again!" 또는 "Great job!"으로 응원해주며 코인과 경험치를 선물합니다.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#1b88dd] hover:bg-[#1572bc] text-white font-black text-xs rounded-2xl shadow-md transition-all"
        >
          확인하고 모험 떠나기 🚀
        </button>
      </div>
    </div>
  );
};
