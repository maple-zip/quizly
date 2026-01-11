import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { QuizConfig } from '@/types/quiz';

interface QuizConfigFormProps {
  config: QuizConfig;
  onUpdate: (updates: Partial<QuizConfig>) => void;
}

export function QuizConfigForm({ config, onUpdate }: QuizConfigFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Thông tin bài kiểm tra</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Tên bài kiểm tra *</Label>
            <Input
              id="title"
              value={config.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Nhập tên bài kiểm tra"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Môn học</Label>
            <Input
              id="subject"
              value={config.subject || ''}
              onChange={(e) => onUpdate({ subject: e.target.value })}
              placeholder="Ví dụ: Toán, Lý, Hóa..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade">Lớp</Label>
            <Input
              id="grade"
              value={config.grade || ''}
              onChange={(e) => onUpdate({ grade: e.target.value })}
              placeholder="Ví dụ: 10, 11, 12..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Tác giả</Label>
            <Input
              id="author"
              value={config.author || ''}
              onChange={(e) => onUpdate({ author: e.target.value })}
              placeholder="Tên người tạo"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            value={config.description || ''}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Mô tả ngắn về bài kiểm tra"
            rows={3}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="duration">Thời gian (phút)</Label>
            <Input
              id="duration"
              type="number"
              min={0}
              value={config.duration || 0}
              onChange={(e) => onUpdate({ duration: parseInt(e.target.value) || 0 })}
              placeholder="0 = Không giới hạn"
            />
            <p className="text-xs text-muted-foreground">0 = Không giới hạn thời gian</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="openTime">Thời gian mở</Label>
            <Input
              id="openTime"
              type="datetime-local"
              value={config.openTime ? config.openTime.slice(0, 16) : ''}
              onChange={(e) => onUpdate({ openTime: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="closeTime">Thời gian đóng</Label>
            <Input
              id="closeTime"
              type="datetime-local"
              value={config.closeTime ? config.closeTime.slice(0, 16) : ''}
              onChange={(e) => onUpdate({ closeTime: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="shuffleQuestions"
              checked={config.shuffleQuestions || false}
              onCheckedChange={(checked) => onUpdate({ shuffleQuestions: checked })}
            />
            <Label htmlFor="shuffleQuestions">Xáo trộn câu hỏi</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="shuffleAnswers"
              checked={config.shuffleAnswers || false}
              onCheckedChange={(checked) => onUpdate({ shuffleAnswers: checked })}
            />
            <Label htmlFor="shuffleAnswers">Xáo trộn đáp án</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
