import React, { useRef } from 'react';
import { ICONS, getIcon } from '../../utils/icons';
import { useCanvas } from '../../context/CanvasContext';

const ServiceNode = ({ id, type, selected, isConnectable }) => {
    // Determine icon and label
    // If it's a custom node, node data might have a specific icon name
    const { nodes, startLinking, stopLinking, addEdge, linkingSource, updateNodeDimensions } = useCanvas();
    const node = nodes.find(n => n.id === id);
    const nodeRef = useRef(null);

    // Measure and report dimensions
    React.useLayoutEffect(() => {
        if (nodeRef.current) {
            const { offsetWidth, offsetHeight } = nodeRef.current;
            updateNodeDimensions(id, { width: offsetWidth, height: offsetHeight });
        }
    }, [id, updateNodeDimensions, node?.data?.label, type]); // Dependencies that might change size

    // Helper to format labels
    const formatLabel = (str) => {
        const SPECIAL_CASES = {
            'loadbalancer': 'Load Balancer',
            'taskqueue': 'Task Queue',
            'filestorage': 'File Storage',
            'pubsub': 'Pub/Sub',
            'ratelimiter': 'Rate Limiter',
            'circuitbreaker': 'Circuit Breaker',
            'apigateway': 'API Gateway',
            'datalake': 'Data Lake',
            'cdncache': 'CDN Cache',
            'dns': 'DNS',
            'cdn': 'CDN',
            'waf': 'WAF',
            'cicd': 'CI/CD'
        };

        if (SPECIAL_CASES[str]) return SPECIAL_CASES[str];

        // Default: Capitalize first letter
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    // Default label based on type
    let label = node?.data?.label || formatLabel(type);

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
        <div ref={nodeRef} style={{
            minWidth: '160px',
            width: 'auto',
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
            padding: '14px 18px', // Increased padding
            gap: '16px', // Increased gap between icon and text
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
                color: 'var(--text-secondary)',
                // Subtle colored background behind icon
                background: 'rgba(255,255,255,0.03)',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'none',
                transition: 'all 0.3s ease',
            }}>
                <IconComponent size={20} strokeWidth={1.5} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
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
                    // Handle is at node.x + width, node.y + height/2
                    const currentWidth = nodeRef.current ? nodeRef.current.offsetWidth : 160;
                    const currentHeight = nodeRef.current ? nodeRef.current.offsetHeight : 60;
                    const handleX = node.x + currentWidth;
                    const handleY = node.y + (currentHeight / 2);

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
