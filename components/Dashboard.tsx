import React from 'react';
import { Star, Zap, Trophy, TrendingUp } from 'lucide-react';
import { AppView } from '../types';

const Dashboard: React.FC<{ setView: (v: AppView) => void }> = ({ setView }) => (
  <div className="space-y-8">
    <section className="bg-indigo-600 rounded-3xl p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">欢迎回来! 👋</h1>
      <p className="mb-6">准备好开始今天的英语学习了吗？</p>
      <div className="flex gap-4">
        <button onClick={() => setView('tutor')} className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-bold">继续对话</button>
      </div>
    </section>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[{label:'词汇',val:'128',icon:Star},{label:'连续',val:'7天',icon:Zap},{label:'平均',val:'92%',icon:Trophy},{label:'等级',val:'B2',icon:TrendingUp}].map((s,i)=>(
        <div key={i} className="bg-white p-4 rounded-xl border flex items-center gap-3">
          <s.icon className="text-indigo-500"/><div><p className="text-xs text-gray-400">{s.label}</p><p className="font-bold">{s.val}</p></div>
        </div>
      ))}
    </div>
  </div>
);
export default Dashboard;