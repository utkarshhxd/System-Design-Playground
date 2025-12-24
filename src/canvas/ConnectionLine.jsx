import React from 'react';

const ConnectionLine = ({ sourceX, sourceY, targetX, targetY, isSelected }) => {
    const deltaX = Math.abs(targetX - sourceX);
    const controlOffset = Math.max(deltaX * 0.5, 40);

    const path = `M ${sourceX} ${sourceY} C ${sourceX + controlOffset} ${sourceY}, ${targetX - controlOffset} ${targetY}, ${targetX} ${targetY}`;

    return (
        <g>
            {/* Invisible wide path for easier selection */}
            <path
                d={path}
                fill="none"
                stroke="transparent"
                strokeWidth={15}
                style={{ cursor: 'pointer' }}
            />
            {/* Visible Path */}
            <path
                d={path}
                fill="none"
                stroke={isSelected ? 'var(--accent-primary)' : 'var(--text-dim)'}
                strokeWidth={2}
                style={{
                    transition: 'stroke 0.2s',
                    opacity: 0.6
                }}
                markerEnd="url(#arrowhead)"
            />
        </g>
    );
};

export default ConnectionLine;
