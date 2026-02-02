import React from 'react';
import { ICONS, ICON_NAMES, getIcon } from '../../utils/icons';

const CATEGORIES = {
    'Client': [
        { type: 'client', label: 'Client (Web / Mobile)', icon: 'Globe' },
        { type: 'mobile', label: 'Mobile App', icon: 'Smartphone' },
    ],
    'Networking': [
        { type: 'dns', label: 'DNS', icon: 'Route' },
        { type: 'cdn', label: 'CDN', icon: 'Cloud' },
        { type: 'loadbalancer', label: 'Load Balancer', icon: 'Layers' },
        { type: 'firewall', label: 'Firewall', icon: 'Shield' },
        { type: 'waf', label: 'WAF', icon: 'ShieldAlert' },
    ],
    'Application': [
        { type: 'server', label: 'API Server', icon: 'Server' },
        { type: 'microservice', label: 'Microservices', icon: 'Cpu' },
        { type: 'worker', label: 'Background Workers', icon: 'Calculator' },
        { type: 'scheduler', label: 'Scheduler', icon: 'Clock' },
    ],
    'Data Storage': [
        { type: 'database', label: 'Database', icon: 'Database' },
        { type: 'storage', label: 'Object Storage', icon: 'Box' },
        { type: 'filestorage', label: 'File Storage', icon: 'File' },
        { type: 'warehouse', label: 'Data Warehouse', icon: 'Archive' },
        { type: 'datalake', label: 'Data Lake', icon: 'Layers' },
        { type: 'backup', label: 'Backup Storage', icon: 'Save' },
    ],
    'Caching': [
        { type: 'cache', label: 'Cache', icon: 'HardDrive' },
        { type: 'cdncache', label: 'CDN Cache', icon: 'Zap' },
    ],
    'Async & Messaging': [
        { type: 'queue', label: 'Message Queue', icon: 'LayoutGrid' },
        { type: 'taskqueue', label: 'Task Queue', icon: 'List' },
        { type: 'pubsub', label: 'Pub-Sub System', icon: 'Radio' },
        { type: 'stream', label: 'Event Stream', icon: 'Zap' },
    ],
    'Security & Access': [
        { type: 'auth', label: 'Authentication', icon: 'Lock' },
        { type: 'authorization', label: 'Authorization', icon: 'Key' },
        { type: 'gateway', label: 'API Gateway', icon: 'Router' },
        { type: 'ratelimiter', label: 'Rate Limiter', icon: 'Gauge' },
        { type: 'secrets', label: 'Secrets Manager', icon: 'Key' },
    ],
    'Reliability & Scaling': [
        { type: 'registry', label: 'Service Registry', icon: 'Book' },
        { type: 'autoscaler', label: 'Auto Scaler', icon: 'TrendingUp' },
        { type: 'replica', label: 'Replicas', icon: 'Copy' },
        { type: 'failover', label: 'Failover System', icon: 'Shuffle' },
        { type: 'circuitbreaker', label: 'Circuit Breaker', icon: 'ToggleRight' },
    ],
    'Observability': [
        { type: 'logging', label: 'Logging System', icon: 'FileText' },
        { type: 'metrics', label: 'Metrics System', icon: 'BarChart' },
        { type: 'tracing', label: 'Tracing System', icon: 'Activity' },
        { type: 'alerts', label: 'Alert Manager', icon: 'Bell' },
    ],
    'Deployment & Ops': [
        { type: 'config', label: 'Config Service', icon: 'Settings' },
        { type: 'cicd', label: 'CI/CD Pipeline', icon: 'GitBranch' },
        { type: 'container', label: 'Container Runtime', icon: 'Container' },
        { type: 'orchestrator', label: 'Orchestrator', icon: 'Ship' },
    ],
    'Search & Analytics': [
        { type: 'search', label: 'Search Engine', icon: 'Search' },
        { type: 'indexing', label: 'Indexing Service', icon: 'ListStart' },
        { type: 'analytics', label: 'Analytics Engine', icon: 'PieChart' },
    ],
    'External Services': [
        { type: 'notification', label: 'Notification Service', icon: 'Mail' },
        { type: 'payment', label: 'Payment Gateway', icon: 'CreditCard' },
        { type: 'external', label: 'Third-Party APIs', icon: 'LinkIcon' },
    ],
};

