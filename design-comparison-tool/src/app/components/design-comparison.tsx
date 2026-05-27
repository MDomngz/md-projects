import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, AlertCircle, CheckCircle2, Layers, ZoomIn, ZoomOut, RotateCcw, List, Ruler, HelpCircle, ChevronDown, ChevronUp, BarChart3, Crop, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { ComparisonCanvas } from "./comparison-canvas";
import { DiscrepancyList } from "./discrepancy-list";
import { ComparisonMode } from "./comparison-mode";
import { DiscrepancyFilter } from "./discrepancy-filter";
import { SpacingDetails } from "./spacing-details";
import { ReferenceGuide } from "./reference-guide";
import { AnalysisInsights } from "./analysis-insights";
import { FigmaUrlInput } from "./figma-url-input";
import { FigmaApiNotice } from "./figma-api-notice";
import { DiscrepancyManager } from "./discrepancy-manager";
import { DiscrepancyForm } from "./discrepancy-form";
import { Button } from "./ui/button";
import { detectDiscrepanciesFromImages } from "../services/local-discrepancy-detector";

export interface Discrepancy {
  id: string;
  type: 'color' | 'spacing' | 'typography' | 'size' | 'border' | 'alignment' | 'padding' | 'margin' | 'line-height' | 'space-after' | 'formatting' | 'missing' | 'content';
  severity: 'high' | 'medium' | 'low';
  description: string;
  location: {
    x: number;
    y: number;
  };
  figmaLocation?: {
    x: number;
    y: number;
  };
  productionLocation?: {
    x: number;
    y: number;
  };
  cvLocation?: {
    x: number;
    y: number;
  };
  area?: {
    width: number;
    height: number;
  };
  figmaArea?: {
    width: number;
    height: number;
  };
  productionArea?: {
    width: number;
    height: number;
  };
  cvArea?: {
    width: number;
    height: number;
  };
  cvConfidence?: number;
  figmaValue?: string;
  productionValue?: string;
  source?: 'auto' | 'import' | 'manual';
  reportingBucket?: 'missing_text_elements' | 'large_spacing_discrepancies' | 'color_issues' | 'major_visual_issues';
  reportingReason?: string;
  ignored?: boolean;
  detectionDetails?: {
    confidence: number;
    pixelCount: number;
    meanDiff: number;
    compactness: number;
    avgChannelDelta?: {
      r: number;
      g: number;
      b: number;
    };
    filterNotes?: string[];
  };
}

type ReportingBucket = NonNullable<Discrepancy['reportingBucket']>;

const REPORTING_BUCKET_META: Record<ReportingBucket, { label: string; detail: string }> = {
  missing_text_elements: {
    label: 'Text and Content Gaps',
    detail: 'Likely missing words, labels, or inline content regions.',
  },
  large_spacing_discrepancies: {
    label: 'Layout and Spacing Shifts',
    detail: 'Structure, rhythm, or alignment spacing appears off from design.',
  },
  color_issues: {
    label: 'Color and Tone Mismatches',
    detail: 'Detected color-channel differences or unexpected visual tone shifts.',
  },
  major_visual_issues: {
    label: 'Major Visual Changes',
    detail: 'Large blocks differ and may indicate missing or heavily altered components.',
  },
};

interface ProductionCalibration {
  scaleX: number;
  scaleY: number;
  offsetX: number;
  offsetY: number;
}

interface ValidationIssue {
  id: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
}

const DEFAULT_PRODUCTION_CALIBRATION: ProductionCalibration = {
  scaleX: 1,
  scaleY: 1,
  offsetX: 0,
  offsetY: 0,
};

const MUST_HAVE_DISCREPANCY_TYPES: Discrepancy['type'][] = ['missing', 'content', 'color', 'spacing'];

