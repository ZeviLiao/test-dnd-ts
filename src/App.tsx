// App.tsx
import React from 'react';
import DragOverlayExample from './DragDropExample';

const App: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Drag and Drop Overlay Example</h1>
      <DragOverlayExample />
    </div>
  );
};

export default App;
