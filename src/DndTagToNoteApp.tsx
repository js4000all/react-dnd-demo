import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';

// 型定義
interface Note {
  text: string;
  tag: string;
}

interface DraggableTagProps {
  tag: string;
}

interface DroppableNoteProps {
  note: Note;
  index: number;
}

// Tag コンポーネント
function DraggableTag({ tag }: DraggableTagProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: tag });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="px-2 py-1 bg-blue-100 rounded border cursor-move flex justify-between items-center"
    >
      <span>{tag}</span>
    </div>
  );
}

// Note コンポーネント
function DroppableNote({ note, index }: DroppableNoteProps) {
  const { isOver, setNodeRef } = useDroppable({ id: `note-${index}` });
  return (
    <div
      ref={setNodeRef}
      className={`p-3 border rounded bg-white flex flex-col gap-1 transition ${
        isOver ? 'border-blue-500 shadow-md' : 'border-gray-300'
      }`}
    >
      <div className="font-semibold">{note.text}</div>
      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit">
        {note.tag || '(no tag)'}
      </div>
    </div>
  );
}

// メインコンポーネント
export default function DndTagToNoteApp() {
  const [tags] = useState<string[]>(['#Work', '#Personal', '#Ideas']);
  const [notes, setNotes] = useState<Note[]>([
    { text: 'Finish the report', tag: '' },
    { text: 'Buy groceries', tag: '' },
    { text: 'Plan weekend trip', tag: '' },
  ]);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTag(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTag(null);
    if (!over || !active) return;

    const tag = String(active.id);
    const noteIndex = parseInt(over.id.replace('note-', ''), 10);
    if (isNaN(noteIndex)) return;

    const updated = [...notes];
    updated[noteIndex].tag = tag;
    setNotes(updated);
  };

  return (
    <div className="flex gap-10 p-8 bg-gray-50 min-h-screen">
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <div className="w-1/3">
          <h2 className="text-lg font-bold mb-4">Tags</h2>
          <div className="flex flex-col gap-2">
            {tags.map((tag) => (
              <DraggableTag key={tag} tag={tag} />
            ))}
          </div>
        </div>

        <div className="w-2/3">
          <h2 className="text-lg font-bold mb-4">Notes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((note, idx) => (
              <DroppableNote
                key={idx}
                note={note}
                index={idx}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {activeTag ? (
            <div className="px-2 py-1 bg-blue-200 border border-blue-400 rounded shadow-lg opacity-90 text-center">
              {activeTag}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
