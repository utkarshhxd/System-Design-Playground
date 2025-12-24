import React from 'react';
import { Server, Database, Globe, Layers, HardDrive, LayoutGrid, Cloud, Shield, Box, Zap, Route } from 'lucide-react';
import { useCanvas } from '../../context/CanvasContext';

const icons = {
    client: Globe,
    server: Server,
    database: Database,
    loadbalancer: Layers,
    cache: HardDrive,
    queue: LayoutGrid,
    cdn: Cloud,
    firewall: Shield,
    storage: Box,
    stream: Zap,
    dns: Route,
};

const ServiceNode = ({ id, type, title, subtitle }) => {
    const { linkingSource, startLinking, stopLinking, addEdge, nodes } = useCanvas();
    const Icon = icons[type] || Server;

    const handlePortDown = (e, handleType) => {
        e.stopPropagation();
        e.preventDefault();

        // If already linking and clicked on a compatible handle (Source -> Target)
        if (linkingSource) {
            if (linkingSource.nodeId === id) return; // Self-loop check (optional, prevent for now)
            if (linkingSource.handleType === handleType) return; // Source-Source or Target-Target

            // Allow Source -> Target connection
            if (linkingSource.handleType === 'source' && handleType === 'target') {
                addEdge({
                    id: crypto.randomUUID(),
                    source: linkingSource.nodeId,
                    target: id
                });
                stopLinking();
            }
            return;
        }

        // Start Linking
        if (handleType === 'source') {
            // Calculate World Coords for start point based on Node Position
            const node = nodes.find(n => n.id === id);
            if (node) {
                // Source handle is at right side
                // Width 160px. Handle is roughly at +160 relative to node.x
                // Vertical center is roughly +40 (Node is padding 12 + gap 8 + 32 header... approx 80 height)
                const worldX = node.x + 160;
                const worldY = node.y + 40;

                startLinking({
                    nodeId: id,
                    handleType: 'source',
                    x: worldX,
                    y: worldY
                });
            }
        }
    };

    return (
        <div style={{
            width: '160px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                    width: '32px', height: '32px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-canvas)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent-primary)',
                    border: '1px solid var(--border-subtle)'
                }}>
                    <Icon size={18} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{subtitle || type}</span>
                </div>
            </div>

            {/* Inputs (Target) - Left */}
            <div
                className="port-handle"
                onPointerDown={(e) => handlePortDown(e, 'target')}
                style={{
                    position: 'absolute', left: '-6px', top: '50%', transform: 'translateY(-50%)',
                    width: '12px', height: '12px', borderRadius: '50%',
                    backgroundColor: 'var(--bg-panel)',
                    border: '2px solid var(--text-dim)',
                    cursor: 'crosshair',
                    transition: 'all 0.2s',
                    zIndex: 20
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--text-dim)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
            />

            {/* Outputs (Source) - Right */}
            <div
                className="port-handle"
                onPointerDown={(e) => handlePortDown(e, 'source')}
                style={{
                    position: 'absolute', right: '-6px', top: '50%', transform: 'translateY(-50%)',
                    width: '12px', height: '12px', borderRadius: '50%',
                    backgroundColor: 'var(--bg-panel)',
                    border: '2px solid var(--text-dim)',
                    cursor: 'crosshair',
                    transition: 'all 0.2s',
                    zIndex: 20
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--text-dim)'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
            />
        </div>
    );
};

export default ServiceNode;
