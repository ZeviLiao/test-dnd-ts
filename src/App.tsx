import React, { ReactNode, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Define the item type
const ItemType = "ITEM";

// Define the props for the MyComponent
interface MyComponentProps {
  onDrop: (draggedId: string, targetId: string) => void;
}

// DraggableItem component
const DraggableItem: React.FC<{
  id: string;
  onDrop: (draggedId: string, targetId: string) => void;
  children: React.ReactNode;
}> = ({ id, onDrop, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item: { id: string }) => {
      onDrop(item.id, id); // Call onDrop with the dragged ID and the target ID
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Define styles for the container
  const containerStyle: React.CSSProperties = {
    opacity: isDragging ? 0.5 : 1,
    margin: "10px",
    backgroundColor: isOver ? "lightgreen" : "lightblue",
    display: "inline-block",
    border: "1px solid black",
    position: "relative",
    cursor: "move",
    padding: "3px",
  };

  // Define styles for the children when overlapping
  const childStyle: React.CSSProperties = {
    opacity: isOver ? 0.7 : 1, // Change opacity on overlap
    transform: isOver ? "scale(1.1)" : "scale(1)", // Slightly enlarge children
    transition: "opacity 0.2s, transform 0.2s", // Smooth transition
  };

  return (
    <div ref={(node) => drag(drop(node))} style={containerStyle}>
      <div style={childStyle}>{children}</div>
    </div>
  );
};

// Main component
export const MyComponent: React.FC<MyComponentProps> = ({ onDrop }) => {
  return (
    <div style={{ position: "relative", padding: "20px" }}>
      <DraggableItem id="1" onDrop={onDrop}>
        <button style={{ padding: "10px 20px" }}>Button 1</button>
      </DraggableItem>
      <DraggableItem id="2" onDrop={onDrop}>
        <button style={{ padding: "10px 20px" }}>Button 2</button>
      </DraggableItem>
      <DraggableItem id="3" onDrop={onDrop}>
        <button style={{ padding: "10px 20px" }}>Button 3</button>
      </DraggableItem>
    </div>
  );
};

// Main App component
const App: React.FC = () => {
  const [overlapping, setOverlapping] = useState<{
    draggedId: string;
    targetId: string;
  } | null>(null);

  // Handle the drop event
  const handleDrop = (draggedId: string, targetId: string) => {
    setOverlapping({ draggedId, targetId });
    console.log(`Dropped item ID: ${draggedId} on target ID: ${targetId}`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <MyComponent onDrop={handleDrop} />
      {overlapping && (
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            background: "rgba(255, 255, 0, 0.5)",
            padding: "10px",
          }}
        >
          Dropped Item ID: {overlapping.draggedId} on Target ID:{" "}
          {overlapping.targetId}
        </div>
      )}
    </DndProvider>
  );
};

export default App;
