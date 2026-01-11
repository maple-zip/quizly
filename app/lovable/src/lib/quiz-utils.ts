import JSZip from 'jszip';
import * as yaml from 'js-yaml';
import type {
  Quiz,
  QuizConfig,
  Question,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  MediaItem,
  YAMLConfig,
  YAMLQuestion,
  YAMLMultipleChoiceQuestion,
  YAMLTrueFalseQuestion,
  QuizResult,
  QuestionResult,
} from '@/types/quiz';

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

// Convert Quiz to ZIP file
export async function quizToZip(quiz: Quiz): Promise<Blob> {
  const zip = new JSZip();
  const mediaFolder = zip.folder('media');
  const mediaMapping: Record<string, string> = {};

  // Collect all media files
  const collectMedia = async (media?: MediaItem): Promise<string | undefined> => {
    if (!media) return undefined;
    
    const fileName = `${media.id}_${media.name}`;
    mediaMapping[media.id] = fileName;
    
    if (media.file) {
      const arrayBuffer = await media.file.arrayBuffer();
      mediaFolder?.file(fileName, arrayBuffer);
    } else if (media.url && media.url.startsWith('data:')) {
      // Handle base64 data URL
      const base64Data = media.url.split(',')[1];
      mediaFolder?.file(fileName, base64Data, { base64: true });
    }
    
    return fileName;
  };

  // Process all questions
  const yamlQuestions: YAMLQuestion[] = [];

  for (const question of quiz.questions) {
    const mediaFileName = await collectMedia(question.media);

    if (question.type === 'multiple-choice') {
      const mcq = question as MultipleChoiceQuestion;
      const yamlChoices = await Promise.all(
        mcq.choices.map(async (choice) => ({
          id: choice.id,
          text: choice.text,
          media: await collectMedia(choice.media),
        }))
      );

      yamlQuestions.push({
        id: mcq.id,
        type: 'multiple-choice',
        text: mcq.text,
        media: mediaFileName,
        choices: yamlChoices,
        correct_answer_id: mcq.correctAnswerId,
      } as YAMLMultipleChoiceQuestion);
    } else {
      const tfq = question as TrueFalseQuestion;
      const yamlStatements = await Promise.all(
        tfq.statements.map(async (stmt) => ({
          id: stmt.id,
          text: stmt.text,
          media: await collectMedia(stmt.media),
          is_true: stmt.isTrue,
        }))
      );

      yamlQuestions.push({
        id: tfq.id,
        type: 'true-false',
        text: tfq.text,
        media: mediaFileName,
        statements: yamlStatements,
      } as YAMLTrueFalseQuestion);
    }
  }

  // Create config.yaml
  const yamlConfig: YAMLConfig = {
    title: quiz.config.title,
    subject: quiz.config.subject,
    grade: quiz.config.grade,
    author: quiz.config.author,
    description: quiz.config.description,
    duration: quiz.config.duration,
    shuffle_questions: quiz.config.shuffleQuestions,
    shuffle_answers: quiz.config.shuffleAnswers,
    open_time: quiz.config.openTime,
    close_time: quiz.config.closeTime,
  };

  zip.file('config.yaml', yaml.dump(yamlConfig));
  zip.file('questions.yaml', yaml.dump(yamlQuestions));

  return await zip.generateAsync({ type: 'blob' });
}

