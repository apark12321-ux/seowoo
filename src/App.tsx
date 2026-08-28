import React, { useState, useEffect } from 'react';
import {
  UserChildProfile,
  DailyQuest,
  Book,
  Chapter,
  SpellCard,
  CardRarity,
} from './types';
import { storageService } from './utils/storage';
import { ALL_BOOKS } from './data/mockBooks';
import { ALL_SPELL_CARDS } from './data/spellCards';
import { Navbar } from './components/Navigation/Navbar';
import { MagicTowerHome } from './components/Home/MagicTowerHome';
import { BookLibrary } from './components/Library/BookLibrary';
import { InteractiveReader } from './components/Reader/InteractiveReader';
import { SpeakingBattle } from './components/Battle/SpeakingBattle';
import { BattleResult } from './components/Battle/BattleResult';
import { GrimoireView } from './components/Grimoire/GrimoireView';
import { ArenaView } from './components/Arena/ArenaView';
import { ParentDashboard } from './components/Parent/ParentDashboard';
import { PaywallModal } from './components/Subscription/PaywallModal';
import { soundEngine } from './utils/soundEngine';

export default function App() {
  const [profile, setProfile] = useState<UserChildProfile>(() => storageService.getProfile());
  const [quests, setQuests] = useState<DailyQuest[]>(() => storageService.getQuests());
  const [books] = useState<Book[]>(ALL_BOOKS);

  // App Navigation State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [readingBookId, setReadingBookId] = useState<string>(ALL_BOOKS[0].id);
  const [readingChapterId, setReadingChapterId] = useState<string>(ALL_BOOKS[0].chapters[0].id);

  // Battle State
  const [battleResultData, setBattleResultData] = useState<{
    result: 'win' | 'lose';
    damageTotal: number;
    maxCombo: number;
  } | null>(null);

  // Modals
  const [showPaywall, setShowPaywall] = useState<boolean>(false);

  // Persist Profile and Quests updates
  const handleUpdateProfile = (updated: UserChildProfile) => {
    setProfile(updated);
    storageService.saveProfile(updated);
  };

  const handleUpdateQuests = (updatedQuests: DailyQuest[]) => {
    setQuests(updatedQuests);
    storageService.saveQuests(updatedQuests);
  };

  // Start Reading handler
  const handleStartReading = (bookId: string, chapterId: string) => {
    setReadingBookId(bookId);
    setReadingChapterId(chapterId);
    setActiveTab('reader');
  };

  // Card Captured handler
  const handleCardCaptured = (card: SpellCard, score: number, rarity: CardRarity) => {
    const updatedProfile = {
      ...profile,
      xp: profile.xp + 25,
      mana: Math.min(profile.maxMana, profile.mana + 2),
      collectedCards: {
        ...profile.collectedCards,
        [card.id]: {
          collectedAt: new Date().toISOString(),
          rarity,
          bestScore: Math.max(score, profile.collectedCards[card.id]?.bestScore || 0),
          masteryLevel: Math.min(5, (profile.collectedCards[card.id]?.masteryLevel || 0) + 1),
        },
      },
    };

    // Update quest progress for word capture
    const updatedQuests = quests.map((q) => {
      if (q.id === 'q_02') {
        const nextCount = Math.min(q.target, q.current + 1);
        return { ...q, current: nextCount, completed: nextCount >= q.target };
      }
      return q;
    });

    handleUpdateProfile(updatedProfile);
    handleUpdateQuests(updatedQuests);
  };

  // Start Speaking Battle
  const handleStartBattle = (chapterId: string) => {
    setReadingChapterId(chapterId);
    setActiveTab('battle');
  };

  // Battle Completed handler
  const handleBattleComplete = (result: 'win' | 'lose', damageTotal: number, maxCombo: number) => {
    setBattleResultData({ result, damageTotal, maxCombo });

    if (result === 'win') {
      const updatedProfile = {
        ...profile,
        xp: profile.xp + 50,
        mana: Math.min(profile.maxMana, profile.mana + 5),
        streakDays: profile.streakDays + 1,
      };

      // Mark chapter completion quest
      const updatedQuests = quests.map((q) => {
        if (q.id === 'q_01') {
          return { ...q, current: 1, completed: true };
        }
        return q;
      });

      handleUpdateProfile(updatedProfile);
      handleUpdateQuests(updatedQuests);
    }

    setActiveTab('battle-result');
  };

  // Current active book/chapter references
  const currentBook = books.find((b) => b.id === readingBookId) || books[0];
  const currentChapter = currentBook.chapters.find((c) => c.id === readingChapterId) || currentBook.chapters[0];

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 ${profile.settings.dyslexiaFont ? 'font-dyslexic' : ''}`}>
      {/* Top Global Navigation Bar (Hidden during full-screen battle and reader for immersion) */}
      {activeTab !== 'reader' && activeTab !== 'battle' && activeTab !== 'battle-result' && (
        <Navbar
          activeTab={activeTab}
          currentTab={activeTab}
          appMode={activeTab === 'parent' ? 'parent' : 'student'}
          profile={profile}
          onUpdateProfile={handleUpdateProfile}
          onSelectTab={(tab) => {
            soundEngine.playClick();
            if (tab === 'my') {
              setActiveTab('parent');
            } else {
              setActiveTab(tab);
            }
          }}
          onSelectMode={(mode) => {
            if (mode === 'parent' || mode === 'admin') {
              setActiveTab('parent');
            } else if (mode === 'student') {
              if (activeTab === 'parent') setActiveTab('home');
            }
          }}
          onOpenPaywall={() => setShowPaywall(true)}
        />
      )}

      {/* Main View Router */}
      <div className="flex-1">
        {activeTab === 'home' && (
          <MagicTowerHome
            profile={profile}
            quests={quests}
            books={books}
            onStartReading={handleStartReading}
            onNavigateTab={(tab) => {
              soundEngine.playClick();
              setActiveTab(tab);
            }}
            onClaimQuest={(questId) => {
              // Quest claim logic
            }}
            onOpenPaywall={() => setShowPaywall(true)}
          />
        )}

        {activeTab === 'library' && (
          <BookLibrary
            books={books}
            profile={profile}
            onSelectChapter={handleStartReading}
            onOpenPaywall={() => setShowPaywall(true)}
          />
        )}

        {activeTab === 'reader' && (
          <InteractiveReader
            book={currentBook}
            chapter={currentChapter}
            profile={profile}
            onExit={() => setActiveTab('library')}
            onStartBattle={handleStartBattle}
            onCardCaptured={handleCardCaptured}
          />
        )}

        {activeTab === 'battle' && (
          <SpeakingBattle
            chapterId={readingChapterId}
            profile={profile}
            onBattleComplete={handleBattleComplete}
            onExit={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'battle-result' && battleResultData && (
          <BattleResult
            result={battleResultData.result}
            damageTotal={battleResultData.damageTotal}
            maxCombo={battleResultData.maxCombo}
            chapterTitle={currentChapter.titleKo}
            onContinue={() => setActiveTab('library')}
            onRetry={() => setActiveTab('battle')}
            onGoHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'grimoire' && (
          <GrimoireView
            profile={profile}
            books={books}
            onUpdateProfile={handleUpdateProfile}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'arena' && (
          <ArenaView
            profile={profile}
            onStartBattle={handleStartBattle}
          />
        )}

        {activeTab === 'parent' && (
          <ParentDashboard
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onClose={() => setActiveTab('home')}
          />
        )}
      </div>

      {/* SC-11 Paywall & 7-Day Free Trial Modal */}
      {showPaywall && (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onSubscribe={() => {
            setShowPaywall(false);
            const updated = {
              ...profile,
              isSubscribed: true,
              subscriptionTier: 'premium' as const,
              mana: profile.maxMana,
            };
            handleUpdateProfile(updated);
            alert('🎉 SPELLBOOK 무제한 프리미엄 패스가 활성화되었습니다! 모든 챕터와 카드가 해금되었습니다.');
          }}
        />
      )}
    </div>
  );
}
