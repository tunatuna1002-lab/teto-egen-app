import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SEO } from '../components/SEO';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { Disclaimer } from '../components/Disclaimer';
import { AdBanner } from '../components/AdBanner';
import { initializeABTest } from '../utils/abTesting';
import { logEvent } from '../utils/storage';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 공유된 결과 파싱
  const sharedAttempt = {
    isShared: searchParams.get('share') === 'true',
    type: searchParams.get('type'), // '테토형', '에겐형', 'COUPLE'
    t_pct: searchParams.get('t_pct'),
    mbti: searchParams.get('mbti')
  };

  useEffect(() => {
    const abConfig = initializeABTest();
    logEvent('page_view', {
      page: 'home',
      ab_bucket: abConfig.bucket,
      is_shared_view: sharedAttempt.isShared
    });
  }, []);

  const handleTestStart = () => {
    logEvent('test_start', { source: sharedAttempt.isShared ? 'viral_link' : 'home' });
    navigate('/test');
  };

  const handleDirectMatch = () => {
    logEvent('match_start', { source: 'home' });
    navigate('/match');
  };

  const handleAbout = () => {
    navigate('/about');
  };

  return (
    <div className="min-h-screen pb-20 px-4 flex flex-col">
      <SEO title="홈" />
      <div className="blob-1" />
      <div className="blob-2" />
      <div className="blob-3" />

      <div className="flex-1 flex flex-col justify-center items-center text-center">

        {/* 친구 결과가 있을 경우 표시되는 특별 카드 */}
        {sharedAttempt.isShared && sharedAttempt.t_pct ? (
          <GlassCard className="max-w-sm mx-auto mb-8 animate-fade-in border-2 border-lovely-pink/30 relative overflow-hidden" padding="lg">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-500" />
            <div className="text-sm font-bold text-lovely-pink mb-2 bg-white/50 inline-block px-3 py-1 rounded-full">
              💌 친구가 보낸 리포트 도착
            </div>

            {sharedAttempt.type === 'COUPLE' ? (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-charcoal mb-2">
                  "우리 궁합 {sharedAttempt.t_pct}점이래!"
                </h2>
                <p className="text-charcoal-light">
                  나랑은 몇 점일까요? 궁금하지 않나요?
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-charcoal mb-1">
                  친구의 테토력 <span className="text-lovely-pink">{sharedAttempt.t_pct}%</span>
                </h2>
                <p className="text-sm text-charcoal-light mb-4">
                  ({sharedAttempt.type || '테토/에겐형'})
                </p>
                <p className="text-lg font-medium text-charcoal leading-relaxed word-break-keep">
                  "내 성향은 이렇대!<br />너랑 나는 잘 맞을까?"
                </p>
              </div>
            )}

            <GlassButton
              onClick={handleTestStart}
              size="lg"
              fullWidth
              className="animate-pulse-subtle"
            >
              나도 테스트 해보기 👉
            </GlassButton>
          </GlassCard>
        ) : (
          /* 기존 히어로 섹션 */
          <GlassCard className="max-w-sm mx-auto mb-8 animate-fade-in" padding="lg" variant="hero">
            <h1 className="text-3xl font-bold text-charcoal mb-6 leading-normal tracking-wide py-1">
              테토·에겐 게이지
              <span className="block text-2xl font-semibold text-charcoal-light mt-2 tracking-normal">
                + MBTI 궁합 리포트
              </span>
            </h1>

            <p className="text-lg text-charcoal-light mb-6">
              2분 컷. 재미는 크게. 단정은 작게.
            </p>

            <div className="space-y-4">
              <GlassButton
                onClick={handleTestStart}
                size="lg"
                fullWidth
                className="animate-slide-up"
              >
                테스트 시작
              </GlassButton>

              <GlassButton
                onClick={handleDirectMatch}
                variant="secondary"
                size="md"
                fullWidth
                className="animate-slide-up"
                style={{ animationDelay: '0.1s' }}
              >
                궁합 바로 보기
              </GlassButton>

              <button
                onClick={handleAbout}
                className="text-sm text-charcoal-light hover:text-charcoal transition-colors underline"
              >
                이게 뭐예요?
              </button>
            </div>
          </GlassCard>
        )}

        <AdBanner className="max-w-sm w-full mx-auto" />

        {/* 특징 카드 */}

        <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto w-full">
          <GlassCard
            className="text-center cursor-pointer hover:scale-105 transition-transform"
            padding="md"
            onClick={() => navigate('/feature/quick-test')}
          >
            <div className="text-2xl mb-2">⚡</div>
            <h3 className="font-semibold text-charcoal mb-1">빠른 테스트</h3>
            <p className="text-sm text-charcoal-light">20문항으로 끝내는 간단한 성향 체크</p>
          </GlassCard>

          <GlassCard
            className="text-center cursor-pointer hover:scale-105 transition-transform"
            padding="md"
            onClick={() => navigate('/feature/mbti-match')}
          >
            <div className="text-2xl mb-2">💕</div>
            <h3 className="font-semibold text-charcoal mb-1">MBTI 궁합</h3>
            <p className="text-sm text-charcoal-light">성격 유형으로 보는 관계 가능성</p>
          </GlassCard>

          <GlassCard
            className="text-center cursor-pointer hover:scale-105 transition-transform"
            padding="md"
            onClick={() => navigate('/feature/share')}
          >
            <div className="text-2xl mb-2">📱</div>
            <h3 className="font-semibold text-charcoal mb-1">공유 가능</h3>
            <p className="text-sm text-charcoal-light">예쁜 카드로 결과 공유하기</p>
          </GlassCard>
        </div>
      </div>

      {/* 면책 사항 */}
      <Disclaimer />
    </div>
  );
};