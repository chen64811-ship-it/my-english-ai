export type AppView = 'dashboard' | 'tutor' | 'vocabulary' | 'grammar' | 'reading' | 'test';
export interface VocabularyItem { word: string; phonetic: string; definition: string; example: string; chineseTranslation: string; }
export interface VocabQuizQuestion { word: string; options: string[]; correctIndex: number; chineseMeaning: string; exampleSentence: string; }
export interface GrammarSuggestion { original: string; corrected: string; explanation: string; }
export interface ReadingPassage { title: string; content: string; level: string; questions: { question: string; options: string[]; answer: number; }[]; }