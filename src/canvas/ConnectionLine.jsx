import React from 'react';

const ConnectionLine = ({ sourceX, sourceY, targetX, targetY, sourceDirection, targetDirection, isSelected, onSelect }) => {
    // Determine Control Points based on Direction
    const deltaX = Math.abs(targetX - sourceX);
    const deltaY = Math.abs(targetY - sourceY);
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Dynamic offset based on distance (min 40, max 150)
    const offset = Math.max(dist * 0.4, 40);

    let cp1X, cp1Y, cp2X, cp2Y;

    // Source Control Point
    switch (sourceDirection) {
        case 'top': cp1X = sourceX; cp1Y = sourceY - offset; break;
        case 'bottom': cp1X = sourceX; cp1Y = sourceY + offset; break;
        case 'left': cp1X = sourceX - offset; cp1Y = sourceY; break;
        case 'right': cp1X = sourceX + offset; cp1Y = sourceY; break;
        default: cp1X = sourceX + offset; cp1Y = sourceY; // Default right
    }

    // Target Control Point
    switch (targetDirection) {
        case 'top': cp2X = targetX; cp2Y = targetY - offset; break;
        case 'bottom': cp2X = targetX; cp2Y = targetY + offset; break;
        case 'left': cp2X = targetX - offset; cp2Y = targetY; break;
        case 'right': cp2X = targetX + offset; cp2Y = targetY; break;
        default: cp2X = targetX - offset; cp2Y = targetY; // Default left
    }

    const path = `M ${sourceX} ${sourceY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${targetX} ${targetY}`;

    const handlePointerDown = (e) => {
        if (onSelect) {
            e.stopPropagation(); // Prevent canvas panning/deselection
            onSelect();
        }
    };

    return (
        <g>
            {/* Invisible wide path for easier selection */}
            <path
                d={path}
                fill="none"
                stroke="transparent"
                strokeWidth={15}
                style={{ cursor: 'pointer', pointerEvents: 'all' }}
                onPointerDown={handlePointerDown}
            />
            {/* Visible Path */}
            <path
                d={path}
                fill="none"
                stroke={isSelected ? 'var(--accent-primary)' : 'var(--border-active)'}
                strokeWidth={isSelected ? 2 : 1.5}
                style={{
                    transition: 'stroke 0.2s, stroke-width 0.2s',
                    opacity: isSelected ? 1 : 0.8,
                    pointerEvents: 'none',
                    filter: isSelected ? 'drop-shadow(0 0 3px var(--accent-glow))' : 'none'
                }}
                markerEnd={isSelected ? "url(#arrowhead-active)" : "url(#arrowhead)"}
            />
        </g>
    );
};

export default ConnectionLine;
