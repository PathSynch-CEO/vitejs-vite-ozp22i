import React from 'react';
import { createRoot } from 'react-dom/client';
import * as Sentry from "@sentry/react";
import App from './App';
import './index.css';

// Initialize Sentry
Sentry.init({
  dsn: "https://7096f7b9353a25a9afffe41ccfa3fe7f@o4508342019424256.ingest.us.sentry.io/4508342033252352",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^https:\/\/.*pathsynch\.com\/api/],
  // Session Replay
  replaysSessionSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,
  // Environment
  environment: process.env.NODE_ENV,
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);