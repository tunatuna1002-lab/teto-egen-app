import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { Disclaimer } from '../components/Disclaimer';
import { logEvent } from '../utils/storage';

export const About: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    logEvent('page_view', { page: 'about' });
  }, []);

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="blob-1" />
      <div className="blob-2" />

      <div className="max-w-md mx-auto pt-8">
        <GlassCard className="mb-6" padding="lg">
          <h1 className="text-2xl font-bold text-charcoal mb-6 text-center">
            이게 뭐예요?
          </h1>
          <div className="space-y-6 text-charcoal-light">
            <div>
              <h3 className="font-bold text-lg text-charcoal mb-1">
                🤔 이거 호르몬 수치랑 관련 있나요?
              </h3>
              <p>
                아니요! 자가응답 기반 밈 테스트예요. 과학적 진단이 아니라 재미로 봐주세요.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-charcoal mb-1">
                👀 외모로 판단해도 되나요?
              </h3>
              <p>
                권장하지 않아요! 행동 경향 중심으로 봐주세요. 사람은 겉보다 속이 중요하니까요.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-charcoal mb-1">
                🤷‍♀️ 나는 안 맞는 것 같은데?
              </h3>
              <p>
                그럴 수 있어요! 사람은 상황에 따라 달라지고, 테스트는 경향일 뿐이니까요.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg text-charcoal mb-1">
                💡 이 테스트는 어떻게 만든 거예요?
              </h3>
              <p>
                연애 심리학 연구와 MBTI 이론을 바탕으로 했지만, 과학적 정확도보다는 재미를 추구합니다.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="mb-6" padding="md">
          <h3 className="font-bold text-charcoal mb-3">⚠️ 주의사항</h3>
          <ul className="list-disc list-inside text-sm text-charcoal-light space-y-1">
            <li>이 테스트는 엔터테인먼트 목적입니다</li>
            <li>의학적/심리학적 진단을 대체할 수 없습니다</li>
            <li>결과로 사람을 평가하거나 단정 짓지 마세요</li>
            <li>과몰입은 금물입니다!</li>
          </ul>
        </GlassCard>

        <GlassCard className="mb-6" padding="md">
          <h3 className="font-semibold text-charcoal mb-3">
            📊 테스트 정보
          </h3>
          <div className="space-y-2 text-sm text-charcoal-light">
            <p>• 문항 수: 20개</p>
            <p>• 소요 시간: 약 2분</p>
            <p>• 기준: 자가응답</p>
            <p>• 결과: 경향 기반</p>
          </div>
        </GlassCard>

        <div className="space-y-3">
          <GlassButton onClick={() => navigate('/test')} fullWidth size="lg">
            테스트 해보기
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