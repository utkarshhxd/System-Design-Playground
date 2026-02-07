import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { X, Trash2 } from 'lucide-react';

const NodeWrapper = ({ id, x, y, isSelected, children }) => {
    const { selectNode, setNodes, transform, deleteNode } = useCanvas();
    const [contextMenu, setContextMenu] = useState(null);
    const wrapperRef = useRef(null);

    // Close context menu on outside click
    useEffect(() => {
        if (!contextMenu) return;
        const handleClickOutside = (e) => {
            if (contextMenu && !wrapperRef.current?.contains(e.target)) {
                setContextMenu(null);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [contextMenu]);

    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        deleteNode(id);
        setContextMenu(null);
    };

    const handlePointerDown = (e) => {
        // Don't start drag if clicking on delete button
        if (e.target.closest('.node-delete-btn')) {
            return;
        }

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
            const SNAP = 1;
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
        <>
            <div
                ref={wrapperRef}
                onPointerDown={handlePointerDown}
                onContextMenu={handleContextMenu}
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
                    // Styling moved to ServiceNode to avoid double outlines
                }}>

                    {children}
                </div>
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <div
                    style={{
                        position: 'fixed',
                        left: contextMenu.x,
                        top: contextMenu.y,
                        backgroundColor: 'var(--bg-panel)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '6px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        zIndex: 'var(--z-overlay)',
                        minWidth: '150px',
                        padding: '4px',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={handleDelete}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '4px',
                            color: 'var(--danger)',
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'background 0.1s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <Trash2 size={14} />
                        Delete Node
                    </button>
                </div>
            )}
        </>
    );
};

export default NodeWrapper;
