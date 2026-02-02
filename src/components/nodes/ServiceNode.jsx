import React from 'react';
import { ICONS, getIcon } from '../../utils/icons';
import { useCanvas } from '../../context/CanvasContext';

const ServiceNode = ({ id, type, selected, isConnectable }) => {
    // Determine icon and label
    // If it's a custom node, node data might have a specific icon name
    const { nodes } = useCanvas();
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
            backgroundColor: 'var(--bg-node)',
            border: `1px solid ${selected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
            borderRadius: '8px',
            boxShadow: selected ? '0 0 0 2px rgba(99, 102, 241, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            padding: '12px',
            gap: '12px',
            position: 'relative',
            transition: 'all 0.2s ease',
            cursor: 'grab'
        }}>
            {/* Input Handle */}
            <div className="react-flow__handle react-flow__handle-left" style={{
                left: '-6px',
                width: '10px',
                height: '10px',
                backgroundColor: 'var(--text-secondary)',
                borderRadius: '50%',
                border: '2px solid var(--bg-node)'
            }} />

            {/* Icon */}
            <div style={{
                width: '36px',
                height: '36px',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                flexShrink: 0
            }}>
                <IconComponent size={18} />
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {label}
                </div>
                <div style={{
                    fontSize: '10px',
                    color: 'var(--text-secondary)',
                    marginTop: '2px'
                }}>
                    {type.toUpperCase()}
                </div>
            </div>

            {/* Output Handle */}
            <div className="react-flow__handle react-flow__handle-right" style={{
                right: '-6px',
                width: '10px',
                height: '10px',
                backgroundColor: 'var(--text-secondary)',
                borderRadius: '50%',
                border: '2px solid var(--bg-node)'
            }} />
        </div>
    );
};

export default React.memo(ServiceNode);
