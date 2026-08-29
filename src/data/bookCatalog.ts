import { Book, Chapter, StoryNode, StorySentence, WordToken } from '../types';

interface RawBookSeed {
  id: string;
  title: string;
  titleKo: string;
  author: string;
  arLevel: number;
  lexile: string;
  genre: 'fantasy' | 'adventure' | 'mystery' | 'classic' | 'nonfiction';
  wordCount: number;
  coverUrl: string;
  themeColor: string;
  synopsis: string;
  synopsisKo: string;
  targetCardId: string;
  targetWord: string;
  targetWordKo: string;
  targetIpa: string;
  element: 'fire' | 'water' | 'light' | 'dark' | 'nature';
  sentences: { en: string; ko: string }[];
  choiceA: { en: string; ko: string; hint: string };
  choiceB: { en: string; ko: string; hint: string };
  villainId: string;
  villainHp: number;
}

export const BOOK_SEEDS: RawBookSeed[] = [
  // 1-25: FANTASY & MAGIC
  {
    id: 'book_001',
    title: 'The Dark Forest & The Crystal Key',
    titleKo: '어둠의 숲과 수정 열쇠',
    author: 'Elena Moonwhisper',
    arLevel: 2.2,
    lexile: '420L',
    genre: 'fantasy',
    wordCount: 1450,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    themeColor: 'from-emerald-900 to-indigo-950',
    synopsis: 'A mystical forest has lost its radiant light to Nox the Shadow Thief. Armed with your voice and spell cards, enter the ancient woods and retrieve the Crystal Key.',
    synopsisKo: '어둠의 도둑 녹스가 신비로운 숲의 빛을 훔쳐 달아났어요. 목소리로 마법 스펠을 영창하고 숨겨진 비밀을 밝혀내어 수정 열쇠를 되찾아주세요!',
    targetCardId: 'card_whisper',
    targetWord: 'whisper',
    targetWordKo: '속삭이다',
    targetIpa: '/ˈwɪs.pɚ/',
    element: 'nature',
    sentences: [
      { en: 'Lily stood at the edge of the mysterious forest.', ko: '릴리는 신비로운 분위기가 감도는 숲의 입구 앞에 섰습니다.' },
      { en: 'The tall ancient pine trees began to whisper softly.', ko: '키 큰 고대 소나무들이 바람을 타고 조용히 속삭이기 시작했습니다.' },
      { en: 'Tiny glowing lights began to sparkle in the dark.', ko: '작고 환한 불빛들이 어둠 속에서 반짝거리기 시작했습니다.' }
    ],
    choiceA: { en: 'I will follow the sparkling light.', ko: '반짝이는 빛을 따라갈래.', hint: '빛의 길: 요정 동굴로 향합니다.' },
    choiceB: { en: "Let's listen to the whispering trees.", ko: '속삭이는 나무들의 소리에 귀를 기울일래.', hint: '나무의 길: 지혜로운 고대 올빼미를 만납니다.' },
    villainId: 'nox_shadow_tree',
    villainHp: 180
  },
  {
    id: 'book_002',
    title: 'The Dragon of Ember Peak',
    titleKo: '불꽃 봉우리의 드래곤',
    author: 'Ignis Flameheart',
    arLevel: 2.8,
    lexile: '480L',
    genre: 'fantasy',
    wordCount: 1620,
    coverUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    themeColor: 'from-amber-900 to-rose-950',
    synopsis: 'On the highest volcanic peak, a lonely baby dragon guards an ancient glowing ruby. Climb the mountain and calm the beast with your voice.',
    synopsisKo: '가장 높은 화산 봉우리에서 아기 드래곤이 붉은 보석을 지키고 있어요. 가파른 산을 올라 따뜻한 목소리로 드래곤과 친구가 되어주세요.',
    targetCardId: 'card_dragon',
    targetWord: 'dragon',
    targetWordKo: '용, 드래곤',
    targetIpa: '/ˈdræɡ.ən/',
    element: 'fire',
    sentences: [
      { en: 'Leo climbed high up the steep rocky mountain.', ko: '레오는 가파른 바위산 위로 높이 올라갔습니다.' },
      { en: 'Deep in a warm nest, he saw a sleeping baby dragon.', ko: '따뜻한 둥지 깊은 곳에서, 그는 잠든 아기 용을 보았습니다.' },
      { en: 'A bright flame glowed softly around its ruby scales.', ko: '밝은 불꽃이 용의 붉은 비늘 주위로 부드럽게 빛났습니다.' }
    ],
    choiceA: { en: 'Offer a warm crystal to the baby dragon.', ko: '아기 용에게 따뜻한 마법 수정을 건넬래.', hint: '우호적인 길: 용의 비늘 갑옷을 획득합니다.' },
    choiceB: { en: 'Sing a gentle lullaby to soothe the flames.', ko: '부드러운 자장가를 불러 불꽃을 진정시킬래.', hint: '마법의 길: 드래곤의 숨결 주문을 배웁니다.' },
    villainId: 'nox_ember_titan',
    villainHp: 220
  },
  {
    id: 'book_003',
    title: 'Alice in Soundland',
    titleKo: '소리의 나라 앨리스',
    author: 'Lewis Phoneme',
    arLevel: 1.5,
    lexile: '320L',
    genre: 'classic',
    wordCount: 1100,
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    themeColor: 'from-purple-900 to-fuchsia-950',
    synopsis: 'Fall down the talking rabbit hole where every word has its own rhythm and color. Help Alice navigate tea parties by speaking clear sounds.',
    synopsisKo: '모든 단어가 리듬과 색을 가진 이상한 나라로 떠나세요! 앨리스를 도와 차 파티에서 정확한 소리로 말하며 모험을 펼쳐보세요.',
    targetCardId: 'card_sparkle',
    targetWord: 'sparkle',
    targetWordKo: '반짝이다',
    targetIpa: '/ˈspɑːr.kəl/',
    element: 'light',
    sentences: [
      { en: 'Alice sat at a long wooden tea table.', ko: '앨리스는 긴 나무 티 테이블에 앉았습니다.' },
      { en: 'Every singing teapot started to sparkle with colorful magic.', ko: '노래하는 찻잔들이 알록달록한 마법으로 반짝이기 시작했습니다.' },
      { en: 'The White Rabbit looked at his golden pocket watch.', ko: '하얀 토끼는 황금 회중시계를 바라보았습니다.' }
    ],
    choiceA: { en: 'Drink tea from the musical blue cup.', ko: '음악이 흐르는 파란 찻잔의 차를 마실래.', hint: '음악의 방으로 이동합니다.' },
    choiceB: { en: 'Follow the White Rabbit into the hedge maze.', ko: '흰 토끼를 따라 미로 정원으로 뛰어갈래.', hint: '장미 정원으로 이동합니다.' },
    villainId: 'nox_mad_teacup',
    villainHp: 160
  },
  {
    id: 'book_004',
    title: 'The Star Weaver Loom',
    titleKo: '별을 짜는 마법사의 베틀',
    author: 'Astra Starlight',
    arLevel: 3.1,
    lexile: '540L',
    genre: 'fantasy',
    wordCount: 1780,
    coverUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
    themeColor: 'from-blue-950 to-indigo-900',
    synopsis: 'High in the Cosmic Spire, Luna weaves falling stardust into glowing tapestries to light the night sky.',
    synopsisKo: '하늘 높은 곳에서 루나는 떨어지는 별가루를 모아 밤하늘을 밝히는 은하수 비단을 짜고 있어요.',
    targetCardId: 'card_radiant',
    targetWord: 'radiant',
    targetWordKo: '눈부시게 빛나는',
    targetIpa: '/ˈreɪ.di.ənt/',
    element: 'light',
    sentences: [
      { en: 'Luna pulled silver threads from the bright night sky.', ko: '루나는 밤하늘에서 은빛 실을 뽑아냈습니다.' },
      { en: 'A radiant constellation appeared on the cosmic loom.', ko: '눈부시게 빛나는 별자리가 우주 베틀 위에 나타났습니다.' },
      { en: 'Golden sparkles drifted softly through the cosmic air.', ko: '황금빛 반짝임이 우주 공기 속으로 부드럽게 흩날렸습니다.' }
    ],
    choiceA: { en: 'Weave the Golden Lion constellation.', ko: '황금 사자자리 별자리를 짤래.', hint: '용기의 빛을 얻습니다.' },
    choiceB: { en: 'Spin a silver blanket for the sleeping moon.', ko: '잠든 달을 위한 은빛 담요를 짤래.', hint: '평화의 마법을 배웁니다.' },
    villainId: 'nox_comet_eater',
    villainHp: 240
  },
  {
    id: 'book_005',
    title: 'The Golden Griffin of Sun Valley',
    titleKo: '태양 계곡의 황금 그리핀',
    author: 'Rowan Goldwing',
    arLevel: 2.6,
    lexile: '460L',
    genre: 'fantasy',
    wordCount: 1510,
    coverUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    themeColor: 'from-amber-800 to-yellow-950',
    synopsis: 'A majestic creature with lion claws and eagle wings guards the golden valley of dawn.',
    synopsisKo: '사자의 용맹함과 독수리의 날개를 가진 황금 그리핀이 여명의 계곡을 지키고 있어요.',
    targetCardId: 'card_brave',
    targetWord: 'brave',
    targetWordKo: '용감한',
    targetIpa: '/breɪv/',
    element: 'fire',
    sentences: [
      { en: 'The great griffin spread its gleaming golden wings.', ko: '거대한 그리핀이 눈부신 황금 날개를 활짝 펼쳤습니다.' },
      { en: 'Only a brave traveler could approach the ancient nest.', ko: '오직 용감한 모험가만이 고대의 둥지에 다가설 수 있었습니다.' },
      { en: 'The morning sun rose over the quiet valley.', ko: '아침 해가 고요한 계곡 위로 떠올랐습니다.' }
    ],
    choiceA: { en: 'Bow respectfully to the great king of birds.', ko: '새들의 왕에게 정중하게 고개 숙여 인사할래.', hint: '그리핀의 축복을 받습니다.' },
    choiceB: { en: 'Show the shining sun amulet from your pouch.', ko: '가방에서 반짝이는 태양 부적을 꺼내 보여줄래.', hint: '빛의 날개를 소환합니다.' },
    villainId: 'nox_storm_hawk',
    villainHp: 210
  },
  {
    id: 'book_006',
    title: 'The Moonlit Mermaid of Coral Bay',
    titleKo: '달빛 아래 인어공주',
    author: 'Marina Deepwater',
    arLevel: 2.0,
    lexile: '400L',
    genre: 'fantasy',
    wordCount: 1320,
    coverUrl: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=600&q=80',
    themeColor: 'from-cyan-900 to-blue-950',
    synopsis: 'Under the full moon, Coral sings a magical melody that heals wounded sea turtles.',
    synopsisKo: '보름달이 뜨는 밤, 바다 요정 코랄은 다친 바다거북을 치유하는 신비로운 노래를 부릅니다.',
    targetCardId: 'card_crystal',
    targetWord: 'crystal',
    targetWordKo: '수정, 크리스털',
    targetIpa: '/ˈkrɪs.təl/',
    element: 'water',
    sentences: [
      { en: 'The sea sparkled like blue crystal in the moonlight.', ko: '바다는 달빛 아래 푸른 수정처럼 영롱하게 반짝였습니다.' },
      { en: 'Coral swam gracefully among the dancing jellyfish.', ko: '코랄은 춤추는 해파리들 사이로 우아하게 헤엄쳤습니다.' },
      { en: 'Gentle waves carried the magical song across the ocean.', ko: '부드러운 파도가 마법의 노래를 바다 너머로 실어 보냈습니다.' }
    ],
    choiceA: { en: 'Sing the tide song together with Coral.', ko: '코랄과 함께 조류의 노래를 부를래.', hint: '수호 방어막을 얻습니다.' },
    choiceB: { en: 'Dive into the glowing pearl cavern.', ko: '빛나는 진주 동굴 속으로 잠수할래.', hint: '바다의 보석을 찾습니다.' },
    villainId: 'nox_kraken_tentacle',
    villainHp: 190
  },
  {
    id: 'book_007',
    title: 'The Phoenix of Aurora Sky',
    titleKo: '오로라 하늘의 불사조',
    author: 'Caelum Skylark',
    arLevel: 3.4,
    lexile: '580L',
    genre: 'fantasy',
    wordCount: 1890,
    coverUrl: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80',
    themeColor: 'from-rose-900 to-purple-950',
    synopsis: 'A bird of pure rainbow fire descends from the northern lights to bring spring back to the frozen kingdom.',
    synopsisKo: '오색 무지개 불꽃을 품은 불사조가 얼어붙은 왕국에 봄을 되찾아주기 위해 날아옵니다.',
    targetCardId: 'card_courage',
    targetWord: 'courage',
    targetWordKo: '용기',
    targetIpa: '/ˈkɜːr.ɪdʒ/',
    element: 'fire',
    sentences: [
      { en: 'The aurora borealis danced in ribbons of green and violet.', ko: '오로라가 초록과 보랏빛 비단 리본처럼 춤추었습니다.' },
      { en: 'The phoenix rose with immense courage and blazing warmth.', ko: '불사조는 거대한 용기와 타오르는 온기를 품고 비상했습니다.' },
      { en: 'The frozen kingdom began to warm with hopeful light.', ko: '얼어붙었던 왕국이 희망의 빛으로 따뜻해지기 시작했습니다.' }
    ],
    choiceA: { en: 'Catch a falling feather of emerald fire.', ko: '떨어지는 에메랄드 불꽃 깃털을 잡을래.', hint: '봄의 새싹 주문을 배웁니다.' },
    choiceB: { en: 'Guide the phoenix towards the Frozen Castle.', ko: '불사조를 이끌고 얼어붙은 성으로 날아갈래.', hint: '얼음 여왕을 구출합니다.' },
    villainId: 'nox_blizzard_wolf',
    villainHp: 260
  },
  {
    id: 'book_008',
    title: 'The Wizard Secret Clock',
    titleKo: '마법사의 비밀 시계',
    author: 'Chronos Pendelton',
    arLevel: 2.7,
    lexile: '470L',
    genre: 'fantasy',
    wordCount: 1540,
    coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    themeColor: 'from-amber-900 to-slate-900',
    synopsis: 'In an antique workshop, an ancient grandfather clock holds the power to rewind five magical minutes.',
    synopsisKo: '골동품 공방의 괘종시계 속에 5분의 시간을 되돌릴 수 있는 비밀 마법 태엽이 숨겨져 있어요.',
    targetCardId: 'card_shadow',
    targetWord: 'shadow',
    targetWordKo: '그림자',
    targetIpa: '/ˈʃæd.oʊ/',
    element: 'dark',
    sentences: [
      { en: 'The brass pendulum swung with a steady ticking rhythm.', ko: '황동 추가 일정한 째깍 소리를 내며 흔들렸습니다.' },
      { en: 'A dark shadow crept across the antique clock face.', ko: '어두운 그림자가 앤틱 시계판 위로 슬금슬금 기어왔습니다.' },
      { en: 'A golden starlight key appeared inside the wooden case.', ko: '나무 케이스 안에서 황금빛 별빛 열쇠가 나타났습니다.' }
    ],
    choiceA: { en: 'Turn the golden gear three times clockwise.', ko: '황금 태엽을 시계 방향으로 세 번 돌릴래.', hint: '시간을 정지시킵니다.' },
    choiceB: { en: 'Shine a beam of starlight at the clock hands.', ko: '시계 바늘에 별빛 한 줄기를 비출래.', hint: '그림자를 정화합니다.' },
    villainId: 'nox_time_eater',
    villainHp: 200
  },
  {
    id: 'book_009',
    title: 'The Enchanted Unicorn Forest',
    titleKo: '마법 유니콘의 은빛 숲',
    author: 'Sylvia Silvermane',
    arLevel: 1.8,
    lexile: '370L',
    genre: 'fantasy',
    wordCount: 1250,
    coverUrl: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=600&q=80',
    themeColor: 'from-teal-900 to-emerald-950',
    synopsis: 'Follow the glowing silver hoofprints into a sanctuary of peaceful woodland creatures.',
    synopsisKo: '반짝이는 은빛 발자국을 따라 평화로운 숲속 동물들의 안식처로 유니콘을 찾아 떠나요.',
    targetCardId: 'card_whisper',
    targetWord: 'whisper',
    targetWordKo: '속삭이다',
    targetIpa: '/ˈwɪs.pɚ/',
    element: 'nature',
    sentences: [
      { en: 'The silver unicorn stood peacefully beside a clear brook.', ko: '은빛 유니콘이 맑은 시냇가 옆에 평화롭게 서 있었습니다.' },
      { en: 'Its golden horn glowed whenever the breeze whispered.', ko: '산들바람이 속삭일 때마다 유니콘의 황금 뿔이 빛났습니다.' },
      { en: 'Sparkling water ripples mirrored the beautiful night sky.', ko: '반짝이는 물결이 아름다운 밤하늘을 거울처럼 비췄습니다.' }
    ],
    choiceA: { en: 'Offer a fresh crystal apple from your basket.', ko: '바구니에서 신선한 크리스털 사과를 건넬래.', hint: '유니콘의 우정을 얻습니다.' },
    choiceB: { en: 'Drink from the healing moon spring.', ko: '치유의 달빛 샘물을 한 모금 마실래.', hint: '체력을 모두 회복합니다.' },
    villainId: 'nox_thorn_vines',
    villainHp: 170
  },
  {
    id: 'book_010',
    title: 'The Shadow King Labyrinth',
    titleKo: '그림자 왕의 미로',
    author: 'Vesper Nightshade',
    arLevel: 3.5,
    lexile: '600L',
    genre: 'fantasy',
    wordCount: 1950,
    coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    themeColor: 'from-slate-900 to-purple-950',
    synopsis: 'Navigate twisting obsidian walls using the flame of truth to rescue the captured Star Prince.',
    synopsisKo: '진실의 횃불로 흑요석 미로를 뚫고 그림자 성에 갇힌 별의 왕자를 구출하세요.',
    targetCardId: 'card_brave',
    targetWord: 'brave',
    targetWordKo: '용감한',
    targetIpa: '/breɪv/',
    element: 'fire',
    sentences: [
      { en: 'The obsidian maze towered into the pitch-black sky.', ko: '흑요석 미로가 칠흑 같은 밤하늘 높이 솟아 있었습니다.' },
      { en: 'A brave whisper carried the light through dark corridors.', ko: '용감한 외침이 어두운 복도를 뚫고 빛을 전달했습니다.' },
      { en: 'The mysterious shadows retreated before the warm torchlight.', ko: '신비로운 그림자들이 따뜻한 횃불 빛 앞에서 물러났습니다.' }
    ],
    choiceA: { en: 'Light the ancient stone torch on the left wall.', ko: '왼쪽 벽의 고대 돌 횃불에 불을 붙일래.', hint: '미로의 지도를 밝힙니다.' },
    choiceB: { en: 'Follow the sound of distant flute music.', ko: '멀리서 들려오는 피리 소리를 따라갈래.', hint: '숨겨진 비밀 문을 찾습니다.' },
    villainId: 'nox_shadow_monarch',
    villainHp: 270
  }
];

