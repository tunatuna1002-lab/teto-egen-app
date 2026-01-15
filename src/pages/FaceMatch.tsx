import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { FaceAnalysis } from '../components/FaceAnalysis';
import { SEO } from '../components/SEO';
import { AdBanner } from '../components/AdBanner';
import { loadCurrentResult, logEvent } from '../utils/storage';
import {
    FaceType,
    getFaceChemistry,
    getFaceTypeLabel,
    getTetoLevelLabel,
    getMBTIGroupLabel,
    FaceChemistryResult
} from '../data/faceChemistry';
import { Share2, RefreshCw, ArrowLeft } from 'lucide-react';

interface TetoResult {
    t_pct: number;
    type_label: string;
    mbti?: string;
}

export const FaceMatch: React.FC = () => {
    const navigate = useNavigate();
    const [tetoResult, setTetoResult] = useState<TetoResult | null>(null);
    const [chemistryResult, setChemistryResult] = useState<FaceChemistryResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const result = loadCurrentResult();
        if (result) {
            setTetoResult(result);
            logEvent('face_match_start', { has_mbti: !!result.mbti });
        }
    }, []);

    const handleFaceResult = (faceType: FaceType, probability: number) => {
        if (!tetoResult) return;

        const chemistry = getFaceChemistry(faceType, tetoResult.t_pct, tetoResult.mbti);
        setChemistryResult(chemistry);

        logEvent('face_match_complete', {
            face_type: faceType,
            probability,
            character: chemistry.characterName
        });
    };

    const handleError = (errorMsg: string) => {
        setError(errorMsg);
    };

    const handleShare = async () => {
        if (!chemistryResult) return;

        const shareText = `나의 관상+심리 케미 분석 결과!\n${chemistryResult.emoji} ${chemistryResult.characterName}\n"${chemistryResult.subtitle}"\n\n나도 분석하러 가기 👉`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: '테토에겐 - 관상 케미 분석',
                    text: shareText,
                    url: window.location.origin
                });
                logEvent('face_match_share', { method: 'native' });
            } catch (e) {
                // 사용자가 취소했을 경우
            }
        } else {
            // 클립보드에 복사
            await navigator.clipboard.writeText(shareText + ' ' + window.location.origin);
            alert('링크가 복사되었습니다!');
            logEvent('face_match_share', { method: 'clipboard' });
        }
    };

    const handleRetry = () => {
        setChemistryResult(null);
        setError(null);
    };

    const handleBack = () => {
        navigate('/result');
    };

    return (
        <div className="min-h-screen pb-20 px-4">
            <SEO
                title="관상 + 심리 케미 분석 - 테토에겐"
                description="얼굴상과 성격을 조합한 나만의 반전 캐릭터를 찾아보세요!"
            />
            <div className="blob-1" />
            <div className="blob-2" />

            <div className="max-w-md mx-auto pt-8">
                {/* 헤더 */}
                <div className="mb-6">
                    <button
                        onClick={handleBack}
                        className="flex items-center text-charcoal-light hover:text-charcoal mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        결과로 돌아가기
                    </button>
                    <h1 className="text-2xl font-bold text-charcoal text-center">
                        🐶🐱 관상 + 심리 케미 분석
                    </h1>
                    <p className="text-center text-charcoal-light mt-2">
                        외모와 성격의 반전 매력을 찾아드려요!
                    </p>
                </div>

                {/* 테토 결과가 없을 경우 */}
                {!tetoResult && (
                    <GlassCard className="mb-6 text-center" padding="lg">
                        <p className="text-charcoal mb-4">
                            먼저 테토 테스트를 완료해주세요!
                        </p>
                        <GlassButton onClick={() => navigate('/test')} fullWidth>
                            테스트하러 가기
                        </GlassButton>
                    </GlassCard>
                )}

                {/* 사진 업로드 (결과 전) */}
                {tetoResult && !chemistryResult && (
                    <>
                        <GlassCard className="mb-4 text-center" padding="md">
                            <p className="text-sm text-charcoal-light">
                                현재 테토 점수: <span className="font-bold text-lovely-pink">{tetoResult.t_pct}%</span>
                                {tetoResult.mbti && (
                                    <> · MBTI: <span className="font-bold">{tetoResult.mbti}</span></>
                                )}
                            </p>
                        </GlassCard>

                        <FaceAnalysis
                            onResult={handleFaceResult}
                            onError={handleError}
                        />

                        {error && (
                            <GlassCard className="mt-4 text-center" padding="md">
                                <p className="text-red-500">{error}</p>
                            </GlassCard>
                        )}
                    </>
                )}

                {/* 결과 화면 */}
                {chemistryResult && (
                    <>
                        {/* ✨ Dynamic Vibe Background */}
                        <div
                            className="fixed inset-0 -z-10 transition-all duration-1000"
                            style={{
                                background: `linear-gradient(135deg, ${chemistryResult.vibe.auraGradient[0]}, ${chemistryResult.vibe.auraGradient[1]})`
                            }}
                        />

                        {/* 캐릭터 카드 */}
                        <GlassCard
                            className="mb-6 text-center"
                            padding="lg"
                            variant="ultra"
                            style={{
                                backgroundColor: `rgba(255, 255, 255, ${chemistryResult.vibe.glassOpacity})`
                            }}
                        >
                            <div className="text-6xl mb-4">{chemistryResult.emoji}</div>
                            <h2 className="text-2xl font-bold text-charcoal mb-2">
                                {chemistryResult.characterName}
                            </h2>
                            <p
                                className="font-medium mb-4"
                                style={{ color: chemistryResult.vibe.themeColor }}
                            >
                                "{chemistryResult.subtitle}"
                            </p>

                            {/* Vibe 키워드 */}
                            <div className="flex flex-wrap justify-center gap-2 mb-4">
                                {chemistryResult.vibe.keywords.map((keyword, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 text-xs font-medium rounded-full text-white"
                                        style={{ backgroundColor: chemistryResult.vibe.themeColor }}
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>

                            {/* 조합 배지 */}
                            <div className="flex flex-wrap justify-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-white/50 text-charcoal text-xs font-medium rounded-full">
                                    {getFaceTypeLabel(chemistryResult.faceType)}
                                </span>
                                <span className="px-3 py-1 bg-white/50 text-charcoal text-xs font-medium rounded-full">
                                    {getTetoLevelLabel(chemistryResult.tetoLevel)}
                                </span>
                                <span className="px-3 py-1 bg-white/50 text-charcoal text-xs font-medium rounded-full">
                                    {getMBTIGroupLabel(chemistryResult.mbtiGroup)}
                                </span>
                            </div>
                        </GlassCard>

                        {/* 상세 설명 */}
                        <GlassCard className="mb-6" padding="md">
                            <h3 className="font-semibold text-charcoal mb-3">📝 캐릭터 분석</h3>
                            <p className="text-sm text-charcoal-light leading-relaxed mb-4">
                                {chemistryResult.description}
                            </p>

                            <h4 className="font-semibold text-charcoal mb-2">✨ 특징</h4>
                            <div className="flex flex-wrap gap-2">
                                {chemistryResult.traits.map((trait, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1 bg-gray-100 text-charcoal-light text-xs rounded-full"
                                    >
                                        #{trait}
                                    </span>
                                ))}
                            </div>
                        </GlassCard>

                        {/* CTA 버튼 */}
                        <div className="space-y-3 mb-6">
                            <GlassButton onClick={handleShare} fullWidth size="lg">
                                <Share2 className="w-5 h-5 mr-2" />
                                결과 공유하기
                            </GlassButton>
                            <GlassButton onClick={handleRetry} variant="secondary" fullWidth>
                                <RefreshCw className="w-5 h-5 mr-2" />
                                다른 사진으로 다시 분석
                            </GlassButton>
                        </div>
                    </>
                )}
            </div>

            <AdBanner className="max-w-md w-full mx-auto mt-8" />
        </div>
    );
};
