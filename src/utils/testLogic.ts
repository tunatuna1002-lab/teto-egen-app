import { TestResult, MBTIType, MBTI_TYPES, PersonalityAnalysis } from '../types';
import { TEST_QUESTIONS } from '../data/questions';
import { MBTI_PROFILES } from '../data/mbtiContent';
import { getResultContent } from '../data/resultContent';

// 테스트 점수 계산
export function calculateTestScore(answers: number[]): TestResult {
  if (answers.length !== TEST_QUESTIONS.length) {
    console.warn(`답변 개수 불일치: ${answers.length}/${TEST_QUESTIONS.length}`);
  }

  // T 점수 계산 (Teto Logic)
  // T 문항: 점수 그대로 (0->0, 4->4) // 높을수록 T
  // E 문항: 점수 반대로 (0->4, 4->0) // 낮을수록 T
  let rawScore = 0;
  const maxScore = TEST_QUESTIONS.length * 4;

  answers.forEach((score, index) => {
    // 인덱스 범위 체크 (answers가 더 길 수도 있음)
    if (index >= TEST_QUESTIONS.length) return;

    const question = TEST_QUESTIONS[index];
    if (question.type === 'T') {
      rawScore += score;
    } else {
      rawScore += (4 - score);
    }
  });

  // T_pct = (rawScore / maxScore) * 100
  const T_pct = Math.round((rawScore / maxScore) * 100);

  // 유형 판정
  let type_label: TestResult['type_label'];
  if (T_pct >= 60) {
    type_label = '테토형';
  } else if (T_pct <= 40) {
    type_label = '에겐형';
  } else {
    type_label = '반반(믹스형)';
  }

  return {
    t_pct: T_pct,
    type_label,
    answers,
    created_at: new Date()
  };
}

// MBTI 검증
export function validateMBTI(mbti: string): MBTIType | null {
  const normalized = mbti.toUpperCase().trim();

  if (normalized.length !== 4) {
    return null;
  }

  if (!MBTI_TYPES.includes(normalized as MBTIType)) {
    return null;
  }

  return normalized as MBTIType;
}

// MBTI 차이 계산 (다른 글자 수)
export function calculateMBTIDifference(mbti1?: string, mbti2?: string): number {
  if (!mbti1 || !mbti2 || mbti1.length !== 4 || mbti2.length !== 4) {
    return 0;
  }

  let diff = 0;
  for (let i = 0; i < 4; i++) {
    if (mbti1[i] !== mbti2[i]) {
      diff++;
    }
  }
  return diff;
}

// 성격 종합 분석 (테토 + MBTI)
export function analyzePersonality(tPct: number, mbti?: string): PersonalityAnalysis {
  const tetoContent = getResultContent(tPct);

  let mbtiAnalysis = undefined;

  if (mbti) {
    const normalizedMBTI = validateMBTI(mbti);
    if (normalizedMBTI) {
      const profile = MBTI_PROFILES[normalizedMBTI];

      // 케미 분석 (간단한 로직)
      let chemistry = "";
      const typeLabel = tPct >= 60 ? '테토' : tPct <= 40 ? '에겐' : '반반';

      if (typeLabel === '테토' && normalizedMBTI.includes('T')) {
        chemistry = "논리력 끝판왕! 당신의 이성은 아무도 못 말립니다.";
      } else if (typeLabel === '에겐' && normalizedMBTI.includes('F')) {
        chemistry = "감수성 폭발! 공감 능력으로 세상을 치유하는 힐러시군요.";
      } else if (typeLabel === '테토' && normalizedMBTI.includes('F')) {
        chemistry = "따뜻한 가슴을 가진 냉철한 전략가. 반전 매력의 소유자!";
      } else if (typeLabel === '에겐' && normalizedMBTI.includes('T')) {
        chemistry = "부드러운 카리스마! 공감하면서도 할 말은 하는 외유내강형.";
      } else {
        chemistry = "균형 잡힌 시각을 가진 당신, 어디서나 잘 어울리는 적응력의 왕!";
      }

      mbtiAnalysis = {
        type: normalizedMBTI,
        profile,
        combinationChemistry: chemistry
      };
    }
  }

  return {
    tetoAnalysis: {
      score: tPct,
      label: tetoContent.title,
      description: tetoContent.description[0] // 첫 번째 줄 요약
    },
    mbtiAnalysis,
    keywords: [tetoContent.subtitle.split(' ')[0], mbti || '']
  };
}


