import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { GlassCard } from '../components/GlassCard';
import { GlassButton } from '../components/GlassButton';
import { TypeBadge } from '../components/TypeBadge';
import { loadCurrentResult, logEvent } from '../utils/storage';



interface ShareCardData {
  type: 'minimal' | 'romantic' | 'match_premium';
}

interface MatchShareState {
  mode: 'match';
  matchResult: any;
  myResult: any;
  otherTPct: number;
  otherMBTI?: string;
  analysis: any;
}

export const Share: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cardRef = useRef<HTMLDivElement>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ShareCardData['type']>('minimal');

  // Handle Match Mode
  const matchState = location.state as MatchShareState | undefined;
  const isMatchMode = matchState?.mode === 'match';

  useEffect(() => {
    // Set default template based on mode
    if (isMatchMode) {
      setSelectedTemplate('match_premium');
    }
  }, [isMatchMode]);

  const result = loadCurrentResult();



  if (!result && !isMatchMode) {
    navigate('/');
    return null;
  }

  const handleShare = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false
      });

      // 이미지 다운로드
      const link = document.createElement('a');
      const filename = isMatchMode
        ? `테토_궁합_${matchState?.myResult.type_label}_${matchState?.otherTPct}_${Date.now()}.png`
        : `테토게이지_${result?.type_label}_${Date.now()}.png`;

      link.download = filename;
      link.href = canvas.toDataURL();
      link.click();

      // 공유 이벤트
      logEvent('share_complete', {
        template: selectedTemplate,
        t_pct: result ? result.t_pct : matchState?.matchResult.attraction,
        type_label: result ? result.type_label : 'COUPLE'
      });

      // 공유 완료 메시지
      alert('이미지가 저장되었습니다! 공유해 주세요 😊');

    } catch (error) {
      console.error('Share error:', error);
      alert('이미지 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };



  const handleCopyLink = () => {
    const params = new URLSearchParams();
    params.set('share', 'true');
    if (isMatchMode && matchState) {
      params.set('mode', 'match');
      params.set('t_pct', matchState.matchResult.attraction.toString());
      params.set('type', 'COUPLE'); // Special type for couple
    } else if (result) {
      params.set('t_pct', result.t_pct.toString());
      params.set('type', result.type_label);
      if (result.mbti) params.set('mbti', result.mbti);
    }

    const url = `${window.location.origin}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    logEvent('share_link_copy', { type: isMatchMode ? 'match' : 'single' });
    alert('결과가 포함된 링크가 복사되었습니다! 친구에게 공유해보세요.');
  };

  const renderCard = () => {
    switch (selectedTemplate) {
      case 'minimal':
        if (!result) return null;
        return (
          <div
            ref={cardRef}
            className="w-full aspect-[4/5] bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg rounded-3xl p-8 flex flex-col justify-center items-center text-center"
            style={{ minHeight: '500px' }}
          >
            <div className="mb-6">
              <p className="text-5xl font-bold" style={{ color: '#FF6FAE' }}>
                {result.t_pct}%
              </p>
            </div>

            <h2 className="text-2xl font-bold text-charcoal mb-4">
              나의 테토 게이지
            </h2>

            <div className="mb-6">
              <TypeBadge type={result.type_label} size="lg" />
            </div>

            {result.mbti && (
              <p className="text-lg text-charcoal-light mb-6">
                MBTI: {result.mbti}
              </p>
            )}

            <p className="text-sm text-charcoal-light mb-2">
              연애 성향 테스트
            </p>

            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-xs text-charcoal-light">
                {window.location.origin}
              </p>
            </div>
          </div>
        );



      case 'romantic':
        if (!result) return null;
        return (
          <div
            ref={cardRef}
            className="w-full aspect-[4/5] bg-gradient-to-br from-orange-100/90 via-pink-100/90 to-purple-100/90 backdrop-blur-lg rounded-3xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden"
            style={{ minHeight: '500px' }}
          >
            {/* 장식 요소 */}
            <div className="absolute top-10 left-10 text-2xl">💫</div>
            <div className="absolute top-20 right-16 text-xl">⭐</div>
            <div className="absolute bottom-20 left-16 text-xl">🌟</div>
            <div className="absolute bottom-10 right-10 text-2xl">✨</div>

            <div className="mb-8">
              <h2 className="text-4xl font-black text-charcoal mb-2 tracking-tight">
                시그널
              </h2>
              <p className="text-sm font-medium text-charcoal/60 tracking-widest uppercase">
                Love Style Report
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 mb-8 shadow-xl ring-1 ring-white/50 w-full max-w-[280px]">
              <p className="text-6xl font-black mb-6 tracking-tighter" style={{ color: '#FF6FAE' }}>
                {result.t_pct}%
              </p>
              <div className="flex justify-center">
                <TypeBadge type={result.type_label} size="lg" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-lg font-bold text-charcoal mb-1">
                {result.type_label === '테토형' ? '도전적인 사랑을 추구해요' :
                  result.type_label === '에겐형' ? '깊이 있는 사랑을 원해요' :
                    '서로 존중하는 사랑을 추구해요'}
              </p>

              {result.mbti && (
                <p className="text-sm font-medium text-charcoal/50">
                  MBTI: <span className="font-bold text-charcoal">{result.mbti}</span>
                </p>
              )}
            </div>

            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-[10px] text-charcoal/30 font-medium tracking-wider">
                {window.location.host}
              </p>
            </div>
          </div>
        );

      case 'match_premium':
        if (!matchState) return null;
        return (
          <div
            ref={cardRef}
            className="w-full aspect-[4/5] bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 backdrop-blur-lg rounded-3xl p-6 flex flex-col justify-between items-center text-center relative overflow-hidden ring-4 ring-white/50"
            style={{ minHeight: '520px' }}
          >
            {/* Background Decos */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl -ml-10 -mb-10"></div>

            <div className="w-full flex justify-between items-center mt-2 px-2">
              <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Love Chemistry</span>
              <span className="text-xs font-bold text-gray-400">{new Date().toLocaleDateString()}</span>
            </div>

            <div className="flex-1 flex flex-col justify-center w-full">
              <h2 className="text-xl font-bold text-charcoal mb-6 bg-white/50 inline-block px-4 py-1 rounded-full mx-auto backdrop-blur-sm border border-white/60 shadow-sm">
                우리의 궁합 리포트
              </h2>

              <div className="flex justify-center items-center gap-4 mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 border-2 border-white shadow-inner flex items-center justify-center mb-2">
                    <span className="text-2xl">😎</span>
                  </div>
                  <span className="text-xs font-bold text-charcoal-light">나</span>
                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full mt-1 text-gray-500">{matchState.myResult.type_label}</span>
                </div>

                <div className="h-0.5 w-10 bg-gray-300 dashed relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-lg">❤️</div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-100 to-rose-100 border-2 border-white shadow-inner flex items-center justify-center mb-2">
                    <span className="text-2xl">🥰</span>
                  </div>
                  <span className="text-xs font-bold text-charcoal-light">그 사람</span>
                  {/* 상대 타입 추정 */}
                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full mt-1 text-gray-500">
                    {matchState.otherTPct >= 60 ? '테토형' : matchState.otherTPct <= 40 ? '에겐형' : '믹스형'}
                  </span>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-sm mb-4 mx-2">
                <p className="text-sm text-charcoal-light mb-1">두 분의 궁합 점수는</p>
                <div className="flex justify-center items-baseline gap-1">
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                    {matchState.matchResult.attraction}
                  </span>
                  <span className="text-lg font-bold text-charcoal/50">점</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${matchState.matchResult.attraction}%` }}></div>
                </div>
              </div>

              <div className="px-4">
                <p className="text-sm font-bold text-charcoal mb-1">"{matchState.analysis?.summary}"</p>
                <p className="text-xs text-charcoal-light line-clamp-2 leading-relaxed">
                  {matchState.analysis?.chemistry}
                </p>
              </div>
            </div>

            <div className="w-full mt-6 bg-charcoal/5 rounded-xl p-3 flex justify-between items-center">
              <div className="text-left">
                <p className="text-[10px] text-charcoal-light font-bold">테토/에겐 궁합 테스트</p>
                <p className="text-[9px] text-charcoal/40">나는 어떤 유형일까?</p>
              </div>
              <div className="bg-charcoal text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
                지금 해보기 ⚡
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };




  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="blob-1" />
      <div className="blob-2" />

      <div className="max-w-md mx-auto pt-12">
        <h1 className="text-2xl font-bold text-charcoal text-center mb-6">
          공유 카드 만들기
        </h1>

        {/* 템플릿 선택 */}
        {/* 템플릿 선택 (싱글 모드일 때만 표시하거나, 매치 모드도 여러 개면 표시) */}
        {!isMatchMode && (
          <GlassCard className="mb-6" padding="md">
            <h3 className="font-semibold text-charcoal mb-4">템플릿 선택</h3>
            <div className="grid grid-cols-3 gap-2">
              {(['minimal', 'romantic'] as const).map((template) => (
                <button
                  key={template}
                  onClick={() => setSelectedTemplate(template)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedTemplate === template
                    ? 'bg-lovely-pink text-white'
                    : 'bg-white/50 text-charcoal-light hover:bg-white/70'
                    }`}
                >
                  {template === 'minimal' && '미니멀'}
                  {template === 'romantic' && '연프 감성'}
                </button>
              ))}
            </div>
          </GlassCard>
        )}

        {/* 미리보기 */}
        <div className="mb-6">
          {renderCard()}
        </div>

        {/* 공유 옵션 */}
        <div className="space-y-3">
          <GlassButton
            onClick={handleShare}
            fullWidth
            size="lg"
            disabled={isGenerating}
          >
            {isGenerating ? '이미지 생성 중...' : '이미지로 저장하기'}
          </GlassButton>

          <GlassButton
            onClick={handleCopyLink}
            variant="secondary"
            fullWidth
          >
            링크 복사하기
          </GlassButton>

          <GlassButton
            onClick={() => navigate('/result')}
            variant="secondary"
            fullWidth
          >
            결과로 돌아가기
          </GlassButton>
        </div>

        {/* 팁 */}
        <GlassCard className="mt-6" padding="md">
          <h3 className="font-semibold text-charcoal mb-2">💡 공유 팁</h3>
          <ul className="text-sm text-charcoal-light space-y-1">
            <li>• 인스타그램 스토리에 올려보세요</li>
            <li>• 친구들과 결과를 비교해 보세요</li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
};