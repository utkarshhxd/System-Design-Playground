import React, { useRef, useState, useEffect } from 'react';
import { Minus, Plus, Maximize, RotateCcw } from 'lucide-react';
import { useCanvas } from '../context/CanvasContext';
import NodeWrapper from '../components/nodes/NodeWrapper';
import ServiceNode from '../components/nodes/ServiceNode';
import ConnectionLayer from './ConnectionLayer';

const Canvas = () => {
    const { transform, setTransform, zoomTo, nodes, addNode, screenToCanvas, selection, setCursorPos, linkingSource, stopLinking, deselectAll } = useCanvas();
    const containerRef = useRef(null);
    const [isPanning, setIsPanning] = useState(false);
    const lastMousePos = useRef({ x: 0, y: 0 });

    // Handle Drop from Sidebar
    const handleDrop = (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('application/nodeType');
        const label = e.dataTransfer.getData('application/nodeLabel');
        if (!type) return;

        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            // Calculate center of node (approx width 160, height 60)
            const { x, y } = screenToCanvas(e.clientX, e.clientY, rect);

            addNode({
                id: crypto.randomUUID(),
                type,
                x: x - 80, // Center horizontally
                y: y - 30, // Center vertically
                data: { title: label || (type.charAt(0).toUpperCase() + type.slice(1)) }
            });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    // Handle Wheel Zoom
    const handleWheel = (e) => {
        e.preventDefault();

        const ZOOM_SENSITIVITY = 0.001;
        const delta = -e.deltaY * ZOOM_SENSITIVITY;
        const newScale = Math.max(0.1, Math.min(5, transform.k + delta * transform.k));

        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const worldX = (mouseX - transform.x) / transform.k;
        const worldY = (mouseY - transform.y) / transform.k;

        const newX = mouseX - worldX * newScale;
        const newY = mouseY - worldY * newScale;

        setTransform({ x: newX, y: newY, k: newScale });
    };

    // Handle Panning
    const handlePointerDown = (e) => {
        // If linking, click on background cancels it
        if (linkingSource) {
            stopLinking();
            return;
        }

        // Avoid panning if clicking on a node (handled by NodeWrapper stopPropagation)
        // But if we click on background, we pan.
        if (e.target.closest('.node-wrapper') || e.target.closest('.port-handle')) return;

        if (e.button === 1 || e.button === 0) {
            if (!isPanning) {
                deselectAll();
            }
            setIsPanning(true);
            lastMousePos.current = { x: e.clientX, y: e.clientY };
            e.currentTarget.setPointerCapture(e.pointerId);
        }
    };

    const handlePointerMove = (e) => {
        // Update cursor pos for linking (both screen and world coordinates)
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const worldX = (e.clientX - rect.left - transform.x) / transform.k;
            const worldY = (e.clientY - rect.top - transform.y) / transform.k;
            setCursorPos({ x: e.clientX, y: e.clientY, worldX, worldY });
        } else {
            setCursorPos({ x: e.clientX, y: e.clientY, worldX: 0, worldY: 0 });
        }

        if (!isPanning) return;

        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;

        lastMousePos.current = { x: e.clientX, y: e.clientY };

        setTransform(prev => ({
            ...prev,
            x: prev.x + dx,
            y: prev.y + dy
        }));
    };

    const handlePointerUp = (e) => {
        setIsPanning(false);
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const preventDefault = (e) => e.preventDefault();
        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [transform]);

    return (
        <main
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
                flex: 1,
                position: 'relative',
                backgroundColor: 'var(--bg-canvas)',
                overflow: 'hidden',
                cursor: isPanning ? 'grabbing' : 'grab',
                touchAction: 'none',
                userSelect: 'none',
            }}
        >
            {/* HUD / Toolbar */}
            <div style={{
                position: 'absolute',
                top: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 8px',
                backgroundColor: 'var(--bg-panel)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                zIndex: 'var(--z-ui)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
                <UtilityButton icon={<Minus size={14} />} onClick={() => zoomTo(transform.k * 0.9)} />
                <span style={{
                    fontSize: '12px',
                    fontVariantNumeric: 'tabular-nums',
                    padding: '0 8px',
                    color: 'var(--text-dim)',
                    minWidth: '48px',
                    textAlign: 'center'
                }}>
                    {Math.round(transform.k * 100)}%
                </span>
                <UtilityButton icon={<Plus size={14} />} onClick={() => zoomTo(transform.k * 1.1)} />
                <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-subtle)', margin: '0 4px' }} />
                <UtilityButton icon={<RotateCcw size={14} />} onClick={() => setTransform({ x: 0, y: 0, k: 1 })} />
            </div>

            {/* World Container - Transformed */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.k})`,
                transformOrigin: '0 0',
                willChange: 'transform',
            }}>
                {/* Dynamic Grid */}
                <div style={{
                    position: 'absolute',
                    top: -50000,
                    left: -50000,
                    width: 100000,
                    height: 100000,
                    backgroundImage: 'radial-gradient(var(--grid-dot) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    opacity: 0.3,
                    pointerEvents: 'none',
                }} />

                {/* Connection Layer (Edges) */}
                <ConnectionLayer />

                {/* Nodes */}
                {nodes.map(node => (
                    <NodeWrapper
                        key={node.id}
                        id={node.id}
                        x={node.x}
                        y={node.y}
                        isSelected={selection.includes(node.id)}
                        className="node-wrapper"
                    >
                        <ServiceNode
                            id={node.id}
                            type={node.type}
                            title={node.data.title || node.type}
                        />
                    </NodeWrapper>
                ))}
            </div>
        </main>
    );
};

const UtilityButton = ({ icon, onClick }) => (
    <button style={{
        background: 'transparent',
        border: 'none',
        color: 'var(--text-secondary)',
        padding: '6px',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.1s'
    }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--bg-canvas)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        onClick={onClick}
        onPointerDown={(e) => e.stopPropagation()}
    >
        {icon}
    </button>
)

export default Canvas;
