import { useState } from "react";
import { AlertCircle, AlertTriangle, Info, ThumbsDown } from "lucide-react";
import type { Discrepancy } from "./design-comparison";
import { Button } from "./ui/button";

interface DiscrepancyListProps {
  discrepancies: Discrepancy[];
  hoveredDiscrepancy?: string | null;
  onDiscrepancyHover?: (id: string | null) => void;
  onIgnoreMarker?: (id: string) => void;
}

export function DiscrepancyList({ discrepancies, hoveredDiscrepancy, onDiscrepancyHover, onIgnoreMarker }: DiscrepancyListProps) {
  const [activeSubcategoryByCategory, setActiveSubcategoryByCategory] = useState<
    Record<string, Discrepancy['type'] | 'all'>
  >({});

  const highCount = discrepancies.filter(d => d.severity === 'high').length;
  const mediumCount = discrepancies.filter(d => d.severity === 'medium').length;
  const lowCount = discrepancies.filter(d => d.severity === 'low').length;

  const getSeverityIcon = (severity: Discrepancy['severity']) => {
    switch (severity) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4" style={{ color: 'rgba(189, 87, 39, 1.00)' }} />;
      case 'low':
        return <Info className="w-4 h-4 text-muted-foreground" />;
    }
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

  const getTypeColor = (type: Discrepancy['type']) => {
    const colors = {
      missing: 'rgba(181, 9, 9, 1.00)', // --destructive (red for missing)
      content: 'rgba(181, 9, 9, 1.00)', // --destructive (red for content issues)
      formatting: 'rgba(142, 112, 79, 1.00)', // --chart-5 (brown for formatting)
      color: 'rgba(63, 87, 166, 1.00)', // --chart-1
      spacing: 'rgba(77, 128, 85, 1.00)', // --chart-3
      typography: 'rgba(189, 87, 39, 1.00)', // --chart-4
      size: 'rgba(142, 112, 79, 1.00)', // --chart-5
      border: 'rgba(23, 46, 81, 1.00)', // --chart-2
      alignment: 'rgba(86, 92, 101, 1.00)', // --accent
      padding: 'rgba(77, 128, 85, 1.00)', // --chart-3 (green for spacing)
      margin: 'rgba(142, 112, 79, 1.00)', // --chart-5 (brown for margin)
      'line-height': 'rgba(189, 87, 39, 1.00)', // --chart-4 (orange for typography-related)
      'space-after': 'rgba(77, 128, 85, 1.00)' // --chart-3 (green for spacing)
    };
    return colors[type];
  };

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

  const getCategory = (type: Discrepancy['type']) => {
    const categories = {
      missing: 'Content',
      content: 'Content',
      formatting: 'Content',
      color: 'Visual',
      typography: 'Visual',
      size: 'Layout',
      border: 'Visual',
      alignment: 'Layout',
      spacing: 'Spacing',
      padding: 'Spacing',
      margin: 'Spacing',
      'line-height': 'Spacing',
      'space-after': 'Spacing'
    };
    return categories[type];
  };

  const getSubcategoryDetail = (type: Discrepancy['type']) => {
    const details: Record<Discrepancy['type'], string> = {
      missing: 'Likely missing UI elements or blocks expected from design.',
      content: 'Text or values differ from design copy and expected data.',
      formatting: 'Formatting patterns or presentation conventions differ.',
      color: 'Color channels or tone differ from design tokens.',
      spacing: 'General spacing rhythm differs from intended layout.',
      typography: 'Font style, weight, or text presentation differences.',
      size: 'Component or element dimensions differ from design.',
      border: 'Border visibility, weight, radius, or style differs.',
      alignment: 'Elements appear offset from expected alignment.',
      padding: 'Internal spacing inside components differs.',
      margin: 'External spacing between components differs.',
      'line-height': 'Text line spacing differs from specification.',
      'space-after': 'Vertical spacing after elements differs.',
    };

    return details[type];
  };

  const getReportingBucketMeta = (bucket?: Discrepancy['reportingBucket']) => {
    const normalizedBucket = bucket || 'major_visual_issues';
    const meta: Record<NonNullable<Discrepancy['reportingBucket']>, { label: string; detail: string }> = {
      missing_text_elements: {
        label: 'Text and Content Gaps',
        detail: 'Likely missing words, labels, or inline content regions.',
      },
      large_spacing_discrepancies: {
        label: 'Layout and Spacing Shifts',
        detail: 'Spacing rhythm, alignment gaps, or structural whitespace differences.',
      },
      color_issues: {
        label: 'Color and Tone Mismatches',
        detail: 'Visual tone differs due to channel-level color deltas.',
      },
      major_visual_issues: {
        label: 'Major Visual Changes',
        detail: 'Large regions differ and may indicate missing or altered components.',
      },
    };

    return meta[normalizedBucket];
  };

  // Group by category
  const groupedDiscrepancies = discrepancies.reduce((acc, disc, index) => {
    const category = getCategory(disc.type);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push({ ...disc, displayIndex: index + 1 });
    return acc;
  }, {} as Record<string, Array<Discrepancy & { displayIndex: number }>>);

  const categoryOrder = ['Content', 'Visual', 'Layout', 'Spacing'];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-3">Discrepancies Found</h3>
        
        {/* Summary */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-destructive/10 border border-destructive/30 px-3 py-2 text-center" style={{ borderRadius: 'var(--radius)' }}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-3 h-3 border border-white rounded-full" style={{ backgroundColor: 'rgba(181, 9, 9, 1.00)' }}></div>
              <div className="text-destructive" style={{ fontSize: 'var(--text-h3)' }}>{highCount}</div>
            </div>
            <div style={{ fontSize: 'var(--text-label)' }} className="text-destructive">High</div>
          </div>
          <div className="bg-muted/30 border border-border px-3 py-2 text-center" style={{ borderRadius: 'var(--radius)' }}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-3 h-3 border border-white rounded-full" style={{ backgroundColor: 'rgba(189, 87, 39, 1.00)' }}></div>
              <div style={{ fontSize: 'var(--text-h3)', color: 'rgba(189, 87, 39, 1.00)' }}>{mediumCount}</div>
            </div>
            <div style={{ fontSize: 'var(--text-label)', color: 'rgba(189, 87, 39, 1.00)' }}>Medium</div>
          </div>
          <div className="bg-muted/20 border border-border px-3 py-2 text-center" style={{ borderRadius: 'var(--radius)' }}>
            <div className="flex items-center justify-center gap-1 mb-1">
              <div className="w-3 h-3 border border-white rounded-full" style={{ backgroundColor: 'rgba(117, 117, 117, 1.00)' }}></div>
              <div className="text-muted-foreground" style={{ fontSize: 'var(--text-h3)' }}>{lowCount}</div>
            </div>
            <div style={{ fontSize: 'var(--text-label)' }} className="text-muted-foreground">Low</div>
          </div>
        </div>

        {/* List grouped by category */}
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {categoryOrder.map(category => {
            const items = groupedDiscrepancies[category];
            if (!items || items.length === 0) return null;

            const subcategoryCounts = items.reduce((acc, item) => {
              acc[item.type] = (acc[item.type] || 0) + 1;
              return acc;
            }, {} as Record<Discrepancy['type'], number>);

            const subcategories = Object.entries(subcategoryCounts)
              .sort((a, b) => b[1] - a[1]) as Array<[Discrepancy['type'], number]>;

            const activeSubcategory = activeSubcategoryByCategory[category] || 'all';
            const visibleItems = activeSubcategory === 'all'
              ? items
              : items.filter(item => item.type === activeSubcategory);

            const selectedSubcategoryCount = activeSubcategory === 'all'
              ? items.length
              : subcategoryCounts[activeSubcategory] || 0;

            return (
              <div key={category}>
                <div className="sticky top-0 bg-card z-10 pb-2 mb-2 border-b border-border">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-muted-foreground">{category}</h4>
                    <span className="text-xs text-muted-foreground">{selectedSubcategoryCount} shown</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      className={`px-2 py-0.5 text-xs border transition-colors ${
                        activeSubcategory === 'all'
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted/20 text-muted-foreground border-border hover:bg-muted/40'
                      }`}
                      style={{ borderRadius: 'var(--radius-tag)' }}
                      onClick={() => {
                        setActiveSubcategoryByCategory(prev => ({
                          ...prev,
                          [category]: 'all',
                        }));
                      }}
                    >
                      All ({items.length})
                    </button>
                    {subcategories.map(([type, count]) => (
                      <button
                        key={`${category}-${type}`}
                        type="button"
                        className={`px-2 py-0.5 text-xs border transition-colors ${
                          activeSubcategory === type
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted/20 text-muted-foreground border-border hover:bg-muted/40'
                        }`}
                        style={{ borderRadius: 'var(--radius-tag)' }}
                        onClick={() => {
                          setActiveSubcategoryByCategory(prev => ({
                            ...prev,
                            [category]: type,
                          }));
                        }}
                        title={getSubcategoryDetail(type)}
                      >
                        {getTypeLabel(type)} ({count})
                      </button>
                    ))}
                  </div>
                  {activeSubcategory !== 'all' && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {getSubcategoryDetail(activeSubcategory)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  {visibleItems.map((disc) => (
                    <div
                      key={disc.id}
                      className={`relative bg-card border p-3 transition-all cursor-pointer ${
                        hoveredDiscrepancy === disc.id
                          ? 'border-primary bg-primary/5 shadow-md scale-105'
                          : 'border-border hover:bg-muted/10'
                      }`}
                      style={{ borderRadius: 'var(--radius)' }}
                      onMouseEnter={() => onDiscrepancyHover?.(disc.id)}
                      onMouseLeave={() => onDiscrepancyHover?.(null)}
                      title={`Click to locate on canvas - Position: (${disc.location.x}, ${disc.location.y})`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div
                          className={`border border-white rounded-full flex items-center justify-center flex-shrink-0 shadow transition-all ${
                            hoveredDiscrepancy === disc.id ? 'w-7 h-7' : 'w-6 h-6'
                          }`}
                          style={{
                            backgroundColor: getSeverityColor(disc.severity)
                          }}
                        >
                          <span className="text-white" style={{ fontSize: '11px', fontWeight: 'var(--font-weight-medium)' }}>
                            {disc.displayIndex}
                          </span>
                        </div>
                        {getSeverityIcon(disc.severity)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className="px-2 py-0.5 text-white inline-block"
                              style={{
                                fontSize: 'var(--text-label)',
                                backgroundColor: getTypeColor(disc.type),
                                borderRadius: 'var(--radius-tag)'
                              }}
                            >
                              {getTypeLabel(disc.type)}
                            </span>
                            <span
                              className="px-2 py-0.5 bg-muted text-muted-foreground"
                              style={{
                                fontSize: '11px',
                                borderRadius: 'var(--radius-tag)'
                              }}
                            >
                              {disc.source || 'unknown'}
                            </span>
                            {typeof disc.detectionDetails?.confidence === 'number' && (
                              <span
                                className="px-2 py-0.5"
                                style={{
                                  fontSize: '11px',
                                  borderRadius: 'var(--radius-tag)',
                                  backgroundColor: 'rgba(77, 128, 85, 0.12)',
                                  color: 'rgba(77, 128, 85, 1.00)'
                                }}
                              >
                                {(disc.detectionDetails.confidence * 100).toFixed(0)}%
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: 'var(--text-label)' }}>
                            {disc.description}
                          </p>
                          <div className="mt-2 space-y-1">
                            <div className="inline-flex items-center px-2 py-0.5 bg-muted text-muted-foreground" style={{ fontSize: '11px', borderRadius: 'var(--radius-tag)' }}>
                              {getReportingBucketMeta(disc.reportingBucket).label}
                            </div>
                            <p className="text-muted-foreground" style={{ fontSize: '11px' }}>
                              {disc.reportingReason || getReportingBucketMeta(disc.reportingBucket).detail}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onIgnoreMarker?.(disc.id);
                          }}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 flex-shrink-0"
                          title="Mark as inaccurate"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </Button>
                      </div>

                      {(disc.figmaValue || disc.productionValue) && (
                        <div className="ml-14 mt-2 pt-2 border-t border-border space-y-1">
                          {disc.figmaValue && (
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Figma:</span>
                              <span className="font-mono" style={{ fontFamily: 'monospace' }}>{disc.figmaValue}</span>
                            </div>
                          )}
                          {disc.productionValue && (
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Production:</span>
                              <span className="font-mono" style={{ fontFamily: 'monospace' }}>{disc.productionValue}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Type Breakdown */}
      <div className="bg-muted/10 border border-border p-3" style={{ borderRadius: 'var(--radius)' }}>
        <h4 className="mb-3">Issues by Type</h4>
        <div className="space-y-2">
          {Array.from(new Set(discrepancies.map(d => d.type))).map(type => {
            const count = discrepancies.filter(d => d.type === type).length;
            const percentage = Math.round((count / discrepancies.length) * 100);
            return (
              <div key={type} className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span style={{ fontSize: 'var(--text-label)' }}>
                      {getTypeLabel(type)}
                    </span>
                    <span className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                      {count}
                    </span>
                  </div>
                  <div className="w-full bg-muted h-1.5" style={{ borderRadius: 'var(--radius)' }}>
                    <div
                      className="h-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getTypeColor(type),
                        borderRadius: 'var(--radius)'
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={() => {
          const avgConfidence = discrepancies.length
            ? discrepancies.reduce((sum, d) => sum + (d.detectionDetails?.confidence || 0), 0) / discrepancies.length
            : 0;

          const report = {
            timestamp: new Date().toISOString(),
            summary: {
              total: discrepancies.length,
              high: highCount,
              medium: mediumCount,
              low: lowCount,
              averageConfidence: Number(avgConfidence.toFixed(3)),
              autoDetected: discrepancies.filter(d => (d.source || 'unknown') === 'auto').length,
              manual: discrepancies.filter(d => d.source === 'manual').length,
              imported: discrepancies.filter(d => d.source === 'import').length,
              byReportingBucket: discrepancies.reduce((acc, disc) => {
                const bucket = disc.reportingBucket || 'major_visual_issues';
                acc[bucket] = (acc[bucket] || 0) + 1;
                return acc;
              }, {} as Record<string, number>),
              byReportingCategory: discrepancies.reduce((acc, disc) => {
                const bucket = disc.reportingBucket || 'major_visual_issues';
                const meta = getReportingBucketMeta(bucket);
                if (!acc[bucket]) {
                  acc[bucket] = {
                    label: meta.label,
                    detail: meta.detail,
                    count: 0,
                  };
                }
                acc[bucket].count += 1;
                return acc;
              }, {} as Record<string, { label: string; detail: string; count: number }>),
              byType: Array.from(new Set(discrepancies.map(d => d.type))).reduce((acc, type) => {
                acc[type] = discrepancies.filter(d => d.type === type).length;
                return acc;
              }, {} as Record<string, number>)
            },
            discrepancies: discrepancies.map((d, index) => ({
              number: index + 1,
              id: d.id,
              source: d.source || 'unknown',
              type: d.type,
              category: getCategory(d.type),
              severity: d.severity,
              description: d.description,
              reportingBucket: d.reportingBucket,
              reportingCategoryLabel: getReportingBucketMeta(d.reportingBucket).label,
              reportingReason: d.reportingReason,
              location: d.location,
              area: d.area,
              productionLocation: d.productionLocation,
              productionArea: d.productionArea,
              figmaLocation: d.figmaLocation,
              figmaArea: d.figmaArea,
              figmaValue: d.figmaValue,
              productionValue: d.productionValue,
              confidence: d.detectionDetails?.confidence,
              detectionMetrics: d.detectionDetails,
            }))
          };

          const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `design-comparison-report-${Date.now()}.json`;
          a.click();
          URL.revokeObjectURL(url);
        }}
        className="w-full px-4 py-2 bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
        style={{ borderRadius: 'var(--radius-button)' }}
      >
        Export Report
      </button>
    </div>
  );
}