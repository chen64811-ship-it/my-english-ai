import React, { useState } from 'react';
import { correctEnglishSentence } from '../services/geminiService';

const GrammarChecker: React.FC = () => {
  const [inputSentence, setInputSentence] = useState('');
  const [correctedSentence, setCorrectedSentence] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async () => {
    if (!inputSentence.trim()) return;
    setIsLoading(true);
    const result = await correctEnglishSentence(inputSentence);
    setCorrectedSentence(result);
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">语法检查</h3>
      <div className="mb-4">
        <label className="block mb-2">输入句子：</label>
        <textarea
          value={inputSentence}
          onChange={(e) => setInputSentence(e.target.value)}
          placeholder="请输入需要检查的英文句子"
          className="w-full p-2 border rounded min-h-[100px]"
        />
      </div>
      <button
        onClick={handleCheck}
        disabled={isLoading}
        className="w-full p-2 bg-purple-500 text-white rounded disabled:bg-gray-400"
      >
        {isLoading ? "检查中..." : "检查语法"}
      </button>
      {correctedSentence && (
        <div className="mt-6">
          <h4 className="font-bold mb-2">修正结果：</h4>
          <p className="p-3 border rounded bg-gray-50">{correctedSentence}</p>
        </div>
      )}
    </div>
  );
};

export default GrammarChecker;