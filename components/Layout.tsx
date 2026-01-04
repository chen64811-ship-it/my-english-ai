import React from 'react';
import { LayoutDashboard, MessageSquare, BookOpen, CheckSquare, Library, GraduationCap, Trophy } from 'lucide-react';
import { AppView } from '../types';

const Layout: React.FC<{currentView: AppView, setView: (v: AppView) => void, children: React.ReactNode}> = ({ currentView, setView, children }) => {
  const menuItems = [
    { id: 'dashboard', label: '控制面板', icon: LayoutDashboard },
    { id: 'tutor', label: 'AI 导师', icon: MessageSquare },
    { id: 'vocabulary', label: '词汇建设', icon: Library },
    { id: 'test', label: '达标测试', icon: Trophy },
    { id: 'grammar', label: '语法纠错', icon: CheckSquare },
    { id: 'reading', label: '阅读室', icon: BookOpen },
  ] as const;
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-64 bg-white border-r flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><GraduationCap size={24} /></div>
          <span className="text-xl font-bold">LinguistAI</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map(item => (
            <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${currentView === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500'}`}>
              <item.icon size={20} /><span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
};
export default Layout;