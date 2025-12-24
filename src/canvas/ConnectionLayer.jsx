import React, { useRef, useEffect } from 'react';
import { useCanvas } from '../context/CanvasContext';
import ConnectionLine from './ConnectionLine';

const ConnectionLayer = () => {
    const { nodes, edges, linkingSource, cursorPos, transform, selection } = useCanvas();

    // Helper to find handle position
    // Assuming handles are at node.x (left) and node.x + width (right)
    const getNodeHandlePosition = (nodeId, handleType) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return { x: 0, y: 0 };

        // Hardcoded dimensions matching ServiceNode
        // Width 160, Vertical center is roughly +30
        if (handleType === 'source') {
            return { x: node.x + 160, y: node.y + 40 }; // Right side
        } else {
            return { x: node.x, y: node.y + 40 }; // Left side
        }
    };

    return (
        <svg style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible',
            pointerEvents: 'none', // Allow clicks to pass through to nodes
            zIndex: 'var(--z-edge)',
        }}>
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="var(--text-dim)" opacity="0.6" />
                </marker>
                <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent-primary)" />
                </marker>
            </defs>

            {/* Existing Edges */}
            {edges.map((edge, i) => {
                const sourcePos = getNodeHandlePosition(edge.source, 'source');
                const targetPos = getNodeHandlePosition(edge.target, 'target');

                return (
                    <ConnectionLine
                        key={edge.id || i}
                        sourceX={sourcePos.x}
                        sourceY={sourcePos.y}
                        targetX={targetPos.x}
                        targetY={targetPos.y}
                        isSelected={false} // TODO: Selection logic for edges
                    />
                );
            })}

            {/* Linking Line */}
            {linkingSource && (
                <ConnectionLine
                    sourceX={linkingSource.x}
                    sourceY={linkingSource.y}
                    // The cursor pos is in screen coordinates if we get it from event, 
                    // but we stored it as screen coords in context? 
                    // Wait, we need to transform cursor pos to world pos here.
                    // Or we store world pos in context.
                    // Let's assume context stores World Pos for cursor.
                    targetX={(cursorPos.x - transform.x) / transform.k}
                    targetY={(cursorPos.y - transform.y) / transform.k}
                    isSelected={true}
                />
            )}
        </svg>
    );
};

export default ConnectionLayer;
