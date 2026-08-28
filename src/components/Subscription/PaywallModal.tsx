import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X,
  Zap,
  BookOpen,
  Award,
  Crown,
} from 'lucide-react';
import { soundEngine } from '../../utils/soundEngine';

interface PaywallModalProps {
  onClose: () => void;
  onSubscribe: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ onClose, onSubscribe }) => {
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');

  const handleSubscribe = () => {
    soundEngine.playVictory();
    soundEngine.playPerfect();
    onSubscribe();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl shadow-amber-500/10 space-y-6 relative overflow-hidden">
        {/* Shimmer background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/20">
            👑
          </div>
          <span className="px-3 py-0.5 rounded-full text-xs font-black bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase">
            SPELLBOOK Premium Pass
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            마법탑 무제한 프리미엄 패스
          </h2>
          <p className="text-xs text-slate-300">
            아이의 목소리로 100권의 원서를 완독하고 영어 스피킹 마법사가 되어보세요!
          </p>
        </div>

        {/* Value Propositions */}
        <div className="space-y-2.5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-slate-200 font-semibold">
              옥스포드/클래식 명작 100+권 무제한 인터랙티브 리딩
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-slate-200 font-semibold">
              무제한 음성인식 & 스피킹 배틀 & 스토리 분기 생성
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="text-slate-200 font-semibold">
              학부모 정밀 음소 발음 리포트 & 실시간 녹음 아카이브
            </span>
          </div>
        </div>

        {/* Plan Select Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* Yearly Plan (Best Value) */}
          <div
            onClick={() => setSelectedPlan('yearly')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
              selectedPlan === 'yearly'
                ? 'bg-amber-500/10 border-amber-400 shadow-lg shadow-amber-500/10'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <span className="absolute -top-2.5 right-2 px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white shadow">
              50% 할인 (인기)
            </span>
            <p className="text-xs font-bold text-slate-300">연간 멤버십</p>
            <p className="text-lg font-black text-amber-400 mt-1">
              ₩14,900<span className="text-xs font-normal text-slate-400">/월</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">12개월 일시청구 (₩178,800)</p>
          </div>

          {/* Monthly Plan */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              selectedPlan === 'monthly'
                ? 'bg-indigo-500/10 border-indigo-400 shadow-lg'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            <p className="text-xs font-bold text-slate-300">월간 멤버십</p>
            <p className="text-lg font-black text-white mt-1">
              ₩29,900<span className="text-xs font-normal text-slate-400">/월</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">언제든 자유롭게 해지</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-2 pt-2">
          <button
            onClick={handleSubscribe}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5 fill-slate-950" />
            <span>7일 무료 체험 시작하기</span>
          </button>

          <p className="text-center text-[10px] text-slate-400">
            7일 체험 기간 동안 비용이 청구되지 않으며 언제든지 클릭 한 번으로 해지할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};
