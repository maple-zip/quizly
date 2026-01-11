import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
import { MediaUpload } from './MediaUpload';
import type { MultipleChoiceQuestion, Choice, MediaItem } from '@/types/quiz';

interface MultipleChoiceEditorProps {
  question: MultipleChoiceQuestion;
  index: number;
  onUpdate: (updates: Partial<MultipleChoiceQuestion>) => void;
  onDelete: () => void;
  onAddChoice: () => void;
  onUpdateChoice: (choiceId: string, updates: Partial<Choice>) => void;
  onDeleteChoice: (choiceId: string) => void;
  onSetMedia: (media: MediaItem | undefined) => void;
  onSetChoiceMedia: (choiceId: string, media: MediaItem | undefined) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export function MultipleChoiceEditor({
  question,
  index,
  onUpdate,
  onDelete,
  onAddChoice,
  onUpdateChoice,
  onDeleteChoice,
  onSetMedia,
  onSetChoiceMedia,
  dragHandleProps,
}: MultipleChoiceEditorProps) {
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
            <span className="rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
              Câu {index + 1}
            </span>
            <span className="text-xs text-muted-foreground">Trắc nghiệm nhiều lựa chọn</span>
          </div>
          <Input
            value={question.text}
            onChange={(e) => onUpdate({ text: e.target.value })}
            placeholder="Nhập câu hỏi..."
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
          Các lựa chọn (chọn đáp án đúng):
        </Label>
        <RadioGroup
          value={question.correctAnswerId}
          onValueChange={(value) => onUpdate({ correctAnswerId: value })}
          className="space-y-2"
        >
          {question.choices.map((choice, choiceIndex) => (
            <div
              key={choice.id}
              className="flex items-start gap-2 rounded-lg border p-3"
            >
              <RadioGroupItem
                value={choice.id}
                id={`choice-${choice.id}`}
                className="mt-1"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-muted px-2 py-0.5 text-sm font-medium">
                    {LABELS[choiceIndex] || `${choiceIndex + 1}`}
                  </span>
                  <Input
                    value={choice.text}
                    onChange={(e) =>
                      onUpdateChoice(choice.id, { text: e.target.value })
                    }
                    placeholder="Nhập nội dung lựa chọn..."
                    className="flex-1"
                  />
                  {question.choices.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteChoice(choice.id)}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
                <MediaUpload
                  media={choice.media}
                  onMediaChange={(media) => onSetChoiceMedia(choice.id, media)}
                  compact
                />
              </div>
            </div>
          ))}
        </RadioGroup>
        {question.choices.length < 8 && (
          <Button variant="outline" size="sm" onClick={onAddChoice}>
            <Plus className="mr-1 h-4 w-4" />
            Thêm lựa chọn
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
