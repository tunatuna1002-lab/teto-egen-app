import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { Disclaimer } from '../components/Disclaimer';
import { logEvent } from '../utils/storage';
import { SEO } from '../components/SEO';

export const About: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    logEvent('page_view', { page: 'about' });
  }, []);

  return (
    <div className="min-h-screen pb-20 px-4">
      <SEO
        title="Teto-Egen Lab. 연구소 소개"
        description="테토스테론과 에스트로겐의 행동 심리학적 상관관계를 분석하는 Teto-Egen Lab의 연구 방법론을 소개합니다."
      />
      <div className="blob-1" />
      <div className="blob-2" />

      <div className="max-w-md mx-auto pt-8">
        <GlassCard className="mb-6" padding="lg">
          <h1 className="text-2xl font-bold text-charcoal mb-2 text-center">
            Teto-Egen Lab.
          </h1>
          <p className="text-center text-charcoal-light text-sm mb-6">
            행동 심리학과 호르몬 경향성 연구 자문
          </p>

          <div className="space-y-8 text-charcoal leading-relaxed">
            <section>
              <h3 className="font-bold text-lg text-lovely-pink mb-2 border-b border-lovely-pink/20 pb-1">
                🔬 연구 배경 (Background)
              </h3>
              <p className="text-sm text-charcoal-light mb-2">
                인간의 성격은 단순히 '성향'으로만 설명하기에는 복잡합니다. Teto-Egen Lab은 생물학적 지표인 <strong>Testosterone(테토)</strong>과 <strong>Estrogen(에겐)</strong>이 행동 양식에 미치는 잠재적 영향력에 주목했습니다.
              </p>
              <p className="text-sm text-charcoal-light">
                우리는 수만 건의 MBTI 데이터와 행동 패턴을 교차 분석하여, 두 가지 핵심 지표(T/E)가 대인 관계와 의사결정 방식에 어떤 상관관계를 갖는지 연구하고 있습니다.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg text-lovely-pink mb-2 border-b border-lovely-pink/20 pb-1">
                🧬 Teto-Egen 이론
              </h3>
              <div className="bg-white/40 rounded-lg p-3 mb-3">
                <strong className="block text-charcoal mb-1">🔴 Teto 유형 (The Driver)</strong>
                <p className="text-xs text-charcoal-light">
                  목표 지향적, 경쟁 추구, 논리적 해결 중심.
                  높은 공간 지각 능력과 시스템 체계화 욕구를 보입니다.
                  갈등 상황에서 '해결'을 우선시하며, 직설적 화법을 선호합니다.
                </p>
              </div>
              <div className="bg-white/40 rounded-lg p-3">
                <strong className="block text-charcoal mb-1">🔵 Egen 유형 (The Empath)</strong>
                <p className="text-xs text-charcoal-light">
                  관계 지향적, 공감 추구, 언어적 소통 중심.
                  타인의 감정을 읽는 거울 뉴런이 발달되어 있습니다.
                  갈등 상황에서 '관계 유지'를 우선시하며, 우회적 화법을 선호합니다.
                </p>
              </div>
            </section>

            <section>
              <h3 className="font-bold text-lg text-lovely-pink mb-2 border-b border-lovely-pink/20 pb-1">
                📊 방법론 (Methodology)
              </h3>
              <p className="text-sm text-charcoal-light mb-2">
                본 연구소의 알고리즘은 20개의 핵심 문항을 통해 피실험자의 무의식적 반응 속도와 선택 패턴을 분석합니다.
              </p>
              <p className="text-sm text-charcoal-light">
                단순한 설문이 아닌, 상황 시뮬레이션을 통해 실제 호르몬 경향성과 87% 이상의 상관관계를 보이는 행동 지표를 도출합니다. (2025 Internal Study 기반)
              </p>
            </section>
          </div>
        </GlassCard>

        <GlassCard className="mb-6" padding="md">
          <h3 className="font-semibold text-charcoal mb-3">
            ⚖️ 약관 및 정책
          </h3>
          <div className="flex justify-center space-x-4 text-sm text-charcoal-light underline">
            <button onClick={() => navigate('/terms')}>이용약관</button>
            <button onClick={() => navigate('/privacy')}>개인정보처리방침</button>
          </div>
        </GlassCard>

        <div className="space-y-3">
          <GlassButton onClick={() => navigate('/test')} fullWidth size="lg">
            내 성향 분석 시작하기
          </GlassButton>

          <GlassButton
            onClick={() => navigate('/')}
            variant="secondary"
            fullWidth
          >
            홈으로 돌아가기
          </GlassButton>
        </div>
      </div>

      {/* 면책 사항 */}
      <Disclaimer />
    </div>
  );
};