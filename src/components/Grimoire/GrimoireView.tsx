import React, { useState } from 'react';
import {
  Shield,
  Sparkles,
  GitFork,
  Layers,
  RotateCcw,
  Volume2,
  Mic,
  Award,
  Filter,
  CheckCircle2,
  X,
  Play,
} from 'lucide-react';
import { SpellCard, CardRarity, ElementType, UserChildProfile, Book } from '../../types';
import { ALL_SPELL_CARDS } from '../../data/spellCards';
import { soundEngine } from '../../utils/soundEngine';
import { speechService } from '../../utils/speech';

interface GrimoireViewProps {
  profile: UserChildProfile;
  books: Book[];
  onUpdateProfile: (p: UserChildProfile) => void;
  onNavigateTab: (tab: string) => void;
}

export const GrimoireView: React.FC<GrimoireViewProps> = ({
  profile,
  books,
  onUpdateProfile,
  onNavigateTab,
}) => {
  const [subTab, setSubTab] = useState<'cards' | 'deck' | 'map' | 'review'>('cards');
  const [selectedElement, setSelectedElement] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [selectedCard, setSelectedCard] = useState<SpellCard | null>(null);

  // All spell cards array
  const allCards = Object.values(ALL_SPELL_CARDS);

  const filteredCards = allCards.filter((card) => {
    if (selectedElement !== 'all' && card.element !== selectedElement) return false;
    if (selectedRarity !== 'all' && card.rarity !== selectedRarity) return false;
    return true;
  });

  const getRarityBadge = (r: CardRarity) => {
    switch (r) {
      case 'SSR':
        return 'bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-slate-950 font-black';
      case 'SR':
        return 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold';
      case 'R':
        return 'bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold';
      default:
        return 'bg-slate-700 text-slate-200 font-medium';
    }
  };

  const getElementBadge = (elem: ElementType) => {
    switch (elem) {
      case 'fire':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'water':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'light':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'dark':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'nature':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  const toggleDeckCard = (cardId: string) => {
    soundEngine.playClick();
    const currentDeck = [...profile.deckCardIds];
    if (currentDeck.includes(cardId)) {
      if (currentDeck.length <= 1) {
        alert('배틀 덱에는 최소 1장의 카드가 필요합니다.');
        return;
      }
      const next = currentDeck.filter((id) => id !== cardId);
      onUpdateProfile({ ...profile, deckCardIds: next });
    } else {
      if (currentDeck.length >= 5) {
        alert('배틀 덱은 최대 5장까지 장착할 수 있습니다.');
        return;
      }
      currentDeck.push(cardId);
      onUpdateProfile({ ...profile, deckCardIds: currentDeck });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-500/20 text-purple-400">
              <Shield className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              마법 도감 — 그리모어 (Grimoire)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            원서에서 포획한 스펠 카드를 감상하고, 배틀 덱을 편성하며 스토리 분기 지도를 확인하세요.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => {
              soundEngine.playClick();
              setSubTab('cards');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              subTab === 'cards'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            스펠 카드 도감
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setSubTab('deck');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              subTab === 'deck'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            배틀 덱 편성 (5장)
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setSubTab('map');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              subTab === 'map'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            스토리 맵
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setSubTab('review');
            }}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              subTab === 'review'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            스마트 복습 큐
          </button>
        </div>
      </div>

      {/* Tab 1: Cards Collection */}
      {subTab === 'cards' && (
        <div className="space-y-5">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="px-2 text-slate-400 font-semibold">속성:</span>
              {['all', 'fire', 'water', 'light', 'dark', 'nature'].map((elem) => (
                <button
                  key={elem}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedElement(elem);
                  }}
                  className={`px-2.5 py-1 rounded-lg uppercase text-[11px] font-bold transition-all ${
                    selectedElement === elem
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {elem}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="px-2 text-slate-400 font-semibold">등급:</span>
              {['all', 'SSR', 'SR', 'R', 'N'].map((rarity) => (
                <button
                  key={rarity}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedRarity(rarity);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    selectedRarity === rarity
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {rarity}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredCards.map((card) => {
              const collected = profile.collectedCards[card.id];
              const isInDeck = profile.deckCardIds.includes(card.id);

              return (
                <div
                  key={card.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedCard(card);
                  }}
                  className={`p-4 rounded-2xl border-2 flex flex-col justify-between cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-xl relative overflow-hidden ${
                    collected
                      ? card.rarity === 'SSR'
                        ? 'holo-card-ssr border-amber-400'
                        : card.rarity === 'SR'
                        ? 'holo-card-sr border-purple-400'
                        : 'bg-slate-900 border-slate-700'
                      : 'bg-slate-950/60 border-slate-800 opacity-60'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${getRarityBadge(card.rarity)}`}>
                      {card.rarity}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase ${getElementBadge(card.element)}`}>
                      {card.element}
                    </span>
                  </div>

                  {/* Card Icon & Name */}
                  <div className="text-center py-4 space-y-1">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-slate-950/70 border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                      {card.element === 'fire' ? '🔥' : card.element === 'water' ? '💧' : card.element === 'light' ? '✨' : card.element === 'dark' ? '🌑' : '🌿'}
                    </div>
                    <h4 className="font-black text-sm text-white line-clamp-1">
                      {card.word}
                    </h4>
                    <p className="text-[11px] text-amber-300/90 font-medium line-clamp-1">
                      {card.meaningKo}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-400">
                      ⚡ {card.baseAttack} ATK
                    </span>
                    {isInDeck && (
                      <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold border border-indigo-500/30">
                        덱 장착
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Deck Builder */}
      {subTab === 'deck' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="text-lg font-black text-white">
              배틀 덱 편성 (현재 {profile.deckCardIds.length} / 5장)
            </h3>
            <p className="text-xs text-slate-400">
              스피킹 배틀에서 녹스를 물리칠 때 사용할 최정예 스펠 카드 5장을 선택하세요.
            </p>
          </div>

          {/* Active 5 Deck Slots */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[0, 1, 2, 3, 4].map((slotIdx) => {
              const cardId = profile.deckCardIds[slotIdx];
              const card = cardId ? ALL_SPELL_CARDS[cardId] : null;

              return (
                <div
                  key={slotIdx}
                  className={`min-h-[160px] rounded-2xl border-2 flex flex-col justify-between p-3.5 transition-all ${
                    card
                      ? 'bg-slate-950 border-amber-400/60 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-950/40 border-dashed border-slate-800 items-center justify-center text-slate-500'
                  }`}
                >
                  {card ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${getRarityBadge(card.rarity)}`}>
                          {card.rarity}
                        </span>
                        <button
                          onClick={() => toggleDeckCard(card.id)}
                          className="text-[10px] text-rose-400 hover:underline"
                        >
                          해제
                        </button>
                      </div>

                      <div className="text-center py-2">
                        <h4 className="font-extrabold text-sm text-white">
                          {card.word}
                        </h4>
                        <p className="text-[11px] text-amber-300">
                          {card.meaningKo}
                        </p>
                      </div>

                      <div className="text-right text-xs font-bold text-amber-400">
                        ⚡ {card.baseAttack} ATK
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-1">
                      <span className="text-xl">➕</span>
                      <p className="text-[11px]">빈 슬롯</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Available Cards to Equip */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300">
              장착 가능한 보유 카드 목록:
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {allCards.map((card) => {
                const isEquipped = profile.deckCardIds.includes(card.id);
                return (
                  <button
                    key={card.id}
                    onClick={() => toggleDeckCard(card.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-1 transition-all ${
                      isEquipped
                        ? 'bg-indigo-950/60 border-indigo-500/60'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-400">
                        {card.rarity}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {isEquipped ? '✓ 장착중' : '+ 추가'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white line-clamp-1">
                      {card.word}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ⚡ {card.baseAttack} ATK
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Story Map Tree (SC-08-2) */}
      {subTab === 'map' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white">
                스토리 분기 트리 맵 (Story Map)
              </h3>
              <p className="text-xs text-slate-400">
                내 목소리로 선택한 루트와 아직 발견하지 못한 미개척 분기들을 탐험하세요.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              발견율: 65% (4/6 노드 해금)
            </span>
          </div>

          {/* Interactive Visual Node Graph */}
          <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-8 relative overflow-hidden">
            <div className="flex flex-col items-center space-y-6">
              {/* Entry Node */}
              <div className="p-4 rounded-2xl bg-indigo-600 text-white font-black text-xs shadow-lg shadow-indigo-600/30 border border-indigo-400 text-center w-56">
                📍 숲의 입구 (Ch.1 시작)
              </div>

              {/* Branch Connecting Lines */}
              <div className="w-0.5 h-6 bg-slate-700" />

              {/* Branch Decision Split */}
              <div className="grid grid-cols-2 gap-8 w-full max-w-lg">
                {/* Branch A (Explored) */}
                <div className="space-y-4 flex flex-col items-center">
                  <div className="p-3.5 rounded-xl bg-purple-900/60 border border-amber-400 text-amber-300 font-bold text-xs text-center w-full shadow-md">
                    "I will follow the sparkling light"
                    <span className="block text-[10px] text-emerald-400 font-bold mt-1">
                      ✓ 탐험 완료 (요정 동굴)
                    </span>
                  </div>
                  <div className="w-0.5 h-6 bg-amber-400" />
                  <div className="p-3 rounded-xl bg-slate-900 border border-purple-500 text-slate-200 text-xs font-semibold text-center w-full">
                    ⚔️ 녹스 1차 배틀 & 승리
                  </div>
                </div>

                {/* Branch B (Unexplored) */}
                <div className="space-y-4 flex flex-col items-center opacity-50">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-dashed border-slate-700 text-slate-400 font-bold text-xs text-center w-full">
                    "Let's listen to whispering trees"
                    <span className="block text-[10px] text-slate-500 mt-1">
                      🔒 미개척 루트 (지혜의 올빼미)
                    </span>
                  </div>
                  <div className="w-0.5 h-6 bg-slate-700" />
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-600 text-xs text-center w-full">
                    🔒 숨겨진 보물 상자 엔딩
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Review Queue */}
      {subTab === 'review' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white">
                스마트 복습 큐 (Spaced Repetition)
              </h3>
              <p className="text-xs text-slate-400">
                발음 점수가 70점대였거나 취약 음소가 발견된 카드가 자동 적재됩니다.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              오늘의 복습 2장 대기 중
            </span>
          </div>

          <div className="space-y-3">
            {[
              { word: 'courage', score: 78, tip: '/ɜːr/ 음소를 혀를 굴려 다시 발음해보세요!', interval: '오늘' },
              { word: 'crystal', score: 81, tip: '/kr/ 자음군을 또렷하게 발음해보세요!', interval: '내일' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-white">{item.word}</span>
                    <span className="text-xs font-bold text-amber-400">최근 {item.score}점</span>
                    <span className="text-[10px] text-slate-400">({item.interval})</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{item.tip}</p>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    speechService.speak(item.word, 0.9);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>발음 연습</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card Detail Modal (SC-08-1) */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-xs ${getRarityBadge(selectedCard.rarity)}`}>
                  {selectedCard.rarity}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getElementBadge(selectedCard.element)}`}>
                  {selectedCard.element}
                </span>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-1.5 py-2">
              <h3 className="text-3xl font-black text-white tracking-wide">
                {selectedCard.word}
              </h3>
              <p className="text-sm font-mono text-amber-400">
                {selectedCard.ipa}
              </p>
              <p className="text-sm text-slate-300 font-bold">
                {selectedCard.meaningKo}
              </p>
            </div>

            {/* Example Sentences */}
            <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Example Sentence</span>
              <p className="text-slate-200 font-medium">
                "{selectedCard.exampleEn}"
              </p>
              <p className="text-slate-400 text-[11px]">
                {selectedCard.exampleKo}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => speechService.speak(selectedCard.word, 0.9)}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                <span>원어민 발음 듣기</span>
              </button>
              <button
                onClick={() => toggleDeckCard(selectedCard.id)}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs"
              >
                {profile.deckCardIds.includes(selectedCard.id) ? '덱에서 해제' : '배틀 덱에 장착'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
