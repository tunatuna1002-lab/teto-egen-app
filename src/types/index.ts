// 공통 타입 정의

export interface TestResult {
  t_pct: number;
  type_label: '테토형' | '에겐형' | '반반(믹스형)';
  answers: number[];
  mbti?: string;
  created_at: Date;
}

export interface MatchResult {
  attraction: number; // 끌림 0-100
  stability: number; // 안정 0-100
  conflict: number; // 갈등위험 0-100
}

export interface UserProfile {
  id: string;
  created_at: Date;
  mbti?: string;
  t_pct: number;
  type_label: string;
  answers_v1?: number[];
  disclaimer_accepted: boolean;
}

export interface MatchHistory {
  id: string;
  created_at: Date;
  self_snapshot: TestResult;
  other_input: {
    t_pct?: number;
    mbti?: string;
  };
  scores: MatchResult;
  share_token?: string;
  note?: string;
}

export type ABBucket = 'A' | 'B' | 'C';

export interface ABTestConfig {
  bucket: ABBucket;
  palette: 'lovely' | 'minimal';
}

export interface ShareCardData {
  type: 'minimal' | 'meme' | 'romantic';
  userResult: TestResult;
  matchResult?: MatchResult;
}

// MBTI 관련 타입
export const MBTI_TYPES = [
  'ISTJ', 'ISFJ', 'INFJ', 'INTJ',
  'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP',
  'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
] as const;

export type MBTIType = typeof MBTI_TYPES[number];

export interface MBTIProfile {
  id: string;
  alias: string;
  description: string;
  traits: string[];
  psychology: string;
  love_style: string;
}

export interface PersonalityAnalysis {
  tetoAnalysis: {
    score: number;
    label: string;
    description: string;
  };
  mbtiAnalysis?: {
    type: string;
    profile: MBTIProfile;
    combinationChemistry: string;
  };
  keywords: string[];
}


// 테스트 문항
export type QuestionCategory = 'basic' | 'conflict' | 'intimacy' | 'lifestyle' | 'value';

export interface TestQuestion {
  id: number;
  text: string;
  type: 'T' | 'E';
  category: QuestionCategory;
}

// MBTI 간이 테스트 문항
export interface MBTIQuestion {
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  text: string;
  optionA: string;
  optionB: string;
}

export interface DiagnosisQuestion {
  id: number;
  text: string;
  dimension?: 'E' | 'N' | 'T' | 'J'; // Yes일 때 해당되는 성향
  score: number;
}


// 이벤트 타입
export type EventType =
  | 'page_view'
  | 'test_page_view'
  | 'test_start'
  | 'question_answered'
  | 'test_complete'
  | 'mbti_entered'
  | 'mbti_skip'
  | 'result_view'
  | 'share_open'
  | 'share_complete'
  | 'share_link_copy'
  | 'match_start'
  | 'match_complete'
  | 'invite_create'
  | 'invite_click'
  | 'invite_open'
  | 'invite_filled'
  | 'reward_open'
  | 'reward_complete'
  | 'test_retake'
  | 'ab_bucket_assigned'
  | 'palette_assigned'
  | 'deep_analysis_start'
  | 'deep_analysis_complete'
  | 'face_match_start'
  | 'face_match_complete'
  | 'face_match_share';

export interface AppEvent {
  type: EventType;
  timestamp: Date;
  data?: Record<string, any>;
}
