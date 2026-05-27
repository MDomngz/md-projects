import { useState, useRef, MouseEvent, useEffect, ReactNode } from "react";

interface ImageSelectorProps {
  imageSrc: string;
  alt: string;
  zoom: number;
  onSelectionChange: (selection: { x: number; y: number; width: number; height: number } | null) => void;
  selectionMode: boolean;
  selection: { x: number; y: number; width: number; height: number } | null;
  addMarkerMode?: boolean;
  onAddMarkerClick?: (x: number, y: number) => void;
  children?: ReactNode;
  onImageMetricsChange?: (metrics: {
    naturalWidth: number;
    naturalHeight: number;
    renderedWidth: number;
    renderedHeight: number;
  }) => void;
}

export function ImageSelector({
  imageSrc,
  alt,
  zoom,
  onSelectionChange,
  selectionMode,
  selection,
  addMarkerMode,
  onAddMarkerClick,
  children,
  onImageMetricsChange
}: ImageSelectorProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const imageElement = imageRef.current;
    const containerElement = containerRef.current;
    if (!imageElement || !onImageMetricsChange) return;

    const emitMetrics = () => {
      onImageMetricsChange({
        naturalWidth: imageElement.naturalWidth || imageElement.width,
        naturalHeight: imageElement.naturalHeight || imageElement.height,
        renderedWidth: imageElement.clientWidth,
        renderedHeight: imageElement.clientHeight,
      });
    };

    emitMetrics();

    const resizeObserver = new ResizeObserver(emitMetrics);
    if (containerElement) {
      resizeObserver.observe(containerElement);
    } else {
      resizeObserver.observe(imageElement);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [imageSrc, zoom, onImageMetricsChange]);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!selectionMode && !addMarkerMode) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / (zoom / 100);
    const y = (e.clientY - rect.top) / (zoom / 100);

    if (selectionMode) {
      setIsDrawing(true);
      setStartPoint({ x, y });
      onSelectionChange({ x, y, width: 0, height: 0 });
    } else if (addMarkerMode && onAddMarkerClick) {
      onAddMarkerClick(x, y);
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !startPoint || !selectionMode) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentX = (e.clientX - rect.left) / (zoom / 100);
    const currentY = (e.clientY - rect.top) / (zoom / 100);

    const x = Math.min(startPoint.x, currentX);
    const y = Math.min(startPoint.y, currentY);
    const width = Math.abs(currentX - startPoint.x);
    const height = Math.abs(currentY - startPoint.y);

    onSelectionChange({ x, y, width, height });
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setStartPoint(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-background border border-border"
      style={{
        borderRadius: 'var(--radius)',
        cursor: (selectionMode || addMarkerMode) ? 'crosshair' : 'default'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <img
        ref={imageRef}
        src={imageSrc}
        alt={alt}
        onLoad={() => {
          const imageElement = imageRef.current;
          if (!imageElement || !onImageMetricsChange) return;
          onImageMetricsChange({
            naturalWidth: imageElement.naturalWidth || imageElement.width,
            naturalHeight: imageElement.naturalHeight || imageElement.height,
            renderedWidth: imageElement.clientWidth,
            renderedHeight: imageElement.clientHeight,
          });
        }}
        style={{
          width: `${zoom}%`,
          maxWidth: 'none',
          height: 'auto',
          display: 'block'
        }}
      />

      {children}

      {/* Selection overlay */}
      {selection && selection.width > 0 && selection.height > 0 && (
        <div
          className="absolute border-2 border-primary bg-primary/10 pointer-events-none"
          style={{
            left: `${selection.x * (zoom / 100)}px`,
            top: `${selection.y * (zoom / 100)}px`,
            width: `${selection.width * (zoom / 100)}px`,
            height: `${selection.height * (zoom / 100)}px`,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Corner handles */}
          <div className="absolute w-3 h-3 bg-primary border border-white -left-1.5 -top-1.5 rounded-full"></div>
          <div className="absolute w-3 h-3 bg-primary border border-white -right-1.5 -top-1.5 rounded-full"></div>
          <div className="absolute w-3 h-3 bg-primary border border-white -left-1.5 -bottom-1.5 rounded-full"></div>
          <div className="absolute w-3 h-3 bg-primary border border-white -right-1.5 -bottom-1.5 rounded-full"></div>

          {/* Dimension label */}
          <div
            className="absolute -top-7 left-0 px-2 py-1 bg-primary text-primary-foreground text-xs whitespace-nowrap"
            style={{ borderRadius: 'var(--radius-tag)' }}
          >
            {Math.round(selection.width)} × {Math.round(selection.height)}
          </div>
        </div>
      )}
    </div>
  );
}