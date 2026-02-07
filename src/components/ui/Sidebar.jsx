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
    const [customType, setCustomType] = React.useState('');
    const [isManualType, setIsManualType] = React.useState(false);
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

        const typeId = customType.trim() || customName.toLowerCase().replace(/\s+/g, '_');

        // Check for duplicates
        if (customComponents.some(c => c.type === typeId) ||
            Object.values(CATEGORIES).flat().some(c => c.type === typeId)) {
            alert('A component with this type ID already exists. Please choose a unique type.');
            return;
        }

        const newComponent = {
            type: typeId,
            label: customName,
            icon: selectedIconName || 'Hexagon', // Store string name
        };

        const updated = [...customComponents, newComponent];
        setCustomComponents(updated);
        localStorage.setItem('custom_components', JSON.stringify(updated));

        // Reset form
        setCustomName('');
        setCustomType('');
        setIsManualType(false);
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
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{
                            fontSize: '18px',
                            fontWeight: 800,
                            letterSpacing: '-0.02em',
                            color: '#3b82f6',
                        }}>
                            System Design
                        </span>
                        <span style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#ffffff',
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            marginTop: '2px',
                            opacity: 0.9
                        }}>
                            Playground
                        </span>
                    </div>
                </div>



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

                <button
                    onClick={() => setShowCustomForm(!showCustomForm)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginTop: '12px',
                        backgroundColor: showCustomForm ? 'var(--bg-canvas)' : 'var(--accent-primary)',
                        color: showCustomForm ? 'var(--text-primary)' : '#fff',
                        border: showCustomForm ? '1px solid var(--border-subtle)' : 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                        boxShadow: showCustomForm ? 'none' : '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                    onMouseEnter={(e) => {
                        if (!showCustomForm) e.currentTarget.style.opacity = '0.9';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                    }}
                >
                    <ICONS.Plus size={16} />
                    {showCustomForm ? 'Cancel Creation' : 'Create Component'}
                </button>

                {/* Custom Component Form */}
                <div style={{
                    maxHeight: showCustomForm ? '500px' : '0',
                    opacity: showCustomForm ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    marginTop: showCustomForm ? '12px' : '0'
                }}>
                    <div style={{
                        padding: '12px',
                        backgroundColor: 'var(--bg-canvas)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex', flexDirection: 'column', gap: '10px'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</label>
                            <input
                                type="text"
                                placeholder="My Custom Component"
                                value={customName}
                                onChange={(e) => {
                                    setCustomName(e.target.value);
                                    if (!isManualType) {
                                        setCustomType(e.target.value.toLowerCase().replace(/\s+/g, '_'));
                                    }
                                }}
                                style={{
                                    width: '100%', padding: '8px', fontSize: '13px',
                                    borderRadius: '6px', border: '1px solid var(--border-subtle)',
                                    backgroundColor: 'var(--bg-panel)', color: 'var(--text-primary)',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Type ID (Internal)</label>
                            <input
                                type="text"
                                placeholder="my_component_id"
                                value={customType}
                                onChange={(e) => {
                                    setCustomType(e.target.value);
                                    setIsManualType(true);
                                }}
                                style={{
                                    width: '100%', padding: '8px', fontSize: '13px',
                                    borderRadius: '6px', border: '1px solid var(--border-subtle)',
                                    backgroundColor: 'var(--bg-panel)', color: 'var(--text-primary)',
                                    outline: 'none',
                                    fontFamily: 'monospace'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>Icon</label>
                            <div className="custom-scrollbar" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))',
                                gap: '8px',
                                maxHeight: '180px',
                                overflowY: 'auto',
                                padding: '8px',
                                backgroundColor: 'var(--bg-panel)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '6px'
                            }}>
                                {ICON_NAMES.map(name => {
                                    const Icon = getIcon(name);
                                    const isSelected = selectedIconName === name;
                                    return (
                                        <button
                                            key={name}
                                            onClick={() => setSelectedIconName(name)}
                                            title={name}
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-canvas)',
                                                color: isSelected ? '#fff' : 'var(--text-secondary)',
                                                border: isSelected ? 'none' : '1px solid var(--border-subtle)',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                transition: 'all 0.1s ease',
                                                outline: 'none'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isSelected) {
                                                    e.currentTarget.style.borderColor = 'var(--text-secondary)';
                                                    e.currentTarget.style.color = 'var(--text-primary)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isSelected) {
                                                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                                }
                                            }}
                                        >
                                            <Icon size={18} strokeWidth={1.5} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                            <button
                                onClick={handleAddCustomComponent}
                                style={{
                                    width: '100%',
                                    padding: '8px', fontSize: '12px', fontWeight: 600,
                                    borderRadius: '6px', border: 'none',
                                    backgroundColor: 'var(--accent-primary)', color: '#fff',
                                    cursor: 'pointer',
                                    opacity: customName.trim() ? 1 : 0.5,
                                    pointerEvents: customName.trim() ? 'auto' : 'none'
                                }}
                            >
                                Save Component
                            </button>
                        </div>
                    </div>
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
                                    fontSize: '11px',
                                    color: 'var(--text-primary)',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontWeight: 600,
                                    minWidth: '20px',
                                    textAlign: 'center'
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
