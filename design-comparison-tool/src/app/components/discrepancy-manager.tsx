import { Download, Plus, Trash2 } from "lucide-react";
import type { Discrepancy } from "./design-comparison";
import { Button } from "./ui/button";

interface DiscrepancyManagerProps {
  discrepancies: Discrepancy[];
  onAddManual: () => void;
  onClearAll: () => void;
  hasImages: boolean;
  referenceImageSize?: { width: number; height: number } | null;
}

export function DiscrepancyManager({
  discrepancies,
  onAddManual,
  onClearAll,
  hasImages
}: DiscrepancyManagerProps) {
  const bucketMeta: Record<NonNullable<Discrepancy['reportingBucket']>, { label: string; detail: string }> = {
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

  const handleExport = () => {
    const byType = discrepancies.reduce((acc, disc) => {
      acc[disc.type] = (acc[disc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byReportingBucket = discrepancies.reduce((acc, disc) => {
      const bucket = disc.reportingBucket || 'major_visual_issues';
      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byReportingCategory = (Object.keys(bucketMeta) as Array<NonNullable<Discrepancy['reportingBucket']>>)
      .reduce((acc, bucket) => {
        acc[bucket] = {
          label: bucketMeta[bucket].label,
          detail: bucketMeta[bucket].detail,
          count: byReportingBucket[bucket] || 0,
        };
        return acc;
      }, {} as Record<string, { label: string; detail: string; count: number }>);

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: discrepancies.length,
        high: discrepancies.filter(d => d.severity === 'high').length,
        medium: discrepancies.filter(d => d.severity === 'medium').length,
        low: discrepancies.filter(d => d.severity === 'low').length,
        byType,
        byReportingBucket,
        byReportingCategory,
      },
      discrepancies: discrepancies.map((disc, index) => ({
        number: index + 1,
        id: disc.id,
        source: disc.source || 'unknown',
        type: disc.type,
        severity: disc.severity,
        description: disc.description,
        reportingBucket: disc.reportingBucket,
        reportingReason: disc.reportingReason,
        location: disc.location,
        area: disc.area,
        productionLocation: disc.productionLocation,
        productionArea: disc.productionArea,
        figmaLocation: disc.figmaLocation,
        figmaArea: disc.figmaArea,
        figmaValue: disc.figmaValue,
        productionValue: disc.productionValue,
        ignored: disc.ignored || false,
        confidence: disc.detectionDetails?.confidence,
        detectionMetrics: disc.detectionDetails,
      }))
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `design-comparison-report-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-3">
      <label className="block" style={{ fontWeight: 'var(--font-weight-medium)' }}>
        Discrepancy Markers
      </label>

      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={onAddManual}
          disabled={!hasImages}
          className="px-3 py-2 flex items-center justify-center gap-2"
          title={!hasImages ? 'Upload images first' : 'Click on image to add marker'}
        >
          <Plus className="w-4 h-4" />
          Add Manual
        </Button>
      </div>

      {discrepancies.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleExport}
            variant="secondary"
            className="px-3 py-2 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </Button>

          <Button
            onClick={onClearAll}
            variant="destructive"
            className="px-3 py-2 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </Button>
        </div>
      )}

      {discrepancies.length > 0 && (
        <div className="text-xs text-muted-foreground bg-muted/10 p-2" style={{ borderRadius: 'var(--radius)' }}>
          {discrepancies.length} marker{discrepancies.length !== 1 ? 's' : ''} added
        </div>
      )}

      {discrepancies.length === 0 && hasImages && (
        <div className="text-xs text-muted-foreground bg-accent/10 border border-accent/30 p-3 space-y-1" style={{ borderRadius: 'var(--radius)' }}>
          <p style={{ fontWeight: 'var(--font-weight-medium)' }}>No markers yet</p>
          <p>Click "Add Manual" then click on the image to place a marker, or run Analyze to auto-detect.</p>
        </div>
      )}
    </div>
  );
}