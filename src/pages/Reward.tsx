import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { ScoreBar } from '../components/ScoreBar';
import { loadCurrentResult, logEvent } from '../utils/storage';
import { DEEP_QUESTIONS } from '../data/questions';

export const Reward: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'intro' | 'question' | 'loading' | 'report'>('intro');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [deepAnswers, setDeepAnswers] = useState<number[]>([]);

  const result = loadCurrentResult();

  if (!result) {
    navigate('/');
    return null;
  }

  const handleStartAnalysis = () => {
    logEvent('deep_analysis_start');
    setStep('question');
  };

  const handleAnswer = (score: number) => {
    const newAnswers = [...deepAnswers, score];
    setDeepAnswers(newAnswers);

    if (currentQIndex < DEEP_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setStep('loading');
      setTimeout(() => {
        logEvent('deep_analysis_complete');
        setStep('report');
      }, 2000);
    }
  };

  // 심층 분석 리포트 콘텐츠 생성 함수
  const getReportContent = () => {
    const isTeto = result.type_label === '테토형';
    const isEgen = result.type_label === '에겐형';

    return {
      psychAnalysis: {
        title: "전문가 심리 분석",
        content: isTeto
          ? "당신은 관계에서 '효능감'을 중요시합니다. 사랑도 성취해야 할 목표처럼 여기며, 문제가 생기면 빠르게 해결하고 최적화하려는 경향이 있습니다. 상대방에게 가장 바라는 것은 '인정'과 '존중'이며, 비효율적이거나 감정 소모적인 싸움을 극도로 기피합니다. 하지만 이 성향이 지나치면 상대를 통제하려 들거나 차갑게 느껴질 수 있다는 점을 유의해야 합니다."
          : isEgen
            ? "당신은 관계에서 '정서적 연결'을 최우선으로 둡니다. 끊임없이 서로의 감정을 확인하고 공유받길 원하며, '우리'라는 울타리 안에서의 안정을 추구합니다. 상대방에게 가장 바라는 것은 '공감'과 '애정 표현'이며, 갈등 상황에서 논리적 시시비비보다 내 마음을 알아주는 것을 더 중요하게 여깁니다. 지나치면 의존적으로 보이거나 사소한 것에 서운함을 느낄 수 있습니다."
            : "당신은 상황에 따라 태세 전환이 빠른 '하이브리드' 유전자를 가지고 있습니다. 이성과 감정의 균형을 맞추려 노력하지만, 때로는 두 마리 토끼를 다 잡으려다 내적 갈등을 겪기도 합니다. 상대방의 성향에 맞춰 유연하게 대처할 수 있는 것이 가장 큰 무기입니다.",
        keyword: isTeto ? "#해결사 #성취지향 #효율러" : isEgen ? "#공감왕 #관계지향 #감성러" : "#유연함 #밸런스 #처세술"
      },
      conflictSolution: {
        title: "갈등 트리거 & 해결 솔루션",
        triggers: [
          {
            name: isTeto ? "논리적 팩트 폭격" : "감정적 호소와 서운함",
            desc: isTeto
              ? "당신의 논리정연한 말이 상대에게는 '차가운 비수'처럼 꽂힐 수 있습니다. 의도는 좋았더라도 상대는 상처받고 입을 닫아버릴 수 있습니다."
              : "반복적인 감정 표출은 상대방을 지치게 만듭니다. '왜 내 맘을 몰라줘?'라는 태도는 상대에게 해결할 수 없는 숙제처럼 느껴집니다.",
            solution: isTeto
              ? "💡 솔루션: '해결책'을 제시하기 전에 '감정 읽어주기(Validation)' 3초만 먼저 하세요. \"그랬구나, 속상했겠네\" 한 마디면 1시간 싸움을 5분으로 줄일 수 있습니다."
              : "💡 솔루션: 감정을 말하기 전에 '원하는 행동'을 구체적으로 요청하세요. \"나 서운해\" 대신 \"안아줬으면 좋겠어\"라고 말하면 100% 통합니다."
          }
        ]
      },
      communication: {
        title: "실전 대화 스크립트",
        scripts: [
          {
            situation: "상대방이 힘든 일을 털어놓을 때",
            bad: isTeto ? "\"그래서 결론이 뭐야? 이렇게 하면 되잖아.\"" : "\"헐 어떡해 ㅠㅠ (같이 울기만 하고 대안 없음)\"",
            good: isTeto
              ? "\"저런, 진짜 힘들었겠다. (공감) 내가 도와줄 수 있는 게 있을까? (해결)\""
              : "\"정말 속상했겠다.. (공감) 일단 맛있는 거 먹으러 갈까? (환기)\""
          },
          {
            situation: "상대방에게 불만이 생겼을 때",
            bad: isTeto ? "\"너는 왜 항상 이런 식이야? (비난)\"" : "\"(말 안 하고 뚱해 있기)\"",
            good: isTeto
              ? "\"네가 ~할 때 내가 좀 서운해. 다음엔 ~해줄 수 있어? (I-message)\""
              : "\"지금 내 기분이 조금 안 좋아. 잠시 생각할 시간을 줘. (감정 언어화)\""
          }
        ]
      }
    };
  };

  const report = getReportContent();

  if (step === 'intro') {
    return (
      <div className="min-h-screen pb-20 px-4 flex items-center">
        <div className="blob-1" />
        <div className="blob-2" />

        <div className="w-full max-w-md mx-auto">
          <GlassCard className="text-center mb-6" padding="lg">
            <h1 className="text-2xl font-bold text-charcoal mb-4">
              심층 성향 분석
            </h1>
            <p className="text-charcoal-light mb-8">
              단순한 유형 진단을 넘어,<br />
              당신의 무의식적 연애 패턴을 분석합니다.
            </p>
            <div className="bg-white/50 rounded-xl p-4 mb-8 text-left space-y-2 text-sm text-charcoal-light">
              <p>✔️ 10개의 심층 질문 추가 진행</p>
              <p>✔️ 전문가 심리 분석 리포트</p>
              <p>✔️ 갈등 해결 솔루션 제공</p>
            </div>
          </GlassCard>

          <div className="space-y-3">
            <GlassButton onClick={handleStartAnalysis} fullWidth size="lg">
              심층 분석 시작하기
            </GlassButton>
            <GlassButton
              onClick={() => navigate('/result')}
              variant="secondary"
              fullWidth
            >
              다음에 할게요
            </GlassButton>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'question') {
    const question = DEEP_QUESTIONS[currentQIndex];
    const progress = ((currentQIndex + 1) / DEEP_QUESTIONS.length) * 100;

    return (
      <div className="min-h-screen pb-20 px-4 flex items-center">
        <div className="blob-1" />
        <div className="blob-2" />

        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <span className="text-sm text-charcoal-light mb-2 block">
              심층 분석 중 {currentQIndex + 1}/{DEEP_QUESTIONS.length}
            </span>
            <ScoreBar label="" score={progress} color="#FF6FAE" showValue={false} />
          </div>

          <GlassCard className="mb-6" padding="lg">
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
                  className="text-left px-4 py-3"
                >
                  <div className="flex justify-between">
                    <span>
                      {score === 0 && '전혀 아니다'}
                      {score === 1 && '아니다'}
                      {score === 2 && '보통이다'}
                      {score === 3 && '그렇다'}
                      {score === 4 && '매우 그렇다'}
                    </span>
                    <span className="text-xs opacity-50">{score}점</span>
                  </div>
                </GlassButton>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="blob-1" />
        <div className="blob-2" />
        <GlassCard className="text-center max-w-sm mx-auto" padding="lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lovely-pink mx-auto mb-4"></div>
          <p className="text-charcoal-light animate-pulse">
            심층 데이터 분석 중...<br />
            (뇌과학 연구소 서버 접속 중)
          </p>
        </GlassCard>
      </div>
    );
  }

  // Report View
  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="blob-1" />
      <div className="blob-2" />

      <div className="max-w-md mx-auto pt-8">
        <GlassCard className="mb-6 text-center" padding="lg" variant="hero">
          <h1 className="text-xl font-bold text-charcoal mb-2">
            Professional Report
          </h1>
          <h2 className="text-3xl font-bold text-lovely-pink mb-4">
            {result.type_label} 심층 분석
          </h2>
          <p className="text-charcoal-light font-medium">
            {report.psychAnalysis.keyword}
          </p>
        </GlassCard>

        {/* 심리 분석 */}
        <GlassCard className="mb-6" padding="md">
          <h3 className="font-bold text-charcoal mb-3 flex items-center">
            <span className="text-xl mr-2">🧠</span> {report.psychAnalysis.title}
          </h3>
          <p className="text-sm text-charcoal-light leading-relaxed text-justify">
            {report.psychAnalysis.content}
          </p>
        </GlassCard>

        {/* 갈등 솔루션 */}
        <GlassCard className="mb-6" padding="md">
          <h3 className="font-bold text-charcoal mb-3 flex items-center">
            <span className="text-xl mr-2">⚡</span> {report.conflictSolution.title}
          </h3>
          {report.conflictSolution.triggers.map((item, idx) => (
            <div key={idx} className="space-y-3">
              <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                <p className="font-bold text-red-600 text-sm mb-1">⚠️ 주의: {item.name}</p>
                <p className="text-xs text-charcoal-light">{item.desc}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                <p className="text-sm text-green-800 font-medium leading-relaxed">
                  {item.solution}
                </p>
              </div>
            </div>
          ))}
        </GlassCard>

        {/* 대화 스크립트 */}
        <GlassCard className="mb-6" padding="md">
          <h3 className="font-bold text-charcoal mb-3 flex items-center">
            <span className="text-xl mr-2">💬</span> {report.communication.title}
          </h3>
          <div className="space-y-4">
            {report.communication.scripts.map((script, idx) => (
              <div key={idx} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                <p className="font-semibold text-sm text-charcoal mb-2">Situation: {script.situation}</p>
                <div className="grid grid-cols-1 gap-2">
                  <div className="bg-gray-100 p-2 rounded text-xs text-gray-500">
                    ❌ <span className="line-through">{script.bad}</span>
                  </div>
                  <div className="bg-lovely-pink/10 p-2 rounded text-xs text-lovely-pink font-medium">
                    ⭕ {script.good}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-3">
          <GlassButton onClick={() => navigate('/share')} fullWidth size="lg">
            공유 카드 만들기
          </GlassButton>
          <GlassButton onClick={() => navigate('/match')} variant="secondary" fullWidth>
            궁합 테스트하기
          </GlassButton>
          <GlassButton onClick={() => navigate('/result')} variant="secondary" fullWidth>
            결과로 돌아가기
          </GlassButton>
        </div>
      </div>
    </div>
  );
};