export function DesignComparison() {
  const [figmaImage, setFigmaImage] = useState<string | null>(null);
  const [productionImage, setProductionImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
  const [comparisonMode, setComparisonMode] = useState<'side-by-side' | 'overlay' | 'difference'>('side-by-side');
  const [overlayOpacity, setOverlayOpacity] = useState(50);
  const [zoom, setZoom] = useState(100);
  const [selectedTypes, setSelectedTypes] = useState<Set<Discrepancy['type']>>(
    new Set(MUST_HAVE_DISCREPANCY_TYPES)
  );
  const [confidenceThresholdPreset, setConfidenceThresholdPreset] = useState<0.3 | 0.6 | 1.0>(0.6);
  const [viewMode, setViewMode] = useState<'all' | 'spacing' | 'insights'>('all');
  const [showGuide, setShowGuide] = useState(false);
  const [hoveredDiscrepancy, setHoveredDiscrepancy] = useState<string | null>(null);
  const [analysisDepth, setAnalysisDepth] = useState<'quick' | 'detailed'>('detailed');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedArea, setSelectedArea] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [addMarkerMode, setAddMarkerMode] = useState(false);
  const [pendingMarkerPosition, setPendingMarkerPosition] = useState<{ x: number; y: number } | null>(null);
  const [figmaImageSize, setFigmaImageSize] = useState<{ width: number; height: number } | null>(null);
  const [productionImageSize, setProductionImageSize] = useState<{ width: number; height: number } | null>(null);
  const [productionCalibration, setProductionCalibration] = useState<ProductionCalibration>(DEFAULT_PRODUCTION_CALIBRATION);
  const [calibrationCaptureMode, setCalibrationCaptureMode] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState<1 | 2>(1);
  const [calibrationTargetA, setCalibrationTargetA] = useState<{ x: number; y: number } | null>(null);
  const [calibrationTargetB, setCalibrationTargetB] = useState<{ x: number; y: number } | null>(null);
  const [calibrationSourceAId, setCalibrationSourceAId] = useState<string | null>(null);
  const [calibrationSourceBId, setCalibrationSourceBId] = useState<string | null>(null);

  const figmaInputRef = useRef<HTMLInputElement>(null);
  const productionInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!figmaImage) {
      setFigmaImageSize(null);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setFigmaImageSize({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
      });
    };
    img.src = figmaImage;
  }, [figmaImage]);

  useEffect(() => {
    if (!productionImage) {
      setProductionImageSize(null);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setProductionImageSize({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
      });
    };
    img.src = productionImage;
  }, [productionImage]);

  const filteredDiscrepancies = discrepancies.filter(d => {
    // Exclude ignored markers
    if (d.ignored) return false;

    // Filter by type
    if (!selectedTypes.has(d.type)) return false;

    // Filter by confidence for auto-detected markers only.
    if ((d.source || 'unknown') === 'auto') {
      const confidence = d.detectionDetails?.confidence;
      if (typeof confidence === 'number' && confidence < confidenceThresholdPreset) {
        return false;
      }
    }

    // Filter by selected area
    if (selectedArea && selectedArea.width > 0 && selectedArea.height > 0) {
      const areaLocation = d.productionLocation || d.cvLocation || d.location;
      const inArea =
        areaLocation.x >= selectedArea.x &&
        areaLocation.x <= selectedArea.x + selectedArea.width &&
        areaLocation.y >= selectedArea.y &&
        areaLocation.y <= selectedArea.y + selectedArea.height;
      return inArea;
    }

    return true;
  });

  const getProductionAnchorLocation = (disc: Discrepancy) => {
    return disc.productionLocation || disc.cvLocation || disc.location;
  };

  useEffect(() => {
    if (discrepancies.length === 0) {
      setCalibrationSourceAId(null);
      setCalibrationSourceBId(null);
      return;
    }

    if (!calibrationSourceAId || !discrepancies.some(d => d.id === calibrationSourceAId)) {
      setCalibrationSourceAId(discrepancies[0].id);
    }

    if (!calibrationSourceBId || !discrepancies.some(d => d.id === calibrationSourceBId)) {
      const fallback = discrepancies.length > 1 ? discrepancies[1].id : discrepancies[0].id;
      setCalibrationSourceBId(fallback);
    }
  }, [discrepancies, calibrationSourceAId, calibrationSourceBId]);

  const validationIssues: ValidationIssue[] = discrepancies.flatMap((disc, index) => {
    const issues: ValidationIssue[] = [];
    const anchor = getProductionAnchorLocation(disc);

    if (!Number.isFinite(anchor.x) || !Number.isFinite(anchor.y)) {
      issues.push({
        id: `${disc.id}-invalid-anchor`,
        severity: 'high',
        message: `#${index + 1} has invalid production coordinates.`,
      });
      return issues;
    }

    if (productionImageSize) {
      const outOfBounds =
        anchor.x < 0 ||
        anchor.y < 0 ||
        anchor.x > productionImageSize.width ||
        anchor.y > productionImageSize.height;

      if (outOfBounds) {
        issues.push({
          id: `${disc.id}-out-of-bounds`,
          severity: 'high',
          message: `#${index + 1} is outside production bounds (${Math.round(anchor.x)}, ${Math.round(anchor.y)}).`,
        });
      }
    }

    if (!disc.productionLocation) {
      issues.push({
        id: `${disc.id}-fallback-anchor`,
        severity: 'low',
        message: `#${index + 1} uses fallback coordinates (no productionLocation provided).`,
      });
    }

    const area = disc.productionArea || disc.cvArea || disc.area;
    if (area && (area.width <= 0 || area.height <= 0)) {
      issues.push({
        id: `${disc.id}-invalid-area`,
        severity: 'medium',
        message: `#${index + 1} has invalid area size (${Math.round(area.width)}x${Math.round(area.height)}).`,
      });
    }

    return issues;
  });

  const reportingBucketCounts = filteredDiscrepancies.reduce((acc, disc) => {
    const bucket = disc.reportingBucket || 'major_visual_issues';
    acc[bucket] = (acc[bucket] || 0) + 1;
    return acc;
  }, {
    missing_text_elements: 0,
    large_spacing_discrepancies: 0,
    color_issues: 0,
    major_visual_issues: 0,
  } as Record<ReportingBucket, number>);

  const handleImageUpload = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: (image: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const analyzeImages = useCallback(async () => {
    if (!figmaImage || !productionImage) return;

    setIsAnalyzing(true);

    try {
      let detected = await detectDiscrepanciesFromImages(figmaImage, productionImage, {
        depth: analysisDepth,
        selectedArea,
      });

      // If area-scoped detection is too narrow, retry once on full image before surfacing empty state.
      if (detected.length === 0 && selectedArea && selectedArea.width > 0 && selectedArea.height > 0) {
        detected = await detectDiscrepanciesFromImages(figmaImage, productionImage, {
          depth: analysisDepth,
          selectedArea: null,
        });
      }

      setDiscrepancies(detected);
      setViewMode('all');
      setHoveredDiscrepancy(null);

      if (detected.length === 0) {
        alert('No significant discrepancies detected. Try Detailed Analysis, lowering confidence threshold to 30%, or selecting a wider area.');
      }
    } catch (error) {
      console.error('Local analysis failed:', error);
      alert(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  }, [figmaImage, productionImage, analysisDepth, selectedArea]);

  const resetComparison = useCallback(() => {
    setFigmaImage(null);
    setProductionImage(null);
    setDiscrepancies([]);
    setZoom(100);
    setOverlayOpacity(50);
    setSelectedArea(null);
    setSelectionMode(false);
    setAddMarkerMode(false);
    setPendingMarkerPosition(null);
    resetCalibration();
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedArea(null);
    setSelectionMode(false);
  }, []);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));

  const handleAddManualMarker = () => {
    setCalibrationCaptureMode(false);
    setAddMarkerMode(true);
    setSelectionMode(false);
  };

  const handleMarkerClick = (x: number, y: number) => {
    setPendingMarkerPosition({ x, y });
    setAddMarkerMode(false);
  };

  const handleCanvasPrimaryClick = (x: number, y: number) => {
    if (calibrationCaptureMode) {
      if (calibrationStep === 1) {
        setCalibrationTargetA({ x, y });
        setCalibrationStep(2);
      } else {
        setCalibrationTargetB({ x, y });
        setCalibrationCaptureMode(false);
      }
      return;
    }

    handleMarkerClick(x, y);
  };

  const startCalibrationCapture = () => {
    setAddMarkerMode(false);
    setSelectionMode(false);
    setCalibrationCaptureMode(true);
    setCalibrationStep(1);
    setCalibrationTargetA(null);
    setCalibrationTargetB(null);
  };

  const cancelCalibrationCapture = () => {
    setCalibrationCaptureMode(false);
    setCalibrationStep(1);
  };

  const applyTwoPointCalibration = () => {
    if (!calibrationSourceAId || !calibrationSourceBId) {
      alert('Select two source discrepancies for calibration.');
      return;
    }

    if (calibrationSourceAId === calibrationSourceBId) {
      alert('Select two different discrepancy points for calibration.');
      return;
    }

    if (!calibrationTargetA || !calibrationTargetB) {
      alert('Capture both target points on the production image first.');
      return;
    }

    const sourceA = discrepancies.find(d => d.id === calibrationSourceAId);
    const sourceB = discrepancies.find(d => d.id === calibrationSourceBId);

    if (!sourceA || !sourceB) {
      alert('Could not find selected source discrepancies.');
      return;
    }

    const sourcePointA = getProductionAnchorLocation(sourceA);
    const sourcePointB = getProductionAnchorLocation(sourceB);

    const deltaX = sourcePointB.x - sourcePointA.x;
    const deltaY = sourcePointB.y - sourcePointA.y;

    if (Math.abs(deltaX) < 1 || Math.abs(deltaY) < 1) {
      alert('Selected source points are too close. Pick points with meaningful X and Y separation.');
      return;
    }

    const scaleX = (calibrationTargetB.x - calibrationTargetA.x) / deltaX;
    const scaleY = (calibrationTargetB.y - calibrationTargetA.y) / deltaY;
    const offsetX = calibrationTargetA.x - sourcePointA.x * scaleX;
    const offsetY = calibrationTargetA.y - sourcePointA.y * scaleY;

    if (![scaleX, scaleY, offsetX, offsetY].every(Number.isFinite)) {
      alert('Computed calibration is invalid. Please capture the points again.');
      return;
    }

    setProductionCalibration({ scaleX, scaleY, offsetX, offsetY });
  };

  const resetCalibration = () => {
    setProductionCalibration(DEFAULT_PRODUCTION_CALIBRATION);
    setCalibrationTargetA(null);
    setCalibrationTargetB(null);
    setCalibrationCaptureMode(false);
    setCalibrationStep(1);
  };

  const handleSaveDiscrepancy = (discrepancy: Omit<Discrepancy, 'id'>) => {
    const newDiscrepancy: Discrepancy = {
      ...discrepancy,
      source: discrepancy.source || 'manual',
      id: `disc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setDiscrepancies(prev => [...prev, newDiscrepancy]);
    setPendingMarkerPosition(null);
  };

  const resetMarkerVisibilityFilters = () => {
    setSelectedTypes(new Set(MUST_HAVE_DISCREPANCY_TYPES));
    setSelectedArea(null);
    setSelectionMode(false);
  };

  const handleClearAllDiscrepancies = () => {
    if (confirm(`Are you sure you want to clear all ${discrepancies.length} markers?`)) {
      setDiscrepancies([]);
    }
  };

  const handleIgnoreMarker = (discrepancyId: string) => {
    setDiscrepancies(prev =>
      prev.map(d =>
        d.id === discrepancyId ? { ...d, ignored: !d.ignored } : d
      )
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-14' : 'w-80'} bg-card border-r border-border flex flex-col transition-all duration-300`}>
        <div className={`${sidebarCollapsed ? 'p-3' : 'p-6'} border-b border-border`}>
          {!sidebarCollapsed && (
            <>
              <div className="flex items-start justify-between mb-2">
                <h1>Design Comparison Tool</h1>
              </div>
              <p className="text-muted-foreground">
                Compare Figma designs with production to identify discrepancies
              </p>
            </>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`${sidebarCollapsed ? 'w-full' : 'mt-4'} p-2 hover:bg-muted/20 transition-colors flex items-center justify-center`}
            style={{ borderRadius: 'var(--radius)' }}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-muted-foreground" />
            ) : (
              <div className="flex items-center gap-2 w-full justify-center">
                <PanelLeftClose className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Collapse</span>
              </div>
            )}
          </button>
        </div>

        {!sidebarCollapsed && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <div>
              <label className="block mb-2">
                Production Screenshot
              </label>
              <input
                ref={productionInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setProductionImage)}
                className="hidden"
              />
              <Button
                onClick={() => productionInputRef.current?.click()}
                variant="outline"
                className="w-full px-4 py-3 flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {productionImage ? 'Change Image' : 'Upload Production'}
              </Button>
              {productionImage && (
                <div className="mt-2 flex items-center gap-2 text-primary">
                  <CheckCircle2 className="w-4 h-4" />
                  <span style={{ fontSize: 'var(--text-label)' }}>Image loaded</span>
                </div>
              )}
            </div>

            <div>
              <label className="block mb-3">
                Figma Design
              </label>
              <FigmaUrlInput
                onImageLoaded={setFigmaImage}
                currentImage={figmaImage}
              />
            </div>
          </div>

          {/* Discrepancy Manager */}
          {(figmaImage || productionImage) && (
            <DiscrepancyManager
              discrepancies={discrepancies}
              onAddManual={handleAddManualMarker}
              onClearAll={handleClearAllDiscrepancies}
              hasImages={!!(figmaImage && productionImage)}
              referenceImageSize={figmaImageSize || productionImageSize}
            />
          )}

          {/* Analyze Button */}
          {figmaImage && productionImage && (
            <Button
              onClick={analyzeImages}
              disabled={isAnalyzing}
              className="w-full px-4 py-3"
            >
              {isAnalyzing ? 'Analyzing...' : `Analyze ${analysisDepth === 'detailed' ? 'Detailed' : 'Quick'}`}
            </Button>
          )}

          {/* Confidence Threshold */}
          {discrepancies.length > 0 && (
            <div className="bg-card border border-border p-4 space-y-3" style={{ borderRadius: 'var(--radius-card)' }}>
              <div className="flex items-center justify-between">
                <h4>Confidence Threshold</h4>
                <span className="text-xs text-muted-foreground">
                  {(confidenceThresholdPreset * 100).toFixed(0)}%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => setConfidenceThresholdPreset(0.3)}
                  variant={confidenceThresholdPreset === 0.3 ? "default" : "secondary"}
                  size="sm"
                  className="text-xs"
                >
                  30% (Broad)
                </Button>
                <Button
                  onClick={() => setConfidenceThresholdPreset(0.6)}
                  variant={confidenceThresholdPreset === 0.6 ? "default" : "secondary"}
                  size="sm"
                  className="text-xs"
                >
                  60% (Lenient)
                </Button>
                <Button
                  onClick={() => setConfidenceThresholdPreset(1.0)}
                  variant={confidenceThresholdPreset === 1.0 ? "default" : "secondary"}
                  size="sm"
                  className="text-xs"
                >
                  100% (Strict)
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Applies to auto-detected markers only. Manual markers stay visible.
              </p>
            </div>
          )}

          {/* Filter */}
          {discrepancies.length > 0 && (
            <DiscrepancyFilter
              selectedTypes={selectedTypes}
              onTypesChange={setSelectedTypes}
              discrepancies={discrepancies}
            />
          )}

          {/* Analysis Summary */}
          {discrepancies.length > 0 && (
            <div className="bg-card border border-border p-4 space-y-3" style={{ borderRadius: 'var(--radius-card)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <h4>Analysis Complete</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="px-2 py-0.5 bg-muted text-muted-foreground" style={{ borderRadius: 'var(--radius-tag)', fontSize: '11px' }}>
                      {analysisDepth === 'detailed' ? 'Deep Analysis' : 'Quick Scan'}
                    </div>
                    {selectedArea && selectedArea.width > 0 && (
                      <div className="px-2 py-0.5 bg-accent text-accent-foreground" style={{ borderRadius: 'var(--radius-tag)', fontSize: '11px' }}>
                        Selected Area
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-3 py-1 bg-primary text-primary-foreground" style={{ borderRadius: 'var(--radius-tag)' }}>
                  <span style={{ fontSize: 'var(--text-label)' }}>{filteredDiscrepancies.length} Issues</span>
                </div>
              </div>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                {filteredDiscrepancies.filter(d => d.severity === 'high').length} critical issues require immediate attention
              </p>
              {discrepancies.filter(d => d.ignored).length > 0 && (
                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                  {discrepancies.filter(d => d.ignored).length} marker{discrepancies.filter(d => d.ignored).length !== 1 ? 's' : ''} marked as inaccurate
                </p>
              )}
              <Button
                onClick={() => {
                  setDiscrepancies([]);
                }}
                variant="secondary"
                size="sm"
                className="w-full text-xs"
              >
                Clear Markers
              </Button>
            </div>
          )}

          {/* Bucket Breakdown */}
          {discrepancies.length > 0 && (
            <div className="bg-card border border-border p-4 space-y-3" style={{ borderRadius: 'var(--radius-card)' }}>
              <div className="flex items-center justify-between">
                <h4>Category Breakdown</h4>
                <span className="text-xs text-muted-foreground">
                  {filteredDiscrepancies.length} shown
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                Grouped by the strongest detection signal for each marker.
              </p>

              <div className="space-y-2">
                {(Object.keys(REPORTING_BUCKET_META) as ReportingBucket[]).map((bucket) => {
                  const count = reportingBucketCounts[bucket];
                  const percent = filteredDiscrepancies.length > 0
                    ? Math.round((count / filteredDiscrepancies.length) * 100)
                    : 0;
                  const meta = REPORTING_BUCKET_META[bucket];

                  return (
                    <div key={bucket} className="border border-border/60 bg-muted/10 p-2" style={{ borderRadius: 'var(--radius)' }}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{meta.label}</span>
                        <span className="text-muted-foreground">{count} ({percent}%)</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{meta.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Fully Filtered Notice */}
          {discrepancies.length > 0 && filteredDiscrepancies.length === 0 && (
            <div className="bg-destructive/10 border border-destructive/30 p-3 space-y-2" style={{ borderRadius: 'var(--radius)' }}>
              <p className="text-destructive" style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>
                Markers are loaded, but current filters hide all of them.
              </p>
              <Button
                onClick={resetMarkerVisibilityFilters}
                variant="secondary"
                size="sm"
                className="w-full text-xs"
              >
                Show All Markers
              </Button>
            </div>
          )}

          {/* Discrepancies List */}
          {discrepancies.length > 0 && (
            <DiscrepancyList
              discrepancies={filteredDiscrepancies}
              hoveredDiscrepancy={hoveredDiscrepancy}
              onDiscrepancyHover={setHoveredDiscrepancy}
              onIgnoreMarker={handleIgnoreMarker}
            />
          )}

          {/* Zoom Controls */}
          {(figmaImage || productionImage) && (
            <div className="space-y-2">
              <label className="block">
                Zoom: {zoom}%
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleZoomOut}
                  className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  style={{ borderRadius: 'var(--radius-button)' }}
                >
                  <ZoomOut className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  style={{ borderRadius: 'var(--radius-button)' }}
                >
                  <ZoomIn className="w-4 h-4 mx-auto" />
                </button>
                <button
                  onClick={() => setZoom(100)}
                  className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  style={{ borderRadius: 'var(--radius-button)' }}
                >
                  <RotateCcw className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          )}

          {/* Reset Button */}
          {(figmaImage || productionImage) && (
            <Button
              onClick={resetComparison}
              variant="secondary"
              className="w-full px-4 py-2"
            >
              Reset Comparison
            </Button>
          )}
        </div>
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 bg-muted/5 overflow-hidden relative">
        {!figmaImage && !productionImage ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md px-6">
              <Layers className="w-16 h-16 mx-auto text-muted mb-4" />
              <h2 className="mb-2">Start Your Comparison</h2>
              <p className="text-muted-foreground">
                Upload your Figma design and production screenshot to begin analyzing discrepancies
              </p>
            </div>
          </div>
        ) : (
          <ComparisonCanvas
            figmaImage={figmaImage}
            productionImage={productionImage}
            mode={comparisonMode}
            opacity={overlayOpacity}
            zoom={zoom}
            discrepancies={filteredDiscrepancies}
            hoveredDiscrepancy={hoveredDiscrepancy}
            onDiscrepancyHover={setHoveredDiscrepancy}
            selectionMode={false}
            selectedArea={null}
            onSelectionChange={() => {}}
            addMarkerMode={addMarkerMode}
            onAddMarkerClick={handleMarkerClick}
          />
        )}

        {isAnalyzing && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card px-8 py-6 border border-border text-center max-w-md" style={{ borderRadius: 'var(--radius-card)' }}>
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="mb-2">Analyzing Images</h3>
              <p className="text-muted-foreground mb-4">
                Comparing Figma and production to generate discrepancy markers.
              </p>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span>Computing pixel differences</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <span>Grouping mismatch regions</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <span>Scoring discrepancy severity</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {addMarkerMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-accent text-accent-foreground flex items-center gap-2 shadow-lg" style={{ borderRadius: 'var(--radius-card)' }}>
            <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>
              Click on an image to place a discrepancy marker
            </span>
            <button
              onClick={() => setAddMarkerMode(false)}
              className="px-3 py-1 bg-background text-foreground hover:bg-muted/20 transition-colors ml-2"
              style={{ borderRadius: 'var(--radius)' }}
            >
              Cancel
            </button>
          </div>
        )}

      </div>

      {/* Discrepancy Form Modal */}
      {pendingMarkerPosition && (
        <DiscrepancyForm
          position={pendingMarkerPosition}
          onSave={handleSaveDiscrepancy}
          onCancel={() => setPendingMarkerPosition(null)}
        />
      )}
    </div>
  );
}