import { useSearchParams } from 'react-router-dom';
import { useQuizPlayer } from '@/hooks/useQuizPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { MultipleChoiceQuestion, TrueFalseQuestion } from '@/types/quiz';

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const zipUrl = searchParams.get('url');
  const { state, result, startQuiz, setAnswer, setTrueFalseAnswer, submitQuiz } = useQuizPlayer(zipUrl);

  if (state.status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center"><Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" /><p className="mt-4 text-muted-foreground">Đang tải bài kiểm tra...</p></div>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md"><CardHeader><AlertCircle className="mx-auto h-12 w-12 text-destructive" /><CardTitle className="text-center">Lỗi</CardTitle></CardHeader><CardContent><p className="text-center text-muted-foreground">{state.error}</p></CardContent></Card>
      </div>
    );
  }

  if (state.status === 'info' && state.quiz) {
    const { config } = state.quiz;
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader><CardTitle>{config.title}</CardTitle>{config.subject && <CardDescription>{config.subject} {config.grade && `- Lớp ${config.grade}`}</CardDescription>}</CardHeader>
          <CardContent className="space-y-4">
            {config.author && <p className="text-sm text-muted-foreground">Tác giả: {config.author}</p>}
            {config.description && <p className="text-sm">{config.description}</p>}
            <div className="flex flex-wrap gap-4 text-sm">
              <span>📝 {state.quiz.questions.length} câu hỏi</span>
              {config.duration ? <span>⏱️ {config.duration} phút</span> : <span>⏱️ Không giới hạn</span>}
            </div>
            <Button onClick={startQuiz} className="w-full">Bắt đầu làm bài</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state.status === 'playing' && state.quiz) {
    return (
      <div className="flex min-h-screen">
        <aside className="hidden w-64 flex-shrink-0 border-r bg-muted/30 p-4 lg:block">
          {state.timeRemaining !== undefined && (
            <div className="mb-4 rounded-lg bg-primary p-3 text-center text-primary-foreground">
              <Clock className="mx-auto mb-1 h-5 w-5" />
              <span className="text-2xl font-bold">{formatTime(state.timeRemaining)}</span>
            </div>
          )}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {state.quiz.questions.map((q, i) => (
              <button key={q.id} onClick={() => document.getElementById(q.id)?.scrollIntoView({ behavior: 'smooth' })} className={`flex h-8 w-8 items-center justify-center rounded text-sm font-medium ${state.answers[q.id] ? 'bg-primary text-primary-foreground' : 'bg-background border'}`}>{i + 1}</button>
            ))}
          </div>
          <Button onClick={submitQuiz} className="w-full">Nộp bài</Button>
        </aside>
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {state.quiz.questions.map((question, index) => (
              <Card key={question.id} id={question.id}>
                <CardHeader>
                  <CardTitle className="text-base">Câu {index + 1}: {question.text}</CardTitle>
                  {question.media?.url && (question.media.type === 'image' ? <img src={question.media.url} alt="" className="max-h-48 rounded" /> : <audio controls src={question.media.url} />)}
                </CardHeader>
                <CardContent>
                  {question.type === 'multiple-choice' ? (
                    <RadioGroup value={(state.answers[question.id] as string) || ''} onValueChange={(v) => setAnswer(question.id, v)}>
                      {(question as MultipleChoiceQuestion).choices.map((c, ci) => (
                        <div key={c.id} className="flex items-center space-x-2 rounded border p-3">
                          <RadioGroupItem value={c.id} id={c.id} />
                          <Label htmlFor={c.id} className="flex-1 cursor-pointer">{LABELS[ci]}. {c.text}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="space-y-2">
                      {(question as TrueFalseQuestion).statements.map((s, si) => (
                        <div key={s.id} className="flex items-center justify-between rounded border p-3">
                          <span>{String.fromCharCode(97 + si)}) {s.text}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Sai</span>
                            <Switch checked={(state.answers[question.id] as Record<string, boolean>)?.[s.id] ?? false} onCheckedChange={(v) => setTrueFalseAnswer(question.id, s.id, v)} />
                            <span className="text-sm text-muted-foreground">Đúng</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            <Button onClick={submitQuiz} className="w-full lg:hidden">Nộp bài</Button>
          </div>
        </main>
      </div>
    );
  }

  if (state.status === 'result' && result && state.quiz) {
    return (
      <div className="min-h-screen bg-muted/30 p-4">
        <div className="mx-auto max-w-3xl space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Kết quả</CardTitle>
              <div className="text-5xl font-bold text-primary">{result.score}%</div>
              <CardDescription>{result.correctAnswers}/{result.totalQuestions} câu đúng</CardDescription>
            </CardHeader>
          </Card>
          {state.quiz.questions.map((q, i) => {
            const detail = result.details.find((d) => d.questionId === q.id);
            return (
              <Card key={q.id} className={detail?.isCorrect ? 'border-green-500' : 'border-red-500'}>
                <CardHeader className="flex-row items-center gap-2">
                  {detail?.isCorrect ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                  <CardTitle className="text-base">Câu {i + 1}: {q.text}</CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
