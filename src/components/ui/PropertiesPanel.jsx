import React, { useEffect, useState } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { Trash2, Copy, X } from 'lucide-react';

const PropertiesPanel = () => {
    const { selection, nodes, setNodes, deselectAll, deleteNode, selectedEdge, deleteEdge } = useCanvas();
    const [localData, setLocalData] = useState(null);

    const selectedNodeId = selection.length > 0 ? selection[0] : null;
    const selectedNode = nodes.find(n => n.id === selectedNodeId);

    // Sync local state when selection changes
    useEffect(() => {
        if (selectedNode) {
            setLocalData({ ...selectedNode.data });
        } else {
            setLocalData(null);
        }
    }, [selectedNodeId, selectedNode]);

    // Handle Edge Selection
    if (selectedEdge) {
        return (
            <aside style={{
                width: '300px',
                backgroundColor: 'var(--bg-panel)',
                borderLeft: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 'var(--z-ui)',
            }}>
                <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h2 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        Connection
                    </h2>
                    <button
                        onClick={() => deselectAll()}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                    >
                        <X size={14} />
                    </button>
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</label>
                        <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                            {selectedEdge}
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => {
                                deleteEdge(selectedEdge);
                                deselectAll();
                            }}
                            style={{
                                flex: 1,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                padding: '8px',
                                borderRadius: '6px',
                                border: '1px solid var(--danger)',
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: 'var(--danger)',
                                fontSize: '13px',
                                cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}
                        >
                            <Trash2 size={14} /> Delete Connection
                        </button>
                    </div>
                </div>
            </aside>
        );
    }

    if (!selectedNode || !localData) {
        return (
            <aside style={{
                width: '300px',
                backgroundColor: 'var(--bg-panel)',
                borderLeft: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 'var(--z-ui)',
            }}>
                <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
                    <h2 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        Properties
                    </h2>
                </div>
                <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-dim)', fontSize: '13px' }}>
                    Select a node or connection to view details
                </div>
            </aside>
        );
    }

    const handleChange = (field, value) => {
        setLocalData(prev => ({ ...prev, [field]: value }));
        setNodes(prev => prev.map(n => n.id === selectedNodeId ? { ...n, data: { ...n.data, [field]: value } } : n));
    };

    const handleDelete = () => {
        deleteNode(selectedNodeId);
        deselectAll();
    };

    return (
        <aside style={{
            width: '300px',
            backgroundColor: 'var(--bg-panel)',
            borderLeft: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 'var(--z-ui)',
        }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {localData.title}
                </h2>
                <button
                    onClick={() => deselectAll()}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                    <X size={14} />
                </button>
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Type Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</label>
                    <div style={{
                        padding: '8px', borderRadius: '4px', backgroundColor: 'var(--bg-canvas)',
                        border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '13px'
                    }}>
                        {selectedNode.type}
                    </div>
                </div>

                {/* Title Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</label>
                    <input
                        type="text"
                        value={localData.title || ''}
                        onChange={(e) => handleChange('title', e.target.value)}
                        style={{
                            background: 'var(--bg-canvas)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            padding: '8px',
                            color: 'var(--text-primary)',
                            fontSize: '13px',
                            outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
                </div>

                {/* Metadata */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</label>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                        {selectedNode.id}
                    </div>
                </div>

                {/* Actions */}
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button
                        onClick={handleDelete}
                        style={{
                            flex: 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            padding: '8px',
                            borderRadius: '6px',
                            border: '1px solid var(--danger)',
                            background: 'rgba(239, 68, 68, 0.1)',
                            color: 'var(--danger)',
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default PropertiesPanel;
