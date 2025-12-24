import React, { createContext, useContext, useState, useCallback } from 'react';

const CanvasContext = createContext(null);

export const useCanvas = () => {
    const context = useContext(CanvasContext);
    if (!context) {
        throw new Error('useCanvas must be used within a CanvasProvider');
    }
    return context;
};

export const CanvasProvider = ({ children }) => {
    // Viewport Transform (Pan/Zoom)
    const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });

    // Data
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [selection, setSelection] = useState([]); // Array of Node IDs

    // Interaction State
    const [linkingSource, setLinkingSource] = useState(null); // { nodeId, handleType, x, y }
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 }); // For live connection line

    const zoomTo = useCallback((scale) => {
        setTransform(prev => {
            const newK = Math.max(0.1, Math.min(5, scale));
            return { ...prev, k: newK };
        });
    }, []);

    const panTo = useCallback((x, y) => {
        setTransform(prev => ({ ...prev, x, y }));
    }, []);

    const selectNode = useCallback((id, multi = false) => {
        setSelection(prev => multi ? [...prev, id] : [id]);
    }, []);

    const deselectAll = useCallback(() => {
        setSelection([]);
    }, []);

    const addNode = useCallback((node) => {
        setNodes(prev => [...prev, node]);
    }, []);

    const addEdge = useCallback((edge) => {
        // Check for duplicates
        setEdges(prev => {
            if (prev.find(e => e.source === edge.source && e.target === edge.target)) return prev;
            return [...prev, edge];
        });
    }, []);

    // Use this for linking updates
    const startLinking = useCallback((sourceParams) => {
        setLinkingSource(sourceParams);
    }, []);

    const stopLinking = useCallback(() => {
        setLinkingSource(null);
    }, []);

    const screenToCanvas = useCallback((screenX, screenY, rect) => {
        return {
            x: (screenX - rect.left - transform.x) / transform.k,
            y: (screenY - rect.top - transform.y) / transform.k
        };
    }, [transform]);

    const value = {
        transform,
        nodes,
        edges,
        selection,
        linkingSource,
        cursorPos,
        setTransform,
        setNodes,
        setEdges, // Exposed
        setCursorPos,
        zoomTo,
        panTo,
        selectNode,
        deselectAll,
        addNode,
        addEdge,
        startLinking,
        stopLinking,
        screenToCanvas
    };

    return (
        <CanvasContext.Provider value={value}>
            {children}
        </CanvasContext.Provider>
    );
};
