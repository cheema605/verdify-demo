
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Prevent ResizeObserver loop limit exceeded error from crashing the app (common with Recharts)
const debounce = (callback: (...args: any[]) => void, delay: number) => {
  let tid: any;
  return (...args: any[]) => {
    clearTimeout(tid);
    tid = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

const _ResizeObserver = window.ResizeObserver;
if (_ResizeObserver) {
  window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      super(debounce(callback, 20));
    }
  };
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
