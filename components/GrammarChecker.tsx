import React, { useState } from 'react';
import { checkGrammar } from '../services/geminiService';

const GrammarChecker: React.FC = () => {
  const [text, setText] = useState('');
  const [res, setRes] = useState<any>(null);
  const check = async () => setRes(await checkGrammar(text));
  return (
    <div className="space-y-4">
      <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-32 p-4 border rounded-xl" placeholder="输入句子..."/>
      <button onClick={check} className="bg-indigo-600 text-white px-6 py-2 rounded-xl">检查</button>
      {res && <div className="p-4 bg-green-50 border rounded-xl"><p className="font-bold">修改：</p><p>{res.corrected}</p></div>}
    </div>
  );
};
export default GrammarChecker;