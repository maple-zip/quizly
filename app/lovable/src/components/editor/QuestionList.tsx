import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MultipleChoiceEditor } from './MultipleChoiceEditor';
import { TrueFalseEditor } from './TrueFalseEditor';
import type {
  Question,
  MultipleChoiceQuestion,
  TrueFalseQuestion,
  Choice,
  Statement,
  MediaItem,
} from '@/types/quiz';

interface QuestionListProps {
  questions: Question[];
  onReorder: (questions: Question[]) => void;
  onUpdateQuestion: (id: string, updates: Partial<Question>) => void;
  onDeleteQuestion: (id: string) => void;
  onAddChoice: (questionId: string) => void;
  onUpdateChoice: (questionId: string, choiceId: string, updates: Partial<Choice>) => void;
  onDeleteChoice: (questionId: string, choiceId: string) => void;
  onAddStatement: (questionId: string) => void;
  onUpdateStatement: (questionId: string, statementId: string, updates: Partial<Statement>) => void;
  onDeleteStatement: (questionId: string, statementId: string) => void;
  onSetQuestionMedia: (questionId: string, media: MediaItem | undefined) => void;
  onSetChoiceMedia: (questionId: string, choiceId: string, media: MediaItem | undefined) => void;
  onSetStatementMedia: (questionId: string, statementId: string, media: MediaItem | undefined) => void;
}

function SortableQuestion({
  question,
  index,
  ...props
}: {
  question: Question;
  index: number;
  onUpdateQuestion: (updates: Partial<Question>) => void;
  onDeleteQuestion: () => void;
  onAddChoice: () => void;
  onUpdateChoice: (choiceId: string, updates: Partial<Choice>) => void;
  onDeleteChoice: (choiceId: string) => void;
  onAddStatement: () => void;
  onUpdateStatement: (statementId: string, updates: Partial<Statement>) => void;
  onDeleteStatement: (statementId: string) => void;
  onSetQuestionMedia: (media: MediaItem | undefined) => void;
  onSetChoiceMedia: (choiceId: string, media: MediaItem | undefined) => void;
  onSetStatementMedia: (statementId: string, media: MediaItem | undefined) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const dragHandleProps = { ...attributes, ...listeners };

  if (question.type === 'multiple-choice') {
    return (
      <div ref={setNodeRef} style={style}>
        <MultipleChoiceEditor
          question={question as MultipleChoiceQuestion}
          index={index}
          onUpdate={props.onUpdateQuestion}
          onDelete={props.onDeleteQuestion}
          onAddChoice={props.onAddChoice}
          onUpdateChoice={props.onUpdateChoice}
          onDeleteChoice={props.onDeleteChoice}
          onSetMedia={props.onSetQuestionMedia}
          onSetChoiceMedia={props.onSetChoiceMedia}
          dragHandleProps={dragHandleProps}
        />
      </div>
    );
  }

  return (
    <div ref={setNodeRef} style={style}>
      <TrueFalseEditor
        question={question as TrueFalseQuestion}
        index={index}
        onUpdate={props.onUpdateQuestion}
        onDelete={props.onDeleteQuestion}
        onAddStatement={props.onAddStatement}
        onUpdateStatement={props.onUpdateStatement}
        onDeleteStatement={props.onDeleteStatement}
        onSetMedia={props.onSetQuestionMedia}
        onSetStatementMedia={props.onSetStatementMedia}
        dragHandleProps={dragHandleProps}
      />
    </div>
  );
}

export function QuestionList({
  questions,
  onReorder,
  onUpdateQuestion,
  onDeleteQuestion,
  onAddChoice,
  onUpdateChoice,
  onDeleteChoice,
  onAddStatement,
  onUpdateStatement,
  onDeleteStatement,
  onSetQuestionMedia,
  onSetChoiceMedia,
  onSetStatementMedia,
}: QuestionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      onReorder(arrayMove(questions, oldIndex, newIndex));
    }
  };

  if (questions.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          Chưa có câu hỏi nào. Nhấn nút bên dưới để thêm câu hỏi.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={questions.map((q) => q.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {questions.map((question, index) => (
            <SortableQuestion
              key={question.id}
              question={question}
              index={index}
              onUpdateQuestion={(updates) => onUpdateQuestion(question.id, updates)}
              onDeleteQuestion={() => onDeleteQuestion(question.id)}
              onAddChoice={() => onAddChoice(question.id)}
              onUpdateChoice={(choiceId, updates) =>
                onUpdateChoice(question.id, choiceId, updates)
              }
              onDeleteChoice={(choiceId) => onDeleteChoice(question.id, choiceId)}
              onAddStatement={() => onAddStatement(question.id)}
              onUpdateStatement={(statementId, updates) =>
                onUpdateStatement(question.id, statementId, updates)
              }
              onDeleteStatement={(statementId) =>
                onDeleteStatement(question.id, statementId)
              }
              onSetQuestionMedia={(media) => onSetQuestionMedia(question.id, media)}
              onSetChoiceMedia={(choiceId, media) =>
                onSetChoiceMedia(question.id, choiceId, media)
              }
              onSetStatementMedia={(statementId, media) =>
                onSetStatementMedia(question.id, statementId, media)
              }
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