// Parse ZIP file to Quiz
export async function zipToQuiz(zipBlob: Blob): Promise<Quiz> {
  const zip = await JSZip.loadAsync(zipBlob);

  // Load config
  const configFile = zip.file('config.yaml');
  if (!configFile) {
    throw new Error('config.yaml không tìm thấy trong file ZIP');
  }
  const configContent = await configFile.async('text');
  const yamlConfig = yaml.load(configContent) as YAMLConfig;

  // Load questions
  const questionsFile = zip.file('questions.yaml');
  if (!questionsFile) {
    throw new Error('questions.yaml không tìm thấy trong file ZIP');
  }
  const questionsContent = await questionsFile.async('text');
  const yamlQuestions = yaml.load(questionsContent) as YAMLQuestion[];

  // Load media files
  const mediaFiles: Record<string, string> = {};
  const mediaFolder = zip.folder('media');
  
  if (mediaFolder) {
    const mediaEntries = Object.entries(zip.files).filter(([path]) => 
      path.startsWith('media/') && !path.endsWith('/')
    );
    
    for (const [path, file] of mediaEntries) {
      const fileName = path.replace('media/', '');
      const blob = await file.async('blob');
      const mimeType = getMimeType(fileName);
      const dataUrl = await blobToDataUrl(new Blob([blob], { type: mimeType }));
      mediaFiles[fileName] = dataUrl;
    }
  }

  // Convert to Quiz
  const config: QuizConfig = {
    title: yamlConfig.title,
    subject: yamlConfig.subject,
    grade: yamlConfig.grade,
    author: yamlConfig.author,
    description: yamlConfig.description,
    duration: yamlConfig.duration,
    shuffleQuestions: yamlConfig.shuffle_questions,
    shuffleAnswers: yamlConfig.shuffle_answers,
    openTime: yamlConfig.open_time,
    closeTime: yamlConfig.close_time,
  };

  const questions: Question[] = yamlQuestions.map((yq) => {
    const createMediaItem = (fileName?: string): MediaItem | undefined => {
      if (!fileName || !mediaFiles[fileName]) return undefined;
      return {
        id: generateId(),
        type: fileName.match(/\.(mp3|wav|ogg|m4a)$/i) ? 'audio' : 'image',
        url: mediaFiles[fileName],
        name: fileName,
      };
    };

    if (yq.type === 'multiple-choice') {
      const mcq = yq as YAMLMultipleChoiceQuestion;
      return {
        id: mcq.id,
        type: 'multiple-choice',
        text: mcq.text,
        media: createMediaItem(mcq.media),
        choices: mcq.choices.map((c) => ({
          id: c.id,
          text: c.text,
          media: createMediaItem(c.media),
        })),
        correctAnswerId: mcq.correct_answer_id,
      } as MultipleChoiceQuestion;
    } else {
      const tfq = yq as YAMLTrueFalseQuestion;
      return {
        id: tfq.id,
        type: 'true-false',
        text: tfq.text,
        media: createMediaItem(tfq.media),
        statements: tfq.statements.map((s) => ({
          id: s.id,
          text: s.text,
          media: createMediaItem(s.media),
          isTrue: s.is_true,
        })),
      } as TrueFalseQuestion;
    }
  });

  return { config, questions };
}

// Helper functions
function getMimeType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Calculate quiz result
export function calculateResult(
  quiz: Quiz,
  answers: Record<string, string | Record<string, boolean>>
): QuizResult {
  const details: QuestionResult[] = [];
  let correctCount = 0;

  for (const question of quiz.questions) {
    const userAnswer = answers[question.id];
    let isCorrect = false;
    let correctAnswer: string | Record<string, boolean>;

    if (question.type === 'multiple-choice') {
      const mcq = question as MultipleChoiceQuestion;
      correctAnswer = mcq.correctAnswerId;
      isCorrect = userAnswer === correctAnswer;
    } else {
      const tfq = question as TrueFalseQuestion;
      correctAnswer = tfq.statements.reduce((acc, stmt) => {
        acc[stmt.id] = stmt.isTrue;
        return acc;
      }, {} as Record<string, boolean>);
      
      const userTfAnswer = userAnswer as Record<string, boolean> | undefined;
      if (userTfAnswer) {
        isCorrect = tfq.statements.every(
          (stmt) => userTfAnswer[stmt.id] === stmt.isTrue
        );
      }
    }

    if (isCorrect) correctCount++;

    details.push({
      questionId: question.id,
      isCorrect,
      userAnswer: userAnswer || '',
      correctAnswer,
    });
  }

  return {
    totalQuestions: quiz.questions.length,
    correctAnswers: correctCount,
    score: Math.round((correctCount / quiz.questions.length) * 100),
    details,
  };
}

// Shuffle array
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
