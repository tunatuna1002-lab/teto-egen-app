import React, { useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const Terms: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen pb-20 px-4 pt-8">
            <SEO title="이용약관" description="Teto-Egen Lab 이용약관입니다." />
            <div className="blob-1" />

            <div className="max-w-2xl mx-auto">
                <GlassCard padding="lg">
                    <h1 className="text-2xl font-bold text-charcoal mb-6">이용약관</h1>

                    <div className="prose prose-sm text-charcoal-light space-y-6">
                        <section>
                            <h2 className="text-lg font-semibold text-charcoal mb-2">제1조 (목적)</h2>
                            <p>
                                본 약관은 Teto-Egen Lab(이하 "연구소")이 제공하는 웹 서비스(이하 "서비스")의 이용조건 및 절차, 이용자와 연구소의 권리, 의무, 책임사항을 규정함을 목적으로 합니다.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-charcoal mb-2">제2조 (용어의 정의)</h2>
                            <p>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>"서비스"라 함은 연구소가 제공하는 성향 분석 및 관련 제반 서비스를 의미합니다.</li>
                                <li>"이용자"라 함은 서비스에 접속하여 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-charcoal mb-2">제3조 (서비스의 제공)</h2>
                            <p>
                                연구소는 다음과 같은 업무를 수행합니다.
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>성향 분석 알고리즘 개발 및 테스트 제공</li>
                                <li>분석 결과 리포트 제공</li>
                                <li>기타 연구소가 정하는 업무</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-charcoal mb-2">제4조 (면책조항)</h2>
                            <p>
                                본 서비스에서 제공하는 분석 결과는 통계 및 심리학적 이론에 기반한 연구 목적의 데이터이며, 전문적인 의학적 진단이나 상담을 대체할 수 없습니다. 연구소는 서비스 이용으로 인해 발생한 결과에 대해 법적인 책임을 지지 않습니다.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-charcoal mb-2">제5조 (광고의 게재)</h2>
                            <p>
                                연구소는 서비스의 운영과 관련하여 서비스 화면, 홈페이지 등에 광고를 게재할 수 있습니다.
                            </p>
                        </section>
                    </div>

                    <div className="mt-8">
                        <GlassButton onClick={() => navigate(-1)} variant="secondary" fullWidth>
                            뒤로 가기
                        </GlassButton>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
