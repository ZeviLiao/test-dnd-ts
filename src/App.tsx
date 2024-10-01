import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Define the item type
const ItemType = 'ITEM';

// Define the props for the DraggableItem component
interface DraggableItemProps {
    id: string;
    onDrop: (draggedId: string, targetId: string) => void;
}

// DraggableItem component
const DraggableItem: React.FC<DraggableItemProps> = ({ id, onDrop }) => {
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

    return (
        <div
            ref={(node) => drag(drop(node))}
            style={{
                opacity: isDragging ? 0.5 : 1,
                width: '100px',
                height: '100px',
                margin: '10px',
                backgroundColor: isOver ? 'lightgreen' : 'lightblue',
                display: 'inline-block',
                border: '1px solid black',
                position: 'relative',
            }}
        >
            Item {id}
        </div>
    );
};

// Main component
const MyComponent: React.FC = () => {
    const [overlapping, setOverlapping] = useState<{ draggedId: string; targetId: string } | null>(null);

    // Handle the drop event
    const handleDrop = (draggedId: string, targetId: string) => {
        setOverlapping({ draggedId, targetId });
        console.log(`Dropped item ID: ${draggedId} on target ID: ${targetId}`);
    };

    return (
        <div style={{ position: 'relative', padding: '20px' }}>
            <DraggableItem id="1" onDrop={handleDrop} />
            <DraggableItem id="2" onDrop={handleDrop} />
            <DraggableItem id="3" onDrop={handleDrop} />
            {overlapping && (
                <div
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        background: 'rgba(255, 255, 0, 0.5)',
                        padding: '10px',
                    }}
                >
                    Dropped Item ID: {overlapping.draggedId} on Target ID: {overlapping.targetId}
                </div>
            )}
        </div>
    );
};

// Main App component
const App: React.FC = () => {
    return (
        <DndProvider backend={HTML5Backend}>
            <MyComponent />
        </DndProvider>
    );
};

export default App;
