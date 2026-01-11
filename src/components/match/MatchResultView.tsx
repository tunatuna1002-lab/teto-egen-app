import React from 'react';
import { GlassCard } from '../GlassCard';
import { GlassButton } from '../GlassButton';
import { ScoreBar } from '../ScoreBar';
import { MatchResult } from '../../types';

interface MatchResultViewProps {
    matchResult: MatchResult;
    analysis: any; // Type this properly if possible, using ReturnType<getMatchAnalysis>
    onShare: () => void;
    onReset: () => void;
    onMyResult: () => void;
}

export const MatchResultView: React.FC<MatchResultViewProps> = ({ matchResult, analysis, onShare, onReset, onMyResult }) => {
    return (
        <div className="min-h-screen pb-20 px-4">
            <div className="blob-1" />
            <div className="blob-2" />

            <div className="max-w-md mx-auto pt-8">
                <GlassCard className="mb-6 text-center" padding="lg">
                    <h1 className="text-2xl font-bold text-charcoal mb-2">
                        우리의 궁합은?
                    </h1>
                    <div className="bg-lovely-pink/10 rounded-xl p-4 mt-4">
                        <p className="text-lg font-bold text-lovely-pink text-center word-break-keep">
                            {analysis?.summary}
                        </p>
                    </div>
                </GlassCard>

                {/* 상세 분석 카드 */}
                <GlassCard className="mb-6" padding="md">
                    <h3 className="font-bold text-lg text-charcoal mb-1">
                        {analysis?.title}
                    </h3>
                    <p className="text-sm font-medium text-charcoal-light bg-gray-100 inline-block px-2 py-1 rounded-md mb-4">
                        {analysis?.relationship_type}
                    </p>

                    <div className="space-y-6">
                        <div>
                            <span className="text-lg mr-2">🧪</span>
                            <span className="font-semibold text-charcoal text-sm">케미 분석</span>
                            <p className="text-sm text-charcoal-light mt-1 leading-relaxed">
                                {analysis?.chemistry}
                            </p>
                        </div>

                        <div>
                            <span className="text-lg mr-2">❤️</span>
                            <span className="font-semibold text-charcoal text-sm">우리의 강점</span>
                            <p className="text-sm text-charcoal-light mt-1 leading-relaxed">
                                {analysis?.advice.strength}
                            </p>
                        </div>

                        <div>
                            <span className="text-lg mr-2">⚠️</span>
                            <span className="font-semibold text-charcoal text-sm">조심해야 할 점</span>
                            <p className="text-sm text-charcoal-light mt-1 leading-relaxed">
                                {analysis?.advice.warning}
                            </p>
                        </div>

                        <div className="bg-white/80 rounded-lg p-3 border border-lovely-pink/30">
                            <span className="text-lg mr-2">📌</span>
                            <span className="font-semibold text-charcoal text-sm">솔루션</span>
                            <p className="text-sm font-medium text-lovely-pink mt-1">
                                "{analysis?.advice.action_item}"
                            </p>
                        </div>
                    </div>
                </GlassCard>

                {/* 끌림 */}
                <GlassCard className="mb-4" padding="md">
                    <ScoreBar
                        label="끌림"
                        score={matchResult.attraction}
                        color="#FF6FAE"
                    />
                    <p className="text-xs text-charcoal-light mt-2 text-center">
                        {matchResult.attraction >= 85 ? '강렬한 첫눈의 끌림! 도파민 폭발' :
                            matchResult.attraction >= 65 ? '서로 다른 매력에 궁금해지는 사이' :
                                '편안한 친구 같은 사이'}
                    </p>
                </GlassCard>

                {/* 안정 */}
                <GlassCard className="mb-4" padding="md">
                    <ScoreBar
                        label="안정"
                        score={matchResult.stability}
                        color="#2DD4BF"
                    />
                    <p className="text-xs text-charcoal-light mt-2 text-center">
                        {matchResult.stability >= 80 ? '말하지 않아도 통하는 영혼의 단짝' :
                            matchResult.stability >= 60 ? '배려하며 맞춰가는 성숙한 관계' :
                                '서로의 세계를 이해하는 노력이 필요'}
                    </p>
                </GlassCard>

                {/* 갈등위험 */}
                <GlassCard className="mb-6" padding="md">
                    <ScoreBar
                        label="갈등위험"
                        score={matchResult.conflict}
                        color="#F59E0B"
                    />
                    <p className="text-xs text-charcoal-light mt-2 text-center">
                        {matchResult.conflict >= 70 ? '사랑싸움도 격렬한 "톰과 제리"' :
                            matchResult.conflict >= 40 ? '가끔 틱틱대지만 금방 풀리는 사이' :
                                '물 흐르듯 평온한 무공해 청정구역'}
                    </p>
                </GlassCard>

                <div className="space-y-3">
                    <GlassButton onClick={onShare} fullWidth size="lg">
                        공유 카드 만들기
                    </GlassButton>

                    <GlassButton
                        onClick={onReset}
                        variant="secondary"
                        fullWidth
                    >
                        다른 사람이랑도 해보기
                    </GlassButton>

                    <GlassButton
                        onClick={onMyResult}
                        variant="secondary"
                        fullWidth
                    >
                        내 결과 다시 보기
                    </GlassButton>
                </div>
            </div>
        </div>
    );
};
