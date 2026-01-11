import React from 'react'

import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'

// IndexedDB 초기화 확인
try {
  const request = indexedDB.open('test');
  request.onsuccess = () => {
    // console.log('IndexedDB is available');
  };
  request.onerror = () => {
    console.warn('IndexedDB not available, falling back to localStorage');
  };
} catch (error) {
  console.warn('IndexedDB not supported:', error);
}

console.log("version 3.0 active");
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)