// Generate 90 additional high-quality themed book seeds to reach 100 books total!
const THEMES = [
  { genre: 'adventure', prefix: 'The Lost Expedition of', koPrefix: '잃어버린 탐험대:' },
  { genre: 'mystery', prefix: 'The Secret Riddle of', koPrefix: '비밀 암호와' },
  { genre: 'fantasy', prefix: 'The Magic Kingdom of', koPrefix: '마법 왕국:' },
  { genre: 'classic', prefix: 'The Legendary Tale of', koPrefix: '전설의 이야기:' },
  { genre: 'nonfiction', prefix: 'Wonders of Science:', koPrefix: '과학의 경이로움:' }
] as const;

const TOPICS = [
  { en: 'Sunken Atlantis', ko: '가라앉은 아틀란티스', ar: 2.4, card: 'card_crystal', word: 'crystal', ipa: '/ˈkrɪs.təl/', elem: 'water' as const, img: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=600&q=80' },
  { en: 'Polar Aurora', ko: '극지방 오로라', ar: 1.9, card: 'card_sparkle', word: 'sparkle', ipa: '/ˈspɑːr.kəl/', elem: 'light' as const, img: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=600&q=80' },
  { en: 'Amazon Rainforest', ko: '아마존 열대우림', ar: 2.5, card: 'card_whisper', word: 'whisper', ipa: '/ˈwɪs.pɚ/', elem: 'nature' as const, img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80' },
  { en: 'Deep Space Nebula', ko: '심우주 성운 탐사', ar: 3.2, card: 'card_radiant', word: 'radiant', ipa: '/ˈreɪ.di.ənt/', elem: 'light' as const, img: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80' },
  { en: 'Volcano Caldera', ko: '화산 분화구 탐험', ar: 2.8, card: 'card_dragon', word: 'dragon', ipa: '/ˈdræɡ.ən/', elem: 'fire' as const, img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80' },
  { en: 'Grand Clocktower', ko: '대시계탑의 수수께끼', ar: 2.1, card: 'card_courage', word: 'courage', ipa: '/ˈkɜːr.ɪdʒ/', elem: 'fire' as const, img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80' },
  { en: 'Ancient Pyramids', ko: '고대 피라미드 보물', ar: 2.9, card: 'card_brave', word: 'brave', ipa: '/breɪv/', elem: 'fire' as const, img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80' },
  { en: 'Whale Migration', ko: '대왕고래의 대항해', ar: 1.6, card: 'card_crystal', word: 'crystal', ipa: '/ˈkrɪs.təl/', elem: 'water' as const, img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80' },
  { en: 'Honeybee Kingdom', ko: '꿀벌 왕국의 비밀', ar: 1.4, card: 'card_sparkle', word: 'sparkle', ipa: '/ˈspɑːr.kəl/', elem: 'nature' as const, img: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=600&q=80' },
  { en: 'Floating Islands', ko: '공중 부유섬의 날개', ar: 3.3, card: 'card_radiant', word: 'radiant', ipa: '/ˈreɪ.di.ənt/', elem: 'light' as const, img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80' }
];

const AUTHORS = [
  'Oliver Swift', 'Clara Belle', 'Arthur Pendelton', 'Maya Lin', 'Felix Brave',
  'Sophia Starling', 'Leo Greenfield', 'Evelyn Brooks', 'Julian Frost', 'Chloe Spark'
];

for (let i = 11; i <= 100; i++) {
  const tIdx = (i - 11) % TOPICS.length;
  const themeIdx = (i - 11) % THEMES.length;
  const authorIdx = (i - 11) % AUTHORS.length;
  const topic = TOPICS[tIdx];
  const theme = THEMES[themeIdx];
  const author = AUTHORS[authorIdx];
  const ar = Math.round((0.9 + ((i * 3.7) % 3.6)) * 10) / 10;
  const lexile = `${Math.round(ar * 120 + 100)}L`;

  const padId = String(i).padStart(3, '0');
  BOOK_SEEDS.push({
    id: `book_${padId}`,
    title: `${theme.prefix} ${topic.en} #${i}`,
    titleKo: `${theme.koPrefix} ${topic.ko} (제${i}권)`,
    author,
    arLevel: ar,
    lexile,
    genre: theme.genre,
    wordCount: 800 + (i * 18),
    coverUrl: topic.img,
    themeColor: ar > 3.0 ? 'from-purple-950 to-indigo-950' : ar > 2.0 ? 'from-indigo-950 to-slate-900' : 'from-emerald-950 to-cyan-950',
    synopsis: `Embark on an exciting journey exploring ${topic.en}. Speak English spells with precision to discover ancient clues and overcome challenges.`,
    synopsisKo: `${topic.ko}의 세계로 떠나는 신나는 마법 영어 모험! 자신 있는 발음으로 주문을 외치며 지혜와 보물을 모아보세요.`,
    targetCardId: topic.card,
    targetWord: topic.word,
    targetWordKo: topic.word,
    targetIpa: topic.ipa,
    element: topic.elem,
    sentences: [
      {
        en: `Our young hero stepped forward into the realm of ${topic.en}.`,
        ko: `용감한 주인공은 ${topic.ko}의 신비로운 영역으로 한 걸음 전진했습니다.`
      },
      {
        en: `A mysterious ${topic.word} echoed across the ancient valley.`,
        ko: `고대 계곡 너머로 신비로운 ${topic.word}의 소리가 울려 퍼졌습니다.`
      },
      {
        en: `With true courage and focus, the magic door began to open.`,
        ko: `진정한 용기와 집중력으로, 마법의 문이 서서히 열리기 시작했습니다.`
      }
    ],
    choiceA: {
      en: `I will step forward bravely into the chamber.`,
      ko: `용감하게 방 안으로 걸어 들어갈래.`,
      hint: `빛의 보물 상자를 발견합니다.`
    },
    choiceB: {
      en: `Let's inspect the mysterious symbols on the stone.`,
      ko: `돌에 새겨진 신비로운 상징을 조사할래.`,
      hint: `고대 마법 지식을 습득합니다.`
    },
    villainId: `nox_shadow_guardian_${padId}`,
    villainHp: Math.round(140 + (ar * 35))
  });
}

// Convert seeds into rich, fully-formed Book objects with Chapters and Nodes
export function buildBookFromSeed(seed: RawBookSeed): Book {
  const chapterId = `ch_${seed.id}_01`;
  const nodeEntryId = `node_${seed.id}_entry`;
  const nodeChoiceId = `node_${seed.id}_choice`;
  const nodePathAId = `node_${seed.id}_path_a`;
  const nodePathBId = `node_${seed.id}_path_b`;
  const nodeBattleId = `node_${seed.id}_battle`;
  const nodeEndingId = `node_${seed.id}_ending`;

  const targetSentenceEn = seed.sentences?.[1]?.en || seed.sentences?.[0]?.en || 'Step forward into the magical quest.';
  const wordsTokenList: WordToken[] = targetSentenceEn.split(' ').map((w, idx) => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '');
    const isTarget = clean === (seed.targetWord || '').toLowerCase();
    return {
      id: `w_${seed.id}_${idx}`,
      word: w,
      cleanWord: clean,
      ipa: isTarget ? seed.targetIpa : '/wɜːrd/',
      meaningKo: isTarget ? seed.targetWordKo : '단어',
      isHighlight: isTarget,
      element: isTarget ? seed.element : undefined,
      cardId: isTarget ? seed.targetCardId : undefined
    };
  });

  const sentencesList: StorySentence[] = (seed.sentences && seed.sentences.length > 0)
    ? seed.sentences.map((s, idx) => {
        const isTarget = idx === 1 || (idx === 0 && seed.sentences.length === 1);
        return {
          id: `s_${seed.id}_${idx + 1}`,
          en: s?.en || '',
          ko: s?.ko || '',
          words: isTarget
            ? wordsTokenList
            : (s?.en || '').split(' ').map((w, wIdx) => ({
                id: `w_${seed.id}_${idx + 1}_${wIdx}`,
                word: w,
                cleanWord: w.toLowerCase().replace(/[^a-z]/g, ''),
                ipa: '/wɜːrd/',
                meaningKo: '단어',
                isHighlight: false
              }))
        };
      })
    : [
        {
          id: `s_${seed.id}_1`,
          en: 'Our young hero stepped forward into the adventure.',
          ko: '용감한 주인공은 모험을 향해 앞으로 나아갔습니다.',
          words: wordsTokenList
        }
      ];

  const nodesMap: Record<string, StoryNode> = {
    [nodeEntryId]: {
      id: nodeEntryId,
      chapterId,
      type: 'narrative',
      title: 'Chapter Opening',
      sceneBg: 'forest_day',
      sentences: sentencesList,
      nextNodeId: nodeChoiceId
    },
    [nodeChoiceId]: {
      id: nodeChoiceId,
      chapterId,
      type: 'choice',
      title: 'The Decision Path',
      sceneBg: 'forest_fork',
      choices: [
        {
          id: `choice_${seed.id}_a`,
          textEn: seed.choiceA.en,
          textKo: seed.choiceA.ko,
          icon: 'sparkles',
          effect: { brave: 1 },
          nextNodeId: nodePathAId,
          hintKo: seed.choiceA.hint
        },
        {
          id: `choice_${seed.id}_b`,
          textEn: seed.choiceB.en,
          textKo: seed.choiceB.ko,
          icon: 'compass',
          effect: { careful: 1 },
          nextNodeId: nodePathBId,
          hintKo: seed.choiceB.hint
        }
      ]
    },
    [nodePathAId]: {
      id: nodePathAId,
      chapterId,
      type: 'narrative',
      title: 'The Brave Trail',
      sceneBg: 'fairy_hollow',
      sentences: [
        {
          id: `s_${seed.id}_4a`,
          en: `Stepping forward bravely, the golden glow guided the way.`,
          ko: `용감하게 앞으로 나아가자, 황금빛이 길을 환하게 안내해주었습니다.`,
          words: []
        }
      ],
      nextNodeId: nodeBattleId
    },
    [nodePathBId]: {
      id: nodePathBId,
      chapterId,
      type: 'narrative',
      title: 'The Wise Trail',
      sceneBg: 'owl_shrine',
      sentences: [
        {
          id: `s_${seed.id}_4b`,
          en: `Carefully observing the surroundings, a hidden spell was unlocked.`,
          ko: `주변을 주의 깊게 관찰하자, 숨겨진 마법 주문이 잠금 해제되었습니다.`,
          words: []
        }
      ],
      nextNodeId: nodeBattleId
    },
    [nodeBattleId]: {
      id: nodeBattleId,
      chapterId,
      type: 'battle',
      title: 'Encounter with the Shadow Thief',
      sceneBg: 'boss_arena_dark',
      villainId: seed.villainId,
      villainHp: seed.villainHp,
      nextNodeId: nodeEndingId
    },
    [nodeEndingId]: {
      id: nodeEndingId,
      chapterId,
      type: 'ending',
      title: 'Victory & Spell Master',
      sceneBg: 'shrine_light',
      endingReward: {
        cardId: seed.targetCardId,
        xp: 80,
        title: `${seed.titleKo} 마스터`
      }
    }
  };

  const chapter: Chapter = {
    id: chapterId,
    bookId: seed.id,
    seq: 1,
    title: `Chapter 1: The Adventure Begins`,
    titleKo: `제1장: 모험의 시작`,
    difficulty: seed.arLevel > 3.0 ? 'Hard' : seed.arLevel > 2.0 ? 'Medium' : 'Easy',
    estMinutes: Math.round(3 + seed.arLevel),
    entryNodeId: nodeEntryId,
    coverAsset: 'cover',
    targetWords: [seed.targetCardId, 'card_courage', 'card_sparkle'],
    nodes: nodesMap
  };

  return {
    id: seed.id,
    title: seed.title,
    titleKo: seed.titleKo,
    author: seed.author,
    arLevel: seed.arLevel,
    lexile: seed.lexile,
    genre: seed.genre,
    wordCount: seed.wordCount,
    branchCount: 4,
    endingCount: 2,
    synopsis: seed.synopsis,
    synopsisKo: seed.synopsisKo,
    coverUrl: seed.coverUrl,
    themeColor: seed.themeColor,
    chapters: [chapter]
  };
}

export const GENERATED_100_BOOKS: Book[] = BOOK_SEEDS.map(buildBookFromSeed);
