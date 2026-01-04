import React, { useState } from 'react';
import { generateVocabList } from '../services/geminiService';

interface VocabWord {
  word: string;
  meaning: string;
  example: string;
}

const AIUTutor: React.FC = () => {
  const [level, setLevel] = useState('初中');
  const [count, setCount] = useState(5);
  const [vocabList, setVocabList] = useState<VocabWord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    const words = await generateVocabList(level, Number(count));
    setVocabList(words);
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">AI词汇生成</h3>
      <div className="mb-4">
        <label className="block mb-2">难度：</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="初中">初中</option>
          <option value="高中">高中</option>
          <option value="大学四级">大学四级</option>
          <option value="大学六级">大学六级</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">数量：</label>
        <input
          type="number"
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          min={1}
          max={20}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full p-2 bg-green-500 text-white rounded disabled:bg-gray-400"
      >
        {isLoading ? "生成中..." : "生成词汇"}
      </button>
      {vocabList.length > 0 && (
        <div className="mt-6">
          <h4 className="font-bold mb-2">生成结果：</h4>
          <ul className="space-y-3">
            {vocabList.map((word, index) => (
              <li key={index} className="p-3 border rounded">
                <p><strong>单词：</strong>{word.word}</p>
                <p><strong>释义：</strong>{word.meaning}</p>
                <p><strong>例句：</strong>{word.example}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIUTutor;