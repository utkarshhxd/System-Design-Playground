import React, { useRef, useState, useEffect } from 'react';
import { Minus, Plus, Maximize, RotateCcw, Download, Upload, Trash2 } from 'lucide-react';
import { useCanvas } from '../context/CanvasContext';
import NodeWrapper from '../components/nodes/NodeWrapper';
import ServiceNode from '../components/nodes/ServiceNode';
import ConnectionLayer from './ConnectionLayer';

const Canvas = () => {
    const { transform, setTransform, zoomTo, nodes, setNodes, edges, setEdges, addNode, screenToCanvas, selection, setCursorPos, linkingSource, stopLinking, deselectAll } = useCanvas();
    const containerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isPanning, setIsPanning] = useState(false);
    const [showClearDialog, setShowClearDialog] = useState(false);
    const lastMousePos = useRef({ x: 0, y: 0 });

    const handleClear = () => {
        setShowClearDialog(true);
    };

    const handleSave = () => {
        const data = {
            nodes,
            edges,
            transform
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system-design-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleImportFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.nodes) setNodes(data.nodes);
                if (data.edges) setEdges(data.edges);
                if (data.transform) setTransform(data.transform);
            } catch (error) {
                console.error("Failed to parse imported file:", error);
                alert("Invalid file format");
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset input so same file can be selected again
    };

    // Handle Drop from Sidebar
    const handleDrop = (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('application/nodeType');
        const label = e.dataTransfer.getData('application/nodeLabel');
        const iconName = e.dataTransfer.getData('application/iconName');

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
                data: {
                    label: label || (type.charAt(0).toUpperCase() + type.slice(1)),
                    iconName: iconName || null
                }
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
        if (linkingSource) {
            stopLinking();
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
                top: '24px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '8px',
                backgroundColor: 'rgba(30, 30, 35, 0.65)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                zIndex: 'var(--z-ui)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                color: 'var(--text-primary)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <UtilityButton icon={<Minus size={16} />} onClick={() => zoomTo(transform.k * 0.9)} title="Zoom Out" />
                    <span style={{
                        fontSize: '13px',
                        fontVariantNumeric: 'tabular-nums',
                        padding: '0 8px',
                        color: 'var(--text-secondary)',
                        minWidth: '52px',
                        textAlign: 'center',
                        fontWeight: 500
                    }}>
                        {Math.round(transform.k * 100)}%
                    </span>
                    <UtilityButton icon={<Plus size={16} />} onClick={() => zoomTo(transform.k * 1.1)} title="Zoom In" />
                </div>

                <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />

                <UtilityButton icon={<RotateCcw size={16} />} onClick={() => setTransform({ x: 0, y: 0, k: 1 })} label="Reset" />

                <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />

                <UtilityButton icon={<Download size={16} />} onClick={handleSave} label="Export" />
                <UtilityButton icon={<Upload size={16} />} onClick={handleImportClick} label="Import" />

                <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />

                <UtilityButton icon={<Trash2 size={16} />} onClick={handleClear} label="Clear" isDanger />

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".json"
                    onChange={handleImportFile}
                />
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
                // willChange: 'transform', // Removed to prevent blurriness on zoom
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
                    opacity: 0.4,
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
                            selected={selection.includes(node.id)}
                        />
                    </NodeWrapper>
                ))}
            </div>

            {/* Clear Confirmation Modal */}
            {showClearDialog && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 'var(--z-overlay)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                    onClick={() => setShowClearDialog(false)}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <div style={{
                        width: '320px',
                        backgroundColor: 'rgba(30, 30, 35, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--danger)' }}>
                            <div style={{
                                padding: '10px',
                                borderRadius: '12px',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)'
                            }}>
                                <Trash2 size={24} />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Clear Board?</h3>
                        </div>

                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5' }}>
                            Are you sure you want to delete all components and connections? This action cannot be undone.
                        </p>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <button
                                onClick={() => setShowClearDialog(false)}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-subtle)',
                                    background: 'transparent',
                                    color: 'var(--text-secondary)',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--bg-panel)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setNodes([]);
                                    setEdges([]);
                                    setShowClearDialog(false);
                                }}
                                style={{
                                    flex: 1,
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'var(--danger)',
                                    color: '#fff',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)'; }}
                            >
                                Clear Board
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

const UtilityButton = ({ icon, onClick, title, label, isDanger }) => (
    <button style={{
        background: 'transparent',
        border: 'none',
        color: isDanger ? 'var(--text-dim)' : 'var(--text-secondary)',
        padding: '8px 12px',
        borderRadius: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)'
    }}
        title={title || label}
        onMouseEnter={(e) => {
            if (isDanger) {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                e.currentTarget.style.color = 'var(--danger)';
            } else {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.color = 'var(--text-primary)';
            }
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = isDanger ? 'var(--text-dim)' : 'var(--text-secondary)';
        }}
        onClick={onClick}
        onPointerDown={(e) => e.stopPropagation()}
    >
        {icon}
        {label && <span style={{ fontSize: '13px', fontWeight: 500 }}>{label}</span>}
    </button>
)

export default Canvas;
