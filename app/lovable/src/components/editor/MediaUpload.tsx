import { useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, Music, X } from 'lucide-react';
import type { MediaItem } from '@/types/quiz';
import { generateId } from '@/lib/quiz-utils';

interface MediaUploadProps {
  media?: MediaItem;
  onMediaChange: (media: MediaItem | undefined) => void;
  compact?: boolean;
}

export function MediaUpload({ media, onMediaChange, compact = false }: MediaUploadProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio') => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        onMediaChange({
          id: generateId(),
          type,
          file,
          url: reader.result as string,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);

      // Reset input
      event.target.value = '';
    },
    [onMediaChange]
  );

  const handleRemove = useCallback(() => {
    onMediaChange(undefined);
  }, [onMediaChange]);

  if (media) {
    return (
      <div className="relative inline-block">
        {media.type === 'image' ? (
          <div className="relative">
            <img
              src={media.url}
              alt="Uploaded"
              className="max-h-32 rounded-md border object-contain"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute -right-2 -top-2 h-6 w-6"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-md border bg-muted p-2">
            <Music className="h-4 w-4 text-muted-foreground" />
            <span className="max-w-32 truncate text-sm">{media.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
            <audio controls src={media.url} className="h-8" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${compact ? '' : 'flex-wrap'}`}>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'image')}
      />
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, 'audio')}
      />
      <Button
        type="button"
        variant="outline"
        size={compact ? 'sm' : 'default'}
        onClick={() => imageInputRef.current?.click()}
      >
        <ImageIcon className="mr-1 h-4 w-4" />
        {compact ? '' : 'Ảnh'}
      </Button>
      <Button
        type="button"
        variant="outline"
        size={compact ? 'sm' : 'default'}
        onClick={() => audioInputRef.current?.click()}
      >
        <Music className="mr-1 h-4 w-4" />
        {compact ? '' : 'Âm thanh'}
      </Button>
    </div>
  );
}
