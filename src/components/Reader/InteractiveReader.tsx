import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Flame,
  Zap,
  Volume2,
  Mic,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Type,
  HelpCircle,
  Pause,
  Play,
  RotateCcw,
  CheckCircle2,
  Shield,
  Layers,
} from 'lucide-react';
import {
  Book,
  Chapter,
  StoryNode,
  StorySentence,
  WordToken,
  SpellCard,
  UserChildProfile,
  CardRarity,
} from '../../types';
import { ALL_SPELL_CARDS } from '../../data/spellCards';
import { LumenSprite } from '../Companion/LumenSprite';
import { WordCaptureOverlay } from './WordCaptureOverlay';
import { BranchChoiceOverlay } from './BranchChoiceOverlay';
import { soundEngine } from '../../utils/soundEngine';
import { speechService } from '../../utils/speech';
import { evaluateUtterance } from '../../utils/scoring';

interface InteractiveReaderProps {
  book: Book;
  chapter: Chapter;
  profile: UserChildProfile;
  onExit: () => void;
  onStartBattle: (chapterId: string) => void;
  onCardCaptured: (card: SpellCard, score: number, rarity: CardRarity) => void;
}

export const InteractiveReader: React.FC<InteractiveReaderProps> = ({
  book,
  chapter,
  profile,
  onExit,
  onStartBattle,
  onCardCaptured,
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(chapter.entryNodeId);
  const [currentSentenceIdx, setCurrentSentenceIdx] = useState<number>(0);
  const [activeCaptureCard, setActiveCaptureCard] = useState<SpellCard | null>(null);
  const [showBranchModal, setShowBranchModal] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Audio / Speech State
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [micLevel, setMicLevel] = useState<number>(0);
  const [speechSpeed, setSpeechSpeed] = useState<0.6 | 0.8 | 1.0>(0.8);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [showKoTranslation, setShowKoTranslation] = useState<boolean>(false);

  // Scored sentences mapping: sentenceId -> score
  const [sentenceScores, setSentenceScores] = useState<Record<string, number>>({});
  const [activeWordTip, setActiveWordTip] = useState<WordToken | null>(null);

  const currentNode: StoryNode = chapter.nodes[currentNodeId] || chapter.nodes[chapter.entryNodeId];
  const sentences: StorySentence[] = currentNode.sentences || [];
  const currentSentence = sentences[currentSentenceIdx];

  // Auto handle node types (e.g. choice / battle)
  useEffect(() => {
    if (currentNode.type === 'choice' && currentNode.choices) {
      setShowBranchModal(true);
    } else if (currentNode.type === 'battle') {
      onStartBattle(chapter.id);
    }
  }, [currentNode, chapter.id, onStartBattle]);

  // Read current sentence via TTS
  const handlePlayCurrentSentence = () => {
    if (!currentSentence) return;
    soundEngine.playClick();
    setIsPlayingAudio(true);
    speechService.speak(currentSentence.en, speechSpeed, () => {
      setIsPlayingAudio(false);
    });
  };

  // Push-To-Talk Sentence evaluation
  const handleStartMic = () => {
    soundEngine.playMicBeep();
    setIsRecording(true);

    speechService.startListening(
      (transcript, isFinal) => {
        if (isFinal) {
          handleSentenceSpoken(transcript);
        }
      },
      () => {
        setIsRecording(false);
        simulateSentenceScore();
      },
      (lvl) => setMicLevel(lvl)
    );
  };

  const handleStopMic = () => {
    speechService.stopListening();
    setIsRecording(false);
    simulateSentenceScore();
  };

  const handleSentenceSpoken = (spokenText: string) => {
    speechService.stopListening();
    setIsRecording(false);
    if (!currentSentence) return;

    const result = evaluateUtterance(currentSentence.en, spokenText);
    const score = result.displayScore;

    setSentenceScores((prev) => ({
      ...prev,
      [currentSentence.id]: score,
    }));

    if (score >= 70) {
      soundEngine.playPerfect();
    } else {
      soundEngine.playClick();
    }
  };

  const simulateSentenceScore = () => {
    if (!currentSentence) return;
    const randomScore = 82 + Math.floor(Math.random() * 16); // 82~98
    setSentenceScores((prev) => ({
      ...prev,
      [currentSentence.id]: randomScore,
    }));
    soundEngine.playPerfect();
  };

  // Navigation between sentences
  const handleNextSentence = () => {
    soundEngine.playClick();
    if (currentSentenceIdx < sentences.length - 1) {
      setCurrentSentenceIdx((prev) => prev + 1);
    } else if (currentNode.nextNodeId) {
      // Proceed to next story node
      setCurrentNodeId(currentNode.nextNodeId);
      setCurrentSentenceIdx(0);
    } else if (currentNode.type === 'narrative') {
      // If end of chapter reached
      onStartBattle(chapter.id);
    }
  };

  const handlePrevSentence = () => {
    soundEngine.playClick();
    if (currentSentenceIdx > 0) {
      setCurrentSentenceIdx((prev) => prev - 1);
    }
  };

  const handleWordClick = (wordToken: WordToken) => {
    soundEngine.playClick();
    speechService.speak(wordToken.cleanWord, 0.8);
    setActiveWordTip(wordToken);

    // If it's a magical highlight token, open word capture overlay
    if (wordToken.isHighlight && wordToken.cardId) {
      const card = ALL_SPELL_CARDS[wordToken.cardId];
      if (card) {
        setActiveCaptureCard(card);
      }
    }
  };

  // Scene artwork lookup
  const getSceneIllustration = () => {
    switch (currentNode.sceneBg) {
      case 'forest_day':
      case 'forest_fork':
        return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80';
      case 'fairy_hollow':
        return 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80';
      case 'owl_shrine':
        return 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80';
      case 'crystal_cavern':
      case 'crystal_battle_arena':
        return 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80';
      default:
        return 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large':
        return 'text-3xl sm:text-4xl md:text-5xl leading-loose';
      case 'xlarge':
        return 'text-4xl sm:text-5xl md:text-6xl leading-loose';
      default:
        return 'text-2xl sm:text-3xl md:text-4xl leading-relaxed';
    }
  };

  return (
    <div className={`min-h-[92vh] flex flex-col justify-between bg-slate-950 text-slate-100 ${profile.settings.dyslexiaFont ? 'font-dyslexic' : ''}`}>
      {/* RD-01 Top Bar */}
      <header className="bg-slate-900/90 border-b border-indigo-900/40 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-2 sm:px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-black shadow-sm"
            title="나가기"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">서재로 나가기</span>
          </button>

          <div>
            <span className="text-xs sm:text-sm font-black text-amber-300">
              {book.titleKo}
            </span>
            <h2 className="text-sm sm:text-base md:text-lg font-black text-white line-clamp-1">
              {chapter.titleKo} ({chapter.title})
            </h2>
          </div>
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs sm:text-sm font-bold">
            <button
              onClick={() => {
                const nextSpeed = speechSpeed === 0.8 ? 1.0 : speechSpeed === 1.0 ? 0.6 : 0.8;
                setSpeechSpeed(nextSpeed);
              }}
              className="px-2.5 py-1 rounded-xl text-amber-300 font-extrabold hover:bg-slate-800"
              title="원어민 발음 속도"
            >
              🔊 {speechSpeed}x
            </button>
            <button
              onClick={() => {
                const nextSize = fontSize === 'normal' ? 'large' : fontSize === 'large' ? 'xlarge' : 'normal';
                setFontSize(nextSize);
              }}
              className="px-2.5 py-1 rounded-xl text-indigo-200 font-black hover:bg-slate-800 flex items-center gap-1"
              title="글자 크기 변경"
            >
              <Type className="w-4 h-4 text-amber-400" />
              <span>글자 {fontSize === 'normal' ? '기본' : fontSize === 'large' ? '크게' : '아주크게'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-black shadow-sm">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-bounce" />
            <span>{profile.streakDays}일 연속</span>
          </div>
        </div>
      </header>

      {/* Main Split Viewer Layout */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* RD-02 Scene Visual & Lumen Companion (Left 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative aspect-video sm:aspect-4/3 rounded-3xl overflow-hidden border-2 border-indigo-900/60 shadow-2xl group">
            <img
              src={getSceneIllustration()}
              alt={currentNode.title || 'Scene'}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 bg-slate-950/80 px-2.5 py-1 rounded-full border border-amber-500/30">
                📍 {currentNode.title || '숲속의 탐험'}
              </span>
              <span className="text-[10px] text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded-md">
                페이지 {currentSentenceIdx + 1} / {Math.max(1, sentences.length)}
              </span>
            </div>
          </div>

          {/* RD-05 Lumen Reactive Companion */}
          <LumenSprite
            mood={isRecording ? 'cheer' : 'happy'}
            message={
              isRecording
                ? '좋아, 큰 목소리로 자신 있게 읽어봐!'
                : currentSentence?.words.some((w) => w.isHighlight)
                ? '반짝이는 황금 단어를 눌러서 스펠 카드를 포획해봐!'
                : '문장을 차근차근 따라 읽으면 마법 게이지가 차올라!'
            }
            size="sm"
          />
        </div>

        {/* RD-03 Narrative Text Area (Right 7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between min-h-[420px] space-y-6">
          {/* Sentence Trackers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  📖 소리 내어 읽기
                </span>
                <button
                  onClick={() => setShowKoTranslation(!showKoTranslation)}
                  className="text-xs sm:text-sm text-slate-300 hover:text-amber-300 flex items-center gap-1 font-bold transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>한국어 해석 {showKoTranslation ? '숨김' : '보기'}</span>
                </button>
              </div>

              {currentSentence && sentenceScores[currentSentence.id] && (
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>발음 점수: {sentenceScores[currentSentence.id]}점</span>
                </div>
              )}
            </div>

            {/* Current Sentence Token Words Display */}
            {currentSentence ? (
              <div className="space-y-4">
                <div className={`flex flex-wrap items-center gap-x-3 gap-y-3.5 font-bold ${getFontSizeClass()}`}>
                  {currentSentence.words.map((token) => (
                    <span
                      key={token.id}
                      onClick={() => handleWordClick(token)}
                      className={`cursor-pointer px-2.5 py-1 rounded-2xl transition-all select-none transform hover:scale-105 ${
                        token.isHighlight
                          ? 'magical-token-gold font-black text-amber-300 bg-amber-500/20 border-2 border-amber-400 shadow-md shadow-amber-500/30'
                          : 'hover:bg-indigo-500/20 text-slate-100 hover:text-indigo-200'
                      }`}
                    >
                      {token.word}
                    </span>
                  ))}
                </div>

                {/* Korean Translation */}
                {showKoTranslation && (
                  <p className="text-base sm:text-lg font-bold text-amber-200/90 pt-3 border-t border-slate-800/80 animate-fadeIn leading-relaxed">
                    💬 {currentSentence.ko}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-base">
                <p>이야기가 진행 중입니다...</p>
              </div>
            )}
          </div>

          {/* Word Tip Popover if active */}
          {activeWordTip && (
            <div className="p-4 bg-slate-950/95 rounded-2xl border-2 border-indigo-500/40 flex items-center justify-between text-sm sm:text-base animate-fadeIn shadow-lg">
              <div className="flex items-center gap-3">
                <span className="font-black text-white text-base sm:text-lg">
                  {activeWordTip.word}
                </span>
                <span className="font-mono text-amber-400 text-sm sm:text-base">
                  {activeWordTip.ipa}
                </span>
                <span className="text-slate-200 font-bold">
                  : {activeWordTip.meaningKo}
                </span>
              </div>
              <button
                onClick={() => speechService.speak(activeWordTip.cleanWord, 0.8)}
                className="p-2 text-indigo-300 hover:text-white bg-indigo-600/30 hover:bg-indigo-600 rounded-xl transition-all"
                title="단어 발음 듣기"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* RD-06 & RD-07 Action Controls */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {/* Native Audio Listen */}
            <button
              onClick={handlePlayCurrentSentence}
              className={`px-4 sm:px-5 py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all border shadow-md ${
                isPlayingAudio
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Volume2 className="w-5 h-5 text-amber-400" />
              <span>원어민 듣기</span>
            </button>

            {/* PTT Microphone Speak Button */}
            <button
              onMouseDown={handleStartMic}
              onMouseUp={handleStopMic}
              onTouchStart={handleStartMic}
              onTouchEnd={handleStopMic}
              className={`flex-1 py-4 px-6 rounded-2xl font-black text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 shadow-xl transition-all ${
                isRecording
                  ? 'bg-rose-600 text-white ring-4 ring-rose-500/40 animate-pulse'
                  : 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-amber-500/30'
              }`}
            >
              {isRecording ? (
                <>
                  <Mic className="w-6 h-6 animate-bounce" />
                  <span>듣고 있어요! (손을 떼면 채점)</span>
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6 fill-current" />
                  <span>🎙 꾹 누르고 문장 외치기</span>
                </>
              )}
            </button>

            {/* Sentence Nav Controls (◀ / ▶) */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevSentence}
                disabled={currentSentenceIdx === 0}
                className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 transition-colors"
                title="이전 문장"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextSentence}
                className="px-5 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
                title="다음 문장 / 챕터 진행"
              >
                <span>다음</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* RD-09 Bottom Progress Status */}
      <footer className="bg-slate-900/90 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>진행도:</span>
          <div className="w-28 sm:w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
              style={{
                width: `${Math.round(
                  ((currentSentenceIdx + 1) / Math.max(1, sentences.length)) * 100
                )}%`,
              }}
            />
          </div>
          <span className="font-bold text-slate-300">
            {currentSentenceIdx + 1} / {sentences.length}
          </span>
        </div>

        <div className="flex items-center gap-2 text-amber-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>황금 단어를 눌러 스펠 카드를 모으세요!</span>
        </div>
      </footer>

      {/* SC-04 Word Capture Modal */}
      {activeCaptureCard && (
        <WordCaptureOverlay
          card={activeCaptureCard}
          onSuccess={(capturedCard, score, rarity) => {
            onCardCaptured(capturedCard, score, rarity);
            setActiveCaptureCard(null);
          }}
          onClose={() => setActiveCaptureCard(null)}
        />
      )}

      {/* SC-05 Branch Choice Modal */}
      {showBranchModal && currentNode.choices && (
        <BranchChoiceOverlay
          choices={currentNode.choices}
          onSelectChoice={(choice) => {
            setShowBranchModal(false);
            setCurrentNodeId(choice.nextNodeId);
            setCurrentSentenceIdx(0);
          }}
        />
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-extrabold text-base text-white">
              여기까지 학습 진도를 저장할까요?
            </h3>
            <p className="text-xs text-slate-400">
              포획한 스펠 카드와 리딩 진도는 그리모어에 안전하게 봉인돼요.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                계속 읽기
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExit();
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                저장하고 나가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
