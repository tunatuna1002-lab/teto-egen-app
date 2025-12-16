import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { ScoreBar } from '../components/ScoreBar';
import { TEST_QUESTIONS } from '../data/questions';
import { calculateTestScore } from '../utils/testLogic';
import { saveCurrentResult, logEvent } from '../utils/storage';

export const Test: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    logEvent('test_page_view');
  }, []);

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    // 진행률 로깅
    logEvent('question_answered', {
      question: currentQuestion + 1,
      score,
      total: newAnswers.length
    });

    if (currentQuestion < TEST_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 테스트 완료
      completeTest(newAnswers);
    }
  };

  const completeTest = async (finalAnswers: number[]) => {
    setIsLoading(true);

    // 로딩 시작
    setIsLoading(true);

    try {
      // 결과 계산
      const result = calculateTestScore(finalAnswers);

      // 결과 저장
      saveCurrentResult(result);

      // 완료 이벤트
      logEvent('test_complete', {
        t_pct: result.t_pct,
        type_label: result.type_label
      });

      // MBTI 입력 페이지로 이동
      setTimeout(() => {
        navigate('/mbti', { state: { result } });
      }, 1500);

    } catch (error) {
      console.error('Test completion error:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="blob-1" />
        <div className="blob-2" />
        <GlassCard className="text-center max-w-sm mx-auto" padding="lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lovely-pink mx-auto mb-4"></div>
          <p className="text-charcoal-light animate-pulse">
            {[
              "게이지 측정 중... (도망 금지)",
              "연애 알고리즘(밈 버전) 가동!",
              "결과 만드는 중... 너무 진지하면 튕깁니다"
            ][Math.floor(Math.random() * 3)]}
          </p>
        </GlassCard>
      </div>
    );
  }

  if (currentQuestion >= TEST_QUESTIONS.length) {
    return null;
  }

  const question = TEST_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / TEST_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen pb-20 px-4 flex items-center">
      <div className="blob-1" />
      <div className="blob-2" />

      <div className="w-full max-w-md mx-auto">
        {/* 진행률 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-charcoal-light">
              내 연애 모드 측정 중 {currentQuestion + 1}/{TEST_QUESTIONS.length}
            </span>
          </div>
          <ScoreBar
            label="진행률"
            score={progress}
            color="#FF6FAE"
            showValue={false}
          />
        </div>

        {/* 질문 카드 */}
        <GlassCard className="mb-8" padding="lg">
          <h2 className="text-xl font-semibold text-charcoal mb-8 text-center leading-relaxed">
            {question.text}
          </h2>

          <div className="space-y-3">
            {[0, 1, 2, 3, 4].map((score) => (
              <GlassButton
                key={score}
                onClick={() => handleAnswer(score)}
                variant="secondary"
                fullWidth
                className="text-left px-4 py-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-charcoal">
                    {score === 0 && '전혀 아니다'}
                    {score === 1 && '아니다'}
                    {score === 2 && '보통이다'}
                    {score === 3 && '그렇다'}
                    {score === 4 && '매우 그렇다'}
                  </span>
                  <span className="text-xs text-charcoal-light">
                    {score}점
                  </span>
                </div>
              </GlassButton>
            ))}
          </div>
        </GlassCard>

        {/* 뒤로가기 버튼 */}
        {currentQuestion > 0 && (
          <button
            onClick={() => {
              setCurrentQuestion(currentQuestion - 1);
              setAnswers(answers.slice(0, -1));
            }}
            className="w-full text-center text-sm text-charcoal-light hover:text-charcoal transition-colors underline"
          >
            이전 문항으로
          </button>
        )}
      </div>
    </div>
  );
};