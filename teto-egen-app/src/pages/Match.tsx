import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { ScoreBar } from '../components/ScoreBar';
import { TEST_QUESTIONS, MBTI_DIAGNOSIS_QUESTIONS } from '../data/questions';
import { getMatchAnalysis } from '../data/matchContent';
import { loadCurrentResult, saveMatchHistory, logEvent } from '../utils/storage';
import { validateMBTI, calculateCompatibility } from '../utils/testLogic';

export const Match: React.FC = () => {
  const navigate = useNavigate();

  // States
  const [diagnosisMode, setDiagnosisMode] = useState<'none' | 'teto' | 'mbti'>('none');
  const [diagnosisStep, setDiagnosisStep] = useState(0);
  const [diagnosisScore, setDiagnosisScore] = useState(0); // Raw T score accumulator

  const [otherTPct, setOtherTPct] = useState(50);
  const [otherMBTI, setOtherMBTI] = useState('');
  const [error, setError] = useState('');

  const [mbtiScores, setMbtiScores] = useState({ E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 });
  const [matchResult, setMatchResult] = useState<any>(null); // Replace 'any' with MatchResult type if available
  const [showResults, setShowResults] = useState(false);

  // Use the standard 20 questions for partner diagnosis
  const PARTNER_DIAGNOSIS_QUESTIONS = TEST_QUESTIONS.map(q => ({
    ...q,
    text: q.text.replace('저는', '그 사람은').replace('제가', '그 사람이').replace('나의', '그 사람의').replace('내', '그 사람의')
  }));

  const handleTetoDiagnosis = (isYes: boolean) => {
    const currentQ = PARTNER_DIAGNOSIS_QUESTIONS[diagnosisStep];
    let scoreToAdd = 0;

    if (currentQ.type === 'T') {
      scoreToAdd = isYes ? 4 : 0;
    } else {
      scoreToAdd = isYes ? 0 : 4;
    }

    const newScore = diagnosisScore + scoreToAdd;

    if (diagnosisStep === PARTNER_DIAGNOSIS_QUESTIONS.length - 1) {
      // Calculate final % (Max based on questions length)
      const maxScore = PARTNER_DIAGNOSIS_QUESTIONS.length * 4;
      const finalPct = Math.round((newScore / maxScore) * 100);

      setOtherTPct(finalPct);
      setDiagnosisMode('none');
      setDiagnosisStep(0);
      setDiagnosisScore(0);
      alert(`진단 완료! 상대의 테토 성향은 약 ${finalPct}% 입니다.`);
    } else {
      setDiagnosisScore(newScore);
      setDiagnosisStep(prev => prev + 1);
    }
  };

  const handleMbtiDiagnosis = (isYes: boolean) => {
    const q = MBTI_DIAGNOSIS_QUESTIONS[diagnosisStep];
    const newScores = { ...mbtiScores };

    if (isYes) {
      if (q.dimension) {
        newScores[q.dimension] = (newScores[q.dimension] || 0) + 1;
      }
    } else {
      const opposite = { 'E': 'I', 'N': 'S', 'T': 'F', 'J': 'P' };
      if (q.dimension) {
        const opp = opposite[q.dimension] as keyof typeof mbtiScores;
        newScores[opp] = (newScores[opp] || 0) + 1;
      }
    }
    setMbtiScores(newScores);

    if (diagnosisStep === MBTI_DIAGNOSIS_QUESTIONS.length - 1) {
      const resultMBTI = [
        newScores.E > newScores.I ? 'E' : 'I',
        newScores.N > newScores.S ? 'N' : 'S',
        newScores.T > newScores.F ? 'T' : 'F',
        newScores.J > newScores.P ? 'J' : 'P'
      ].join('');

      setOtherMBTI(resultMBTI);
      setDiagnosisMode('none');
      setDiagnosisStep(0);
      setMbtiScores({ E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 });
      alert(`진단 완료! 상대의 MBTI는 ${resultMBTI}로 추정됩니다.`);
    } else {
      setDiagnosisStep(prev => prev + 1);
    }
  };

  const myResult = loadCurrentResult();

  const handleCalculate = () => {
    if (!myResult) {
      setError('먼저 테스트를 완료해주세요');
      return;
    }

    let normalizedMBTI = undefined;
    if (otherMBTI && otherMBTI.trim() !== '') {
      const validated = validateMBTI(otherMBTI);
      if (!validated) {
        alert('올바른 MBTI 형식이 아닙니다 (예: ENTP)');
        return;
      }
      normalizedMBTI = validated;
    }

    setError('');

    const result = calculateCompatibility(
      myResult.t_pct,
      otherTPct,
      myResult.mbti,
      normalizedMBTI
    );

    setMatchResult(result);
    setShowResults(true);

    saveMatchHistory({
      created_at: new Date(),
      self_snapshot: myResult,
      other_input: {
        t_pct: otherTPct,
        mbti: otherMBTI || undefined
      },
      scores: result
    });

    logEvent('match_complete', {
      my_t_pct: myResult.t_pct,
      other_t_pct: otherTPct,
      my_mbti: myResult.mbti,
      other_mbti: otherMBTI,
      ...result
    });
  };

  const handleInvite = () => {
    logEvent('invite_click');
    navigate('/share', {
      state: {
        mode: 'match',
        matchResult,
        myResult,
        otherTPct,
        otherMBTI,
        analysis // Also pass the analysis text for the card
      }
    });
  };

  // Result Analysis Logic
  const otherTypeLabel = otherTPct >= 60 ? '테토형' : otherTPct <= 40 ? '에겐형' : '반반(믹스형)';
  const analysis = myResult ? getMatchAnalysis(myResult.type_label as any, otherTypeLabel as any, matchResult ? matchResult.attraction : 0) : null;

  if (showResults && matchResult) {
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
            <GlassButton onClick={() => navigate('/share')} fullWidth size="lg">
              공유 카드 만들기
            </GlassButton>

            <GlassButton
              onClick={() => {
                setShowResults(false);
                setMatchResult(null);
              }}
              variant="secondary"
              fullWidth
            >
              다른 사람이랑도 해보기
            </GlassButton>

            <GlassButton
              onClick={() => navigate('/result')}
              variant="secondary"
              fullWidth
            >
              내 결과 다시 보기
            </GlassButton>
          </div>
        </div>
      </div>
    );
  }

  // 진단 화면 (Full Screen)
  if (diagnosisMode !== 'none') {
    const isTeto = diagnosisMode === 'teto';

    // Adjusting variable for loop
    const activeQuestions = isTeto ? PARTNER_DIAGNOSIS_QUESTIONS : MBTI_DIAGNOSIS_QUESTIONS;
    const currentQ = activeQuestions[diagnosisStep];
    const progress = ((diagnosisStep + 1) / activeQuestions.length) * 100;

    return (
      <div className="min-h-screen pb-20 px-4 flex flex-col justify-center">
        <div className="blob-1" />
        <div className="blob-2" />

        <div className="max-w-md mx-auto w-full">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-charcoal-light font-medium">
                {isTeto ? '테토 성향 진단 중...' : 'MBTI 추리 중...'} ({diagnosisStep + 1}/{activeQuestions.length})
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
                onClick={() => isTeto ? handleTetoDiagnosis(true) : handleMbtiDiagnosis(true)}
                fullWidth
                size="lg"
              >
                네, 그렇습니다
              </GlassButton>
              <GlassButton
                onClick={() => isTeto ? handleTetoDiagnosis(false) : handleMbtiDiagnosis(false)}
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
                setDiagnosisMode('none');
                setDiagnosisStep(0);
                setDiagnosisScore(0);
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
    <div className="min-h-screen pb-20 px-4">
      <div className="blob-1" />
      <div className="blob-2" />

      <div className="max-w-md mx-auto pt-8">
        <GlassCard className="mb-6" padding="lg">
          <h1 className="text-2xl font-bold text-charcoal mb-2 text-center">
            상대 정보 입력
          </h1>
          <h2 className="text-xl font-semibold text-lovely-pink mb-6 text-center">
            아는 만큼만
          </h2>

          <p className="text-center text-charcoal-light mb-4">
            어떤 성향인지 잘 모르겠다면?
            <br />
            <span className="text-xs opacity-70">클릭해서 간단하게 진단해보세요!</span>
          </p>

          <div className="grid grid-cols-2 gap-3 mb-2">
            <GlassButton
              onClick={() => {
                setDiagnosisMode('teto');
                setDiagnosisStep(0);
              }}
              size="sm"
              variant="secondary"
            >
              ⚡ 테토 성향 진단
              <span className="block text-[10px] opacity-70 mt-1">20문항 / 2분</span>
            </GlassButton>

            <GlassButton
              onClick={() => {
                setDiagnosisMode('mbti');
                setDiagnosisStep(0);
              }}
              size="sm"
              variant="secondary"
            >
              🧩 MBTI 추리
              <span className="block text-[10px] opacity-70 mt-1">20문항 (정확도 UP) / 2분</span>
            </GlassButton>
          </div>
        </GlassCard>

        {/* 상대 테토% */}
        <GlassCard className="mb-6" padding="md">
          <h3 className="font-semibold text-charcoal mb-4">
            상대의 테토 게이지 (추정)
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-charcoal-light">에겐형</span>
              <span className="text-sm text-charcoal-light">테토형</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={otherTPct}
              onChange={(e) => setOtherTPct(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #6B7CFF 0%, #FF6FAE ${otherTPct}%, #e5e7eb ${otherTPct}%, #e5e7eb 100%)`
              }}
            />

            <div className="text-center">
              <span className="text-lg font-bold text-charcoal">
                {otherTPct}%
              </span>
            </div>
          </div>
        </GlassCard>

        {/* 상대 MBTI */}
        <GlassCard className="mb-6" padding="md">
          <h3 className="font-semibold text-charcoal mb-4">
            상대의 MBTI (선택)
          </h3>

          <input
            type="text"
            placeholder="예) ENTP"
            value={otherMBTI}
            onChange={(e) => setOtherMBTI(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-lovely-pink focus:outline-none text-center text-lg font-semibold tracking-wider"
            maxLength={4}
          />
        </GlassCard>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <GlassButton onClick={handleCalculate} fullWidth size="lg">
            궁합 계산
          </GlassButton>

          <GlassButton
            onClick={handleInvite}
            variant="secondary"
            fullWidth
          >
            링크로 초대하기
          </GlassButton>

          <GlassButton
            onClick={() => navigate('/result')}
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