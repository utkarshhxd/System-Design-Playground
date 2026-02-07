import React from 'react';
import { useCanvas } from '../context/CanvasContext';
import ConnectionLine from './ConnectionLine';

const ConnectionLayer = () => {
    const { nodes, edges, linkingSource, cursorPos, transform, selectedEdge, selectEdge } = useCanvas();

    // Helper: Get node dimensions (approximate based on ServiceNode)
    const getNodeHandlePosition = (nodeId, handleType) => {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return { x: 0, y: 0 };

        // Use dynamic dimensions if available, fallback to defaults
        const width = node.width || 160;
        const height = node.height || 60;

        if (handleType === 'source') {
            return { x: node.x + width, y: node.y + (height / 2) }; // Right side
        } else {
            return { x: node.x, y: node.y + (height / 2) }; // Left side
        }
    };

    // Find the nearest valid target port to snap to
    const getSnappedTargetPosition = (worldCursorX, worldCursorY) => {
        if (!linkingSource) return null;

        // Snap threshold in screen pixels (converted to world coordinates)
        const SNAP_THRESHOLD_SCREEN = 40;
        const SNAP_THRESHOLD = SNAP_THRESHOLD_SCREEN / transform.k;

        let nearestPort = null;
        let minDistance = Infinity;

        // Find compatible target ports (if linking from source, find target ports)
        nodes.forEach(node => {
            // Skip the source node itself
            if (node.id === linkingSource.nodeId) return;

            // Only snap to compatible ports (source -> target)
            if (linkingSource.handleType === 'source') {
                const targetPos = getNodeHandlePosition(node.id, 'target');
                const dx = worldCursorX - targetPos.x;
                const dy = worldCursorY - targetPos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < SNAP_THRESHOLD && distance < minDistance) {
                    minDistance = distance;
                    nearestPort = targetPos;
                }
            }
        });

        return nearestPort;
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
                <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill="var(--text-dim)" opacity="0.6" />
                </marker>
                <marker id="arrowhead-active" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent-primary)" />
                </marker>
            </defs>

            {/* Existing Edges */}
            {edges.map((edge, i) => {
                const sourcePos = getNodeHandlePosition(edge.source, 'source');
                const targetPos = getNodeHandlePosition(edge.target, 'target');

                return (
                    <ConnectionLine
                        key={edge.id || i}
                        id={edge.id}
                        sourceX={sourcePos.x}
                        sourceY={sourcePos.y}
                        sourceDirection="right" // Explicit direction for precision
                        targetX={targetPos.x}
                        targetY={targetPos.y}
                        targetDirection="left"  // Explicit direction for precision
                        isSelected={selectedEdge === edge.id}
                        onSelect={() => selectEdge(edge.id)}
                    />
                );
            })}

            {/* Linking Line */}
            {linkingSource && (() => {
                const worldCursorX = cursorPos.worldX || 0;
                const worldCursorY = cursorPos.worldY || 0;

                const snappedTarget = getSnappedTargetPosition(worldCursorX, worldCursorY);

                let targetX, targetY;
                if (snappedTarget) {
                    targetX = snappedTarget.x;
                    targetY = snappedTarget.y;
                } else {
                    targetX = worldCursorX;
                    targetY = worldCursorY;
                }

                return (
                    <ConnectionLine
                        sourceX={linkingSource.x}
                        sourceY={linkingSource.y}
                        sourceDirection="right"
                        targetX={targetX}
                        targetY={targetY}
                        targetDirection="left"
                        isSelected={true}
                    />
                );
            })()}
        </svg>
    );
};

export default ConnectionLayer;
