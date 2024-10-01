// DraggableItems.tsx
import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  rectIntersection,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface DraggableItemProps {
  id: string;
  color: string;
  isOver: boolean;
  isDragging: boolean;
  handleDragEnd: (event: DragEndEvent) => void;
  handleDragStart: (event: DragStartEvent) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  color,
  isOver,
  isDragging,
  handleDragEnd,
  handleDragStart,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
  } = useDraggable({
    id,
  });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id,
  });

  const style = {
    width: 100,
    height: 100,
    backgroundColor: color,
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
    borderRadius: 10,
    border: isOver ? "2px solid black" : "none", // Highlight if item is overlapping
    transition: "border 0.2s ease",
    zIndex: isDragging ? 10 : 1, // Higher z-index when dragging
  };

  return (
    <div
      ref={(node) => {
        setDraggableRef(node);
        setDroppableRef(node);
      }}
      style={style}
      {...listeners}
      {...attributes}
    >
      {id}
    </div>
  );
};

const DraggableItems: React.FC = () => {
  const initialItems = [
    { id: "item-1", color: "red" },
    { id: "item-2", color: "green" },
    { id: "item-3", color: "blue" },
    { id: "item-4", color: "yellow" },
  ];

  const [items] = useState(initialItems);
  const [activeId, setActiveId] = useState<string | null>(null); // To track the active draggable item
  const [overId, setOverId] = useState<string | null>(null); // To track the item being overlapped

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log("Drag ended", event);
    // Reset overlapping state
    setOverId(null);
    setActiveId(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const over = event.over;
    if (over) {
      setOverId(over.id as string);
    } else {
      setOverId(null);
    }
  };

  return (
    <DndContext
      collisionDetection={rectIntersection} // Use rectIntersection to detect overlaps
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          padding: "20px",
          border: "2px dashed #ddd",
        }}
      >
        {items.map((item) => (
          <div key={item.id}>
            <DraggableItem
              id={item.id}
              color={item.color}
              isOver={overId === item.id} // Pass whether this item is being overlapped
              isDragging={activeId === item.id} // Pass whether this item is currently being dragged
              handleDragEnd={handleDragEnd}
              handleDragStart={handleDragStart}
            />

            {/* {activeId === item.id && (
              <div
                style={{
                  position: "absolute",
                  width: 100,
                  height: 100,
                  top: 0,
                  left: 0,
                  backgroundColor: "lightgrey",
                  borderRadius: 10,
                  border: "2px dashed black",
                  pointerEvents: "none", // Prevent it from interfering with drag events
                  zIndex: 1, // Lower z-index than the dragging item
                }}
              >
                Drag Overlay
              </div>
            )} */}
          </div>
        ))}
      </div>

      {/* Display the active item and the item it is overlapping with */}
      {activeId && overId && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p>Dragging: {activeId}</p>
          <p>Overlapping with: {overId}</p>
        </div>
      )}
    </DndContext>
  );
};

export default DraggableItems;
