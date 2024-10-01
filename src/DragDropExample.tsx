// DragDropExample.tsx
import React from 'react';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';

interface Item {
  id: string;
  content: string;
}

const initialItems: Item[] = [
  { id: '1', content: 'Item 1' },
  { id: '2', content: 'Item 2' },
  { id: '3', content: 'Item 3' },
  { id: '4', content: 'Item 4' },
  { id: '5', content: 'Item 5' },
  { id: '6', content: 'Item 6' },
];

const DraggableItem = ({
  item,
  isDragging,
  isOver,
}: {
  item: Item;
  isDragging: boolean;
  isOver: boolean;
}) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: item.id,
  });

  // We can use useDroppable here to make the item droppable
  const { isOver: isOverDroppable, setNodeRef: setDroppableRef } = useDroppable({
    id: item.id,
  });

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        setDroppableRef(node);
      }}
      {...listeners}
      {...attributes}
      style={{
        padding: '16px',
        margin: '4px',
        backgroundColor: isDragging
          ? 'lightblue'
          : isOver || isOverDroppable
          ? 'lightcoral'
          : 'lightgray',
        border: '1px solid gray',
        borderRadius: '4px',
        cursor: 'grab',
        transition: 'background-color 0.3s ease, transform 0.2s ease',
        transform: isOver || isOverDroppable ? 'scale(1.05)' : 'scale(1)', // Scale up when hovered
        position: 'relative',
        zIndex: isDragging ? 10 : 1,
      }}
    >
      {item.content}
    </div>
  );
};

const DragDropExample = () => {
  const [items] = React.useState<Item[]>(initialItems);
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '300px' }}>
        {items.map((item) => (
          <DraggableItem
            key={item.id}
            item={item}
            isDragging={activeId === item.id}
            isOver={false} // Not needed anymore
          />
        ))}
      </div>
      <DragOverlay>
        {activeId ? (
          <div
            style={{
              padding: '16px',
              backgroundColor: 'lightgreen',
              border: '1px solid darkgreen',
              borderRadius: '4px',
              position: 'absolute',
              zIndex: 1000,
              transform: 'scale(1.1)', // Optional: scale the overlay for emphasis
            }}
          >
            {items.find((item) => item.id === activeId)?.content}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default DragDropExample;
