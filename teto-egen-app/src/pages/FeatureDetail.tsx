import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';

const FEATURES = {
    'quick-test': {
        icon: '⚡',
        title: '빠른 성향 테스트',
        subtitle: '20문항으로 알아보는 나의 연애 성향',
        description: [
            '연애할 때 나는 어떤 사람일까요?',
            '단 2분, 20개의 핵심 문항으로',
            '나의 Teto/Egen 성향을 분석해 드립니다.',
            '과학적인 3차원 분석 모델을 경험해 보세요.'
        ],
        buttonText: '테스트 시작하기',
        path: '/test'
    },
    'mbti-match': {
        icon: '💕',
        title: 'MBTI 궁합 분석',
        subtitle: '성격 유형으로 보는 우리의 가능성',
        description: [
            '그 사람과 나는 잘 맞을까요?',
            '상대방의 MBTI만 알고 있다면',
            '우리의 끌림, 안정감, 갈등 위험도를',
            '데이터 기반으로 정밀하게 예측해 드립니다.'
        ],
        buttonText: '궁합 보러가기',
        path: '/match'
    },
    'share': {
        icon: '📱',
        title: '결과 공유하기',
        subtitle: '예쁜 카드로 마음 전하기',
        description: [
            '나의 분석 결과를 친구들에게 자랑해 보세요.',
            '인스타그램, 카카오톡 프로필에 딱 맞는',
            '감성적인 디자인의 카드를 만들어 드립니다.',
            '다양한 템플릿을 선택할 수 있어요.'
        ],
        buttonText: '결과 공유하러 가기',
        path: '/share'
    }
};

export const FeatureDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const feature = FEATURES[id as keyof typeof FEATURES];

    if (!feature) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-charcoal-light">페이지를 찾을 수 없습니다.</p>
                <button onClick={() => navigate('/')} className="ml-2 underline">홈으로</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 px-4 flex items-center">
            <div className="blob-1" />
            <div className="blob-2" />

            <div className="w-full max-w-md mx-auto">
                <GlassCard className="mb-6 text-center" padding="lg">
                    <div className="text-6xl mb-6 animate-bounce-slow">
                        {feature.icon}
                    </div>

                    <h1 className="text-2xl font-bold text-charcoal mb-2">
                        {feature.title}
                    </h1>

                    <p className="text-lovely-pink font-medium mb-8">
                        {feature.subtitle}
                    </p>

                    <div className="bg-white/50 rounded-xl p-6 mb-8 text-left space-y-2">
                        {feature.description.map((line, index) => (
                            <p key={index} className="text-charcoal text-sm leading-relaxed">
                                • {line}
                            </p>
                        ))}
                    </div>

                    <div className="space-y-3">
                        <GlassButton
                            onClick={() => navigate(feature.path)}
                            fullWidth
                            size="lg"
                        >
                            {feature.buttonText}
                        </GlassButton>

                        <GlassButton
                            onClick={() => navigate(-1)}
                            variant="secondary"
                            fullWidth
                        >
                            뒤로 가기
                        </GlassButton>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
