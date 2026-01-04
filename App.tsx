import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AITutor from './components/AITutor';
import VocabBuilder from './components/VocabBuilder';
import GrammarChecker from './components/GrammarChecker';
import ReadingRoom from './components/ReadingRoom';
import VocabTest from './components/VocabTest';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>('dashboard');
  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard setView={setView} />;
      case 'tutor': return <AITutor />;
      case 'vocabulary': return <VocabBuilder setView={setView} />;
      case 'grammar': return <GrammarChecker />;
      case 'reading': return <ReadingRoom />;
      case 'test': return <VocabTest />;
      default: return <Dashboard setView={setView} />;
    }
  };
  return <Layout currentView={currentView} setView={setView}>{renderView()}</Layout>;
};
export default App;