import { useRef, useEffect, useState, MouseEvent } from "react";
import type { Discrepancy } from "./design-comparison";
import { MarkerTooltip } from "./marker-tooltip";
import { Marker } from "./marker";
import { ImageSelector } from "./image-selector";
import { DiscrepancyZone } from "./discrepancy-zone";

interface ImageMetrics {
  naturalWidth: number;
  naturalHeight: number;
  renderedWidth: number;
  renderedHeight: number;
}

interface ComparisonCanvasProps {
  figmaImage: string | null;
  productionImage: string | null;
  mode: 'side-by-side' | 'overlay' | 'difference';
  opacity: number;
  zoom: number;
  discrepancies: Discrepancy[];
  hoveredDiscrepancy?: string | null;
  onDiscrepancyHover?: (id: string | null) => void;
  selectionMode: boolean;
  selectedArea: { x: number; y: number; width: number; height: number } | null;
  onSelectionChange: (area: { x: number; y: number; width: number; height: number } | null) => void;
  addMarkerMode?: boolean;
  onAddMarkerClick?: (x: number, y: number) => void;
  productionCalibration?: {
    scaleX: number;
    scaleY: number;
    offsetX: number;
    offsetY: number;
  };
  calibrationCaptureMode?: boolean;
  onCalibrationPointCapture?: (x: number, y: number) => void;
}

