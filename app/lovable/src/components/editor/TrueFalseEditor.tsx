import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { MediaUpload } from './MediaUpload';
import type { TrueFalseQuestion, Statement, MediaItem } from '@/types/quiz';

interface TrueFalseEditorProps {
  question: TrueFalseQuestion;
  index: number;
  onUpdate: (updates: Partial<TrueFalseQuestion>) => void;
  onDelete: () => void;
  onAddStatement: () => void;
  onUpdateStatement: (statementId: string, updates: Partial<Statement>) => void;
  onDeleteStatement: (statementId: string) => void;
  onSetMedia: (media: MediaItem | undefined) => void;
  onSetStatementMedia: (statementId: string, media: MediaItem | undefined) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

export function TrueFalseEditor({
  question,
  index,
  onUpdate,
  onDelete,
  onAddStatement,
  onUpdateStatement,
  onDeleteStatement,
  onSetMedia,
  onSetStatementMedia,
  dragHandleProps,
}: TrueFalseEditorProps) {
  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-start gap-2 space-y-0 pb-2">
        <div
          {...dragHandleProps}
          className="mt-1 cursor-grab rounded p-1 hover:bg-muted active:cursor-grabbing"
        >
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
              Câu {index + 1}
            </span>
            <span className="text-xs text-muted-foreground">Đúng/Sai</span>
          </div>
          <Input
            value={question.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Nhập câu hỏi chính..."
            className="font-medium"
          />
          <MediaUpload media={question.media} onMediaChange={onSetMedia} />
        </div>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        <Label className="text-sm text-muted-foreground">
          Các mệnh đề (đánh dấu đúng hoặc sai):
        </Label>
        <div className="space-y-2">
          {question.statements.map((statement, stmtIndex) => (
            <div
              key={statement.id}
              className="flex items-start gap-2 rounded-lg border p-3"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-muted px-2 py-0.5 text-sm font-medium">
                    {String.fromCharCode(97 + stmtIndex)}
                  </span>
                  <Input
                    value={statement.text}
                    onChange={(e) =>
                      onUpdateStatement(statement.id, { text: e.target.value })
                    }
                    placeholder="Nhập mệnh đề..."
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={statement.isTrue}
                      onCheckedChange={(checked) =>
                        onUpdateStatement(statement.id, { isTrue: checked })
                      }
                    />
                    <span
                      className={`min-w-12 text-sm font-medium ${
                        statement.isTrue ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {statement.isTrue ? 'Đúng' : 'Sai'}
                    </span>
                  </div>
                  {question.statements.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteStatement(statement.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
                <MediaUpload
                  media={statement.media}
                  onMediaChange={(media) =>
                    onSetStatementMedia(statement.id, media)
                  }
                  compact
                />
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={onAddStatement}>
          <Plus className="mr-1 h-4 w-4" />
          Thêm mệnh đề
        </Button>
      </CardContent>
    </Card>
  );
}
