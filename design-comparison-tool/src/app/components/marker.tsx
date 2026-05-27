import type { Discrepancy } from "./design-comparison";

interface MarkerProps {
  index: number;
  x: number;
  y: number;
  severity: Discrepancy['severity'];
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function Marker({ index, x, y, severity, isHovered, onMouseEnter, onMouseLeave }: MarkerProps) {
  const getSeverityColor = () => {
    switch (severity) {
      case 'high':
        return {
          bg: 'rgba(181, 9, 9, 1.00)', // --destructive
          shadow: 'rgba(181, 9, 9, 0.2)'
        };
      case 'medium':
        return {
          bg: 'rgba(189, 87, 39, 1.00)', // --chart-4 (orange)
          shadow: 'rgba(189, 87, 39, 0.2)'
        };
      case 'low':
        return {
          bg: 'rgba(117, 117, 117, 1.00)', // --muted-foreground
          shadow: 'rgba(117, 117, 117, 0.2)'
        };
    }
  };

  const colors = getSeverityColor();

  return (
    <div
      className={`absolute border-2 border-white rounded-full flex items-center justify-center cursor-pointer transition-all shadow-lg ${
        isHovered ? 'w-8 h-8 z-50 animate-pulse' : 'w-7 h-7 hover:scale-110'
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
        backgroundColor: colors.bg,
        boxShadow: isHovered
          ? `0 0 0 4px ${colors.shadow}, 0 4px 8px rgba(0, 0, 0, 0.3)`
          : 'var(--elevation-sm)'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span
        className="text-white select-none"
        style={{
          fontSize: isHovered ? '14px' : '13px',
          fontWeight: 'var(--font-weight-medium)',
          transition: 'font-size 0.2s'
        }}
      >
        {index}
      </span>
    </div>
  );
}
