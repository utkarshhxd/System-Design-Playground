

import React, { useEffect } from 'react';
import './index.css';
import Sidebar from './components/ui/Sidebar';
import PropertiesPanel from './components/ui/PropertiesPanel';
import Canvas from './canvas/Canvas';
import { CanvasProvider, useCanvas } from './context/CanvasContext';

const AppContent = () => {
  const { selection, nodes, setNodes, setEdges, deselectAll, deleteNodes, selectedEdge, deleteEdge } = useCanvas();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selection.length > 0) {
          deleteNodes(selection);
          deselectAll();
        } else if (selectedEdge) {
          deleteEdge(selectedEdge);
          deselectAll();
        }
      }
      // ESC to deselect
      if (e.key === 'Escape') {
        deselectAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selection, deleteNodes, deselectAll, selectedEdge, deleteEdge]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', overflow: 'hidden' }}>
      <Sidebar />
      <Canvas />
      <PropertiesPanel />
    </div>
  );
};

function App() {
  return (
    <CanvasProvider>
      <AppContent />
    </CanvasProvider>
  );
}

export default App;
