import React from 'react';

export const Disclaimer: React.FC = () => {
  return (
    <div className="text-center py-6 px-4">
      <p className="text-xs text-charcoal-light opacity-70">
        © Teto-Egen Lab. 당신의 관계를 완벽하게 분석합니다.<br />
        친구와 공유하여 숨겨진 케미를 발견해보세요!
      </p>
      <div className="mt-4 space-x-4 text-xs text-charcoal-light opacity-50">
        <a href="/terms" className="hover:underline hover:opacity-100 transition-opacity">이용약관</a>
        <span>|</span>
        <a href="/privacy" className="hover:underline hover:opacity-100 transition-opacity">개인정보처리방침</a>
      </div>
    </div>
  );
};