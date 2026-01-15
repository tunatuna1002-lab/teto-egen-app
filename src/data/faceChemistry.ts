/**
 * Face Chemistry - 40가지 캐릭터 조합 데이터
 * 얼굴상(2) × Teto점수(5) × MBTI그룹(4) = 40 combinations
 */

export type FaceType = 'dog' | 'cat';
export type TetoLevel = 'powerF' | 'activeF' | 'hybrid' | 'activeT' | 'powerT';
export type MBTIGroup = 'analyst' | 'diplomat' | 'sentinel' | 'explorer';

export interface VibeData {
    themeColor: string;       // 주조색 (예: #FF6FAE)
    auraGradient: [string, string]; // 배경 그라데이션
    glassOpacity: number;     // 유리 투명도 (0.5 ~ 0.8)
    keywords: string[];       // 분위기 키워드
}

export interface FaceChemistryResult {
    faceType: FaceType;
    tetoLevel: TetoLevel;
    mbtiGroup: MBTIGroup;
    characterName: string;
    subtitle: string;
    description: string;
    traits: string[];
    emoji: string;
    vibe: VibeData; // ✨ NEW: Dynamic Vibe System
}

// MBTI를 그룹으로 분류
export const getMBTIGroup = (mbti: string): MBTIGroup => {
    const analysts = ['INTJ', 'INTP', 'ENTJ', 'ENTP'];
    const diplomats = ['INFJ', 'INFP', 'ENFJ', 'ENFP'];
    const sentinels = ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'];
    const explorers = ['ISTP', 'ISFP', 'ESTP', 'ESFP'];

    if (analysts.includes(mbti)) return 'analyst';
    if (diplomats.includes(mbti)) return 'diplomat';
    if (sentinels.includes(mbti)) return 'sentinel';
    if (explorers.includes(mbti)) return 'explorer';
    return 'diplomat'; // default
};

// Teto 점수를 레벨로 변환
export const getTetoLevel = (tPct: number): TetoLevel => {
    if (tPct <= 29) return 'powerF';
    if (tPct <= 45) return 'activeF';
    if (tPct <= 54) return 'hybrid';
    if (tPct <= 79) return 'activeT';
    return 'powerT';
};

// 캐릭터 데이터 (vibe는 동적 생성되므로 제외)
interface CharacterData {
    characterName: string;
    subtitle: string;
    description: string;
    traits: string[];
    emoji: string;
}

