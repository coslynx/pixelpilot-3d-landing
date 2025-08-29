import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import MinimalLayout from './components/layout/MinimalLayout';
import './index.css';
import './base.css';
import ModelShowcasePage from './pages/ModelShowcasePage';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <MinimalLayout>
        <ModelShowcasePage/>
      </MinimalLayout>
    </ThemeProvider>
  );
};

export default App;