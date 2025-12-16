import React, { useState } from 'react';
import { GlassCard } from '../GlassCard';
import { GlassButton } from '../GlassButton';
import { TEST_QUESTIONS, MBTI_DIAGNOSIS_QUESTIONS } from '../../data/questions';

interface PartnerDiagnosisProps {
    mode: 'teto' | 'mbti';
    onComplete: (result: { type: 'teto' | 'mbti'; value: number | string }) => void;
    onCancel: () => void;
}

export const PartnerDiagnosis: React.FC<PartnerDiagnosisProps> = ({ mode, onComplete, onCancel }) => {
    const [step, setStep] = useState(0);
    const [scoreAcc, setScoreAcc] = useState(0); // For Teto
    const [mbtiScores, setMbtiScores] = useState({ E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 }); // For MBTI

    // Use the standard 20 questions for partner diagnosis
    const PARTNER_DIAGNOSIS_QUESTIONS = TEST_QUESTIONS.map(q => ({
        ...q,
        text: q.text.replace('저는', '그 사람은').replace('제가', '그 사람이').replace('나의', '그 사람의').replace('내', '그 사람의')
    }));

    const activeQuestions = mode === 'teto' ? PARTNER_DIAGNOSIS_QUESTIONS : MBTI_DIAGNOSIS_QUESTIONS;
    const currentQ = activeQuestions[step];
    const progress = ((step + 1) / activeQuestions.length) * 100;

    const handleAnswer = (isYes: boolean) => {
        if (mode === 'teto') {
            const q = activeQuestions[step] as typeof PARTNER_DIAGNOSIS_QUESTIONS[0];
            let scoreToAdd = 0;
            if (q.type === 'T') {
                scoreToAdd = isYes ? 4 : 0;
            } else {
                scoreToAdd = isYes ? 0 : 4;
            }

            const newScore = scoreAcc + scoreToAdd;

            if (step === activeQuestions.length - 1) {
                const maxScore = activeQuestions.length * 4;
                const finalPct = Math.round((newScore / maxScore) * 100);
                onComplete({ type: 'teto', value: finalPct });
            } else {
                setScoreAcc(newScore);
                setStep(prev => prev + 1);
            }
        } else {
            // MBTI Logic
            const q = activeQuestions[step] as typeof MBTI_DIAGNOSIS_QUESTIONS[0];
            const newScores = { ...mbtiScores };

            if (isYes) {
                if (q.dimension) {
                    newScores[q.dimension] = (newScores[q.dimension] || 0) + 1;
                }
            } else {
                const opposite = { 'E': 'I', 'N': 'S', 'T': 'F', 'J': 'P' };
                if (q.dimension) {
                    const opp = opposite[q.dimension as keyof typeof opposite] as keyof typeof mbtiScores;
                    newScores[opp] = (newScores[opp] || 0) + 1;
                }
            }

            if (step === activeQuestions.length - 1) {
                const resultMBTI = [
                    newScores.E > newScores.I ? 'E' : 'I',
                    newScores.N > newScores.S ? 'N' : 'S',
                    newScores.T > newScores.F ? 'T' : 'F',
                    newScores.J > newScores.P ? 'J' : 'P'
                ].join('');
                onComplete({ type: 'mbti', value: resultMBTI });
            } else {
                setMbtiScores(newScores);
                setStep(prev => prev + 1);
            }
        }
    };

    return (
        <div className="min-h-screen pb-20 px-4 flex flex-col justify-center">
            <div className="blob-1" />
            <div className="blob-2" />

            <div className="max-w-md mx-auto w-full">
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-charcoal-light font-medium">
                            {mode === 'teto' ? '테토 성향 진단 중...' : 'MBTI 추리 중...'} ({step + 1}/{activeQuestions.length})
                        </span>
                    </div>
                    <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                        <div
                            className="bg-lovely-pink h-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <GlassCard className="mb-6" padding="lg">
                    <h3 className="text-xl font-bold text-charcoal mb-8 text-center leading-relaxed word-break-keep">
                        {currentQ.text}
                    </h3>

                    <div className="space-y-3">
                        <GlassButton
                            onClick={() => handleAnswer(true)}
                            fullWidth
                            size="lg"
                        >
                            네, 그렇습니다
                        </GlassButton>
                        <GlassButton
                            onClick={() => handleAnswer(false)}
                            variant="secondary"
                            fullWidth
                            size="lg"
                        >
                            아니요, 그렇지 않습니다
                        </GlassButton>
                    </div>
                </GlassCard>

                <button
                    onClick={() => {
                        if (window.confirm('진단을 취소하고 돌아갈까요?')) {
                            onCancel();
                        }
                    }}
                    className="w-full text-center text-sm text-charcoal-light hover:text-charcoal underline p-4"
                >
                    진단 취소하기
                </button>
            </div>
        </div>
    );
};
