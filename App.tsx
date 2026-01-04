import React, { useState } from 'react';
import AIUTutor from './components/AIUTutor.tsx';
import GrammarChecker from './components/GrammarChecker.tsx';
import VocabTest from './components/VocabTest.tsx';
import { generateVocabList } from './services/geminiService';

interface VocabWord {
  word: string;
  meaning: string;
  example: string;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tutor');
  const [testWords, setTestWords] = useState<VocabWord[]>([]);

  const handleGenerateTest = async () => {
    const words = await generateVocabList('高中', 5);
    setTestWords(words);
    setActiveTab('test');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-2">英语AI助手</h1>
        <p className="text-gray-600">词汇生成、语法检查、词汇测试</p>
      </header>

      <nav className="max-w-4xl mx-auto mb-6 flex gap-2 flex-wrap justify-center">
        <button
          onClick={() => setActiveTab('tutor')}
          className={`px-4 py-2 rounded ${activeTab === 'tutor' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
        >
          AI词汇生成
        </button>
        <button
          onClick={() => setActiveTab('checker')}
          className={`px-4 py-2 rounded ${activeTab === 'checker' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
        >
          语法检查
        </button>
        <button
          onClick={handleGenerateTest}
          className="px-4 py-2 rounded bg-green-500 text-white"
        >
          词汇测试
        </button>
      </nav>

      <main className="max-w-4xl mx-auto">
        {activeTab === 'tutor' && <AIUTutor />}
        {activeTab === 'checker' && <GrammarChecker />}
        {activeTab === 'test' && testWords.length > 0 && <VocabTest words={testWords} />}
      </main>
    </div>
  );
};

export default App;