// 40가지 캐릭터 데이터
const FACE_CHEMISTRY_DATA: Record<string, CharacterData> = {
    // 🐶 강아지상 + 파워F (0-29%)
    'dog_powerF_analyst': {
        characterName: '논리적인 순둥이',
        subtitle: '머리는 차갑고 마음은 따뜻한',
        description: '생긴 건 완전 순둥이인데, 가끔 논리 폭격을 날림. 울면서 팩트 체크하는 타입.',
        traits: ['공감력 만렙', '숨겨진 분석력', '반전 매력'],
        emoji: '🐕‍🦺'
    },
    'dog_powerF_diplomat': {
        characterName: '순둥 말랑이',
        subtitle: '보기만 해도 힐링되는',
        description: '세상에서 제일 착한 강아지. 모든 사람의 감정을 스펀지처럼 흡수함.',
        traits: ['공감 자판기', '눈물 많음', '치유 능력'],
        emoji: '🐶'
    },
    'dog_powerF_sentinel': {
        characterName: '충직한 마음지기',
        subtitle: '약속은 목숨처럼 지키는',
        description: '순둥한 외모에 책임감 폭발. 내 사람을 위해서라면 끝까지 함께하는 충견.',
        traits: ['헌신적', '약속 철저', '안정 추구'],
        emoji: '🦮'
    },
    'dog_powerF_explorer': {
        characterName: '자유로운 힐링독',
        subtitle: '어디든 함께 가자!',
        description: '사랑 많고 적응력 좋은 순둥이. 즉흥적으로 산책 가자고 하면 바로 OK.',
        traits: ['순응적', '모험심', '긍정 에너지'],
        emoji: '🐕'
    },

    // 🐶 강아지상 + 액티브F (30-45%)
    'dog_activeF_analyst': {
        characterName: '분위기 읽는 리트리버',
        subtitle: '센스 있게 분석하는',
        description: '눈치도 빠르고 머리도 좋은 만능견. 상황 파악 후 최적의 위로를 제공.',
        traits: ['눈치 만렙', '전략적 배려', '지적 공감'],
        emoji: '🦮'
    },
    'dog_activeF_diplomat': {
        characterName: '따뜻한 중재견',
        subtitle: '모두를 감싸 안는',
        description: '싸움 중재의 달인. 양쪽 다 이해해주면서 화해시키는 능력자.',
        traits: ['중재력', '포용력', '진정성'],
        emoji: '🐕‍🦺'
    },
    'dog_activeF_sentinel': {
        characterName: '든든한 베스트프렌드',
        subtitle: '믿음직한 옆자리',
        description: '항상 내 편이 되어주는 친구 같은 연인. 안정감과 배려의 균형.',
        traits: ['신뢰감', '꾸준함', '배려심'],
        emoji: '🐶'
    },
    'dog_activeF_explorer': {
        characterName: '함께라면 어디든',
        subtitle: '신나는 동행자',
        description: '같이 있으면 세상이 더 재밌어지는 타입. 모험도 위로도 함께.',
        traits: ['적응력', '유쾌함', '동반자'],
        emoji: '🐕'
    },

    // 🐶 강아지상 + 하이브리드 (46-54%)
    'dog_hybrid_analyst': {
        characterName: '이중생활 믹스견',
        subtitle: '상황에 따라 변신하는',
        description: '회사에서는 프로, 집에서는 순둥이. 온오프 전환이 완벽한 멀티 플레이어.',
        traits: ['태세 전환', '적응력', '균형감'],
        emoji: '🐕‍🦺'
    },
    'dog_hybrid_diplomat': {
        characterName: '감성 밸런서',
        subtitle: '이성과 감성 사이',
        description: '때론 공감, 때론 조언. 상대에게 맞춤형 서비스를 제공하는 만능견.',
        traits: ['유연함', '공감 능력', '상황 판단'],
        emoji: '🐶'
    },
    'dog_hybrid_sentinel': {
        characterName: '안정적인 변화구',
        subtitle: '예측 가능한 예측불가',
        description: '기본은 안정적인데 가끔 깜짝 이벤트. 성실하지만 지루하지 않은 타입.',
        traits: ['신뢰성', '서프라이즈', '일관성'],
        emoji: '🦮'
    },
    'dog_hybrid_explorer': {
        characterName: '즉흥 여행 믹스견',
        subtitle: '오늘 뭐해? 갈래?',
        description: '계획 없이도 행복한 자유로운 영혼. 함께 있으면 매일이 여행.',
        traits: ['즉흥성', '자유로움', '긍정'],
        emoji: '🐕'
    },

    // 🐶 강아지상 + 액티브T (55-79%)
    'dog_activeT_analyst': {
        characterName: '츤데레 시바견',
        subtitle: '표정은 웃는데 말은 팩폭',
        description: '귀여운 얼굴로 정곡 찌르기. 하지만 다 널 위한 거야 (진심).',
        traits: ['츤데레', '솔직함', '듬직함'],
        emoji: '🐕‍🦺'
    },
    'dog_activeT_diplomat': {
        characterName: '조언하는 순둥이',
        subtitle: '따끔하지만 진심인',
        description: '부드럽게 말하지만 핵심을 정확히 짚어줌. 성장을 도와주는 파트너.',
        traits: ['진심 어린 조언', '성장 지향', '따뜻한 팩트'],
        emoji: '🐶'
    },
    'dog_activeT_sentinel': {
        characterName: '책임감 폭발 시바',
        subtitle: '내가 다 알아서 할게',
        description: '순둥해 보이지만 해결사. 문제가 생기면 제일 먼저 나서는 듬직함.',
        traits: ['책임감', '실행력', '문제 해결'],
        emoji: '🦮'
    },
    'dog_activeT_explorer': {
        characterName: '액션 히어로 독',
        subtitle: '일단 해보고 생각하자',
        description: '고민보다는 실행. 귀여운 얼굴로 세상을 헤쳐나가는 행동파.',
        traits: ['실행력', '도전 정신', '활동적'],
        emoji: '🐕'
    },

    // 🐶 강아지상 + 파워T (80-100%)
    'dog_powerT_analyst': {
        characterName: '인공지능 골든리트리버',
        subtitle: '생긴 건 순둥이, 속은 ChatGPT',
        description: '웃는 얼굴로 팩트 폭격. 귀엽게 생겨서 더 무서운 논리왕.',
        traits: ['논리 만렙', '분석력', '반전 매력'],
        emoji: '🐕‍🦺'
    },
    'dog_powerT_diplomat': {
        characterName: '논리적인 공감러',
        subtitle: '감정도 분석해서 위로함',
        description: '공감도 하고 해결책도 주는 완벽한 조합. 울다가도 "맞아 그치?" 하게 됨.',
        traits: ['효율적 위로', '문제 해결', '논리적 공감'],
        emoji: '🐶'
    },
    'dog_powerT_sentinel': {
        characterName: '조직의 순둥이 리더',
        subtitle: '귀엽게 조직을 이끄는',
        description: '외모는 순둥, 실력은 에이스. 팀을 책임지는 숨은 보스.',
        traits: ['리더십', '책임감', '조직력'],
        emoji: '🦮'
    },
    'dog_powerT_explorer': {
        characterName: '효율 만점 여행견',
        subtitle: '최단 루트로 세상을 돌아다니는',
        description: '자유롭지만 낭비는 싫어. 효율적으로 인생을 즐기는 스마트 독.',
        traits: ['효율성', '모험심', '실용적'],
        emoji: '🐕'
    },

    // 🐱 고양이상 + 파워F (0-29%)
    'cat_powerF_analyst': {
        characterName: '시크한 감성 분석가',
        subtitle: '도도하지만 속은 감성 폭발',
        description: '겉은 차가운 척, 속은 눈물 바다. 밤에 혼자 감성글 쓰는 타입.',
        traits: ['감성 숨김', '깊은 내면', '분석적 감성'],
        emoji: '🐱'
    },
    'cat_powerF_diplomat': {
        characterName: '꾹꾹이 하는 시인냥',
        subtitle: '도도한 외모에 숨겨진 애교',
        description: '시크해 보이지만 내 사람에겐 졸졸 따라다님. 무장해제 100%.',
        traits: ['반전 애교', '깊은 사랑', '충성심'],
        emoji: '😺'
    },
    'cat_powerF_sentinel': {
        characterName: '집사 사랑 페르시안',
        subtitle: '내 사람만 챙기는',
        description: '도도하지만 한번 마음 먹으면 헌신적. 내 편 아니면 관심 없음.',
        traits: ['선택적 헌신', '충직함', '인내심'],
        emoji: '🐈'
    },
    'cat_powerF_explorer': {
        characterName: '자유로운 개냥이',
        subtitle: '시크하게 모험하는',
        description: '도도하게 세상 탐험. 자유롭지만 집에 돌아오면 꾹꾹이.',
        traits: ['자유로움', '호기심', '귀소 본능'],
        emoji: '🐈‍⬛'
    },

    // 🐱 고양이상 + 액티브F (30-45%)
    'cat_activeF_analyst': {
        characterName: '우아한 조언냥',
        subtitle: '고급지게 팩트 전달',
        description: '센스 있게 핵심만 짚어줌. 말 한마디가 힐링인 고급진 고양이.',
        traits: ['우아함', '센스', '간결함'],
        emoji: '🐱'
    },
    'cat_activeF_diplomat': {
        characterName: '고급진 페르시안',
        subtitle: '품격 있는 공감러',
        description: '티 안 내고 옆에 있어주는 스타일. 말없이 위로해주는 따뜻함.',
        traits: ['품격', '절제된 표현', '깊은 공감'],
        emoji: '😺'
    },
    'cat_activeF_sentinel': {
        characterName: '묵묵한 수호냥',
        subtitle: '말은 없지만 옆에 있는',
        description: '시크하게 지켜주는 타입. 힘들 때 슬쩍 옆에 와있음.',
        traits: ['수호자', '과묵함', '신뢰'],
        emoji: '🐈'
    },
    'cat_activeF_explorer': {
        characterName: '탐험하는 배려냥',
        subtitle: '같이 모험할 친구',
        description: '함께 새로운 걸 경험하고 싶어하는 호기심 많은 고양이.',
        traits: ['호기심', '동반자', '적응력'],
        emoji: '🐈‍⬛'
    },

    // 🐱 고양이상 + 하이브리드 (46-54%)
    'cat_hybrid_analyst': {
        characterName: '4차원 먼치킨',
        subtitle: '예측 불가 매력',
        description: '오늘은 츤, 내일은 데레. 알다가도 모르겠는 미스터리한 매력.',
        traits: ['예측 불가', '미스터리', '호기심 유발'],
        emoji: '🐱'
    },
    'cat_hybrid_diplomat': {
        characterName: '감성 스위치 냥',
        subtitle: '상황에 따라 모드 전환',
        description: '공감 모드와 독립 모드 자유자재. 카멜레온 같은 적응력.',
        traits: ['유연함', '모드 전환', '센스'],
        emoji: '😺'
    },
    'cat_hybrid_sentinel': {
        characterName: '신비로운 집사',
        subtitle: '알 수 없는 안정감',
        description: '묘하게 안심이 되는 존재. 도도하지만 든든함.',
        traits: ['신비로움', '안정감', '믿음직'],
        emoji: '🐈'
    },
    'cat_hybrid_explorer': {
        characterName: '즉흥 탐험 냥이',
        subtitle: '기분 따라 움직이는',
        description: '계획? 그게 뭔데? 기분 좋으면 어디든 가는 자유로운 영혼.',
        traits: ['즉흥성', '자유', '순수함'],
        emoji: '🐈‍⬛'
    },

    // 🐱 고양이상 + 액티브T (55-79%)
    'cat_activeT_analyst': {
        characterName: '스프레드시트 러시안블루',
        subtitle: '데이트 플랜도 노션으로',
        description: '시크하게 모든 걸 계획함. 효율적이지만 알고 보면 챙겨주는 타입.',
        traits: ['계획적', '효율적', '숨겨진 배려'],
        emoji: '🐱'
    },
    'cat_activeT_diplomat': {
        characterName: '시크한 조언냥',
        subtitle: '핵심만 찌르는',
        description: '부드럽게 팩트 전달. 상처 주지 않으면서 깨달음을 주는 능력.',
        traits: ['절제된 조언', '핵심 정리', '배려'],
        emoji: '😺'
    },
    'cat_activeT_sentinel': {
        characterName: '시크한 관리냥',
        subtitle: '말없이 챙겨주는',
        description: '티는 안 내지만 뒤에서 다 해놓는 스타일. 책임감 강한 고양이.',
        traits: ['책임감', '꼼꼼함', '무표정 챙김'],
        emoji: '🐈'
    },
    'cat_activeT_explorer': {
        characterName: '쿨한 모험냥',
        subtitle: '효율적으로 세상을 탐험',
        description: '계획 안에서 자유를 즐기는 타입. 시크하게 인생을 즐김.',
        traits: ['효율적 자유', '쿨함', '실행력'],
        emoji: '🐈‍⬛'
    },

    // 🐱 고양이상 + 파워T (80-100%)
    'cat_powerT_analyst': {
        characterName: '계산적인 스핑크스',
        subtitle: '감정 노출 0%, 효율 100%',
        description: '인간 컴퓨터급 냉철함. 하지만 내 사람에겐 조금 다름 (조금).',
        traits: ['냉철함', '효율성', '숨겨진 따뜻함'],
        emoji: '🐱'
    },
    'cat_powerT_diplomat': {
        characterName: '도도한 문제해결사',
        subtitle: '시크하게 다 해결함',
        description: '감정보다 해결책 먼저. 울지 말고 들어봐, 이렇게 하면 돼.',
        traits: ['문제 해결', '실용적', '신뢰'],
        emoji: '😺'
    },
    'cat_powerT_sentinel': {
        characterName: '조용한 보스냥',
        subtitle: '말없이 조직을 이끄는',
        description: '시크한 리더십. 필요할 때만 나타나서 상황을 정리함.',
        traits: ['리더십', '차분함', '결단력'],
        emoji: '🐈'
    },
    'cat_powerT_explorer': {
        characterName: '논리적 자유냥',
        subtitle: '효율적으로 세상을 정복',
        description: '자유롭지만 낭비는 싫어. 전략적으로 인생을 즐기는 스마트 캣.',
        traits: ['전략적', '효율성', '자유로움'],
        emoji: '🐈‍⬛'
    }
};

