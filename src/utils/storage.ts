import Dexie from 'dexie';
import { UserProfile, MatchHistory, TestResult, AppEvent } from '../types';

// IndexedDB 설정
class TetoEgenDB extends Dexie {
  userProfile!: Dexie.Table<UserProfile, string>;
  matchHistory!: Dexie.Table<MatchHistory, string>;
  events!: Dexie.Table<AppEvent, number>;

  constructor() {
    super('TetoEgenDB');

    this.version(1).stores({
      userProfile: 'id, created_at',
      matchHistory: 'id, created_at',
      events: '++id, timestamp'
    });
  }
}

export const db = new TetoEgenDB();

// 로컬 스토리지 키
const STORAGE_KEYS = {
  CURRENT_RESULT: 'current_test_result',
  AB_CONFIG: 'ab_test_config',
  DISCLAIMER_ACCEPTED: 'disclaimer_accepted'
} as const;

// 현재 테스트 결과 저장/불러오기
export function saveCurrentResult(result: TestResult): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_RESULT, JSON.stringify(result));
  } catch (e) {
    console.warn('LocalStorage write failed:', e);
  }
}

export function loadCurrentResult(): TestResult | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_RESULT);
    if (!data) return null;

    try {
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        created_at: new Date(parsed.created_at)
      };
    } catch {
      return null;
    }
  } catch (e) {
    console.warn('LocalStorage read failed:', e);
    return null;
  }
}

export function clearCurrentResult(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_RESULT);
}

// A/B 테스트 설정 저장/불러오기
export function saveABConfig(config: any): void {
  try {
    localStorage.setItem(STORAGE_KEYS.AB_CONFIG, JSON.stringify(config));
  } catch (e) {
    console.warn('LocalStorage write failed:', e);
  }
}

export function loadABConfig(): any {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AB_CONFIG);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  } catch (e) {
    console.warn('LocalStorage read failed:', e);
    return null;
  }
}

// 면책 동의 저장/불러오기
export function saveDisclaimerAccepted(): void {
  localStorage.setItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED, 'true');
}

export function isDisclaimerAccepted(): boolean {
  return localStorage.getItem(STORAGE_KEYS.DISCLAIMER_ACCEPTED) === 'true';
}

// 사용자 프로필 저장
export async function saveUserProfile(profile: Omit<UserProfile, 'id'>): Promise<UserProfile> {
  const id = crypto.randomUUID();
  const userProfile = { ...profile, id };

  await db.userProfile.add(userProfile);
  return userProfile;
}

// 사용자 프로필 불러오기
export async function getUserProfile(id: string): Promise<UserProfile | undefined> {
  return await db.userProfile.get(id);
}

// 최근 프로필 불러오기
export async function getLatestUserProfile(): Promise<UserProfile | undefined> {
  const profiles = await db.userProfile.orderBy('created_at').reverse().limit(1).toArray();
  return profiles[0];
}

// 궁합 기록 저장
export async function saveMatchHistory(history: Omit<MatchHistory, 'id'>): Promise<MatchHistory> {
  const id = crypto.randomUUID();
  const matchHistory = { ...history, id };

  await db.matchHistory.add(matchHistory);
  return matchHistory;
}

// 궁합 기록 불러오기
export async function getMatchHistory(id: string): Promise<MatchHistory | undefined> {
  return await db.matchHistory.get(id);
}

// 모든 궁합 기록 불러오기
export async function getAllMatchHistory(): Promise<MatchHistory[]> {
  return await db.matchHistory.orderBy('created_at').reverse().toArray();
}

// 이벤트 로깅
export async function logEvent(type: AppEvent['type'], data?: Record<string, any>): Promise<void> {
  const event: AppEvent = {
    type,
    timestamp: new Date(),
    data
  };

  // 콘솔 로그
  // console.log(`[Event] ${type}:`, data);

  // DB에 저장
  await db.events.add(event);
}

// 통계 데이터 가져오기
export async function getStats(): Promise<{
  totalTests: number;
  totalMatches: number;
  recentEvents: AppEvent[];
}> {
  const [totalTests, totalMatches, recentEvents] = await Promise.all([
    db.userProfile.count(),
    db.matchHistory.count(),
    db.events.orderBy('timestamp').reverse().limit(10).toArray()
  ]);

  return {
    totalTests,
    totalMatches,
    recentEvents
  };
}

// 데이터 낳출하기 (디버깅용)
export async function exportData(): Promise<{
  userProfiles: UserProfile[];
  matchHistory: MatchHistory[];
  events: AppEvent[];
}> {
  const [userProfiles, matchHistory, events] = await Promise.all([
    db.userProfile.toArray(),
    db.matchHistory.toArray(),
    db.events.toArray()
  ]);

  return {
    userProfiles,
    matchHistory,
    events
  };
}