import React from 'react';
import { X, Volume2, ShieldCheck, HelpCircle, Check } from 'lucide-react';
import { UserChildProfile } from '../../types';
import { soundEngine } from '../../utils/soundEngine';

interface SettingsModalProps {
  profile: UserChildProfile;
  onUpdateProfile: (updated: UserChildProfile) => void;
  onClose: () => void;
  onOpenParentDashboard?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  profile,
  onUpdateProfile,
  onClose,
  onOpenParentDashboard,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl border-4 border-[#124974] max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="text-xl font-black text-[#124974] flex items-center gap-2">
            ⚙️ 게임 및 학습 설정
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Speed */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-700">
            영어 음성 속도 (Speaking Speed)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[0.75, 1.0, 1.25].map((speed) => (
              <button
                key={speed}
                onClick={() => {
                  soundEngine.playClick();
                  onUpdateProfile({
                    ...profile,
                    settings: { ...profile.settings, speechSpeed: speed as any },
                  });
                }}
                className={`py-2 rounded-xl text-xs font-black transition-all ${
                  profile.settings.speechSpeed === speed
                    ? 'bg-[#1b88dd] text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {speed === 0.75 ? '느리게 (0.75x)' : speed === 1.0 ? '표준 (1.0x)' : '빠르게 (1.25x)'}
              </button>
            ))}
          </div>
        </div>

        {/* Dyslexia / Readability Font Toggle */}
        <div className="flex items-center justify-between bg-sky-50 border border-sky-200 rounded-2xl p-3">
          <div>
            <span className="text-xs font-black text-slate-800 block">
              읽기 편한 글꼴 (Dyslexia Friendly)
            </span>
            <span className="text-[10px] text-slate-500">
              글자 간격을 넓혀 읽기 편하게 지원합니다.
            </span>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onUpdateProfile({
                ...profile,
                settings: { ...profile.settings, dyslexiaFont: !profile.settings.dyslexiaFont },
              });
            }}
            className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center ${
              profile.settings.dyslexiaFont ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Parent Dashboard Link */}
        {onOpenParentDashboard && (
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenParentDashboard();
              }}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs rounded-2xl shadow flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>학부모 안심 리포트 (Parent Zone) 열기</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