/**
 * 얼굴상, Teto 점수, MBTI를 조합하여 캐릭터 결과를 반환
 */
export const getFaceChemistry = (
    faceType: FaceType,
    tPct: number,
    mbti?: string
): FaceChemistryResult => {
    const tetoLevel = getTetoLevel(tPct);
    const mbtiGroup = mbti ? getMBTIGroup(mbti) : 'diplomat'; // MBTI 없으면 외교관 디폴트

    const key = `${faceType}_${tetoLevel}_${mbtiGroup}`;
    const data = FACE_CHEMISTRY_DATA[key] || FACE_CHEMISTRY_DATA['dog_hybrid_diplomat'];

    // ✨ Dynamic Vibe 생성
    const vibe = generateVibe(faceType, tetoLevel, mbtiGroup);

    return {
        faceType,
        tetoLevel,
        mbtiGroup,
        ...data,
        vibe
    };
};

/**
 * MBTI 그룹 한글 이름
 */
export const getMBTIGroupLabel = (group: MBTIGroup): string => {
    const labels: Record<MBTIGroup, string> = {
        analyst: '분석가',
        diplomat: '외교관',
        sentinel: '관리자',
        explorer: '탐험가'
    };
    return labels[group];
};

/**
 * Teto 레벨 한글 이름
 */
