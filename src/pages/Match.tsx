import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { getMatchAnalysis } from '../data/matchContent';
import { loadCurrentResult, saveMatchHistory, logEvent } from '../utils/storage';
import { validateMBTI, calculateCompatibility } from '../utils/testLogic';
import { PartnerDiagnosis } from '../components/match/PartnerDiagnosis';
import { MatchResultView } from '../components/match/MatchResultView';
import { MatchResult } from '../types';

export const Match: React.FC = () => {
  const navigate = useNavigate();

  // States
  const [diagnosisMode, setDiagnosisMode] = useState<'none' | 'teto' | 'mbti'>('none');
  const [otherTPct, setOtherTPct] = useState(50);
  const [otherMBTI, setOtherMBTI] = useState('');
  const [error, setError] = useState('');

  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Load My Result
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

  const handleDiagnosisComplete = (result: { type: 'teto' | 'mbti'; value: number | string }) => {
    if (result.type === 'teto') {
      setOtherTPct(result.value as number);
      alert(`진단 완료! 상대의 테토 성향은 약 ${result.value}% 입니다.`);
    } else {
      setOtherMBTI(result.value as string);
      alert(`진단 완료! 상대의 MBTI는 ${result.value}로 추정됩니다.`);
    }
    setDiagnosisMode('none');
  };

  // 1. Result View
  if (showResults && matchResult) {
    return (
      <MatchResultView
        matchResult={matchResult}
        analysis={analysis}
        onShare={handleInvite}
        onReset={() => {
          setShowResults(false);
          setMatchResult(null);
        }}
        onMyResult={() => navigate('/result')}
      />
    );
  }

  // 2. Diagnosis View
  if (diagnosisMode !== 'none') {
    return (
      <PartnerDiagnosis
        mode={diagnosisMode}
        onComplete={handleDiagnosisComplete}
        onCancel={() => setDiagnosisMode('none')}
      />
    );
  }

  // 3. Input View (Default)
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
              onClick={() => setDiagnosisMode('teto')}
              size="sm"
              variant="secondary"
            >
              ⚡ 테토 성향 진단
              <span className="block text-[10px] opacity-70 mt-1">20문항 / 2분</span>
            </GlassButton>

            <GlassButton
              onClick={() => setDiagnosisMode('mbti')}
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