import React from 'react';
import { Volume2, Sparkles, X, CheckCircle2, Shield } from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';
import { speechService } from '../../utils/speech';

export interface PopUpWordData {
  word: string;
  ipa: string;
  definitionEn: string;
  meaningKo: string;
  exampleEn: string;
  illustrationType: 'explore_leaf' | 'danger_warning' | 'hidden_treasure' | 'jungle_trees' | 'sparkle_fairy';
}

export const VOCAB_DICTIONARY: Record<string, PopUpWordData> = {
  explore: {
    word: 'explore',
    ipa: '/ɪkˈsplɔːr/',
    definitionEn: 'to look closely at a new place',
    meaningKo: '새로운 장소를 찾아 떠나다, 탐험하다',
    exampleEn: 'Liam and Sparky explore the misty jungle.',
    illustrationType: 'explore_leaf',
  },
  danger: {
    word: 'danger',
    ipa: '/ˈdeɪn.dʒɚ/',
    definitionEn: 'the possibility of something bad or risky happening',
    meaningKo: '위험, 조심해야 할 상황',
    exampleEn: 'Watch out for danger in the deep vines!',
    illustrationType: 'danger_warning',
  },
  hidden: {
    word: 'hidden',
    ipa: '/ˈhɪd.ən/',
    definitionEn: 'kept out of sight or secret',
    meaningKo: '숨겨진, 비밀의 장소',
    exampleEn: 'They discovered a hidden stone temple.',
    illustrationType: 'hidden_treasure',
  },
  jungle: {
    word: 'jungle',
    ipa: '/ˈdʒʌŋ.ɡəl/',
    definitionEn: 'a thick tropical forest with many plants and animals',
    meaningKo: '울창한 밀림, 열대 정글',
    exampleEn: 'The green jungle is full of adventure.',
    illustrationType: 'jungle_trees',
  },
};

interface WordCapturePopUpProps {
  wordKey: string;
  onClose: () => void;
  onCaptureWord?: (wordKey: string) => void;
}

export const WordCapturePopUp: React.FC<WordCapturePopUpProps> = ({
  wordKey,
  onClose,
  onCaptureWord,
}) => {
  const data = VOCAB_DICTIONARY[wordKey.toLowerCase()] || VOCAB_DICTIONARY['explore'];

  const handleSpeak = () => {
    soundEngine.playClick();
    speechService.speak(data.word, 0.85);
  };

  return (
    <div className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:top-14 sm:right-6 sm:left-auto sm:translate-x-0 sm:translate-y-0 w-64 sm:w-72 bg-white rounded-3xl p-3.5 shadow-2xl border-4 border-[#1b88dd] animate-in fade-in zoom-in-95 duration-200 select-none">
      {/* Little triangular speech pointer pointing to the word */}
      <div className="hidden sm:block absolute -top-3 left-8 w-6 h-6 bg-white border-t-4 border-l-4 border-[#1b88dd] transform rotate-45" />

      {/* Header with Word & Sound */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-xl sm:text-2xl font-black text-[#124974] tracking-tight">
              {data.word}
            </h3>
            <button
              onClick={handleSpeak}
              className="p-1 rounded-full bg-sky-100 hover:bg-sky-200 text-[#1b88dd] transition-all hover:scale-110 active:scale-95"
              title="발음 듣기"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[11px] font-bold text-slate-500 font-mono">
            {data.ipa}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Definition Box */}
      <div className="mt-2 bg-sky-50 border border-sky-200/80 rounded-2xl p-2.5">
        <p className="text-xs font-bold text-slate-800 leading-snug">
          {data.definitionEn}
        </p>
        <p className="text-[11px] font-bold text-[#1b88dd] mt-1">
          {data.meaningKo}
        </p>
      </div>

      {/* Cute Visual Definition Illustration */}
      <div className="mt-2.5 bg-gradient-to-b from-emerald-100 to-teal-50 border-2 border-emerald-200 rounded-2xl p-2 flex items-center justify-center relative overflow-hidden h-28">
        {data.illustrationType === 'explore_leaf' && (
          <div className="flex flex-col items-center justify-center relative">
            {/* Monstera Leaf & Liam Peeking with Magnifying Glass */}
            <div className="text-4xl transform -rotate-12 animate-pulse">🌿</div>
            <div className="flex items-center gap-1 -mt-4 relative z-10">
              <span className="text-3xl">👦🏽</span>
              <span className="text-2xl transform -translate-x-2 -translate-y-1">🔍</span>
            </div>
            <span className="text-[10px] font-black text-emerald-800 mt-1">
              "나뭇잎 뒤를 돋보기로 살피는 리암"
            </span>
          </div>
        )}

        {data.illustrationType === 'danger_warning' && (
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl animate-bounce">⚠️</div>
            <span className="text-[10px] font-black text-amber-800 mt-1">
              "조심해! 앞에 위험이 있어!"
            </span>
          </div>
        )}

        {data.illustrationType === 'hidden_treasure' && (
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl">🗝️✨</div>
            <span className="text-[10px] font-black text-purple-800 mt-1">
              "비밀의 사원 유적지 발견!"
            </span>
          </div>
        )}

        {data.illustrationType === 'jungle_trees' && (
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl">🌴🦜</div>
            <span className="text-[10px] font-black text-teal-800 mt-1">
              "생명력 넘치는 열대 정글!"
            </span>
          </div>
        )}
      </div>

      {/* Capture Button */}
      <div className="mt-2.5">
        <button
          onClick={() => {
            soundEngine.playCardCapture();
            if (onCaptureWord) onCaptureWord(data.word);
            onClose();
          }}
          className="w-full py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all transform hover:scale-102 active:scale-98 border border-amber-300"
        >
          <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
          <span>단어 보석 포획 (+50 XP)</span>
        </button>
      </div>
    </div>
  );
};
