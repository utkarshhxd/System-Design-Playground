import React from 'react';
import {
    Server, Database, Globe, Layers, HardDrive, LayoutGrid, Cloud, Shield, Box, Zap, Route,
    Smartphone, ShieldAlert, Cpu, Calculator, Clock, File, Archive, Save, List,
    Radio, Lock, Key, Router, Gauge, Book, TrendingUp, Copy, Shuffle, ToggleRight,
    FileText, BarChart, Activity, Bell, Settings, GitBranch, Container, Ship,
    Search, ListStart, PieChart, Mail, CreditCard, Link as LinkIcon
} from 'lucide-react';

const Sidebar = () => {
    return (
        <aside style={{
            width: '260px',
            backgroundColor: 'var(--bg-panel)',
            borderRight: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 'var(--z-ui)',
        }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
                <h1 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
                    System Design Playground
                </h1>
            </div>

            <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Components
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {Object.entries({
                        'Client': [
                            { type: 'client', label: 'Client (Web / Mobile)', icon: <Globe size={16} /> },
                            { type: 'mobile', label: 'Mobile App', icon: <Smartphone size={16} /> },
                        ],
                        'Networking': [
                            { type: 'dns', label: 'DNS', icon: <Route size={16} /> },
                            { type: 'cdn', label: 'CDN', icon: <Cloud size={16} /> },
                            { type: 'loadbalancer', label: 'Load Balancer', icon: <Layers size={16} /> },
                            { type: 'firewall', label: 'Firewall', icon: <Shield size={16} /> },
                            { type: 'waf', label: 'WAF', icon: <ShieldAlert size={16} /> },
                        ],
                        'Application': [
                            { type: 'server', label: 'API Server', icon: <Server size={16} /> },
                            { type: 'microservice', label: 'Microservices', icon: <Cpu size={16} /> },
                            { type: 'worker', label: 'Background Workers', icon: <Calculator size={16} /> },
                            { type: 'scheduler', label: 'Scheduler', icon: <Clock size={16} /> },
                        ],
                        'Data Storage': [
                            { type: 'database', label: 'Database', icon: <Database size={16} /> },
                            { type: 'storage', label: 'Object Storage', icon: <Box size={16} /> },
                            { type: 'filestorage', label: 'File Storage', icon: <File size={16} /> },
                            { type: 'warehouse', label: 'Data Warehouse', icon: <Archive size={16} /> },
                            { type: 'datalake', label: 'Data Lake', icon: <Layers size={16} /> },
                            { type: 'backup', label: 'Backup Storage', icon: <Save size={16} /> },
                        ],
                        'Caching': [
                            { type: 'cache', label: 'Cache', icon: <HardDrive size={16} /> },
                            { type: 'cdncache', label: 'CDN Cache', icon: <Zap size={16} /> },
                        ],
                        'Async & Messaging': [
                            { type: 'queue', label: 'Message Queue', icon: <LayoutGrid size={16} /> },
                            { type: 'taskqueue', label: 'Task Queue', icon: <List size={16} /> },
                            { type: 'pubsub', label: 'Pub-Sub System', icon: <Radio size={16} /> },
                            { type: 'stream', label: 'Event Stream', icon: <Zap size={16} /> },
                        ],
                        'Security & Access': [
                            { type: 'auth', label: 'Authentication', icon: <Lock size={16} /> },
                            { type: 'authorization', label: 'Authorization', icon: <Key size={16} /> },
                            { type: 'gateway', label: 'API Gateway', icon: <Router size={16} /> },
                            { type: 'ratelimiter', label: 'Rate Limiter', icon: <Gauge size={16} /> },
                            { type: 'secrets', label: 'Secrets Manager', icon: <Key size={16} /> },
                        ],
                        'Reliability & Scaling': [
                            { type: 'registry', label: 'Service Registry', icon: <Book size={16} /> },
                            { type: 'autoscaler', label: 'Auto Scaler', icon: <TrendingUp size={16} /> },
                            { type: 'replica', label: 'Replicas', icon: <Copy size={16} /> },
                            { type: 'failover', label: 'Failover System', icon: <Shuffle size={16} /> },
                            { type: 'circuitbreaker', label: 'Circuit Breaker', icon: <ToggleRight size={16} /> },
                        ],
                        'Observability': [
                            { type: 'logging', label: 'Logging System', icon: <FileText size={16} /> },
                            { type: 'metrics', label: 'Metrics System', icon: <BarChart size={16} /> },
                            { type: 'tracing', label: 'Tracing System', icon: <Activity size={16} /> },
                            { type: 'alerts', label: 'Alert Manager', icon: <Bell size={16} /> },
                        ],
                        'Deployment & Ops': [
                            { type: 'config', label: 'Config Service', icon: <Settings size={16} /> },
                            { type: 'cicd', label: 'CI/CD Pipeline', icon: <GitBranch size={16} /> },
                            { type: 'container', label: 'Container Runtime', icon: <Container size={16} /> },
                            { type: 'orchestrator', label: 'Orchestrator', icon: <Ship size={16} /> },
                        ],
                        'Search & Analytics': [
                            { type: 'search', label: 'Search Engine', icon: <Search size={16} /> },
                            { type: 'indexing', label: 'Indexing Service', icon: <ListStart size={16} /> },
                            { type: 'analytics', label: 'Analytics Engine', icon: <PieChart size={16} /> },
                        ],
                        'External Services': [
                            { type: 'notification', label: 'Notification Service', icon: <Mail size={16} /> },
                            { type: 'payment', label: 'Payment Gateway', icon: <CreditCard size={16} /> },
                            { type: 'external', label: 'Third-Party APIs', icon: <LinkIcon size={16} /> },
                        ],
                    }).map(([category, items]) => (
                        <div key={category}>
                            <div style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                color: 'var(--accent-primary)',
                                marginBottom: '10px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                opacity: 0.9,
                                paddingLeft: '4px'
                            }}>
                                {category}
                            </div>
                            <div style={{ display: 'grid', gap: '4px' }}>
                                {items.map((item) => (
                                    <SidebarItem key={item.type} type={item.type} icon={item.icon} label={item.label} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

const SidebarItem = ({ icon, label, type }) => {
    const handleDragStart = (e) => {
        e.dataTransfer.setData('application/nodeType', type);
        e.dataTransfer.setData('application/nodeLabel', label);
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
                padding: '10px 12px',
                borderRadius: '6px',
                cursor: 'grab',
                backgroundColor: 'var(--bg-node)',
                border: '1px solid transparent',
                transition: 'all 0.2s ease',
                color: 'var(--text-secondary)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-canvas)';
                e.currentTarget.style.borderColor = 'var(--border-active)';
                e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-node)';
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-secondary)';
            }}
        >
            {icon}
            <span style={{ fontSize: '13px' }}>{label}</span>
            <div style={{ marginLeft: 'auto', opacity: 0.3, fontSize: '10px' }}>::</div>
        </div>
    );
};

export default Sidebar;
