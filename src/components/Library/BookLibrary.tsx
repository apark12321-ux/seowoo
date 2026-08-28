import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Search,
  Filter,
  Play,
  GitFork,
  CheckCircle2,
  Lock,
  Layers,
  Clock,
  X,
} from 'lucide-react';
import { Book, Chapter, UserChildProfile } from '../../types';
import { soundEngine } from '../../utils/soundEngine';
import { ALL_SPELL_CARDS } from '../../data/spellCards';

interface BookLibraryProps {
  books: Book[];
  profile: UserChildProfile;
  onSelectChapter: (bookId: string, chapterId: string) => void;
  onOpenPaywall: () => void;
}

export const BookLibrary: React.FC<BookLibraryProps> = ({
  books,
  profile,
  onSelectChapter,
  onOpenPaywall,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedArRange, setSelectedArRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filteredBooks = books.filter((book) => {
    if (selectedGenre !== 'all' && book.genre !== selectedGenre) return false;
    if (selectedArRange === '1.0-1.9' && (book.arLevel < 1.0 || book.arLevel >= 2.0)) return false;
    if (selectedArRange === '2.0-2.9' && (book.arLevel < 2.0 || book.arLevel >= 3.0)) return false;
    if (selectedArRange === '3.0+' && book.arLevel < 3.0) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        book.title.toLowerCase().includes(q) ||
        book.titleKo.toLowerCase().includes(q) ||
        book.author.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getMatchBadge = (bookAr: number) => {
    const diff = Math.abs(bookAr - profile.arLevel);
    if (diff <= 0.3) {
      return { label: '딱맞는 레벨', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    } else if (bookAr > profile.arLevel) {
      return { label: '도전 레벨 (+)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    }
    return { label: '자신감 쑥쑥 (-)', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100">
              마법 원서 서재 (Library)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            내 목소리로 스토리를 선택하고, 단어를 포획하며 영어 원서를 완독하세요.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="원서 제목, 작가 검색..."
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs shrink-0 overflow-x-auto no-scrollbar">
          <span className="px-2 text-slate-400 font-semibold whitespace-nowrap">장르:</span>
          {['all', 'fantasy', 'adventure', 'classic'].map((genre) => (
            <button
              key={genre}
              onClick={() => {
                soundEngine.playClick();
                setSelectedGenre(genre);
              }}
              className={`px-3 py-1 rounded-lg capitalize font-bold transition-all whitespace-nowrap shrink-0 ${
                selectedGenre === genre
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {genre === 'all'
                ? '전체'
                : genre === 'fantasy'
                ? '판타지'
                : genre === 'adventure'
                ? '모험'
                : '고전'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs shrink-0 overflow-x-auto no-scrollbar">
          <span className="px-2 text-slate-400 font-semibold whitespace-nowrap">AR 레벨:</span>
          {['all', '1.0-1.9', '2.0-2.9', '3.0+'].map((range) => (
            <button
              key={range}
              onClick={() => {
                soundEngine.playClick();
                setSelectedArRange(range);
              }}
              className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap shrink-0 ${
                selectedArRange === range
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range === 'all' ? '전체' : range}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => {
          const match = getMatchBadge(book.arLevel);
          return (
            <div
              key={book.id}
              onClick={() => {
                soundEngine.playClick();
                setSelectedBook(book);
              }}
              className="bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              {/* Cover & Badges */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border shadow-sm ${match.color}`}>
                    {match.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-amber-300 border border-slate-700">
                    AR {book.arLevel} · {book.lexile}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="text-xs font-bold text-amber-400">
                    {book.titleKo}
                  </span>
                  <h3 className="text-base font-extrabold text-white line-clamp-1">
                    {book.title}
                  </h3>
                </div>
              </div>

              {/* Body stats */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {book.synopsisKo}
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{book.chapters.length}개 챕터</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-3.5 h-3.5 text-purple-400" />
                    <span>분기 {book.branchCount}개 · 엔딩 {book.endingCount}종</span>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <div className="px-4 pb-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundEngine.playClick();
                    onSelectChapter(book.id, book.chapters[0].id);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-indigo-500/30 hover:border-indigo-600 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>제1장 시작하기</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Book Detail Modal (SC-02-1) */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4">
                <img
                  src={selectedBook.coverUrl}
                  alt={selectedBook.title}
                  className="w-24 h-32 object-cover rounded-2xl border border-slate-800 flex-shrink-0 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-amber-400">
                      AR {selectedBook.arLevel} · {selectedBook.lexile}
                    </span>
                    <span className="text-xs text-slate-400">
                      {selectedBook.author}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-white">
                    {selectedBook.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    {selectedBook.titleKo}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3">
                    {selectedBook.synopsisKo}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedBook(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chapters List */}
            <div className="space-y-3 pt-2">
              <h4 className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>챕터 목록 & 포획 대상 스펠 카드</span>
              </h4>

              <div className="space-y-2.5">
                {selectedBook.chapters.map((chapter) => {
                  const isUnlocked = profile.unlockedChapters.includes(chapter.id);
                  return (
                    <div
                      key={chapter.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                        isUnlocked
                          ? 'bg-slate-950/70 border-slate-800'
                          : 'bg-slate-950/40 border-slate-800/50 opacity-70'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-indigo-400">
                            제{chapter.seq}장
                          </span>
                          <span className="text-xs font-bold text-white">
                            {chapter.titleKo}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({chapter.title})
                          </span>
                        </div>

                        {/* Spell Cards chips */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-slate-400">포획 스펠:</span>
                          {chapter.targetWords.map((cardId) => {
                            const card = ALL_SPELL_CARDS[cardId];
                            if (!card) return null;
                            return (
                              <span
                                key={cardId}
                                className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20"
                              >
                                {card.word} ({card.meaningKo})
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        {isUnlocked ? (
                          <button
                            onClick={() => {
                              soundEngine.playClick();
                              setSelectedBook(null);
                              onSelectChapter(selectedBook.id, chapter.id);
                            }}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>플레이</span>
                          </button>
                        ) : (
                          <button
                            onClick={onOpenPaywall}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs flex items-center gap-1"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>해금</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
