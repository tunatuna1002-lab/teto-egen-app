import React, { useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navigation } from './components/Navigation';
import { getABConfig } from './utils/abTesting';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Test = React.lazy(() => import('./pages/Test').then(module => ({ default: module.Test })));
const MBTI = React.lazy(() => import('./pages/MBTI').then(module => ({ default: module.MBTI })));
const Result = React.lazy(() => import('./pages/Result').then(module => ({ default: module.Result })));
const Match = React.lazy(() => import('./pages/Match').then(module => ({ default: module.Match })));
const Share = React.lazy(() => import('./pages/Share').then(module => ({ default: module.Share })));
const About = React.lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const Reward = React.lazy(() => import('./pages/Reward').then(module => ({ default: module.Reward })));
const FeatureDetail = React.lazy(() => import('./pages/FeatureDetail').then(module => ({ default: module.FeatureDetail })));
const Privacy = React.lazy(() => import('./pages/Privacy').then(module => ({ default: module.Privacy })));
const Terms = React.lazy(() => import('./pages/Terms').then(module => ({ default: module.Terms })));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center text-charcoal-light">
    Loading...
  </div>
);

function App() {
  useEffect(() => {
    // A/B 테스트 설정 적용
    const abConfig = getABConfig();
    document.body.className = `palette-${abConfig.palette}`;
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-lovely-bg to-white">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/test" element={<Test />} />
              <Route path="/mbti" element={<MBTI />} />
              <Route path="/result" element={<Result />} />
              <Route path="/match" element={<Match />} />
              <Route path="/share" element={<Share />} />
              <Route path="/about" element={<About />} />
              <Route path="/reward" element={<Reward />} />
              <Route path="/feature/:id" element={<FeatureDetail />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
            </Routes>
          </Suspense>
          <Navigation />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;