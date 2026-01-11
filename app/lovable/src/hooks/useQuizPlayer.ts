import { useState, useEffect, useCallback, useRef } from 'react';
import type { Quiz, QuizPlayerState, QuizResult, MultipleChoiceQuestion, TrueFalseQuestion } from '@/types/quiz';
import { zipToQuiz, calculateResult, shuffleArray } from '@/lib/quiz-utils';

export function useQuizPlayer(zipUrl: string | null) {
  const [state, setState] = useState<QuizPlayerState>({
    status: 'loading',
    answers: {},
  });
  const [result, setResult] = useState<QuizResult | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load quiz from URL
  useEffect(() => {
    if (!zipUrl) {
      setState({ status: 'error', answers: {}, error: 'Không tìm thấy URL bài kiểm tra' });
      return;
    }

    const loadQuiz = async () => {
      try {
        const response = await fetch(zipUrl);
        if (!response.ok) {
          throw new Error('Không thể tải bài kiểm tra');
        }
        const blob = await response.blob();
        const quiz = await zipToQuiz(blob);

        // Check open/close time
        const now = new Date();
        if (quiz.config.openTime) {
          const openTime = new Date(quiz.config.openTime);
          if (now < openTime) {
            throw new Error(`Bài kiểm tra chưa mở. Thời gian mở: ${openTime.toLocaleString('vi-VN')}`);
          }
        }
        if (quiz.config.closeTime) {
          const closeTime = new Date(quiz.config.closeTime);
          if (now > closeTime) {
            throw new Error(`Bài kiểm tra đã đóng. Thời gian đóng: ${closeTime.toLocaleString('vi-VN')}`);
          }
        }

        // Shuffle if needed
        if (quiz.config.shuffleQuestions) {
          quiz.questions = shuffleArray(quiz.questions);
        }
        if (quiz.config.shuffleAnswers) {
          quiz.questions = quiz.questions.map((q) => {
            if (q.type === 'multiple-choice') {
              return {
                ...q,
                choices: shuffleArray((q as MultipleChoiceQuestion).choices),
              };
            }
            return q;
          });
        }

        setState({
          status: 'info',
          quiz,
          answers: {},
        });
      } catch (error) {
        setState({
          status: 'error',
          answers: {},
          error: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tải bài kiểm tra',
        });
      }
    };

    loadQuiz();
  }, [zipUrl]);

  // Start quiz
  const startQuiz = useCallback(() => {
    if (!state.quiz) return;

    const duration = state.quiz.config.duration || 0;
    const startTime = new Date();

    setState((prev) => ({
      ...prev,
      status: 'playing',
      startTime,
      timeRemaining: duration > 0 ? duration * 60 : undefined,
    }));

    // Start timer if duration is set
    if (duration > 0) {
      timerRef.current = setInterval(() => {
        setState((prev) => {
          if (!prev.timeRemaining || prev.timeRemaining <= 1) {
            // Time's up
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return prev;
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }
  }, [state.quiz]);

  // Auto-submit when time's up
  useEffect(() => {
    if (state.status === 'playing' && state.timeRemaining === 0) {
      submitQuiz();
    }
  }, [state.timeRemaining, state.status]);

  // Answer handlers
  const setAnswer = useCallback(
    (questionId: string, answer: string | Record<string, boolean>) => {
      setState((prev) => ({
        ...prev,
        answers: { ...prev.answers, [questionId]: answer },
      }));
    },
    []
  );

  const setTrueFalseAnswer = useCallback(
    (questionId: string, statementId: string, value: boolean) => {
      setState((prev) => {
        const currentAnswer = (prev.answers[questionId] as Record<string, boolean>) || {};
        return {
          ...prev,
          answers: {
            ...prev.answers,
            [questionId]: { ...currentAnswer, [statementId]: value },
          },
        };
      });
    },
    []
  );

  // Submit quiz
  const submitQuiz = useCallback(() => {
    if (!state.quiz) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const endTime = new Date();
    const quizResult = calculateResult(state.quiz, state.answers);

    setState((prev) => ({
      ...prev,
      status: 'result',
      endTime,
    }));

    setResult(quizResult);
  }, [state.quiz, state.answers]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    state,
    result,
    startQuiz,
    setAnswer,
    setTrueFalseAnswer,
    submitQuiz,
  };
}
