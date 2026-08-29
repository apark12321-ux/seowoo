import React, { useState, useMemo } from 'react';
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
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
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

const ITEMS_PER_PAGE = 12;

export const BookLibrary: React.FC<BookLibraryProps> = ({
  books,
  profile,
  onSelectChapter,
  onOpenPaywall,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedArRange, setSelectedArRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recommend' | 'ar_asc' | 'ar_desc' | 'branches' | 'title'>('recommend');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        if (selectedGenre !== 'all' && book.genre !== selectedGenre) return false;
        if (selectedArRange === '0.8-1.9' && (book.arLevel < 0.8 || book.arLevel >= 2.0)) return false;
        if (selectedArRange === '2.0-2.9' && (book.arLevel < 2.0 || book.arLevel >= 3.0)) return false;
        if (selectedArRange === '3.0-3.9' && (book.arLevel < 3.0 || book.arLevel >= 4.0)) return false;
        if (selectedArRange === '4.0+' && book.arLevel < 4.0) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            book.title.toLowerCase().includes(q) ||
            book.titleKo.toLowerCase().includes(q) ||
            book.author.toLowerCase().includes(q) ||
            book.synopsisKo.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'ar_asc') return a.arLevel - b.arLevel;
        if (sortBy === 'ar_desc') return b.arLevel - a.arLevel;
        if (sortBy === 'branches') return b.branchCount - a.branchCount;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        // Default: Recommended (closer to user AR level first)
        const diffA = Math.abs(a.arLevel - profile.arLevel);
        const diffB = Math.abs(b.arLevel - profile.arLevel);
        return diffA - diffB;
      });
  }, [books, selectedGenre, selectedArRange, searchQuery, sortBy, profile.arLevel]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredBooks.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedBooks = useMemo(() => {
    const startIdx = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredBooks.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredBooks, safeCurrentPage]);

  const handlePageChange = (page: number) => {
    soundEngine.playClick();
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getMatchBadge = (bookAr: number) => {
    const diff = Math.abs(bookAr - profile.arLevel);
    if (diff <= 0.3) {
      return { label: '🎯 딱맞는 레벨', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    } else if (bookAr > profile.arLevel) {
      return { label: '🔥 도전 레벨 (+)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
    }
    return { label: '✨ 자신감 쑥쑥 (-)', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <BookOpen className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-100">
                  마법 원서 대도서관 (100 Readers)
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md">
                  총 {books.length}권 보유
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                내 발음으로 스토리를 선택하고, 단어를 포획하며 영어 원서를 완독하세요. (서우 권장 AR: {profile.arLevel})
              </p>
            </div>
          </div>
        </div>

        {/* Search Input & Sort */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="원서 제목, 작가, 키워드 검색..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-2xl text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={sortBy}
              onChange={(e) => {
                soundEngine.playClick();
                setSortBy(e.target.value as any);
              }}
              className="bg-transparent border-none text-slate-200 text-xs font-bold focus:outline-none cursor-pointer"
            >
              <option value="recommend" className="bg-slate-900 text-white">추천순 (내 레벨)</option>
              <option value="ar_asc" className="bg-slate-900 text-white">AR 레벨 낮은순</option>
              <option value="ar_desc" className="bg-slate-900 text-white">AR 레벨 높은순</option>
              <option value="branches" className="bg-slate-900 text-white">분기/엔딩 많은순</option>
              <option value="title" className="bg-slate-900 text-white">제목 알파벳순</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          {/* Genre tabs */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto no-scrollbar">
            <span className="px-2 text-slate-400 font-semibold whitespace-nowrap">장르:</span>
            {[
              { key: 'all', label: '전체' },
              { key: 'fantasy', label: '판타지' },
              { key: 'adventure', label: '모험' },
              { key: 'mystery', label: '추리' },
              { key: 'classic', label: '고전' },
              { key: 'nonfiction', label: '과학/지식' },
            ].map((g) => (
              <button
                key={g.key}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedGenre(g.key);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap shrink-0 ${
                  selectedGenre === g.key
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          {/* AR Range tabs */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto no-scrollbar">
            <span className="px-2 text-slate-400 font-semibold whitespace-nowrap">AR 레벨:</span>
            {[
              { key: 'all', label: '전체' },
              { key: '0.8-1.9', label: 'AR 0.8~1.9' },
              { key: '2.0-2.9', label: 'AR 2.0~2.9' },
              { key: '3.0-3.9', label: 'AR 3.0~3.9' },
              { key: '4.0+', label: 'AR 4.0+' },
            ].map((range) => (
              <button
                key={range.key}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedArRange(range.key);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all whitespace-nowrap shrink-0 ${
                  selectedArRange === range.key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick counter */}
        <div className="text-xs text-slate-400 font-medium">
          검색된 원서: <span className="font-bold text-amber-400">{filteredBooks.length}</span>권 / 페이지 <span className="font-bold text-white">{safeCurrentPage}</span> of {totalPages}
        </div>
      </div>

      {/* Book Grid */}
      {paginatedBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginatedBooks.map((book) => {
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
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border shadow-sm ${match.color}`}>
                      {match.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-amber-300 border border-slate-700">
                      AR {book.arLevel} · {book.lexile}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3">
                    <span className="text-[11px] font-bold text-amber-400 block truncate">
                      {book.titleKo}
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold text-white line-clamp-1">
                      {book.title}
                    </h3>
                  </div>
                </div>

                {/* Body stats */}
                <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {book.synopsisKo}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
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
                <div className="px-3.5 pb-3.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundEngine.playClick();
                      onSelectChapter(book.id, book.chapters[0].id);
                    }}
                    className="w-full py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-indigo-500/30 hover:border-indigo-600 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>제1장 시작하기</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center bg-slate-900/50 rounded-3xl border border-slate-800 space-y-3">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-bold text-slate-300">검색 조건에 맞는 원서가 없습니다.</p>
          <button
            onClick={() => {
              setSelectedGenre('all');
              setSelectedArRange('all');
              setSearchQuery('');
              setCurrentPage(1);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
          >
            필터 초기화
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            disabled={safeCurrentPage === 1}
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="이전 페이지"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              // Show first, last, and window around current page
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= safeCurrentPage - 2 && pageNum <= safeCurrentPage + 2)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-xl font-bold text-xs transition-all ${
                      safeCurrentPage === pageNum
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (
                pageNum === safeCurrentPage - 3 ||
                pageNum === safeCurrentPage + 3
              ) {
                return (
                  <span key={pageNum} className="px-1 text-slate-500 text-xs">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            disabled={safeCurrentPage === totalPages}
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="다음 페이지"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

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
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
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
                  const isUnlocked = profile.unlockedChapters.includes(chapter.id) || chapter.seq === 1;
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
