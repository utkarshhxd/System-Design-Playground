import React from 'react';
import { ICONS, getIcon } from '../../utils/icons';
import { useCanvas } from '../../context/CanvasContext';

const ServiceNode = ({ id, type, selected, isConnectable }) => {
    // Determine icon and label
    // If it's a custom node, node data might have a specific icon name
    const { nodes, startLinking, stopLinking, addEdge, linkingSource } = useCanvas();
    const node = nodes.find(n => n.id === id);

    // Default label based on type
    let label = node?.data?.label || type.charAt(0).toUpperCase() + type.slice(1);

    // Icon resolution
    // 1. Check if node data has an explicit iconName (for custom components)
    // 2. Map type to icon name for standard components

    let IconComponent = ICONS.Server; // Default

    if (node?.data?.iconName) {
        IconComponent = getIcon(node.data.iconName);
    } else {
        // Fallback for standard types: Map type string to Icon Name if possible, or use switch/map
        // For standard types, we can rely on the same mapping we used in Sidebar CATEGORIES, or build a reverse map.
        // Or simpler: The sidebar passes 'nodeType'. 
        // We need a robust way to map 'nodeType' to 'Icon'.

        // Let's create a quick map for standard types based on what was in Sidebar
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

        const iconName = TYPE_TO_ICON[type] || 'Server';
        IconComponent = getIcon(iconName);
    }

    // Node Dimensions
    const width = 160;
    const height = 60;

    return (
        <div style={{
            width: `${width}px`,
            height: `${height}px`,
            background: selected ? 'var(--bg-node-gradient)' : 'var(--bg-node)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid transparent`, // Placeholder for gradient border logic if needed, or keeping it subtle
            borderColor: selected ? 'var(--accent-primary)' : 'var(--border-glass)',
            borderRadius: '12px',
            boxShadow: selected ? 'var(--shadow-glow), inset 0 0 20px var(--accent-glass)' : 'var(--shadow-glass)',
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            gap: '14px',
            position: 'relative',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            cursor: 'grab',
            zIndex: selected ? 20 : 10 // Bring selected to front
        }}>
            {/* Input Handle */}
            <div
                className="react-flow__handle react-flow__handle-left"
                style={{
                    position: 'absolute',
                    left: '-5px',
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'var(--bg-canvas)',
                    borderRadius: '50%',
                    border: '2px solid var(--text-secondary)',
                    cursor: 'crosshair',
                    transition: 'all 0.2s ease',
                    zIndex: 20
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.transform = 'scale(1.2)';
                    e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--text-secondary)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-canvas)';
                }}
                onPointerUp={(e) => {
                    e.stopPropagation();
                    if (linkingSource && linkingSource.nodeId !== id && linkingSource.handleType === 'source') {
                        addEdge({
                            id: crypto.randomUUID(),
                            source: linkingSource.nodeId,
                            target: id,
                        });
                        stopLinking();
                    }
                }}
            />

            {/* Icon */}
            <div style={{
                color: selected ? '#fff' : 'var(--text-secondary)',
                // Subtle colored background behind icon for 'pop'
                background: selected ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'rgba(255,255,255,0.03)',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: selected ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none',
                transition: 'all 0.3s ease',
            }}>
                <IconComponent size={20} strokeWidth={selected ? 2 : 1.5} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    letterSpacing: '0.01em'
                }}>
                    {label}
                </div>
                <div style={{
                    fontSize: '10px',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 500
                }}>
                    {type}
                </div>
            </div>

            {/* Output Handle */}
            <div
                className="react-flow__handle react-flow__handle-right"
                style={{
                    position: 'absolute',
                    right: '-5px',
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'var(--bg-canvas)',
                    borderRadius: '50%',
                    border: '2px solid var(--text-secondary)',
                    cursor: 'crosshair',
                    transition: 'all 0.2s ease',
                    zIndex: 20
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.transform = 'scale(1.2)';
                    e.currentTarget.style.backgroundColor = 'var(--accent-primary)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--text-secondary)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-canvas)';
                }}
                onPointerDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    // Calculate handle position (Right side)
                    // Node is at node.x, node.y.
                    // Handle is at node.x + 160, node.y + 30
                    const handleX = node.x + 160;
                    const handleY = node.y + 30;

                    startLinking({
                        nodeId: id,
                        handleType: 'source',
                        x: handleX,
                        y: handleY
                    });
                }}
            />
        </div>
    );
};

export default React.memo(ServiceNode);
