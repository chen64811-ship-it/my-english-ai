import React, { useState } from 'react';
import { Search, Loader2, Volume2 } from 'lucide-react';
import { generateVocabulary } from '../services/geminiService';

const VocabBuilder: React.FC<{setView: any}> = () => {
  const [topic, setTopic] = useState('');
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const handleGen = async () => { setLoading(true); setWords(await generateVocabulary(topic)); setLoading(false); };
  return (
    <div className="space-y-6">
      <div className="flex gap-2"><input value={topic} onChange={e=>setTopic(e.target.value)} className="flex-1 p-3 border rounded-xl" placeholder="话题"/><button onClick={handleGen} className="bg-indigo-600 text-white px-6 rounded-xl">{loading ? <Loader2 className="animate-spin"/> : <Search/>}</button></div>
      {words.map((w,i)=>(<div key={i} className="bg-white p-4 rounded-xl border flex justify-between"><div><p className="font-bold">{w.word}</p><p className="text-gray-500">{w.definition}</p></div><Volume2 className="text-indigo-500 cursor-pointer" onClick={()=>window.speechSynthesis.speak(new SpeechSynthesisUtterance(w.word))}/></div>))}
    </div>
  );
};
export default VocabBuilder;