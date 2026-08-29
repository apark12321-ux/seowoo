import {
  UserChildProfile,
  DailyQuest,
  UtteranceRecord,
  ReviewQueueItem,
  ParentReportData,
  LeaguePlayer,
  CardRarity,
} from '../types';
import { ALL_SPELL_CARDS } from '../data/spellCards';

const STORAGE_KEY_PROFILE = 'spellbook_profile_seowoo_v3';
const STORAGE_KEY_UTTERANCES = 'spellbook_utterances_seowoo_v3';
const STORAGE_KEY_QUESTS = 'spellbook_quests_seowoo_v3';
const STORAGE_KEY_REVIEW = 'spellbook_review_seowoo_v3';

export const INITIAL_CHILD_PROFILE: UserChildProfile = {
  id: 'child_001',
  nickname: '박서우',
  grade: 5,
  avatarId: 'avatar_mage_star',
  arLevel: 2.5,
  wizardRank: 5,
  rankTitle: '은하수 수호 대마법사 (Archmage Seowoo)',
  xp: 580,
  mana: 95,
  gems: 24,
  coins: 1500,
  level: 2,
  levelXp: 12,
  levelNextXp: 13,
  inventory: [
    { id: 'item_robot_sparky', name: 'Robot Pet Sparky', type: 'pet', icon: '🤖', isEquipped: true, isLocked: false },
    { id: 'item_shirt_blue', name: 'Sky Blue T-Shirt', type: 'clothing', icon: '👕', isEquipped: true, isLocked: false },
    { id: 'item_shirt_yellow', name: 'Explorer Yellow Vest', type: 'clothing', icon: '🦺', isEquipped: false, isLocked: true },
  ],
  wordGems: {
    ruby: 8,
    sapphire: 14,
    amethyst: 6,
  },
  streakDays: 15,
  streakActiveToday: true,
  freezeCount: 3,
  deckCardIds: ['card_seowoo_star', 'card_whisper', 'card_courage', 'card_crystal', 'card_brave'],
  collectedCards: {
    card_seowoo_star: { rarity: 'SSR', bestScore: 100, date: '2026-08-27' },
    card_courage: { rarity: 'SR', bestScore: 95, date: '2026-08-25' },
    card_whisper: { rarity: 'SSR', bestScore: 98, date: '2026-08-26' },
    card_sparkle: { rarity: 'N', bestScore: 88, date: '2026-08-24' },
    card_crystal: { rarity: 'R', bestScore: 92, date: '2026-08-26' },
    card_brave: { rarity: 'SR', bestScore: 94, date: '2026-08-27' },
  },
  unlockedChapters: ['ch_forest_01', 'ch_forest_02', 'ch_dragon_01', 'ch_sound_01'],
  exploredNodes: {
    book_forest: ['node_f1_01', 'node_f1_choice', 'node_f1_path_light', 'node_f1_battle', 'node_f1_ending'],
  },
  readingMode: 'read_aloud',
  settings: {
    dyslexiaFont: false,
    speechSpeed: 1.0,
    showSubtitles: true,
    autoMic: false,
    dailyLimitMinutes: 30,
  },
};

export const INITIAL_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'q1',
    title: 'Complete 1 Chapter',
    titleKo: '박서우 마법사의 오늘의 챕터 1개 완주하기',
    type: 'chapter',
    current: 1,
    target: 1,
    completed: true,
    rewardMana: 10,
    icon: 'book-open',
  },
  {
    id: 'q2',
    title: 'Capture 3 Spell Cards',
    titleKo: '서우의 스펠 도감에 마법 카드 3장 포획하기',
    type: 'capture',
    current: 2,
    target: 3,
    completed: false,
    rewardMana: 15,
    icon: 'sparkles',
  },
  {
    id: 'q3',
    title: 'Achieve 5 PERFECTs',
    titleKo: 'PERFECT 발음 5회 달성하기 (서우 파워!)',
    type: 'precision',
    current: 3,
    target: 5,
    completed: false,
    rewardMana: 20,
    icon: 'flame',
  },
];

