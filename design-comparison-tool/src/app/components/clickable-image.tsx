import { useRef } from "react";

interface ClickableImageProps {
  src: string;
  alt: string;
  zoom: number;
  onClick: (x: number, y: number) => void;
}

export function ClickableImage({ src, alt, zoom, onClick }: ClickableImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / (zoom / 100);
    const y = (e.clientY - rect.top) / (zoom / 100);

    onClick(x, y);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-crosshair inline-block"
      title="Click to add discrepancy marker"
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left', display: 'block' }}
        className="w-full h-auto"
      />
    </div>
  );
}
