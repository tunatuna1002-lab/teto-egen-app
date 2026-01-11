import React, { useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const Privacy: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen pb-20 px-4 pt-8">
            <SEO title="개인정보처리방침" description="Teto-Egen Lab의 개인정보처리방침입니다." />
            <div className="blob-1" />

            <div className="max-w-2xl mx-auto">
                <GlassCard padding="lg">
                    <h1 className="text-2xl font-bold text-charcoal mb-6">개인정보처리방침</h1>

                    <div className="prose prose-sm text-charcoal-light space-y-6">
                        <section>
                            <h2 className="text-lg font-semibold text-charcoal mb-2">1. 개인정보의 처리 목적</h2>
                            <p>
                                Teto-Egen Lab(이하 '연구소')은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며 이용 목적이 변경되는 경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>서비스 제공: MBTI 및 성향 분석 결과 제공</li>
                                <li>서비스 개선: 이용자 통계 분석을 통한 서비스 품질 향상</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-charcoal mb-2">2. 처리하는 개인정보의 항목</h2>
                            <p>연구소는 서비스 제공을 위해 다음과 같은 정보를 처리합니다.</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>필수항목: 접속 로그, 쿠키, 접속 IP 정보, 서비스 이용 기록</li>
                                <li>선택항목: 사용자가 입력한 성향 테스트 응답 데이터 (익명 처리됨)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-charcoal mb-2">3. 쿠키(Cookie)의 운용 및 거부</h2>
                            <p>
                                연구소는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
                            </p>
                            <p className="mt-2">
                                특히, <strong>Google AdSense</strong>와 같은 타사 공급업체는 쿠키를 사용하여 사용자가 해당 웹사이트나 다른 웹사이트를 방문한 기록을 바탕으로 광고를 게재할 수 있습니다.
                            </p>
                            <p className="mt-2">
                                사용자는 쿠키 설치에 대한 선택권을 가지고 있으며, 브라우저 옵션 설정을 통해 모든 쿠키를 허용하거나, 거부할 수 있습니다. 다만, 쿠키 저장을 거부할 경우 일부 서비스 이용에 어려움이 있을 수 있습니다.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold text-charcoal mb-2">4. 개인정보의 안전성 확보 조치</h2>
                            <p>연구소는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>관리적 조치: 내부관리계획 수립 및 시행</li>
                                <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 보안프로그램 설치</li>
                            </ul>
                        </section>

                        <div className="pt-6 border-top border-gray-200">
                            <p className="text-xs text-gray-500">본 방침은 2026년 1월 12일부터 시행됩니다.</p>
                        </div>
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