export function ComparisonCanvas({
  figmaImage,
  productionImage,
  mode,
  opacity,
  zoom,
  discrepancies,
  hoveredDiscrepancy,
  onDiscrepancyHover,
  selectionMode,
  selectedArea,
  onSelectionChange,
  addMarkerMode,
  onAddMarkerClick,
  productionCalibration,
  calibrationCaptureMode,
  onCalibrationPointCapture
}: ComparisonCanvasProps) {
  const FIGMA_Y_CALIBRATION = 0;
  const PRODUCTION_Y_CALIBRATION = 0;

  const containerRef = useRef<HTMLDivElement>(null);
  const [showMarkers, setShowMarkers] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [tooltipDiscrepancy, setTooltipDiscrepancy] = useState<{ disc: Discrepancy; index: number; x: number; y: number } | null>(null);
  const [figmaMetrics, setFigmaMetrics] = useState<ImageMetrics | null>(null);
  const [productionMetrics, setProductionMetrics] = useState<ImageMetrics | null>(null);

  const clamp = (value: number, min: number, max: number) => {
    if (Number.isNaN(value)) return min;
    return Math.max(min, Math.min(max, value));
  };

  // Helper to get the best available location (prefers CV, then specific image location, then fallback)
  const getLocationForImage = (disc: Discrepancy, isProduction: boolean) => {
    // Prefer image-specific location for the current pane
    if (isProduction && disc.productionLocation) {
      return disc.productionLocation;
    }
    if (!isProduction && disc.figmaLocation) {
      return disc.figmaLocation;
    }
    // Then use CV-detected coordinates
    if (disc.cvLocation) {
      return disc.cvLocation;
    }
    // Fallback to generic location
    return disc.location;
  };

  const getAreaForImage = (disc: Discrepancy, isProduction: boolean) => {
    // Prefer image-specific area for the current pane
    if (isProduction && disc.productionArea) {
      return disc.productionArea;
    }
    if (!isProduction && disc.figmaArea) {
      return disc.figmaArea;
    }
    // Then use CV-detected area
    if (disc.cvArea) {
      return disc.cvArea;
    }
    // Fallback to generic area
    return disc.area;
  };

  const getOverlayPlacement = (
    disc: Discrepancy,
    metrics: ImageMetrics | null,
    isProduction: boolean,
    location?: { x: number; y: number },
    area?: { width: number; height: number },
  ) => {
    const baseWidth = area?.width || disc.area?.width || 60;
    const baseHeight = area?.height || disc.area?.height || 40;
    const baseLocation = location || disc.location;

    const calibratedLocation = isProduction && productionCalibration
      ? {
          x: baseLocation.x * productionCalibration.scaleX + productionCalibration.offsetX,
          y: baseLocation.y * productionCalibration.scaleY + productionCalibration.offsetY,
        }
      : baseLocation;

    const calibratedArea = isProduction && productionCalibration
      ? {
          width: Math.max(8, baseWidth * Math.abs(productionCalibration.scaleX)),
          height: Math.max(8, baseHeight * Math.abs(productionCalibration.scaleY)),
        }
      : { width: baseWidth, height: baseHeight };

    // Source coordinates are in natural image space; map to actual rendered on-screen space.
    const naturalWidth = metrics?.naturalWidth || 1;
    const naturalHeight = metrics?.naturalHeight || 1;
    const renderedWidth = metrics?.renderedWidth || naturalWidth;
    const renderedHeight = metrics?.renderedHeight || naturalHeight;

    const fitScaleX = renderedWidth / naturalWidth;
    const fitScaleY = renderedHeight / naturalHeight;

    const width = calibratedArea.width * fitScaleX;
    const height = calibratedArea.height * fitScaleY;
    const x = calibratedLocation.x * fitScaleX;
    const y =
      calibratedLocation.y * fitScaleY +
      (isProduction ? PRODUCTION_Y_CALIBRATION : FIGMA_Y_CALIBRATION);

    const maxX = renderedWidth;
    const maxY = renderedHeight;

    const result = {
      x: clamp(x, 0, Math.max(0, maxX - width)),
      y: clamp(y, 0, Math.max(0, maxY - height)),
      width: clamp(width, 8, maxX),
      height: clamp(height, 8, maxY),
    };

    return result;
  };

  if (mode === 'side-by-side') {
    return (
      <div className="h-full overflow-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3>Side-by-Side Comparison</h3>
            {(showMarkers || showZones) && discrepancies.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-muted/30 border border-border" style={{ borderRadius: 'var(--radius-tag)' }}>
                <div className="flex items-center -space-x-1">
                  <div className="w-4 h-4 border border-white rounded-full shadow-sm" style={{ backgroundColor: 'rgba(181, 9, 9, 1.00)' }} title="High severity"></div>
                  <div className="w-4 h-4 border border-white rounded-full shadow-sm" style={{ backgroundColor: 'rgba(189, 87, 39, 1.00)' }} title="Medium severity"></div>
                  <div className="w-4 h-4 border border-white rounded-full shadow-sm" style={{ backgroundColor: 'rgba(117, 117, 117, 1.00)' }} title="Low severity"></div>
                </div>
                <span className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                  {discrepancies.length} issues • Hover for details
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 hover:bg-muted/20 transition-colors" style={{ borderRadius: 'var(--radius)' }}>
              <input
                type="checkbox"
                checked={showZones}
                onChange={(e) => setShowZones(e.target.checked)}
                className="w-4 h-4"
              />
              <span style={{ fontSize: 'var(--text-label)' }}>Zones</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 hover:bg-muted/20 transition-colors" style={{ borderRadius: 'var(--radius)' }}>
              <input
                type="checkbox"
                checked={showMarkers}
                onChange={(e) => setShowMarkers(e.target.checked)}
                className="w-4 h-4"
              />
              <span style={{ fontSize: 'var(--text-label)' }}>Markers</span>
            </label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-3 px-3 py-2 bg-primary text-primary-foreground inline-block" style={{ borderRadius: 'var(--radius-tag)' }}>
              <span style={{ fontSize: 'var(--text-label)' }}>Production</span>
            </div>
            {productionImage ? (
              <div className="relative">
                <ImageSelector
                  imageSrc={productionImage}
                  alt="Production screenshot"
                  zoom={zoom}
                  selectionMode={selectionMode}
                  selection={selectedArea}
                  onSelectionChange={onSelectionChange}
                  addMarkerMode={addMarkerMode}
                  onAddMarkerClick={onAddMarkerClick}
                  onImageMetricsChange={setProductionMetrics}
                >
                  {showZones && !selectionMode && discrepancies.map((disc) => (
                    (() => {
                      const placement = getOverlayPlacement(
                        disc,
                        productionMetrics,
                        true,
                        getLocationForImage(disc, true),
                        getAreaForImage(disc, true),
                      );
                      return (
                        <DiscrepancyZone
                          key={`prod-zone-${disc.id}`}
                          severity={disc.severity}
                          x={placement.x}
                          y={placement.y}
                          width={placement.width}
                          height={placement.height}
                          isHovered={hoveredDiscrepancy === disc.id}
                        />
                      );
                    })()
                  ))}
                  {showMarkers && !selectionMode && discrepancies.map((disc, index) => {
                    const placement = getOverlayPlacement(
                      disc,
                      productionMetrics,
                      true,
                      getLocationForImage(disc, true),
                      getAreaForImage(disc, true),
                    );
                    const markerX = placement.x + placement.width / 2;
                    const markerY = placement.y + placement.height / 2;
                    return (
                      <Marker
                        key={`prod-${disc.id}`}
                        index={index + 1}
                        x={markerX}
                        y={markerY}
                        severity={disc.severity}
                        isHovered={hoveredDiscrepancy === disc.id}
                        onMouseEnter={() => {
                          onDiscrepancyHover?.(disc.id);
                          setTooltipDiscrepancy({
                            disc,
                            index: index + 1,
                            x: markerX,
                            y: markerY
                          });
                        }}
                        onMouseLeave={() => {
                          onDiscrepancyHover?.(null);
                          setTooltipDiscrepancy(null);
                        }}
                      />
                    );
                  })}
                  {tooltipDiscrepancy && !selectionMode && (
                    <MarkerTooltip
                      discrepancy={tooltipDiscrepancy.disc}
                      index={tooltipDiscrepancy.index}
                      position={{ x: tooltipDiscrepancy.x, y: tooltipDiscrepancy.y }}
                    />
                  )}
                </ImageSelector>
              </div>
            ) : (
              <div className="h-64 bg-background border border-border flex items-center justify-center text-muted-foreground" style={{ borderRadius: 'var(--radius)' }}>
                No image uploaded
              </div>
            )}
          </div>

          <div>
            <div className="mb-3 px-3 py-2 bg-accent text-accent-foreground inline-block" style={{ borderRadius: 'var(--radius-tag)' }}>
              <span style={{ fontSize: 'var(--text-label)' }}>Figma Design</span>
            </div>
            {figmaImage ? (
              <div className="relative">
                <ImageSelector
                  imageSrc={figmaImage}
                  alt="Figma design"
                  zoom={zoom}
                  selectionMode={selectionMode}
                  selection={selectedArea}
                  onSelectionChange={onSelectionChange}
                  onImageMetricsChange={setFigmaMetrics}
                >
                  {showZones && !selectionMode && discrepancies.map((disc) => (
                    (() => {
                      const placement = getOverlayPlacement(
                        disc,
                        figmaMetrics,
                        false,
                        getLocationForImage(disc, false),
                        getAreaForImage(disc, false),
                      );
                      return (
                        <DiscrepancyZone
                          key={`figma-zone-${disc.id}`}
                          severity={disc.severity}
                          x={placement.x}
                          y={placement.y}
                          width={placement.width}
                          height={placement.height}
                          isHovered={hoveredDiscrepancy === disc.id}
                        />
                      );
                    })()
                  ))}
                  {showMarkers && !selectionMode && discrepancies.map((disc, index) => {
                    const placement = getOverlayPlacement(
                      disc,
                      figmaMetrics,
                      false,
                      getLocationForImage(disc, false),
                      getAreaForImage(disc, false),
                    );
                    const markerX = placement.x + placement.width / 2;
                    const markerY = placement.y + placement.height / 2;
                    return (
                      <Marker
                        key={`figma-${disc.id}`}
                        index={index + 1}
                        x={markerX}
                        y={markerY}
                        severity={disc.severity}
                        isHovered={hoveredDiscrepancy === disc.id}
                        onMouseEnter={() => {
                          onDiscrepancyHover?.(disc.id);
                          setTooltipDiscrepancy({
                            disc,
                            index: index + 1,
                            x: markerX,
                            y: markerY
                          });
                        }}
                        onMouseLeave={() => {
                          onDiscrepancyHover?.(null);
                          setTooltipDiscrepancy(null);
                        }}
                      />
                    );
                  })}
                  {tooltipDiscrepancy && !selectionMode && (
                    <MarkerTooltip
                      discrepancy={tooltipDiscrepancy.disc}
                      index={tooltipDiscrepancy.index}
                      position={{ x: tooltipDiscrepancy.x, y: tooltipDiscrepancy.y }}
                    />
                  )}
                </ImageSelector>
              </div>
            ) : (
              <div className="h-64 bg-background border border-border flex items-center justify-center text-muted-foreground" style={{ borderRadius: 'var(--radius)' }}>
                No image uploaded
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'overlay') {
    return (
      <div className="h-full overflow-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3>Overlay Comparison</h3>
            {(showMarkers || showZones) && discrepancies.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1 bg-muted/30 border border-border" style={{ borderRadius: 'var(--radius-tag)' }}>
                <div className="flex items-center -space-x-1">
                  <div className="w-4 h-4 border border-white rounded-full shadow-sm" style={{ backgroundColor: 'rgba(181, 9, 9, 1.00)' }} title="High severity"></div>
                  <div className="w-4 h-4 border border-white rounded-full shadow-sm" style={{ backgroundColor: 'rgba(189, 87, 39, 1.00)' }} title="Medium severity"></div>
                  <div className="w-4 h-4 border border-white rounded-full shadow-sm" style={{ backgroundColor: 'rgba(117, 117, 117, 1.00)' }} title="Low severity"></div>
                </div>
                <span className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                  {discrepancies.length} issues • Hover for details
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 hover:bg-muted/20 transition-colors" style={{ borderRadius: 'var(--radius)' }}>
              <input
                type="checkbox"
                checked={showZones}
                onChange={(e) => setShowZones(e.target.checked)}
                className="w-4 h-4"
              />
              <span style={{ fontSize: 'var(--text-label)' }}>Zones</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 hover:bg-muted/20 transition-colors" style={{ borderRadius: 'var(--radius)' }}>
              <input
                type="checkbox"
                checked={showMarkers}
                onChange={(e) => setShowMarkers(e.target.checked)}
                className="w-4 h-4"
              />
              <span style={{ fontSize: 'var(--text-label)' }}>Markers</span>
            </label>
          </div>
        </div>
        <div className="relative inline-block">
          <div className="relative bg-background border border-border" style={{ borderRadius: 'var(--radius)' }}>
            {figmaImage && (
              <img
                src={figmaImage}
                alt="Figma design"
                onLoad={(e) => {
                  const imageElement = e.currentTarget;
                  setFigmaMetrics({
                    naturalWidth: imageElement.naturalWidth || imageElement.width,
                    naturalHeight: imageElement.naturalHeight || imageElement.height,
                    renderedWidth: imageElement.clientWidth,
                    renderedHeight: imageElement.clientHeight,
                  });
                }}
                style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left', display: 'block' }}
              />
            )}
            {productionImage && (
              <img
                src={productionImage}
                alt="Production screenshot"
                onLoad={(e) => {
                  const imageElement = e.currentTarget;
                  setProductionMetrics({
                    naturalWidth: imageElement.naturalWidth || imageElement.width,
                    naturalHeight: imageElement.naturalHeight || imageElement.height,
                    renderedWidth: imageElement.clientWidth,
                    renderedHeight: imageElement.clientHeight,
                  });
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  opacity: opacity / 100,
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: 'top left'
                }}
              />
            )}
            {selectedArea && selectedArea.width > 0 && (
              <div
                className="absolute border-2 border-primary bg-primary/10 pointer-events-none"
                style={{
                  left: `${selectedArea.x * (zoom / 100)}px`,
                  top: `${selectedArea.y * (zoom / 100)}px`,
                  width: `${selectedArea.width * (zoom / 100)}px`,
                  height: `${selectedArea.height * (zoom / 100)}px`,
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.3)'
                }}
              />
            )}
          </div>
          {showZones && !selectionMode && discrepancies.map((disc) => (
            (() => {
              const baseSize = figmaMetrics || productionMetrics;
              const placement = getOverlayPlacement(
                disc,
                baseSize,
                true,
                getLocationForImage(disc, true),
                getAreaForImage(disc, true)
              );
              return (
                <DiscrepancyZone
                  key={`overlay-zone-${disc.id}`}
                  severity={disc.severity}
                  x={placement.x}
                  y={placement.y}
                  width={placement.width}
                  height={placement.height}
                  isHovered={hoveredDiscrepancy === disc.id}
                />
              );
            })()
          ))}
          {showMarkers && !selectionMode && discrepancies.map((disc, index) => {
            const baseSize = figmaMetrics || productionMetrics;
            const placement = getOverlayPlacement(
              disc,
              baseSize,
              true,
              getLocationForImage(disc, true),
              getAreaForImage(disc, true)
            );
            const markerX = placement.x + placement.width / 2;
            const markerY = placement.y + placement.height / 2;
            return (
              <Marker
                key={`overlay-${disc.id}`}
                index={index + 1}
                x={markerX}
                y={markerY}
                severity={disc.severity}
                isHovered={hoveredDiscrepancy === disc.id}
                onMouseEnter={() => {
                  onDiscrepancyHover?.(disc.id);
                  setTooltipDiscrepancy({
                    disc,
                    index: index + 1,
                    x: markerX,
                    y: markerY
                  });
                }}
                onMouseLeave={() => {
                  onDiscrepancyHover?.(null);
                  setTooltipDiscrepancy(null);
                }}
              />
            );
          })}
          {tooltipDiscrepancy && !selectionMode && (
            <MarkerTooltip
              discrepancy={tooltipDiscrepancy.disc}
              index={tooltipDiscrepancy.index}
              position={{ x: tooltipDiscrepancy.x, y: tooltipDiscrepancy.y }}
            />
          )}
        </div>
      </div>
    );
  }

  // Difference mode
  return (
    <div className="h-full overflow-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h3>Difference View</h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-destructive/10 border border-destructive/30" style={{ borderRadius: 'var(--radius-tag)' }}>
            <div className="w-4 h-4 bg-destructive" style={{ borderRadius: 'var(--radius-tag)' }}></div>
            <span className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>Pixel differences</span>
          </div>
          {showMarkers && discrepancies.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-muted/30 border border-border" style={{ borderRadius: 'var(--radius-tag)' }}>
              <div className="w-5 h-5 bg-destructive border border-white rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white" style={{ fontSize: '10px', fontWeight: 'var(--font-weight-medium)' }}>
                  #
                </span>
              </div>
              <span className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                {discrepancies.length} issues • Hover for details
              </span>
            </div>
          )}
        </div>
        <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 hover:bg-muted/20 transition-colors" style={{ borderRadius: 'var(--radius)' }}>
          <input
            type="checkbox"
            checked={showMarkers}
            onChange={(e) => setShowMarkers(e.target.checked)}
            className="w-4 h-4"
          />
          <span style={{ fontSize: 'var(--text-label)' }}>Show markers</span>
        </label>
      </div>
      <div className="relative inline-block">
        <DifferenceCanvas
          figmaImage={figmaImage}
          productionImage={productionImage}
          zoom={zoom}
          discrepancies={discrepancies}
          showMarkers={showMarkers}
          hoveredDiscrepancy={hoveredDiscrepancy}
          onDiscrepancyHover={onDiscrepancyHover}
          addMarkerMode={addMarkerMode || calibrationCaptureMode}
          onAddMarkerClick={onCalibrationPointCapture || onAddMarkerClick}
          productionCalibration={productionCalibration}
        />
      </div>
    </div>
  );
}

function DifferenceCanvas({
  figmaImage,
  productionImage,
  zoom,
  discrepancies,
  showMarkers,
  hoveredDiscrepancy,
  onDiscrepancyHover,
  addMarkerMode,
  onAddMarkerClick,
  productionCalibration
}: {
  figmaImage: string | null;
  productionImage: string | null;
  zoom: number;
  discrepancies: Discrepancy[];
  showMarkers: boolean;
  hoveredDiscrepancy?: string | null;
  onDiscrepancyHover?: (id: string | null) => void;
  addMarkerMode?: boolean;
  onAddMarkerClick?: (x: number, y: number) => void;
  productionCalibration?: {
    scaleX: number;
    scaleY: number;
    offsetX: number;
    offsetY: number;
  };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [tooltipDiscrepancy, setTooltipDiscrepancy] = useState<{ disc: Discrepancy; index: number; x: number; y: number } | null>(null);

  const clamp = (value: number, min: number, max: number) => {
    if (Number.isNaN(value)) return min;
    return Math.max(min, Math.min(max, value));
  };

  const getDifferencePlacement = (disc: Discrepancy) => {
    const scaledWidth = dimensions.width * (zoom / 100);
    const scaledHeight = dimensions.height * (zoom / 100);

    // Difference preview is anchored to production view for reporting.
    const sourceLocation = disc.productionLocation || disc.cvLocation || disc.location;
    const location = productionCalibration
      ? {
          x: sourceLocation.x * productionCalibration.scaleX + productionCalibration.offsetX,
          y: sourceLocation.y * productionCalibration.scaleY + productionCalibration.offsetY,
        }
      : sourceLocation;

    if (!scaledWidth || !scaledHeight) {
      return {
        x: location.x * (zoom / 100),
        y: location.y * (zoom / 100),
      };
    }

    const x = clamp((location.x / dimensions.width) * scaledWidth, 0, Math.max(0, scaledWidth - 1));
    const y = clamp((location.y / dimensions.height) * scaledHeight, 0, Math.max(0, scaledHeight - 1));

    return { x, y };
  };

  useEffect(() => {
    if (!figmaImage || !productionImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img1 = new Image();
    const img2 = new Image();

    img1.onload = () => {
      img2.onload = () => {
        const width = Math.max(img1.width, img2.width);
        const height = Math.max(img1.height, img2.height);

        canvas.width = width;
        canvas.height = height;
        setDimensions({ width, height });

        // Draw first image
        ctx.drawImage(img1, 0, 0);
        const imageData1 = ctx.getImageData(0, 0, width, height);

        // Draw second image
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img2, 0, 0);
        const imageData2 = ctx.getImageData(0, 0, width, height);

        // Calculate difference
        const diff = ctx.createImageData(width, height);
        
        for (let i = 0; i < imageData1.data.length; i += 4) {
          const r1 = imageData1.data[i];
          const g1 = imageData1.data[i + 1];
          const b1 = imageData1.data[i + 2];
          
          const r2 = imageData2.data[i];
          const g2 = imageData2.data[i + 1];
          const b2 = imageData2.data[i + 2];

          const diffR = Math.abs(r1 - r2);
          const diffG = Math.abs(g1 - g2);
          const diffB = Math.abs(b1 - b2);
          const diffTotal = diffR + diffG + diffB;

          if (diffTotal > 30) {
            // Highlight differences in red
            diff.data[i] = 181; // matches --destructive red
            diff.data[i + 1] = 9;
            diff.data[i + 2] = 9;
            diff.data[i + 3] = 200;
          } else {
            // Show original in grayscale
            const gray = (r1 + g1 + b1) / 3;
            diff.data[i] = gray;
            diff.data[i + 1] = gray;
            diff.data[i + 2] = gray;
            diff.data[i + 3] = 255;
          }
        }

        ctx.putImageData(diff, 0, 0);
      };
      img2.src = productionImage;
    };
    img1.src = figmaImage;
  }, [figmaImage, productionImage]);

  return (
    <div
      className="relative bg-background border border-border"
      style={{ borderRadius: 'var(--radius)' }}
      onMouseDown={(e: MouseEvent<HTMLDivElement>) => {
        if (!addMarkerMode || !onAddMarkerClick || !canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / (zoom / 100);
        const y = (e.clientY - rect.top) / (zoom / 100);
        onAddMarkerClick(x, y);
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
      />
      {showMarkers && discrepancies.map((disc, index) => {
        const placement = getDifferencePlacement(disc);
        const markerX = placement.x;
        const markerY = placement.y;
        return (
          <Marker
            key={`diff-${disc.id}`}
            index={index + 1}
            x={markerX}
            y={markerY}
            severity={disc.severity}
            isHovered={hoveredDiscrepancy === disc.id}
            onMouseEnter={() => {
              onDiscrepancyHover?.(disc.id);
              setTooltipDiscrepancy({
                disc,
                index: index + 1,
                x: markerX,
                y: markerY
              });
            }}
            onMouseLeave={() => {
              onDiscrepancyHover?.(null);
              setTooltipDiscrepancy(null);
            }}
          />
        );
      })}
      {tooltipDiscrepancy && (
        <MarkerTooltip
          discrepancy={tooltipDiscrepancy.disc}
          index={tooltipDiscrepancy.index}
          position={{ x: tooltipDiscrepancy.x, y: tooltipDiscrepancy.y }}
        />
      )}
    </div>
  );
}