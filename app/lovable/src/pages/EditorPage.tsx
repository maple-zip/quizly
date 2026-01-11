import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Upload, RotateCcw, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { useQuizEditor } from '@/hooks/useQuizEditor';
import { QuizConfigForm } from '@/components/editor/QuizConfigForm';
import { QuestionList } from '@/components/editor/QuestionList';
import { SUPABASE_CONFIG } from '@/lib/supabase-config';

declare global {
  interface Window {
    turnstile?: { render: (container: string, options: object) => string; reset: (id?: string) => void };
    onTurnstileSuccess?: (token: string) => void;
  }
}

export default function EditorPage() {
  const editor = useQuizEditor();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad';
    script.async = true;
    document.head.appendChild(script);

    (window as any).onTurnstileLoad = () => {
      if (turnstileRef.current && window.turnstile) {
        window.turnstile.render('#turnstile-container', {
          sitekey: SUPABASE_CONFIG.turnstileSiteKey,
          callback: (token: string) => setTurnstileToken(token),
        });
      }
    };

    return () => { document.head.removeChild(script); };
  }, []);

  const handleUpload = () => {
    if (turnstileToken) {
      editor.exportAndUpload(turnstileToken);
      setTurnstileToken(null);
      window.turnstile?.reset();
    }
  };

  const handleCopy = () => {
    if (editor.uploadResult?.url) {
      navigator.clipboard.writeText(editor.uploadResult.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-xl font-bold">📝 Quizly Editor</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={editor.resetQuiz}>
              <RotateCcw className="mr-1 h-4 w-4" /> Làm mới
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        <QuizConfigForm config={editor.config} onUpdate={editor.updateConfig} />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Câu hỏi ({editor.questions.length})</CardTitle>
            <CardDescription>Kéo thả để sắp xếp lại thứ tự câu hỏi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <QuestionList
              questions={editor.questions}
              onReorder={editor.reorderQuestions}
              onUpdateQuestion={editor.updateQuestion}
              onDeleteQuestion={editor.deleteQuestion}
              onAddChoice={editor.addChoice}
              onUpdateChoice={editor.updateChoice}
              onDeleteChoice={editor.deleteChoice}
              onAddStatement={editor.addStatement}
              onUpdateStatement={editor.updateStatement}
              onDeleteStatement={editor.deleteStatement}
              onSetQuestionMedia={editor.setQuestionMedia}
              onSetChoiceMedia={editor.setChoiceMedia}
              onSetStatementMedia={editor.setStatementMedia}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => editor.addQuestion('multiple-choice')}>
                <Plus className="mr-1 h-4 w-4" /> Trắc nghiệm ABCD
              </Button>
              <Button variant="secondary" onClick={() => editor.addQuestion('true-false')}>
                <Plus className="mr-1 h-4 w-4" /> Đúng/Sai
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Xuất & Chia sẻ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div id="turnstile-container" ref={turnstileRef} className="flex justify-center" />
            <Button onClick={handleUpload} disabled={!turnstileToken || editor.isUploading} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              {editor.isUploading ? 'Đang upload...' : 'Upload & Lấy link chia sẻ'}
            </Button>

            {editor.uploadResult?.success && editor.uploadResult.url && (
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="space-y-2">
                  <p className="font-medium text-green-800">Upload thành công!</p>
                  <div className="flex items-center gap-2">
                    <input readOnly value={editor.uploadResult.url} className="flex-1 rounded border bg-background px-2 py-1 text-sm" />
                    <Button size="sm" variant="outline" onClick={handleCopy}>
                      {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={editor.uploadResult.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Link sẽ hết hạn sau 7 ngày</p>
                </AlertDescription>
              </Alert>
            )}

            {editor.uploadResult?.error && (
              <Alert variant="destructive">
                <AlertDescription>{editor.uploadResult.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
