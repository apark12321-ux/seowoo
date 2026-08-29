import React, { useState } from 'react';
import { QuestMapHeader } from './QuestMapHeader';
import { QuestSidebar, QuestTabType } from './QuestSidebar';
import { PlayerStatusSidebar } from './PlayerStatusSidebar';
import { ComicBookReader } from './ComicBookReader';
import { SpeakingLabView } from './SpeakingLabView';
import { MyRoomView } from './MyRoomView';
import { RankingsView } from './RankingsView';
import { SettingsModal } from './SettingsModal';
import { HelpTutorialModal } from './HelpTutorialModal';
import { UserChildProfile, Book } from '../../types';

interface ComicQuestMainProps {
  profile: UserChildProfile;
  books: Book[];
  onUpdateProfile: (updated: UserChildProfile) => void;
  onOpenParentDashboard: () => void;
  onOpenPaywall: () => void;
}

export const ComicQuestMain: React.FC<ComicQuestMainProps> = ({
  profile,
  books,
  onUpdateProfile,
  onOpenParentDashboard,
  onOpenPaywall,
}) => {
  const [activeTab, setActiveTab] = useState<QuestTabType>('story');
  const [currentQuestId, setCurrentQuestId] = useState<string>('misty_jungle');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const handleSelectTab = (tab: QuestTabType) => {
    if (tab === 'settings') {
      setShowSettings(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#0b3353] overflow-hidden select-none">
      {/* 1. Top Quest World Map Trail Header */}
      <QuestMapHeader
        currentQuestId={currentQuestId}
        onSelectQuest={(questId) => setCurrentQuestId(questId)}
        onOpenHelp={() => setShowHelp(true)}
      />

      {/* 2. Main Middle Area: Left Sidebar + Central Comic View + Right Profile Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <QuestSidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
        />

        {/* Central Content Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden relative bg-[#0b3353]">
          {activeTab === 'story' && (
            <ComicBookReader
              currentQuestId={currentQuestId}
              profile={profile}
              onUpdateProfile={onUpdateProfile}
              onOpenHelp={() => setShowHelp(true)}
            />
          )}

          {activeTab === 'speaking-lab' && (
            <SpeakingLabView
              profile={profile}
              onUpdateProfile={onUpdateProfile}
            />
          )}

          {activeTab === 'my-room' && (
            <MyRoomView
              profile={profile}
              onUpdateProfile={onUpdateProfile}
            />
          )}

          {activeTab === 'rankings' && (
            <RankingsView
              profile={profile}
            />
          )}
        </main>

        {/* Right Player Gamification & Profile Status Sidebar */}
        <PlayerStatusSidebar
          profile={profile}
          onUpdateProfile={onUpdateProfile}
          onOpenShop={onOpenPaywall}
        />
      </div>

      {/* 3. Settings Modal */}
      {showSettings && (
        <SettingsModal
          profile={profile}
          onUpdateProfile={onUpdateProfile}
          onClose={() => setShowSettings(false)}
          onOpenParentDashboard={onOpenParentDashboard}
        />
      )}

      {/* 4. Help Tutorial Modal */}
      {showHelp && (
        <HelpTutorialModal
          onClose={() => setShowHelp(false)}
        />
      )}
    </div>
  );
};
