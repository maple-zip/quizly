// Quiz types for Quizly platform

export interface QuizConfig {
  title: string;
  subject?: string;
  grade?: string;
  author?: string;
  description?: string;
  duration?: number; // in minutes, 0 = no limit
  shuffleQuestions?: boolean;
  shuffleAnswers?: boolean;
  openTime?: string; // ISO date string
  closeTime?: string; // ISO date string
}

export interface MediaItem {
  id: string;
  type: 'image' | 'audio';
  file?: File;
  url?: string;
  name: string;
}

export interface Choice {
  id: string;
  text: string;
  media?: MediaItem;
}

export interface Statement {
  id: string;
  text: string;
  media?: MediaItem;
  isTrue: boolean;
}

export interface MultipleChoiceQuestion {
  id: string;
  type: 'multiple-choice';
  text: string;
  media?: MediaItem;
  choices: Choice[];
  correctAnswerId: string;
}

export interface TrueFalseQuestion {
  id: string;
  type: 'true-false';
  text: string;
  media?: MediaItem;
  statements: Statement[];
}

export type Question = MultipleChoiceQuestion | TrueFalseQuestion;

export interface Quiz {
  config: QuizConfig;
  questions: Question[];
}

// For YAML serialization
export interface YAMLConfig {
  title: string;
  subject?: string;
  grade?: string;
  author?: string;
  description?: string;
  duration?: number;
  shuffle_questions?: boolean;
  shuffle_answers?: boolean;
  open_time?: string;
  close_time?: string;
}

export interface YAMLChoice {
  id: string;
  text: string;
  media?: string; // filename in media folder
}

export interface YAMLStatement {
  id: string;
  text: string;
  media?: string;
  is_true: boolean;
}

export interface YAMLMultipleChoiceQuestion {
  id: string;
  type: 'multiple-choice';
  text: string;
  media?: string;
  choices: YAMLChoice[];
  correct_answer_id: string;
}

export interface YAMLTrueFalseQuestion {
  id: string;
  type: 'true-false';
  text: string;
  media?: string;
  statements: YAMLStatement[];
}

export type YAMLQuestion = YAMLMultipleChoiceQuestion | YAMLTrueFalseQuestion;

// Quiz player state
export interface QuizPlayerState {
  status: 'loading' | 'error' | 'info' | 'playing' | 'result';
  quiz?: Quiz;
  answers: Record<string, string | Record<string, boolean>>;
  startTime?: Date;
  endTime?: Date;
  timeRemaining?: number;
  error?: string;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number; // percentage
  details: QuestionResult[];
}

export interface QuestionResult {
  questionId: string;
  isCorrect: boolean;
  userAnswer: string | Record<string, boolean>;
  correctAnswer: string | Record<string, boolean>;
}
