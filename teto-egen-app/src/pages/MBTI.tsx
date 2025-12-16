import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { MBTI_DIAGNOSIS_QUESTIONS } from '../data/questions';
import { validateMBTI } from '../utils/testLogic';
import { saveCurrentResult, logEvent } from '../utils/storage';

export const MBTI: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;

  const [mbtiInput, setMbtiInput] = useState('');
  const [error, setError] = useState('');
  const [showSimpleTest, setShowSimpleTest] = useState(false);

  // 20문항 진단 상태
  const [diagnosisStep, setDiagnosisStep] = useState(0);
  const [mbtiScores, setMbtiScores] = useState({ E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 });

  const handleMBTISubmit = () => {
    const validated = validateMBTI(mbtiInput);

    if (!validated) {
      if (mbtiInput.length !== 4) {
        setError('MBTI는 4글자예요! 예: ENTP');
      } else {
        setError('영문 대문자로 입력해 주세요');
      }
      return;
    }

    // 결과에 MBTI 추가
    const updatedResult = {
      ...result,
      mbti: validated
    };

    saveCurrentResult(updatedResult);
    logEvent('mbti_entered', { mbti: validated, source: 'direct' });
    navigate('/result');
  };

  const handleDiagnosticAnswer = (isYes: boolean) => {
    const q = MBTI_DIAGNOSIS_QUESTIONS[diagnosisStep];
    const newScores = { ...mbtiScores };

    if (isYes) {
      // Yes면 해당 차원 점수 증가
      if (q.dimension) {
        newScores[q.dimension] = (newScores[q.dimension] || 0) + 1;
      }
    } else {
      // No면 반대 차원 점수 증가
      const opposite = { 'E': 'I', 'N': 'S', 'T': 'F', 'J': 'P' };
      if (q.dimension) {
        const opp = opposite[q.dimension] as keyof typeof mbtiScores;
        newScores[opp] = (newScores[opp] || 0) + 1;
      }
    }
    setMbtiScores(newScores);

    if (diagnosisStep === MBTI_DIAGNOSIS_QUESTIONS.length - 1) {
      // 최종 계산
      const resultMBTI = [
        newScores.E > newScores.I ? 'E' : 'I', // 동점이면 I
        newScores.N > newScores.S ? 'N' : 'S', // 동점이면 S
        newScores.T > newScores.F ? 'T' : 'F', // 동점이면 F (감정)
        newScores.J > newScores.P ? 'J' : 'P'  // 동점이면 P (유연)
      ].join('');

      // 결과 저장 및 이동
      const validated = validateMBTI(resultMBTI);
      if (validated) {
        const updatedResult = {
          ...result,
          mbti: validated
        };

        saveCurrentResult(updatedResult);
        logEvent('mbti_entered', { mbti: validated, source: 'simple_test' });
        alert(`진단 완료! 당신의 MBTI는 ${validated}로 추정됩니다.`);
        navigate('/result');
      }
    } else {
      setDiagnosisStep(prev => prev + 1);
    }
  };

  if (showSimpleTest) {
    const question = MBTI_DIAGNOSIS_QUESTIONS[diagnosisStep];
    const progress = ((diagnosisStep + 1) / MBTI_DIAGNOSIS_QUESTIONS.length) * 100;

    return (
      <div className="min-h-screen pb-20 px-4 flex items-center">
        <div className="blob-1" />
        <div className="blob-2" />

        <div className="w-full max-w-md mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-charcoal-light font-medium">
                MBTI 진단 중... ({diagnosisStep + 1}/{MBTI_DIAGNOSIS_QUESTIONS.length})
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
              {question.text}
            </h3>

            <div className="space-y-3">
              <GlassButton
                onClick={() => handleDiagnosticAnswer(true)}
                fullWidth
                size="lg"
              >
                네, 그렇습니다
              </GlassButton>
              <GlassButton
                onClick={() => handleDiagnosticAnswer(false)}
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
                setShowSimpleTest(false);
                setDiagnosisStep(0);
                setMbtiScores({ E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 });
              }
            }}
            className="w-full text-center text-sm text-charcoal-light hover:text-charcoal underline p-4"
          >
            진단 취소하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 px-4 flex items-center">
      <div className="blob-1" />
      <div className="blob-2" />

      <div className="w-full max-w-md mx-auto">
        <GlassCard className="mb-6" padding="lg">
          <h2 className="text-2xl font-bold text-charcoal mb-4 text-center">
            MBTI가 있으면
            <span className="block text-xl font-semibold text-lovely-pink">
              더 잘 맞춰요 (Ver 2.0)
            </span>
          </h2>

          <p className="text-charcoal-light text-center mb-6">
            (선택사항이에요!)
          </p>

          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="예) INFP"
                value={mbtiInput}
                onChange={(e) => {
                  setMbtiInput(e.target.value.toUpperCase());
                  setError('');
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-lovely-pink focus:outline-none text-center text-lg font-semibold tracking-wider"
                maxLength={4}
              />

              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}
            </div>

            <div className="flex space-x-3">
              <GlassButton
                onClick={() => setShowSimpleTest(true)}
                variant="secondary"
                fullWidth
              >
                모르면 20문항으로 찾기 (정확도 UP)
              </GlassButton>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-3">
          <GlassButton
            onClick={handleMBTISubmit}
            fullWidth
            size="lg"
          >
            결과 보기
          </GlassButton>

          <GlassButton
            onClick={() => {
              logEvent('mbti_skip');
              navigate('/result');
            }}
            variant="secondary"
            fullWidth
          >
            건너뛰기
          </GlassButton>
        </div>
      </div>
    </div>
  );
};