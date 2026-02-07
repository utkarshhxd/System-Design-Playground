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
    const [selectedEdge, setSelectedEdge] = useState(null); // ID of selected edge

    // Interaction State
    const [linkingSource, setLinkingSource] = useState(null); // { nodeId, handleType, x, y }
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, worldX: 0, worldY: 0 }); // For live connection line (screen + world coords)

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
        setSelectedEdge(null); // Deselect edge when selecting node
    }, []);

    const selectEdge = useCallback((id) => {
        setSelectedEdge(id);
        setSelection([]); // Deselect nodes when selecting edge
    }, []);

    const deselectAll = useCallback(() => {
        setSelection([]);
        setSelectedEdge(null);
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

    const updateNodeDimensions = useCallback((id, { width, height }) => {
        setNodes(prev => prev.map(node => {
            if (node.id === id) {
                // Only update if changed prevents infinite loops
                if (node.width === width && node.height === height) return node;
                return { ...node, width, height };
            }
            return node;
        }));
    }, []);

    const deleteNode = useCallback((nodeId) => {
        setNodes(prev => prev.filter(n => n.id !== nodeId));
        // Also remove connected edges
        setEdges(prev => prev.filter(e => e.source !== nodeId && e.target !== nodeId));
        // Deselect if this node was selected
        setSelection(prev => prev.filter(id => id !== nodeId));
    }, []);

    const deleteNodes = useCallback((nodeIds) => {
        setNodes(prev => prev.filter(n => !nodeIds.includes(n.id)));
        // Also remove connected edges
        setEdges(prev => prev.filter(e => !nodeIds.includes(e.source) && !nodeIds.includes(e.target)));
        // Deselect deleted nodes
        setSelection(prev => prev.filter(id => !nodeIds.includes(id)));
    }, []);

    const deleteEdge = useCallback((edgeId) => {
        setEdges(prev => prev.filter(e => e.id !== edgeId));
        if (selectedEdge === edgeId) setSelectedEdge(null);
    }, [selectedEdge]);

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
        updateNodeDimensions,
        addEdge,
        deleteNode,
        deleteNodes,
        deleteEdge,
        startLinking,
        stopLinking,
        screenToCanvas,
        selectedEdge,
        selectEdge
    };

    return (
        <CanvasContext.Provider value={value}>
            {children}
        </CanvasContext.Provider>
    );
};
