// App.tsx
import React from 'react';
import DraggableItems from './DraggableItems';

const App: React.FC = () => {
  return (
    <div>
      <h1>Drag and Drop with Reset</h1>
      <DraggableItems />
    </div>
  );
};

export default App;
