import React, { useState } from 'react';
import { generateVocabQuiz } from '../services/geminiService';

const VocabTest: React.FC = () => {
  const [quiz, setQuiz] = useState<any[]>([]);
  const [curr, setCurr] = useState(0);
  const start = async () => setQuiz(await generateVocabQuiz('General English'));
  if(quiz.length===0) return <button onClick={start} className="bg-indigo-600 text-white px-8 py-3 rounded-xl">开始测试</button>;
  return <div className="bg-white p-8 rounded-xl border"><h2 className="text-2xl font-bold">{quiz[curr].word}</h2><div className="grid gap-2 mt-4">{quiz[curr].options.map((o,i)=>(<button key={i} onClick={()=>setCurr(curr+1)} className="p-3 border rounded-lg hover:bg-indigo-50">{o}</button>))}</div></div>;
};
export default VocabTest;