import React, { useCallback } from 'react';
import { useCanvas } from '../../context/CanvasContext';

const NodeWrapper = ({ id, x, y, isSelected, children }) => {
    const { selectNode, setNodes, transform } = useCanvas();

    const handlePointerDown = (e) => {
        e.stopPropagation(); // Prevent canvas pan

        // Select
        selectNode(id, e.shiftKey); // Multi-select with Shift

        // Capture initial node position
        const initialX = x;
        const initialY = y;

        // Start Drag
        const startX = e.clientX;
        const startY = e.clientY;

        const onPointerMove = (moveEvent) => {
            const dx = (moveEvent.clientX - startX) / transform.k;
            const dy = (moveEvent.clientY - startY) / transform.k;

            // Snap logic
            const SNAP = 20;
            const rawX = initialX + dx;
            const rawY = initialY + dy;

            const snappedX = Math.round(rawX / SNAP) * SNAP;
            const snappedY = Math.round(rawY / SNAP) * SNAP;

            // Update Node Position
            setNodes(prev => prev.map(n => {
                if (n.id === id) { // TODO: Handle multi-selection drag
                    return { ...n, x: snappedX, y: snappedY };
                }
                return n;
            }));
        };

        const onPointerUp = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    };

    return (
        <div
            onPointerDown={handlePointerDown}
            style={{
                position: 'absolute',
                transform: `translate(${x}px, ${y}px)`,
                cursor: 'grab',
                userSelect: 'none',
                zIndex: isSelected ? 'var(--z-node) + 1' : 'var(--z-node)',
                touchAction: 'none',
            }}
        >
            <div style={{
                position: 'relative',
                borderRadius: '8px',
                boxShadow: isSelected
                    ? '0 0 0 2px var(--accent-primary), 0 8px 16px rgba(0,0,0,0.5)'
                    : '0 2px 4px rgba(0,0,0,0.2), 0 0 0 1px var(--border-subtle)',
                backgroundColor: 'var(--bg-node)',
                transition: 'box-shadow 0.1s ease',
            }}>
                {children}
            </div>
        </div>
    );
};

export default NodeWrapper;