// S.A.C 모델 기반 궁합 점수 계산
export function calculateCompatibility(
  T_pct_self: number,
  T_pct_other: number,
  mbti_self?: string,
  mbti_other?: string
) {
  // 1. Synergy (매력/케미) - 서로 다를수록 끌림
  // Delta: 0~100
  const delta = Math.abs(T_pct_self - T_pct_other);

  // 기본 점수: 차이가 클수록 점수 높음 (60점 베이스 + 차이점수)
  let attraction = 60 + (delta * 0.4);

  // MBTI 보정: E/I가 다르면 추가 점수 (보완 관계)
  if (mbti_self && mbti_other && mbti_self[0] !== mbti_other[0]) {
    attraction += 5;
  }

  // 2. Alignment (안정감) - 가치관(S/N)과 생활양식(J/P)이 같을수록 안정
  let stability = 50; // 기본점수

  if (mbti_self && mbti_other) {
    // S/N 일치 (가치관/대화 통함)
    if (mbti_self[1] === mbti_other[1]) {
      stability += 20;
    }
    // J/P 일치 (생활 패턴)
    if (mbti_self[3] === mbti_other[3]) {
      stability += 20;
    }
  } else {
    // MBTI 정보 없으면 테토 점수 차이가 적을수록 안정적이라고 가정
    if (delta < 20) stability += 30;
    else if (delta < 40) stability += 10;
  }

  // 테토 점수가 너무 극단적으로 차이나면 안정감 하락
  if (delta > 60) stability -= 10;


  // 3. Challenge (갈등 위험)
  // T끼리 만나면 자존심 싸움 (High Challenge)
  // J와 P가 만나면 생활 갈등 (High Challenge)
  let conflict = 30; // 기본 위험도

  // T 성향이 둘 다 매우 높음 (평균 70 이상) -> 자존심 강함
  if ((T_pct_self + T_pct_other) / 2 >= 70) {
    conflict += 20;
  }

  if (mbti_self && mbti_other) {
    // J/P 불일치 -> 생활 갈등
    if (mbti_self[3] !== mbti_other[3]) {
      conflict += 25;
    }
    // T/F 불일치 -> 의사소통 갈등 (공감 vs 해결)
    if (mbti_self[2] !== mbti_other[2]) {
      conflict += 15;
    }
  }

  // 점수 Clamp (0~100)
  const clamp = (n: number) => Math.min(Math.max(Math.round(n), 0), 100);

  return {
    attraction: clamp(attraction),
    stability: clamp(stability),
    conflict: clamp(conflict)
  };
}

// 타입별 색상
export function getTypeColor(type: string): string {
  switch (type) {
    case '테토형': return '#FF6FAE'; // 핑크
    case '에겐형': return '#6B7CFF'; // 블루
    case '반반(믹스형)': return '#8B7FFF'; // 퍼플
    default: return '#6B7CFF';
  }
}

// 점수별 해석
export function getScoreInterpretation(score: number, type: 'attraction' | 'stability' | 'conflict') {
  switch (type) {
    case 'attraction':
      if (score >= 85) return { text: '강렬한 첫눈의 끌림! 도파민 폭발', color: '#FF6FAE' };
      if (score >= 65) return { text: '서로 다른 매력에 궁금해지는 사이', color: '#8B7FFF' };
      return { text: '편안한 친구 같은 사이', color: '#64748B' };

    case 'stability':
      if (score >= 80) return { text: '말하지 않아도 통하는 영혼의 단짝', color: '#10B981' };
      if (score >= 60) return { text: '배려하며 맞춰가는 성숙한 관계', color: '#2DD4BF' };
      return { text: '서로의 세계를 이해하는 노력이 필요', color: '#F59E0B' };

    case 'conflict':
      if (score >= 70) return { text: '사랑싸움도 격렬한 "톰과 제리"', color: '#EF4444' };
      if (score >= 40) return { text: '가끔 틱틱대지만 금방 풀리는 사이', color: '#F59E0B' };
      return { text: '물 흐르듯 평온한 무공해 청정구역', color: '#10B981' }; // 낮은게 좋음

    default:
      return { text: '', color: '#64748B' };
  }
}