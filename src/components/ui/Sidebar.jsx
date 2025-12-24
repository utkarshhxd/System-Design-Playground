import React from 'react';
import { Server, Database, Globe, Layers, HardDrive, LayoutGrid, Cloud, Shield, Box, Zap, Route } from 'lucide-react';

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
                    System Design
                </h1>
            </div>

            <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-dim)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Components
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                    <SidebarItem type="client" icon={<Globe size={16} />} label="Client" />
                    <SidebarItem type="server" icon={<Server size={16} />} label="API Server" />
                    <SidebarItem type="database" icon={<Database size={16} />} label="Database" />
                    <SidebarItem type="loadbalancer" icon={<Layers size={16} />} label="Load Balancer" />
                    <SidebarItem type="cache" icon={<HardDrive size={16} />} label="Cache" />
                    <SidebarItem type="queue" icon={<LayoutGrid size={16} />} label="Message Queue" />

                    {/* New Components */}
                    <SidebarItem type="cdn" icon={<Cloud size={16} />} label="CDN" />
                    <SidebarItem type="firewall" icon={<Shield size={16} />} label="Firewall" />
                    <SidebarItem type="storage" icon={<Box size={16} />} label="Object Storage" />
                    <SidebarItem type="stream" icon={<Zap size={16} />} label="Event Stream" />
                    <SidebarItem type="dns" icon={<Route size={16} />} label="DNS" />
                </div>
            </div>
        </aside>
    );
};

const SidebarItem = ({ icon, label, type }) => {
    const handleDragStart = (e) => {
        e.dataTransfer.setData('application/nodeType', type);
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
