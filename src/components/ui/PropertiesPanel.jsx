import React, { useEffect, useState } from 'react';
import { useCanvas } from '../../context/CanvasContext';
import { Trash2, Copy, X, ArrowRight, ArrowDown } from 'lucide-react';
import { getIcon } from '../../utils/icons';

const PropertiesPanel = () => {
    const { selection, nodes, setNodes, edges, setEdges, deselectAll, deleteNode, selectedEdge, deleteEdge } = useCanvas();
    const [localData, setLocalData] = useState(null);

    const selectedNodeId = selection.length > 0 ? selection[0] : null;
    const selectedNode = nodes.find(n => n.id === selectedNodeId);
    const currentEdge = edges.find(e => e.id === selectedEdge);

    // Sync local state when selection changes
    useEffect(() => {
        if (selectedNode) {
            setLocalData({ ...selectedNode.data });
        } else if (currentEdge) {
            setLocalData({ ...currentEdge.data });
        } else {
            setLocalData(null);
        }
    }, [selectedNodeId, selectedNode, selectedEdge, currentEdge]);

    const handleEdgeChange = (field, value) => {
        setLocalData(prev => ({ ...prev, [field]: value }));
        setEdges(prev => prev.map(e => e.id === selectedEdge ? { ...e, data: { ...e.data, [field]: value } } : e));
    };

    // Helper to get Icon for a node (duplicated from ServiceNode for now)
    const getNodeIcon = (node) => {
        if (!node) return getIcon('Server');
        if (node.data?.iconName) return getIcon(node.data.iconName);

        const TYPE_TO_ICON = {
            'client': 'Globe', 'mobile': 'Smartphone',
            'dns': 'Route', 'cdn': 'Cloud', 'loadbalancer': 'Layers', 'firewall': 'Shield', 'waf': 'ShieldAlert',
            'server': 'Server', 'microservice': 'Cpu', 'worker': 'Calculator', 'scheduler': 'Clock',
            'database': 'Database', 'storage': 'Box', 'filestorage': 'File', 'warehouse': 'Archive', 'datalake': 'Layers', 'backup': 'Save',
            'cache': 'HardDrive', 'cdncache': 'Zap',
            'queue': 'LayoutGrid', 'taskqueue': 'List', 'pubsub': 'Radio', 'stream': 'Zap',
            'auth': 'Lock', 'authorization': 'Key', 'gateway': 'Router', 'ratelimiter': 'Gauge', 'secrets': 'Key',
            'registry': 'Book', 'autoscaler': 'TrendingUp', 'replica': 'Copy', 'failover': 'Shuffle', 'circuitbreaker': 'ToggleRight',
            'logging': 'FileText', 'metrics': 'BarChart', 'tracing': 'Activity', 'alerts': 'Bell',
            'config': 'Settings', 'cicd': 'GitBranch', 'container': 'Container', 'orchestrator': 'Ship',
            'search': 'Search', 'indexing': 'ListStart', 'analytics': 'PieChart',
            'notification': 'Mail', 'payment': 'CreditCard', 'external': 'LinkIcon'
        };

        const iconName = TYPE_TO_ICON[node.type] || 'Server';
        return getIcon(iconName);
    };

    // Handle Edge Selection
    if (selectedEdge && currentEdge && localData) {
        const sourceNode = nodes.find(n => n.id === currentEdge.source);
        const targetNode = nodes.find(n => n.id === currentEdge.target);

        const SourceIcon = getNodeIcon(sourceNode);
        const TargetIcon = getNodeIcon(targetNode);

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

                    {/* Visual Connection Flow */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                        {/* Source Card */}
                        <div style={{
                            width: '100%',
                            padding: '12px',
                            background: 'var(--bg-canvas)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '6px',
                                background: 'rgba(255,255,255,0.05)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--text-secondary)'
                            }}>
                                <SourceIcon size={18} strokeWidth={1.5} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {sourceNode?.data?.label || 'Source'}
                                </span>
                                <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                                    {sourceNode?.type || 'Unknown'}
                                </span>
                            </div>
                        </div>

                        {/* Arrow Indicator */}
                        <div style={{ color: 'var(--text-dim)' }}>
                            <ArrowDown size={16} />
                        </div>

                        {/* Target Card */}
                        <div style={{
                            width: '100%',
                            padding: '12px',
                            background: 'var(--bg-canvas)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '6px',
                                background: 'rgba(255,255,255,0.05)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--text-secondary)'
                            }}>
                                <TargetIcon size={18} strokeWidth={1.5} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {targetNode?.data?.label || 'Target'}
                                </span>
                                <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                                    {targetNode?.type || 'Unknown'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Label Input */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Label</label>
                        <input
                            type="text"
                            value={localData.label || ''}
                            onChange={(e) => handleEdgeChange('label', e.target.value)}
                            placeholder="e.g. GET /users"
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

                    {/* Protocol / Type Input */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Connection Type</label>
                        <input
                            type="text"
                            value={localData.protocol || ''}
                            onChange={(e) => handleEdgeChange('protocol', e.target.value)}
                            placeholder="e.g. HTTP, Stream, Dependency..."
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
                    {localData.label || localData.title}
                </h2>
                <button
                    onClick={() => deselectAll()}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
                >
                    <X size={14} />
                </button>
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Node Card */}
                <div style={{
                    width: '100%',
                    padding: '12px',
                    background: 'var(--bg-canvas)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '8px',
                        background: 'rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--accent-primary)'
                    }}>
                        {(() => {
                            const Icon = getNodeIcon(selectedNode);
                            return <Icon size={22} strokeWidth={1.5} />;
                        })()}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {localData.label || 'Untitled'}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {selectedNode.type}
                        </span>
                    </div>
                </div>

                {/* Title Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</label>
                    <input
                        type="text"
                        value={localData.label || ''}
                        onChange={(e) => handleChange('label', e.target.value)}
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

                {/* Description Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '11px', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</label>
                    <textarea
                        value={localData.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Add a brief description..."
                        rows={3}
                        style={{
                            background: 'var(--bg-canvas)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            padding: '8px',
                            color: 'var(--text-primary)',
                            fontSize: '13px',
                            outline: 'none',
                            resize: 'vertical',
                            minHeight: '60px',
                            fontFamily: 'inherit'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
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
