import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { LeadFormProvider } from '@/contexts/LeadFormContext';
import LoadingSpinner from '@/components/LoadingSpinner';

import './i18n';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingSpinner />}>
      <BrowserRouter>
        <AuthProvider>
          <LeadFormProvider>
            <App />
          </LeadFormProvider>
        </AuthProvider>
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);
