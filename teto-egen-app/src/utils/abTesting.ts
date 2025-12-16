import { ABBucket, ABTestConfig } from '../types';
import { saveABConfig, loadABConfig, logEvent } from './storage';

// 해시 기반 버킷 할당
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// 사용자 ID 생성 (고정)
function getUserId(): string {
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('user_id', userId);
  }
  return userId;
}

// 버킷 할당
function assignBucket(userId: string): ABBucket {
  const hash = hashString(userId);
  const bucketIndex = hash % 3;
  
  const buckets: ABBucket[] = ['A', 'B', 'C'];
  return buckets[bucketIndex];
}

// 팔레트 할당
function assignPalette(userId: string): 'lovely' | 'minimal' {
  const hash = hashString(userId + '_palette');
  return hash % 2 === 0 ? 'lovely' : 'minimal';
}

// A/B 테스트 초기화
export function initializeABTest(): ABTestConfig {
  // 기존 설정 확인
  const existing = loadABConfig();
  if (existing) {
    return existing;
  }
  
  // 새 설정 생성
  const userId = getUserId();
  const config: ABTestConfig = {
    bucket: assignBucket(userId),
    palette: assignPalette(userId)
  };
  
  // 저장
  saveABConfig(config);
  
  // 이벤트 로깅
  logEvent('ab_bucket_assigned', { 
    bucket: config.bucket,
    palette: config.palette,
    userId 
  });
  
  logEvent('palette_assigned', { 
    palette: config.palette,
    userId 
  });
  
  return config;
}

// 현재 A/B 설정 가져오기
export function getABConfig(): ABTestConfig {
  const config = loadABConfig();
  if (config) {
    return config;
  }
  
  return initializeABTest();
}

// CTA 버튼 순서 가져오기
export function getCTAOrder(bucket: ABBucket): Array<'share' | 'match' | 'reward'> {
  switch (bucket) {
    case 'A': // 공유 우선
      return ['share', 'match', 'reward'];
    case 'B': // 수익 우선
      return ['reward', 'share', 'match'];
    case 'C': // 궁합 우선
      return ['match', 'share', 'reward'];
    default:
      return ['share', 'match', 'reward'];
  }
}

// 실험 지표 계산
export function calculateMetrics(events: any[]) {
  const resultViews = events.filter(e => e.type === 'result_view').length;
  const shareCompletes = events.filter(e => e.type === 'share_complete').length;
  const inviteOpens = events.filter(e => e.type === 'invite_open').length;
  const inviteFills = events.filter(e => e.type === 'invite_filled').length;
  const rewardOpens = events.filter(e => e.type === 'reward_open').length;
  const rewardCompletes = events.filter(e => e.type === 'reward_complete').length;
  
  return {
    shareRate: resultViews > 0 ? shareCompletes / resultViews : 0,
    inviteConversion: inviteOpens > 0 ? inviteFills / inviteOpens : 0,
    rewardConversion: rewardOpens > 0 ? rewardCompletes / rewardOpens : 0,
    arpdau: (shareCompletes + rewardCompletes) / Math.max(events.length, 1)
  };
}