import React, { useState } from 'react';
import { generateReadingRoom } from '../services/geminiService';

const ReadingRoom: React.FC = () => {
  const [p, setP] = useState<any>(null);
  const start = async () => setP(await generateReadingRoom('Intermediate', 'Life'));
  return (
    <div className="bg-white p-6 rounded-xl border">
      {!p ? <button onClick={start} className="bg-indigo-600 text-white px-6 py-2 rounded-xl">生成文章</button> : <div><h2 className="text-2xl font-bold">{p.title}</h2><p className="mt-4">{p.content}</p></div>}
    </div>
  );
};
export default ReadingRoom;