export const getTetoLevelLabel = (level: TetoLevel): string => {
    const labels: Record<TetoLevel, string> = {
        powerF: '파워 감성(F)',
        activeF: '액티브 감성(F)',
        hybrid: '하이브리드',
        activeT: '액티브 이성(T)',
        powerT: '파워 이성(T)'
    };
    return labels[level];
};

/**
 * 얼굴상 한글 이름
 */
export const getFaceTypeLabel = (type: FaceType): string => {
    return type === 'dog' ? '🐶 강아지상' : '🐱 고양이상';
};

/**
 * ✨ Dynamic Vibe System
 * 성격 조합에 따라 UI를 제어하는 Vibe 데이터 생성
 */
export const generateVibe = (
    faceType: FaceType,
    tetoLevel: TetoLevel,
    mbtiGroup: MBTIGroup
): VibeData => {
    // 기본 색상 팔레트
    const colorPalettes = {
        // 강아지상: 따뜻한 톤
        dog: {
            powerF: { theme: '#FF9A9E', gradient: ['#FFB6C1', '#FFF0F5'] as [string, string] },
            activeF: { theme: '#FFB347', gradient: ['#FFECD2', '#FCB69F'] as [string, string] },
            hybrid: { theme: '#DDA0DD', gradient: ['#E0C3FC', '#8EC5FC'] as [string, string] },
            activeT: { theme: '#87CEEB', gradient: ['#89F7FE', '#66A6FF'] as [string, string] },
            powerT: { theme: '#6B7CFF', gradient: ['#667eea', '#764ba2'] as [string, string] }
        },
        // 고양이상: 시크한 톤
        cat: {
            powerF: { theme: '#DDA0DD', gradient: ['#E8DAEF', '#D2B4DE'] as [string, string] },
            activeF: { theme: '#B8B8D1', gradient: ['#C9D6FF', '#E2E2E2'] as [string, string] },
            hybrid: { theme: '#9B59B6', gradient: ['#8E44AD', '#3498DB'] as [string, string] },
            activeT: { theme: '#5DADE2', gradient: ['#4FACFE', '#00F2FE'] as [string, string] },
            powerT: { theme: '#2C3E50', gradient: ['#2C3E50', '#4CA1AF'] as [string, string] }
        }
    };

    // MBTI 그룹에 따른 키워드
    const groupKeywords: Record<MBTIGroup, string[]> = {
        analyst: ['논리적', '전략적', '명석함'],
        diplomat: ['감성적', '진정성', '따뜻함'],
        sentinel: ['신뢰감', '안정적', '책임감'],
        explorer: ['자유로움', '즉흥적', '에너지']
    };

    // 테토 레벨에 따른 투명도 (T 성향일수록 투명하게)
    const opacityMap: Record<TetoLevel, number> = {
        powerF: 0.75,  // 불투명 (따뜻하고 포근한 느낌)
        activeF: 0.7,
        hybrid: 0.65,
        activeT: 0.6,
        powerT: 0.55   // 투명 (쿨하고 명료한 느낌)
    };

    const palette = colorPalettes[faceType][tetoLevel];

    return {
        themeColor: palette.theme,
        auraGradient: palette.gradient,
        glassOpacity: opacityMap[tetoLevel],
        keywords: groupKeywords[mbtiGroup]
    };
};
