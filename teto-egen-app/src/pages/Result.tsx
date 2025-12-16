import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { TypeBadge } from '../components/TypeBadge';
import { Disclaimer } from '../components/Disclaimer';
import { loadCurrentResult, clearCurrentResult, logEvent, saveUserProfile } from '../utils/storage';
import { getABConfig, getCTAOrder } from '../utils/abTesting';
import { analyzePersonality, getTypeColor } from '../utils/testLogic';
import { getResultContent } from '../data/resultContent';

interface ResultData {
  t_pct: number;
  type_label: string;
  mbti?: string;
  created_at: Date;
}

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<ResultData | null>(null);
  const [abConfig, setAbConfig] = useState<any>(null);

  useEffect(() => {
    const loadResult = async () => {
      const currentResult = loadCurrentResult();
      if (currentResult) {
        setResult(currentResult);

        // 사용자 프로필 저장
        await saveUserProfile({
          created_at: currentResult.created_at,
          mbti: currentResult.mbti,
          t_pct: currentResult.t_pct,
          type_label: currentResult.type_label,
          disclaimer_accepted: true
        });

        // A/B 설정
        const config = getABConfig();
        setAbConfig(config);

        // 이벤트 로깅
        logEvent('result_view', {
          t_pct: currentResult.t_pct,
          type_label: currentResult.type_label,
          mbti: currentResult.mbti,
          ab_bucket: config.bucket
        });
      } else {
        // 결과가 없으면 홈으로
        navigate('/');
      }
    };

    loadResult();
  }, [navigate]);

  const handleShare = () => {
    logEvent('share_open');
    navigate('/share');
  };

  const handleMatch = () => {
    logEvent('match_start', { source: 'result' });
    navigate('/match');
  };

  const handleReward = () => {
    logEvent('reward_open');
    navigate('/reward');
  };

  const handleRetake = () => {
    clearCurrentResult();
    logEvent('test_retake');
    navigate('/test');
  };

  if (!result || !abConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lovely-pink"></div>
      </div>
    );
  }

  const ctaOrder = getCTAOrder(abConfig.bucket);

  // Use new analysis logic
  const analysis = analyzePersonality(result.t_pct, result.mbti);
  const content = analysis.tetoAnalysis;
  const mbtiContent = analysis.mbtiAnalysis;

  // Backwards compatibility for UI that uses direct content structure
  // We can fetch the raw content for structure not in analyzePersonality
  const rawContent = getResultContent(result.t_pct);

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="blob-1" />
      <div className="blob-2" />

      <div className="max-w-md mx-auto pt-8">
        {/* 결과 카드 */}
        <GlassCard className="mb-6 text-center" padding="lg" variant="hero">
          <h1 className="text-5xl font-bold mb-8" style={{ color: getTypeColor(result.type_label) }}>
            {result.t_pct}%
          </h1>

          <h2 className="text-2xl font-bold text-charcoal mb-4">
            나의 테토 게이지
          </h2>

          <div className="mb-6">
            <TypeBadge type={result.type_label} size="lg" />
          </div>

          <p className="text-xs text-charcoal-light leading-relaxed opacity-80">
            이 결과는 경향입니다. <br className="hidden sm:block" />관계는 대화로 업데이트됩니다.
          </p>
        </GlassCard>



        {/* 설명 카드 */}
        <GlassCard className="mb-6" padding="md">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-lovely-pink mb-1">
              {content.label}
            </h2>
            <p className="text-sm font-medium text-charcoal-light bg-gray-100 inline-block px-3 py-1 rounded-full">
              {rawContent.subtitle}
            </p>
          </div>

          <div className="bg-white/50 rounded-xl p-4 mb-6 italic text-center text-charcoal font-medium border-l-4 border-lovely-pink">
            {rawContent.quote}
          </div>

          <h3 className="font-semibold text-charcoal mb-3">🧐 당신은 이런 사람</h3>
          <div className="space-y-3 mb-6">
            {rawContent.description.map((desc, idx) => (
              <p key={idx} className="text-sm text-charcoal-light leading-relaxed">
                • {desc}
              </p>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-lg mr-2">💪</span>
              <div>
                <span className="font-semibold text-sm text-charcoal block mb-1">강점</span>
                <p className="text-xs text-charcoal-light">{rawContent.features.strength}</p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-lg mr-2">🥺</span>
              <div>
                <span className="font-semibold text-sm text-charcoal block mb-1">주의할 점</span>
                <p className="text-xs text-charcoal-light">{rawContent.features.weakness}</p>
              </div>
            </div>

            <div className="flex items-start">
              <span className="text-lg mr-2">💞</span>
              <div>
                <span className="font-semibold text-sm text-charcoal block mb-1">환상의 케미</span>
                <p className="text-xs text-charcoal-light">{rawContent.features.chemistry}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* MBTI 상세 분석 카드 (MBTI가 있을 경우) */}
        {mbtiContent && (
          <GlassCard className="mb-6" padding="md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-charcoal">
                T/E + MBTI 케미 분석
              </h2>
              <span className="px-2 py-1 bg-lovely-pink/10 text-lovely-pink text-xs font-bold rounded">
                {mbtiContent.type}
              </span>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-charcoal mb-1">
                {mbtiContent.profile.alias}
              </h3>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-charcoal leading-relaxed word-break-keep">
                {mbtiContent.profile.description}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-charcoal mb-2">💘 연애 스타일</h4>
                <p className="text-sm text-charcoal-light leading-relaxed bg-white/60 p-3 rounded-lg">
                  {mbtiContent.profile.love_style}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-charcoal mb-2">🧠 심리 분석</h4>
                <p className="text-sm text-charcoal-light leading-relaxed bg-white/60 p-3 rounded-lg">
                  {mbtiContent.profile.psychology}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-charcoal mb-2">✨ 테토 앱의 한마디</h4>
                <p className="text-sm font-medium text-lovely-pink leading-relaxed bg-lovely-pink/5 p-3 rounded-lg border border-lovely-pink/20">
                  {mbtiContent.combinationChemistry}
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* CTA 버튼들 - A/B 테스트에 따라 순서 변경 */}
        <div className="space-y-3 mb-6">
          {ctaOrder.map((cta, index) => {
            switch (cta) {
              case 'share':
                return (
                  <GlassButton
                    key={cta}
                    onClick={handleShare}
                    fullWidth
                    size="lg"
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    공유 카드 만들기
                  </GlassButton>
                );
              case 'match':
                return (
                  <GlassButton
                    key={cta}
                    onClick={handleMatch}
                    variant="secondary"
                    fullWidth
                    size="lg"
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    상대와 궁합 보기
                  </GlassButton>
                );
              case 'reward':
                return (
                  <GlassButton
                    key={cta}
                    onClick={handleReward}
                    variant="secondary"
                    fullWidth
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    심화 리포트(선택)
                  </GlassButton>
                );
              default:
                return null;
            }
          })}
        </div>

        {/* 다시하기 버튼 */}
        <div className="text-center">
          <button
            onClick={handleRetake}
            className="text-sm text-charcoal-light hover:text-charcoal transition-colors underline"
          >
            테스트 다시하기
          </button>
        </div>
      </div>

      {/* 면책 사항 */}
      <Disclaimer />
    </div>
  );
};