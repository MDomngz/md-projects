import type { Discrepancy } from "./design-comparison";

interface MarkerTooltipProps {
  discrepancy: Discrepancy;
  index: number;
  position: { x: number; y: number };
}

export function MarkerTooltip({ discrepancy, index, position }: MarkerTooltipProps) {
  const confidence = discrepancy.detectionDetails?.confidence;
  const source = discrepancy.source || 'unknown';
  const areaWidth = discrepancy.area?.width;
  const areaHeight = discrepancy.area?.height;

  const getSeverityColor = (severity: Discrepancy['severity']) => {
    switch (severity) {
      case 'high':
        return 'rgba(181, 9, 9, 1.00)'; // --destructive
      case 'medium':
        return 'rgba(189, 87, 39, 1.00)'; // --chart-4 (orange)
      case 'low':
        return 'rgba(117, 117, 117, 1.00)'; // --muted-foreground
    }
  };

  const getSeverityBadgeColor = (severity: Discrepancy['severity']) => {
    return getSeverityColor(severity);
  };

  const getTypeLabel = (type: Discrepancy['type']) => {
    const labels = {
      missing: 'Missing',
      content: 'Content',
      formatting: 'Formatting',
      color: 'Color',
      spacing: 'Spacing',
      typography: 'Typography',
      size: 'Size',
      border: 'Border',
      alignment: 'Alignment',
      padding: 'Padding',
      margin: 'Margin',
      'line-height': 'Line Height',
      'space-after': 'Space After'
    };
    return labels[type];
  };

  return (
    <div
      className="absolute z-50 pointer-events-none animate-in fade-in duration-200"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(12px, -50%)'
      }}
    >
      <div
        className="bg-popover border border-border shadow-lg max-w-xs"
        style={{
          borderRadius: 'var(--radius-card)',
          boxShadow: 'var(--elevation-sm)'
        }}
      >
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div
              className="w-5 h-5 border border-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{
                backgroundColor: getSeverityBadgeColor(discrepancy.severity)
              }}
            >
              <span className="text-white" style={{ fontSize: '11px', fontWeight: 'var(--font-weight-medium)' }}>
                {index}
              </span>
            </div>
            <span
              className="px-2 py-0.5 text-white inline-block"
              style={{
                fontSize: 'var(--text-label)',
                backgroundColor: getSeverityColor(discrepancy.severity),
                borderRadius: 'var(--radius-tag)'
              }}
            >
              {discrepancy.severity.toUpperCase()}
            </span>
            <span
              className="px-2 py-0.5 text-white inline-block"
              style={{
                fontSize: 'var(--text-label)',
                backgroundColor: 'rgba(77, 128, 85, 1.00)',
                borderRadius: 'var(--radius-tag)'
              }}
            >
              {getTypeLabel(discrepancy.type)}
            </span>
          </div>

          <p className="text-popover-foreground" style={{ fontSize: 'var(--text-label)' }}>
            {discrepancy.description}
          </p>

          <div className="pt-2 border-t border-border space-y-1">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground text-xs">Source:</span>
              <span className="text-xs" style={{ fontFamily: 'monospace', fontWeight: 'var(--font-weight-medium)' }}>{source}</span>
            </div>
            {typeof confidence === 'number' && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground text-xs">Confidence:</span>
                <span className="text-xs" style={{ fontFamily: 'monospace', fontWeight: 'var(--font-weight-medium)' }}>
                  {(confidence * 100).toFixed(1)}%
                </span>
              </div>
            )}
            {typeof areaWidth === 'number' && typeof areaHeight === 'number' && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground text-xs">Marker Size:</span>
                <span className="text-xs" style={{ fontFamily: 'monospace', fontWeight: 'var(--font-weight-medium)' }}>
                  {Math.round(areaWidth)} x {Math.round(areaHeight)}
                </span>
              </div>
            )}
          </div>

          {(discrepancy.figmaValue || discrepancy.productionValue) && (
            <div className="pt-2 border-t border-border space-y-1">
              {discrepancy.figmaValue && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground text-xs">Figma:</span>
                  <span className="text-xs" style={{ fontFamily: 'monospace', fontWeight: 'var(--font-weight-medium)' }}>{discrepancy.figmaValue}</span>
                </div>
              )}
              {discrepancy.productionValue && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground text-xs">Production:</span>
                  <span className="text-xs" style={{ fontFamily: 'monospace', fontWeight: 'var(--font-weight-medium)' }}>{discrepancy.productionValue}</span>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <svg className="w-3 h-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-muted-foreground text-xs">
                Position: ({discrepancy.location.x}, {discrepancy.location.y})
              </span>
            </div>
          </div>
        </div>

        {/* Tooltip arrow */}
        <div
          className="absolute w-2 h-2 bg-popover border-l border-b border-border transform rotate-45"
          style={{
            left: '-5px',
            top: '50%',
            marginTop: '-4px'
          }}
        />
      </div>
    </div>
  );
}
