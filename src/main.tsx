import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './hooks/useAuth';
import { PinProvider } from './context/PinContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <PinProvider>
        <App />
      </PinProvider>
    </AuthProvider>
  </StrictMode>,
);
