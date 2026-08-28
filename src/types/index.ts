export type ElementType = 'fire' | 'water' | 'light' | 'dark' | 'nature';
export type CardRarity = 'N' | 'R' | 'SR' | 'SSR';
export type ReadingMode = 'listen_follow' | 'read_aloud' | 'free_reading';
export type PronunciationVerdict = 'PERFECT' | 'GREAT' | 'GOOD' | 'MISS';

export interface WordPhoneme {
  phoneme: string;
  score: number;
  ipa: string;
  tip?: string;
}

export interface WordToken {
  id: string;
  word: string;
  cleanWord: string;
  ipa: string;
  meaningKo: string;
  isHighlight: boolean;
  element?: ElementType;
  cardId?: string;
}

export interface StorySentence {
  id: string;
  en: string;
  ko: string;
  words: WordToken[];
  audioTiming?: { start: number; end: number };
}

export interface BranchChoice {
  id: string;
  textEn: string;
  textKo: string;
  icon: string;
  effect: Record<string, number>; // e.g. { brave: 1, careful: 1 }
  nextNodeId: string;
  hintKo?: string;
}

export interface StoryNode {
  id: string;
  chapterId: string;
  type: 'narrative' | 'choice' | 'battle' | 'ending';
  title?: string;
  sceneBg: string; // gradient or theme illustration key
  sentences?: StorySentence[];
  choices?: BranchChoice[];
  villainId?: string;
  villainHp?: number;
  nextNodeId?: string;
  branchKey?: string;
  endingReward?: {
    cardId: string;
    xp: number;
    title: string;
  };
}

export interface Chapter {
  id: string;
  bookId: string;
  seq: number;
  title: string;
  titleKo: string;
  difficulty: string;
  estMinutes: number;
  entryNodeId: string;
  coverAsset: string;
  nodes: Record<string, StoryNode>;
  targetWords: string[];
}

export interface Book {
  id: string;
  title: string;
  titleKo: string;
  author: string;
  arLevel: number;
  lexile: string;
  genre: 'fantasy' | 'adventure' | 'mystery' | 'classic' | 'nonfiction';
  wordCount: number;
  branchCount: number;
  endingCount: number;
  synopsis: string;
  synopsisKo: string;
  coverUrl: string;
  themeColor: string;
  chapters: Chapter[];
  isLocked?: boolean;
}

export interface SpellCard {
  id: string;
  wordId: string;
  word: string;
  ipa: string;
  meaningKo: string;
  exampleEn: string;
  exampleKo: string;
  element: ElementType;
  rarity: CardRarity;
  baseAttack: number;
  artKey: string;
  firstCapturedAt?: string;
  bestScore?: number;
  captureCount?: number;
  bookTitle?: string;
  voiceClipUrl?: string;
  phonemes: WordPhoneme[];
}

export interface UserChildProfile {
  id: string;
  nickname: string;
  grade: 4 | 5 | 6;
  avatarId: string;
  arLevel: number;
  wizardRank: number;
  rankTitle: string;
  xp: number;
  mana: number;
  gems: number;
  streakDays: number;
  streakActiveToday: boolean;
  freezeCount: number;
  deckCardIds: string[]; // 5 card IDs
  collectedCards: Record<string, { rarity: CardRarity; bestScore: number; date: string; voiceClip?: string }>;
  unlockedChapters: string[]; // chapter IDs
  exploredNodes: Record<string, string[]>; // bookId -> nodeIds
  readingMode: ReadingMode;
  settings: {
    dyslexiaFont: boolean;
    speechSpeed: 0.75 | 1.0 | 1.25;
    showSubtitles: boolean;
    autoMic: boolean;
    dailyLimitMinutes: number;
  };
}

export interface DailyQuest {
  id: string;
  title: string;
  titleKo: string;
  type: 'chapter' | 'capture' | 'precision';
  current: number;
  target: number;
  completed: boolean;
  rewardMana: number;
  icon: string;
}

export interface UtteranceRecord {
  id: string;
  timestamp: string;
  context: 'sentence' | 'capture' | 'choice' | 'battle';
  targetText: string;
  spokenText: string;
  accuracy: number;
  fluency: number;
  completeness: number;
  displayScore: number;
  verdict: PronunciationVerdict;
  weakPhonemes: string[];
}

export interface ReviewQueueItem {
  cardId: string;
  word: string;
  lastScore: number;
  nextDueAt: string;
  intervalDays: number;
}

export interface ParentReportData {
  weeklyAccuracyTrends: { day: string; score: number; target: number }[];
  wpmProgress: { week: string; wpm: number }[];
  vocabGrowth: { week: string; words: number }[];
  weakPhonemes: { phoneme: string; name: string; accuracy: number; example: string; occurrences: number }[];
  arProgression: { month: string; ar: number }[];
  totalSpeakingTimeMin: number;
  validUtterancesCount: number;
  wordsCapturedTotal: number;
  curatedVoiceClips: {
    id: string;
    word: string;
    sentence: string;
    score: number;
    date: string;
    audioUrl?: string;
    improvement: string;
  }[];
}

export interface LeaguePlayer {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  isUser?: boolean;
  streak: number;
}

export interface LeagueRanker {
  rank: number;
  nickname: string;
  rankTitle: string;
  points: number;
  favoriteCard: string;
  avatarEmoji: string;
  isUser?: boolean;
}

