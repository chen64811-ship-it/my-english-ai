import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { getGeminiClient } from '../services/geminiService';

const AITutor: React.FC = () => {
  const [messages, setMessages] = useState([{ role: 'model', text: '你好！我是你的 AI 导师。' }]);
  const [input, setInput] = useState('');
  const chatRef = useRef<any>(null);
  const send = async () => {
    const t = input; setInput(''); setMessages(m => [...m, {role:'user', text:t}]);
    if(!chatRef.current) chatRef.current = getGeminiClient().chats.create({model:'gemini-3-flash-preview'});
    const res = await chatRef.current.sendMessage({message:t});
    setMessages(m => [...m, {role:'model', text:res.text}]);
  };
  return (
    <div className="flex flex-col h-[60vh] bg-white rounded-xl border">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">{messages.map((m,i)=>(<div key={i} className={`p-3 rounded-lg ${m.role==='user'?'bg-indigo-600 text-white ml-auto':'bg-gray-100 mr-auto'}`} style={{maxWidth:'80%'}}>{m.text}</div>))}</div>
      <div className="p-4 border-t flex gap-2"><input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 p-2 border rounded-lg"/><button onClick={send} className="bg-indigo-600 text-white p-2 rounded-lg"><Send/></button></div>
    </div>
  );
};
export default AITutor;