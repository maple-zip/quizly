import { useState, useCallback } from 'react';
import type {
  Quiz,
  QuizConfig,
  Question,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  Choice,
  Statement,
  MediaItem,
} from '@/types/quiz';
import { generateId, quizToZip } from '@/lib/quiz-utils';
import { SUPABASE_CONFIG } from '@/lib/supabase-config';

const defaultConfig: QuizConfig = {
  title: '',
  subject: '',
  grade: '',
  author: '',
  description: '',
  duration: 0,
  shuffleQuestions: false,
  shuffleAnswers: false,
};

export function useQuizEditor() {
  const [config, setConfig] = useState<QuizConfig>(defaultConfig);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    url?: string;
    error?: string;
  } | null>(null);

  // Config handlers
  const updateConfig = useCallback((updates: Partial<QuizConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  // Question handlers
  const addQuestion = useCallback((type: 'multiple-choice' | 'true-false') => {
    const id = generateId();
    
    if (type === 'multiple-choice') {
      const newQuestion: MultipleChoiceQuestion = {
        id,
        type: 'multiple-choice',
        text: '',
        choices: [
          { id: generateId(), text: '' },
          { id: generateId(), text: '' },
          { id: generateId(), text: '' },
          { id: generateId(), text: '' },
        ],
        correctAnswerId: '',
      };
      setQuestions((prev) => [...prev, newQuestion]);
    } else {
      const newQuestion: TrueFalseQuestion = {
        id,
        type: 'true-false',
        text: '',
        statements: [
          { id: generateId(), text: '', isTrue: true },
          { id: generateId(), text: '', isTrue: false },
        ],
      };
      setQuestions((prev) => [...prev, newQuestion]);
    }
  }, []);

  const updateQuestion = useCallback((id: string, updates: Partial<Question>) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          if (q.type === 'multiple-choice') {
            return { ...q, ...updates } as MultipleChoiceQuestion;
          } else {
            return { ...q, ...updates } as TrueFalseQuestion;
          }
        }
        return q;
      })
    );
  }, []);

  const deleteQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }, []);

  const reorderQuestions = useCallback((newOrder: Question[]) => {
    setQuestions(newOrder);
  }, []);

  // Multiple choice handlers
  const addChoice = useCallback((questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId && q.type === 'multiple-choice') {
          const mcq = q as MultipleChoiceQuestion;
          return {
            ...mcq,
            choices: [...mcq.choices, { id: generateId(), text: '' }],
          };
        }
        return q;
      })
    );
  }, []);

  const updateChoice = useCallback(
    (questionId: string, choiceId: string, updates: Partial<Choice>) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId && q.type === 'multiple-choice') {
            const mcq = q as MultipleChoiceQuestion;
            return {
              ...mcq,
              choices: mcq.choices.map((c) =>
                c.id === choiceId ? { ...c, ...updates } : c
              ),
            };
          }
          return q;
        })
      );
    },
    []
  );

  const deleteChoice = useCallback((questionId: string, choiceId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId && q.type === 'multiple-choice') {
          const mcq = q as MultipleChoiceQuestion;
          return {
            ...mcq,
            choices: mcq.choices.filter((c) => c.id !== choiceId),
            correctAnswerId:
              mcq.correctAnswerId === choiceId ? '' : mcq.correctAnswerId,
          };
        }
        return q;
      })
    );
  }, []);

  // True/False handlers
  const addStatement = useCallback((questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId && q.type === 'true-false') {
          const tfq = q as TrueFalseQuestion;
          return {
            ...tfq,
            statements: [
              ...tfq.statements,
              { id: generateId(), text: '', isTrue: true },
            ],
          };
        }
        return q;
      })
    );
  }, []);

  const updateStatement = useCallback(
    (questionId: string, statementId: string, updates: Partial<Statement>) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId && q.type === 'true-false') {
            const tfq = q as TrueFalseQuestion;
            return {
              ...tfq,
              statements: tfq.statements.map((s) =>
                s.id === statementId ? { ...s, ...updates } : s
              ),
            };
          }
          return q;
        })
      );
    },
    []
  );

  const deleteStatement = useCallback(
    (questionId: string, statementId: string) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId && q.type === 'true-false') {
            const tfq = q as TrueFalseQuestion;
            return {
              ...tfq,
              statements: tfq.statements.filter((s) => s.id !== statementId),
            };
          }
          return q;
        })
      );
    },
    []
  );

  // Media handlers
  const setQuestionMedia = useCallback(
    (questionId: string, media: MediaItem | undefined) => {
      setQuestions((prev) =>
        prev.map((q) => (q.id === questionId ? { ...q, media } : q))
      );
    },
    []
  );

  const setChoiceMedia = useCallback(
    (questionId: string, choiceId: string, media: MediaItem | undefined) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId && q.type === 'multiple-choice') {
            const mcq = q as MultipleChoiceQuestion;
            return {
              ...mcq,
              choices: mcq.choices.map((c) =>
                c.id === choiceId ? { ...c, media } : c
              ),
            };
          }
          return q;
        })
      );
    },
    []
  );

  const setStatementMedia = useCallback(
    (questionId: string, statementId: string, media: MediaItem | undefined) => {
      setQuestions((prev) =>
        prev.map((q) => {
          if (q.id === questionId && q.type === 'true-false') {
            const tfq = q as TrueFalseQuestion;
            return {
              ...tfq,
              statements: tfq.statements.map((s) =>
                s.id === statementId ? { ...s, media } : s
              ),
            };
          }
          return q;
        })
      );
    },
    []
  );

  // Export and upload
  const exportAndUpload = useCallback(
    async (turnstileToken: string) => {
      if (!config.title.trim()) {
        setUploadResult({ success: false, error: 'Vui lòng nhập tên bài kiểm tra' });
        return;
      }

      if (questions.length === 0) {
        setUploadResult({ success: false, error: 'Vui lòng thêm ít nhất một câu hỏi' });
        return;
      }

      setIsUploading(true);
      setUploadResult(null);

      try {
        const quiz: Quiz = { config, questions };
        const zipBlob = await quizToZip(quiz);

        const formData = new FormData();
        formData.append('file', zipBlob, `${config.title.replace(/\s+/g, '_')}.zip`);
        formData.append('turnstileToken', turnstileToken);

        const response = await fetch(SUPABASE_CONFIG.edgeFunctionUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${SUPABASE_CONFIG.supabaseAnonKey}`,
            apikey: SUPABASE_CONFIG.supabaseAnonKey,
          },
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          const quizUrl = `${window.location.origin}/quiz?url=${encodeURIComponent(result.publicUrl)}`;
          setUploadResult({ success: true, url: quizUrl });
        } else {
          setUploadResult({ success: false, error: result.error });
        }
      } catch (error) {
        setUploadResult({
          success: false,
          error: error instanceof Error ? error.message : 'Đã xảy ra lỗi',
        });
      } finally {
        setIsUploading(false);
      }
    },
    [config, questions]
  );

  // Reset
  const resetQuiz = useCallback(() => {
    setConfig(defaultConfig);
    setQuestions([]);
    setUploadResult(null);
  }, []);

  return {
    config,
    questions,
    isUploading,
    uploadResult,
    updateConfig,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    addChoice,
    updateChoice,
    deleteChoice,
    addStatement,
    updateStatement,
    deleteStatement,
    setQuestionMedia,
    setChoiceMedia,
    setStatementMedia,
    exportAndUpload,
    resetQuiz,
  };
}
