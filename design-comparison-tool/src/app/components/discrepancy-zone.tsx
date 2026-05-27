import type { Discrepancy } from "./design-comparison";

interface DiscrepancyZoneProps {
  severity: Discrepancy['severity'];
  x: number;
  y: number;
  width: number;
  height: number;
  isHovered: boolean;
}

const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
  switch (severity) {
    case 'high':
      return 'rgba(181, 9, 9, 0.25)'; // --destructive with transparency
    case 'medium':
      return 'rgba(189, 87, 39, 0.25)'; // orange with transparency
    case 'low':
      return 'rgba(117, 117, 117, 0.25)'; // gray with transparency
  }
};

const getSeverityBorderColor = (severity: 'high' | 'medium' | 'low') => {
  switch (severity) {
    case 'high':
      return 'rgba(181, 9, 9, 0.6)';
    case 'medium':
      return 'rgba(189, 87, 39, 0.6)';
    case 'low':
      return 'rgba(117, 117, 117, 0.6)';
  }
};

export function DiscrepancyZone({ severity, x, y, width, height, isHovered }: DiscrepancyZoneProps) {
  return (
    <div
      className="absolute pointer-events-none transition-all duration-200"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: getSeverityColor(severity),
        border: `2px solid ${getSeverityBorderColor(severity)}`,
        borderRadius: 'var(--radius)',
        opacity: isHovered ? 1 : 0.7,
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
        zIndex: 10,
      }}
    />
  );
}
