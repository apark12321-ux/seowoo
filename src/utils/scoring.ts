import { CardRarity, PronunciationVerdict, WordPhoneme } from '../types';

export interface ScoreBreakdown {
  rawAccuracy: number;
  rawFluency: number;
  rawCompleteness: number;
  displayScore: number;
  verdict: PronunciationVerdict;
  weakPhonemes: string[];
  rarity: CardRarity;
  damage: number;
}

export function calculateSentenceScore(
  accuracy: number,
  fluency: number,
  completeness: number
): number {
  const weighted = accuracy * 0.6 + fluency * 0.25 + completeness * 0.15;
  // Child correction factor: +5% (1.05x)
  return Math.round(Math.min(100, weighted * 1.05));
}

export function getRarityFromScore(score: number): CardRarity {
  if (score >= 95) return 'SSR';
  if (score >= 88) return 'SR';
  if (score >= 82) return 'R';
  return 'N';
}

export function getVerdictFromScore(score: number): PronunciationVerdict {
  if (score >= 95) return 'PERFECT';
  if (score >= 85) return 'GREAT';
  if (score >= 70) return 'GOOD';
  return 'MISS';
}

export function calculateBattleDamage(
  baseAttack: number,
  score: number,
  comboLevel: number
): { damage: number; verdict: PronunciationVerdict; comboMultiplier: number } {
  const verdict = getVerdictFromScore(score);
  let scoreFactor = 0;
  if (verdict === 'PERFECT') scoreFactor = 1.5;
  else if (verdict === 'GREAT') scoreFactor = 1.2;
  else if (verdict === 'GOOD') scoreFactor = 1.0;
  else scoreFactor = 0;

  let comboMultiplier = 1.0;
  if (comboLevel === 2) comboMultiplier = 1.3;
  else if (comboLevel === 3) comboMultiplier = 1.6;
  else if (comboLevel >= 4) comboMultiplier = 2.0;

  const damage = Math.round(baseAttack * scoreFactor * comboMultiplier);
  return { damage, verdict, comboMultiplier };
}

export function calculateXpForNextRank(currentRank: number): number {
  return Math.round(100 * Math.pow(currentRank, 1.35));
}

// Levenshtein distance & similarity calculation for speech evaluation
export function calculateTextSimilarity(target: string, spoken: string): number {
  const t = target.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');
  const s = spoken.toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '');

  if (!t && !s) return 1;
  if (!t || !s) return 0;
  if (t === s) return 1;

  // Simple token matching
  const tTokens = t.split(/\s+/);
  const sTokens = s.split(/\s+/);

  let matchCount = 0;
  tTokens.forEach((tk) => {
    if (sTokens.includes(tk)) matchCount++;
  });

  const tokenSim = matchCount / Math.max(tTokens.length, sTokens.length);

  // Character Levenshtein for fine-grained match
  const matrix: number[][] = [];
  for (let i = 0; i <= t.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= t.length; i++) {
    for (let j = 1; j <= s.length; j++) {
      if (t.charAt(i - 1) === s.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const levDist = matrix[t.length][s.length];
  const levSim = 1 - levDist / Math.max(t.length, s.length);

  return Math.max(tokenSim, levSim);
}

// Generate realistic phonetic breakdown based on spoken text vs target
export function evaluateUtterance(
  targetText: string,
  spokenText: string,
  targetPhonemes?: WordPhoneme[]
): ScoreBreakdown {
  const similarity = calculateTextSimilarity(targetText, spokenText);

  // Generate realistic accuracy and fluency
  let rawAccuracy = Math.round(similarity * 100);
  // Add small natural variance
  if (rawAccuracy > 70) {
    rawAccuracy = Math.min(100, rawAccuracy + Math.floor(Math.random() * 6) - 2);
  }
  const rawFluency = Math.min(100, Math.round(rawAccuracy * 0.95 + Math.random() * 10));
  const rawCompleteness = similarity >= 0.8 ? 100 : Math.round(similarity * 100);

  const displayScore = calculateSentenceScore(rawAccuracy, rawFluency, rawCompleteness);
  const verdict = getVerdictFromScore(displayScore);
  const rarity = getRarityFromScore(displayScore);

  const weakPhonemes: string[] = [];
  if (targetPhonemes && targetPhonemes.length > 0) {
    targetPhonemes.forEach((p) => {
      if (displayScore < 85 && (p.phoneme.includes('r') || p.phoneme.includes('th') || p.phoneme.includes('v') || p.score < 85)) {
        weakPhonemes.push(p.phoneme);
      }
    });
  }

  return {
    rawAccuracy,
    rawFluency,
    rawCompleteness,
    displayScore,
    verdict,
    weakPhonemes,
    rarity,
    damage: 0,
  };
}
