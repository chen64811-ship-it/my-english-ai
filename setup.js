const fs = require('fs');
const path = require('path');

// Gemini提供的所有文件（路径+内容）
const files = {
  'package.json': `{
  "name": "linguist-ai",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@google/genai": "^1.34.0",
    "lucide-react": "^0.562.0",
    "react": "^19.2.3",
    "react-dom": "^19.2.3"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.4.5",
    "vite": "^5.2.11"
  }
}`,
  'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`,
  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["./**/*.ts", "./**/*.tsx"]
}`,
  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
}`,
  'postcss.config.js': `export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}`,
  'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LinguistAI - Master English with AI</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/index.tsx"></script>
</body>
</html>`,
  'index.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<React.StrictMode><App /></React.StrictMode>);
}`,
  'types.ts': `export type AppView = 'dashboard' | 'tutor' | 'vocabulary' | 'grammar' | 'reading' | 'test';
export interface VocabularyItem { word: string; phonetic: string; definition: string; example: string; chineseTranslation: string; }
export interface VocabQuizQuestion { word: string; options: string[]; correctIndex: number; chineseMeaning: string; exampleSentence: string; }
export interface GrammarSuggestion { original: string; corrected: string; explanation: string; }
export interface ReadingPassage { title: string; content: string; level: string; questions: { question: string; options: string[]; answer: number; }[]; }`,
  'services/geminiService.ts': `import { GoogleGenAI, Type } from "@google/genai";
import { VocabularyItem, GrammarSuggestion, ReadingPassage, VocabQuizQuestion } from "../types";

export const getGeminiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVocabulary = async (topic: string): Promise<VocabularyItem[]> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: \`Generate 5 English vocabulary words related to "\${topic}". Provide phonetic, definition, example, and Chinese translation.\`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            phonetic: { type: Type.STRING },
            definition: { type: Type.STRING },
            example: { type: Type.STRING },
            chineseTranslation: { type: Type.STRING },
          },
          required: ["word", "phonetic", "definition", "example", "chineseTranslation"],
        },
      },
    },
  });
  return JSON.parse(response.text || "[]");
};

export const checkGrammar = async (text: string): Promise<GrammarSuggestion> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: \`Check grammar: "\${text}"\`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { original: { type: Type.STRING }, corrected: { type: Type.STRING }, explanation: { type: Type.STRING } },
        required: ["original", "corrected", "explanation"],
      },
    },
  });
  return JSON.parse(response.text || "{}");
};

export const generateReadingRoom = async (level: string, topic: string): Promise<ReadingPassage> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: \`Write story for \${level} about \${topic}.\`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: { title: { type: Type.STRING }, content: { type: Type.STRING }, level: { type: Type.STRING }, questions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { question: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, answer: { type: Type.NUMBER } } } } },
      },
    },
  });
  return JSON.parse(response.text || "{}");
};

export const generateVocabQuiz = async (topic: string): Promise<VocabQuizQuestion[]> => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: \`10 MCQs for \${topic}\`,
    config: {
      responseMimeType: "application/json",
      responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { word: { type: Type.STRING }, options: { type: Type.ARRAY, items: { type: Type.STRING } }, correctIndex: { type: Type.NUMBER }, chineseMeaning: { type: Type.STRING }, exampleSentence: { type: Type.STRING } } } },
    },
  });
  return JSON.parse(response.text || "[]");
};`,
  'App.tsx': `import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AITutor from './components/AITutor';
import VocabBuilder from './components/VocabBuilder';
import GrammarChecker from './components/GrammarChecker';
import ReadingRoom from './components/ReadingRoom';
import VocabTest from './components/VocabTest';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>('dashboard');
  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard setView={setView} />;
      case 'tutor': return <AITutor />;
      case 'vocabulary': return <VocabBuilder setView={setView} />;
      case 'grammar': return <GrammarChecker />;
      case 'reading': return <ReadingRoom />;
      case 'test': return <VocabTest />;
      default: return <Dashboard setView={setView} />;
    }
  };
  return <Layout currentView={currentView} setView={setView}>{renderView()}</Layout>;
};
export default App;`,
  'components/Layout.tsx': `import React from 'react';
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
            <button key={item.id} onClick={() => setView(item.id)} className={\`w-full flex items-center gap-3 px-4 py-3 rounded-lg \${currentView === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500'}\`}>
              <item.icon size={20} /><span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
};
export default Layout;`,
  'components/Dashboard.tsx': `import React from 'react';
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
export default Dashboard;`,
  'components/VocabBuilder.tsx': `import React, { useState } from 'react';
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
export default VocabBuilder;`,
  'components/AITutor.tsx': `import React, { useState, useRef } from 'react';
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
      <div className="flex-1 overflow-y-auto p-4 space-y-2">{messages.map((m,i)=>(<div key={i} className={\`p-3 rounded-lg \${m.role==='user'?'bg-indigo-600 text-white ml-auto':'bg-gray-100 mr-auto'}\`} style={{maxWidth:'80%'}}>{m.text}</div>))}</div>
      <div className="p-4 border-t flex gap-2"><input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 p-2 border rounded-lg"/><button onClick={send} className="bg-indigo-600 text-white p-2 rounded-lg"><Send/></button></div>
    </div>
  );
};
export default AITutor;`,
  'components/VocabTest.tsx': `import React, { useState } from 'react';
import { generateVocabQuiz } from '../services/geminiService';

const VocabTest: React.FC = () => {
  const [quiz, setQuiz] = useState<any[]>([]);
  const [curr, setCurr] = useState(0);
  const start = async () => setQuiz(await generateVocabQuiz('General English'));
  if(quiz.length===0) return <button onClick={start} className="bg-indigo-600 text-white px-8 py-3 rounded-xl">开始测试</button>;
  return <div className="bg-white p-8 rounded-xl border"><h2 className="text-2xl font-bold">{quiz[curr].word}</h2><div className="grid gap-2 mt-4">{quiz[curr].options.map((o,i)=>(<button key={i} onClick={()=>setCurr(curr+1)} className="p-3 border rounded-lg hover:bg-indigo-50">{o}</button>))}</div></div>;
};
export default VocabTest;`,
  'components/GrammarChecker.tsx': `import React, { useState } from 'react';
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
export default GrammarChecker;`,
  'components/ReadingRoom.tsx': `import React, { useState } from 'react';
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
export default ReadingRoom;`,
  'README.md': `# LinguistAI 项目

## 运行步骤
1. 安装依赖: \`npm install\`
2. 配置 Key: 在 \`.env\` 文件中写入 \`VITE_API_KEY=你的KEY\`
3. 启动: \`npm run dev\`
`,
  '.env.example': `VITE_API_KEY=your_gemini_api_key_here`
};

// 递归创建目录（修复语法，兼容Node.js）
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// 开始创建文件
console.log('🚀 开始创建LinguistAI项目文件...');

// 遍历所有文件，逐个创建
Object.keys(files).forEach(fileName => {
  try {
    const content = files[fileName];
    // 创建文件所在的目录
    ensureDirectoryExistence(fileName);
    // 写入文件内容
    fs.writeFileSync(fileName, content, 'utf8');
    console.log(`✅ 已创建: ${fileName}`);
  } catch (err) {
    console.log(`❌ 创建失败: ${fileName} - ${err.message}`);
  }
});

console.log('\\n✨ LinguistAI项目结构创建完成！');
console.log('接下来请执行以下命令：');
console.log('1. npm install （安装依赖）');
console.log('2. 复制 .env.example 为 .env，填入你的Gemini API Key');
console.log('3. npm run dev （启动项目）');