// ✅ 仅改这1行，修复 process 未定义报错，其余代码100%原版
const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';

export const generateVocabList = async (level: string, count: number) => {
  if (!API_KEY) {
    console.error('请在.env文件中配置VITE_API_KEY');
    return [];
  }

  const prompt = `生成${count}个${level}难度的英语核心词汇，包含单词、中文释义、经典例句，格式为JSON数组：[{"word":"单词","meaning":"释义","example":"例句"},...]，不要返回其他无关内容`;

  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    return JSON.parse(content);
  } catch (error) {
    console.error('词汇生成失败：', error);
    return [];
  }
};

export const correctEnglishSentence = async (sentence: string) => {
  if (!API_KEY) {
    console.error('请在.env文件中配置VITE_API_KEY');
    return '配置错误，请检查API密钥';
  }

  const prompt = `修正以下英文句子的语法错误，保留原意，只返回修正后的句子，不要多余内容：${sentence}`;

  try {
    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('语法检查失败：', error);
    return '检查失败，请重试';
  }
};