export const INITIAL_LEAGUE_PLAYERS: LeaguePlayer[] = [
  { rank: 1, name: '👑 박서우 (Seowoo Park)', avatar: '🧙‍♂️', score: 3950, tier: 'Gold', isUser: true, streak: 15 },
  { rank: 2, name: '스타위자드 (민우)', avatar: '🌟', score: 3240, tier: 'Gold', streak: 18 },
  { rank: 3, name: '드래곤슬레이어 (지호)', avatar: '🐉', score: 2850, tier: 'Gold', streak: 9 },
  { rank: 4, name: '매직버니 (서연)', avatar: '🐰', score: 2710, tier: 'Gold', streak: 14 },
  { rank: 5, name: '파이어볼트 (도윤)', avatar: '⚡', score: 2540, tier: 'Gold', streak: 6 },
  { rank: 6, name: '샤이닝클라우드 (하은)', avatar: '☁️', score: 2390, tier: 'Silver', streak: 7 },
  { rank: 7, name: '크리스탈하트 (유진)', avatar: '💎', score: 2210, tier: 'Silver', streak: 4 },
  { rank: 8, name: '섀도우체이서 (태양)', avatar: '🦉', score: 2080, tier: 'Silver', streak: 11 },
];

export const INITIAL_PARENT_REPORT: ParentReportData = {
  weeklyAccuracyTrends: [
    { day: '월', score: 82, target: 80 },
    { day: '화', score: 85, target: 80 },
    { day: '수', score: 84, target: 80 },
    { day: '목', score: 88, target: 80 },
    { day: '금', score: 91, target: 80 },
    { day: '토', score: 89, target: 80 },
    { day: '일', score: 93, target: 80 },
  ],
  wpmProgress: [
    { week: '1주차', wpm: 68 },
    { week: '2주차', wpm: 74 },
    { week: '3주차', wpm: 81 },
    { week: '4주차', wpm: 89 },
  ],
  vocabGrowth: [
    { week: '1주차', words: 24 },
    { week: '2주차', words: 52 },
    { week: '3주차', words: 86 },
    { week: '4주차', words: 124 },
  ],
  weakPhonemes: [
    { phoneme: '/ɜːr/', name: 'R-Vowel (courage, bird)', accuracy: 74, example: 'courage', occurrences: 18 },
    { phoneme: '/θ/', name: 'Voiceless TH (through, path)', accuracy: 78, example: 'through', occurrences: 14 },
    { phoneme: '/v/', name: 'V-Fricative (brave, vanish)', accuracy: 81, example: 'brave', occurrences: 12 },
    { phoneme: '/l/', name: 'Dark L (crystal, little)', accuracy: 83, example: 'crystal', occurrences: 16 },
    { phoneme: '/ʃ/', name: 'SH-Sound (shadow, whisper)', accuracy: 86, example: 'shadow', occurrences: 22 },
  ],
  arProgression: [
    { month: '5월', ar: 1.6 },
    { month: '6월', ar: 1.8 },
    { month: '7월', ar: 2.0 },
    { month: '8월', ar: 2.3 },
  ],
  totalSpeakingTimeMin: 148,
  validUtterancesCount: 312,
  wordsCapturedTotal: 48,
  curatedVoiceClips: [
    {
      id: 'clip_01',
      word: 'courage',
      sentence: 'She felt courage in her heart.',
      score: 92,
      date: '오늘 16:42',
      improvement: '/ɜːr/ 음소 정확도 14% 상승!',
    },
    {
      id: 'clip_02',
      word: 'whisper',
      sentence: 'The ancient trees whisper secrets.',
      score: 98,
      date: '어제 19:10',
      improvement: '원어민 억양 일치율 98% (PERFECT)',
    },
    {
      id: 'clip_03',
      word: 'crystal',
      sentence: 'A magical crystal glowed with blue light.',
      score: 89,
      date: '3일 전',
      improvement: '음절 끊김 없이 유창하게 발화',
    },
  ],
};

export class StorageService {
  public static getProfile(): UserChildProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return INITIAL_CHILD_PROFILE;
  }

  public static saveProfile(profile: UserChildProfile) {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }

  public static getQuests(): DailyQuest[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_QUESTS);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return INITIAL_DAILY_QUESTS;
  }

  public static saveQuests(quests: DailyQuest[]) {
    try {
      localStorage.setItem(STORAGE_KEY_QUESTS, JSON.stringify(quests));
    } catch {
      // ignore
    }
  }

  public static addUtterance(record: UtteranceRecord) {
    try {
      const existing = this.getUtterances();
      existing.unshift(record);
      if (existing.length > 100) existing.pop();
      localStorage.setItem(STORAGE_KEY_UTTERANCES, JSON.stringify(existing));
    } catch {
      // ignore
    }
  }

  public static getUtterances(): UtteranceRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_UTTERANCES);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return [];
  }
}

export const storageService = StorageService;