const Sidebar = () => {
    // Custom Components State
    const [customComponents, setCustomComponents] = React.useState([]);
    const [showCustomForm, setShowCustomForm] = React.useState(false);
    const [customName, setCustomName] = React.useState('');
    const [selectedIconName, setSelectedIconName] = React.useState('Hexagon');

    // Default collapsed
    const [expanded, setExpanded] = React.useState(
        Object.keys(CATEGORIES).reduce((acc, key) => ({ ...acc, [key]: false }), {})
    );
    const [searchQuery, setSearchQuery] = React.useState('');

    const toggleCategory = (category) => {
        setExpanded(prev => ({ ...prev, [category]: !prev[category] }));
    };

    // Load custom components from localStorage on mount
    React.useEffect(() => {
        const saved = localStorage.getItem('custom_components');
        if (saved) {
            try {
                setCustomComponents(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse custom components", e);
            }
        }
    }, []);

    const handleAddCustomComponent = () => {
        if (!customName.trim()) return;

        const newComponent = {
            type: 'custom_' + Date.now(), // Unique type
            label: customName,
            icon: selectedIconName || 'Hexagon', // Store string name
        };

        const updated = [...customComponents, newComponent];
        setCustomComponents(updated);
        localStorage.setItem('custom_components', JSON.stringify(updated));

        // Reset form
        setCustomName('');
        setSelectedIconName('Hexagon');
        setShowCustomForm(false);
        setExpanded(prev => ({ ...prev, 'Custom': true }));
    };

    const handleDeleteCustom = (e, type) => {
        e.stopPropagation();
        const updated = customComponents.filter(c => c.type !== type);
        setCustomComponents(updated);
        localStorage.setItem('custom_components', JSON.stringify(updated));
    };

    const filteredCategories = React.useMemo(() => {
        // Merge default categories with Custom category
        const allCategories = { ...CATEGORIES };
        if (customComponents.length > 0) {
            allCategories['Custom'] = customComponents;
        }

        if (!searchQuery) return allCategories;
        const lowerQuery = searchQuery.toLowerCase();
        const result = {};

        Object.entries(allCategories).forEach(([key, items]) => {
            const matches = items.filter(item =>
                item.label.toLowerCase().includes(lowerQuery) ||
                item.type.toLowerCase().includes(lowerQuery)
            );
            if (matches.length > 0) {
                result[key] = matches;
            }
        });
        return result;
    }, [searchQuery, customComponents]);

    // Auto-expand on search
    const isExpanded = (category) => {
        if (searchQuery) return true;
        return expanded[category];
    };

    return (
        <aside style={{
            width: '280px',
            backgroundColor: 'var(--bg-panel)',
            borderRight: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 'var(--z-ui)',
            height: '100%',
            userSelect: 'none',
        }}>
            {/* Header & Search */}
            <div style={{
                padding: '16px',
                borderBottom: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-panel)',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <div style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <ICONS.Cloud size={16} color="var(--accent-primary)" />
                        System Design
                    </div>
                    <button
                        onClick={() => setShowCustomForm(!showCustomForm)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--accent-primary)',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex', alignItems: 'center'
                        }}
                        title="Add Custom Component"
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-canvas)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        <ICONS.Plus size={16} />
                    </button>
                </div>

                {/* Custom Component Form */}
                {showCustomForm && (
                    <div style={{
                        marginBottom: '12px',
                        padding: '12px',
                        backgroundColor: 'var(--bg-canvas)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex', flexDirection: 'column', gap: '8px'
                    }}>
                        <input
                            type="text"
                            placeholder="Component Name"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            style={{
                                width: '100%', padding: '6px', fontSize: '12px',
                                borderRadius: '4px', border: '1px solid var(--border-subtle)',
                                backgroundColor: 'var(--bg-panel)', color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                        />
                        <select
                            value={selectedIconName}
                            onChange={(e) => setSelectedIconName(e.target.value)}
                            style={{
                                width: '100%', padding: '6px', fontSize: '12px',
                                borderRadius: '4px', border: '1px solid var(--border-subtle)',
                                backgroundColor: 'var(--bg-panel)', color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                        >
                            {ICON_NAMES.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                                onClick={() => setShowCustomForm(false)}
                                style={{
                                    padding: '4px 8px', fontSize: '11px',
                                    borderRadius: '4px', border: '1px solid var(--border-subtle)',
                                    background: 'transparent', color: 'var(--text-secondary)',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddCustomComponent}
                                style={{
                                    padding: '4px 8px', fontSize: '11px',
                                    borderRadius: '4px', border: 'none',
                                    backgroundColor: 'var(--accent-primary)', color: '#fff',
                                    cursor: 'pointer'
                                }}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                )}

                <div style={{ position: 'relative' }}>
                    <ICONS.Search
                        size={14}
                        style={{
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-dim)'
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Search components..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px 10px 8px 32px',
                            fontSize: '13px',
                            backgroundColor: 'var(--bg-canvas)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '6px',
                            color: 'var(--text-primary)',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                    />
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {Object.entries(filteredCategories).map(([category, items]) => (
                        <div key={category} style={{ marginBottom: isExpanded(category) ? '8px' : '0' }}>
                            <div
                                onClick={() => toggleCategory(category)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '8px 8px',
                                    cursor: 'pointer',
                                    borderRadius: '6px',
                                    transition: 'background-color 0.15s ease',
                                    backgroundColor: isExpanded(category) ? 'rgba(255,255,255,0.03)' : 'transparent',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-node)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isExpanded(category) ? 'rgba(255,255,255,0.03)' : 'transparent'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{
                                        transition: 'transform 0.2s ease',
                                        transform: isExpanded(category) ? 'rotate(90deg)' : 'rotate(0deg)',
                                        color: isExpanded(category) ? 'var(--text-primary)' : 'var(--text-dim)',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <ICONS.ChevronRight size={14} />
                                    </div>
                                    <span style={{
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: isExpanded(category) ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        letterSpacing: '0.02em'
                                    }}>
                                        {category.toUpperCase()}
                                    </span>
                                </div>
                                <span style={{
                                    fontSize: '10px',
                                    color: 'var(--text-dim)',
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    padding: '2px 6px',
                                    borderRadius: '10px'
                                }}>
                                    {items.length}
                                </span>
                            </div>

                            {isExpanded(category) && (
                                <div style={{
                                    display: 'grid',
                                    gap: '4px',
                                    marginTop: '4px',
                                    paddingLeft: '12px',
                                    paddingRight: '4px'
                                }}>
                                    {items.map((item) => (
                                        <SidebarItem
                                            key={item.type}
                                            type={item.type}
                                            iconName={item.icon}
                                            label={item.label}
                                            onDelete={category === 'Custom' ? (e) => handleDeleteCustom(e, item.type) : undefined}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {Object.keys(filteredCategories).length === 0 && (
                        <div style={{
                            padding: '20px',
                            textAlign: 'center',
                            color: 'var(--text-dim)',
                            fontSize: '13px'
                        }}>
                            No components found.
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

const SidebarItem = ({ iconName, label, type, onDelete }) => {
    const Icon = getIcon(iconName);

    const handleDragStart = (e) => {
        e.dataTransfer.setData('application/nodeType', type);
        e.dataTransfer.setData('application/nodeLabel', label);
        if (iconName) {
            e.dataTransfer.setData('application/iconName', iconName);
        }
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '6px',
                cursor: 'grab',
                backgroundColor: 'transparent',
                border: '1px solid transparent',
                transition: 'all 0.15s ease',
                color: 'var(--text-secondary)',
                position: 'relative',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-node)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.transform = 'translateX(2px)';
                // Show delete button
                const delBtn = e.currentTarget.querySelector('.delete-btn');
                if (delBtn) delBtn.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.transform = 'translateX(0)';
                // Hide delete button
                const delBtn = e.currentTarget.querySelector('.delete-btn');
                if (delBtn) delBtn.style.opacity = '0';
            }}
        >
            <div style={{ color: 'var(--accent-primary)', opacity: 0.8, width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} />
            </div>
            <span style={{ fontSize: '13px', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>

            {onDelete && (
                <button
                    className="delete-btn"
                    onClick={onDelete}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-dim)',
                        cursor: 'pointer',
                        padding: '2px',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        display: 'flex', alignItems: 'center',
                        zIndex: 10
                    }}
                    title="Delete Component"
                    onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-dim)'}
                >
                    <ICONS.Trash2 size={12} />
                </button>
            )}
        </div>
    );
};

export default Sidebar;
