import React, { useState } from 'react';

interface VocabWord {
  word: string;
  meaning: string;
  example: string;
}

interface VocabTestProps {
  words: VocabWord[];
}

const VocabTest: React.FC<VocabTestProps> = ({ words }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>(''); // ✅ 仅改这1行，修复类型报错
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  if (words.length === 0) return <div className="text-center py-8">暂无词汇</div>;
  const currentWord = words[currentIndex];

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    const correct = userAnswer.trim().toLowerCase() === currentWord.word.toLowerCase();
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) setScore(prev => prev + 1);
  };

  const handleNext = () => {
    setShowResult(false);
    setUserAnswer('');
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">词汇测试</h3>
      <div className="mb-4">
        <p className="text-gray-700 mb-2"><strong>释义：</strong>{currentWord.meaning}</p>
        <p className="text-gray-600 text-sm mb-4"><strong>例句：</strong>{currentWord.example}</p>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="请输入单词"
          className="w-full p-2 border rounded"
        />
      </div>
      <button 
        onClick={handleSubmit}
        disabled={showResult}
        className="w-full p-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
      >
        提交答案
      </button>
      
      {showResult && (
        <div className="mt-4 text-center">
          <p className={isCorrect ? "text-green-500" : "text-red-500"}>
            {isCorrect ? "✅ 回答正确！" : `❌ 回答错误，正确答案：${currentWord.word}`}
          </p>
          {currentIndex < words.length - 1 && (
            <button 
              onClick={handleNext}
              className="mt-2 p-2 bg-gray-500 text-white rounded"
            >
              下一题
            </button>
          )}
          {currentIndex === words.length - 1 && (
            <p className="mt-4 text-lg font-bold">测试完成！得分：{score}/{words.length}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VocabTest;