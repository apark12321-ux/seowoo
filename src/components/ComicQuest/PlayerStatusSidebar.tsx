import React, { useState } from 'react';
import { Plus, Lock, Check, Sparkles, Gem, ShieldCheck, Zap } from 'lucide-react';
import { UserChildProfile } from '../../types';
import { soundEngine } from '../../utils/soundEngine';

interface PlayerStatusSidebarProps {
  profile: UserChildProfile;
  onUpdateProfile: (updated: UserChildProfile) => void;
  onOpenShop?: () => void;
}

export const PlayerStatusSidebar: React.FC<PlayerStatusSidebarProps> = ({
  profile,
  onUpdateProfile,
  onOpenShop,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string>('item_robot_sparky');
  const [showItemDetail, setShowItemDetail] = useState<boolean>(false);

  const inventoryItems = profile.inventory || [
    { id: 'item_robot_sparky', name: 'Sparky Robot', type: 'pet', icon: '🤖', isEquipped: true, isLocked: false },
    { id: 'item_shirt_blue', name: 'Sky Blue T-Shirt', type: 'clothing', icon: '👕', isEquipped: true, isLocked: false },
    { id: 'item_shirt_yellow', name: 'Explorer Yellow Vest', type: 'clothing', icon: '🦺', isEquipped: false, isLocked: true },
  ];

  const handleEquipItem = (itemId: string) => {
    const item = inventoryItems.find((i) => i.id === itemId);
    if (!item) return;

    if (item.isLocked) {
      if (profile.coins >= 300) {
        soundEngine.playLevelUp();
        const updatedInventory = inventoryItems.map((i) =>
          i.id === itemId ? { ...i, isLocked: false, isEquipped: true } : i
        );
        onUpdateProfile({
          ...profile,
          coins: profile.coins - 300,
          inventory: updatedInventory as any,
        });
      } else {
        soundEngine.playClick();
        alert('🪙 코인이 부족합니다! 스피킹 레슨을 완료하여 코인을 모아보세요.');
      }
      return;
    }

    soundEngine.playClick();
    setSelectedSlotId(itemId);
    const updatedInventory = inventoryItems.map((i) => {
      if (i.type === item.type) {
        return { ...i, isEquipped: i.id === itemId };
      }
      return i;
    });
    onUpdateProfile({
      ...profile,
      inventory: updatedInventory as any,
    });
  };

  return (
    <aside className="w-56 sm:w-60 md:w-64 bg-[#145388] border-l-4 border-[#0e3b62] flex flex-col p-3 gap-3 shrink-0 select-none overflow-y-auto no-scrollbar z-10">
      {/* 1. Player Profile & Level */}
      <div className="bg-[#10436b] border-2 border-sky-400/30 rounded-3xl p-3 flex flex-col items-center shadow-lg relative">
        {/* Avatar with Circular Ring */}
        <div className="relative mb-2">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full border-4 border-amber-300 overflow-hidden bg-gradient-to-b from-sky-300 to-indigo-600 shadow-md flex items-center justify-center">
            {/* Liam Avatar Illustration */}
            <div className="text-3xl sm:text-4xl filter drop-shadow">👦🏽</div>
          </div>
          {/* Level 2 Badge Ribbon */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-3 py-0.5 rounded-full text-[11px] font-black shadow-md border border-amber-200 whitespace-nowrap">
            레벨 {profile.level || 2}
          </div>
        </div>

        {/* XP Progression (12 -> 13) */}
        <div className="w-full mt-2 space-y-1">
          <div className="flex items-center justify-between text-[10px] font-black text-sky-200">
            <span>{profile.levelXp || 12} XP</span>
            <span className="text-amber-300 font-bold">경험치 진행도</span>
            <span>{profile.levelNextXp || 13} XP</span>
          </div>
          <div className="w-full h-3 bg-[#0a2842] rounded-full overflow-hidden border border-sky-400/40 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-full transition-all duration-500 shadow-inner"
              style={{ width: `${Math.min(100, (((profile.levelXp || 12) % 10) / 10) * 100 || 85)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Coin Counter */}
      <div className="bg-[#10436b] border-2 border-sky-400/30 rounded-2xl px-3 py-2 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-b from-amber-300 to-yellow-500 flex items-center justify-center text-slate-950 font-black text-sm border-2 border-amber-200 shadow-sm">
            🪙
          </div>
          <span className="text-base sm:text-lg font-black text-amber-300 tracking-wide">
            {(profile.coins || 1500).toLocaleString()} <span className="text-xs font-bold text-amber-200">코인</span>
          </span>
        </div>
        <button
          onClick={() => {
            soundEngine.playLevelUp();
            onUpdateProfile({
              ...profile,
              coins: (profile.coins || 1500) + 100,
            });
          }}
          className="w-6 h-6 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-black flex items-center justify-center text-xs shadow hover:scale-110 active:scale-95 transition-all border border-emerald-300"
          title="코인 보너스"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      {/* 3. Inventory Box */}
      <div className="bg-[#deb887]/20 bg-[#f7eed4] border-3 border-[#8c592b] rounded-3xl p-3 shadow-lg flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-[#5a2e0c] uppercase tracking-wider">
            인벤토리 (장비)
          </span>
          <span className="text-[10px] font-bold text-[#8c592b]">
            3/4 슬롯
          </span>
        </div>

        {/* 4-Grid Slots */}
        <div className="grid grid-cols-2 gap-2">
          {/* Slot 1: Sparky Robot Pet */}
          <button
            onClick={() => handleEquipItem('item_robot_sparky')}
            className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-1 relative transition-all ${
              selectedSlotId === 'item_robot_sparky'
                ? 'bg-sky-200 border-sky-600 ring-2 ring-sky-400 scale-102 shadow-md'
                : 'bg-[#ebd8b7] border-[#b08b59] hover:bg-[#fae8cb]'
            }`}
          >
            <div className="text-2xl sm:text-3xl animate-bounce" style={{ animationDuration: '3s' }}>
              🤖
            </div>
            <span className="text-[9px] font-black text-[#422206] truncate max-w-full">
              스파키 봇
            </span>
            <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">
              ✓
            </div>
          </button>

          {/* Slot 2: Blue T-Shirt */}
          <button
            onClick={() => handleEquipItem('item_shirt_blue')}
            className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-1 relative transition-all ${
              selectedSlotId === 'item_shirt_blue'
                ? 'bg-sky-200 border-sky-600 ring-2 ring-sky-400 scale-102 shadow-md'
                : 'bg-[#ebd8b7] border-[#b08b59] hover:bg-[#fae8cb]'
            }`}
          >
            <div className="text-2xl sm:text-3xl">👕</div>
            <span className="text-[9px] font-black text-[#422206] truncate max-w-full">
              하늘색 상의
            </span>
            <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[8px] font-bold">
              ✓
            </div>
          </button>

          {/* Slot 3: Yellow Adventure Vest (Locked) */}
          <button
            onClick={() => handleEquipItem('item_shirt_yellow')}
            className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-1 relative transition-all bg-[#ebd8b7]/70 border-[#b08b59] hover:bg-[#fae8cb]`}
          >
            <div className="text-2xl sm:text-3xl opacity-75">🦺</div>
            <span className="text-[9px] font-black text-[#422206] truncate max-w-full">
              탐험가 조끼
            </span>
            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-sm">
              <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
            </div>
          </button>

          {/* Slot 4: Add New Item Slot */}
          <button
            onClick={() => {
              soundEngine.playClick();
              alert('✨ 새로운 레슨을 완독하면 전설 장비가 해금됩니다!');
            }}
            className="aspect-square rounded-2xl border-2 border-dashed border-[#b08b59] bg-[#ebd8b7]/40 hover:bg-[#ebd8b7] flex flex-col items-center justify-center text-[#8c592b] hover:text-[#422206] transition-all"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
            <span className="text-[8px] font-black uppercase">해금하기</span>
          </button>
        </div>
      </div>

      {/* 4. Word Gems Box */}
      <div className="bg-[#deb887]/20 bg-[#f7eed4] border-3 border-[#8c592b] rounded-3xl p-3 shadow-lg flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black text-[#5a2e0c] uppercase tracking-wider">
            단어 보석함
          </span>
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
        </div>

        {/* Gems Row */}
        <div className="grid grid-cols-3 gap-1.5 text-center">
          {/* Ruby */}
          <div className="bg-[#ebd8b7] border border-[#b08b59] rounded-xl p-1.5 flex flex-col items-center">
            <div className="text-lg">💎</div>
            <span className="text-[9px] font-extrabold text-[#422206] mt-0.5">
              {profile.wordGems?.ruby || 8}개
            </span>
            <span className="text-[7px] text-[#7a4817] font-semibold truncate">루비 보석</span>
          </div>

          {/* Sapphire */}
          <div className="bg-[#ebd8b7] border border-[#b08b59] rounded-xl p-1.5 flex flex-col items-center">
            <div className="text-lg">🔷</div>
            <span className="text-[9px] font-extrabold text-[#422206] mt-0.5">
              {profile.wordGems?.sapphire || 14}개
            </span>
            <span className="text-[7px] text-[#7a4817] font-semibold truncate">사파이어</span>
          </div>

          {/* Amethyst */}
          <div className="bg-[#ebd8b7] border border-[#b08b59] rounded-xl p-1.5 flex flex-col items-center">
            <div className="text-lg">🔮</div>
            <span className="text-[9px] font-extrabold text-[#422206] mt-0.5">
              {profile.wordGems?.amethyst || 6}개
            </span>
            <span className="text-[7px] text-[#7a4817] font-semibold truncate">자수정</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
