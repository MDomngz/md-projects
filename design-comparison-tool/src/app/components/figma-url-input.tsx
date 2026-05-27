import { useState, useRef } from "react";
import { Link2, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface FigmaUrlInputProps {
  onImageLoaded: (imageUrl: string) => void;
  currentImage: string | null;
}

export function FigmaUrlInput({ onImageLoaded, currentImage }: FigmaUrlInputProps) {
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateFigmaUrl = (url: string): boolean => {
    // Check if it's a valid Figma URL
    const figmaPattern = /^https:\/\/(www\.)?figma\.com\/(file|design|proto)\/[a-zA-Z0-9]+/;
    return figmaPattern.test(url);
  };

  const handleUrlSubmit = async () => {
    setError(null);

    if (!figmaUrl.trim()) {
      setError('Please enter a Figma URL');
      return;
    }

    if (!validateFigmaUrl(figmaUrl)) {
      setError('Invalid Figma URL. Please enter a valid Figma file, design, or prototype URL');
      return;
    }

    setIsLoading(true);

    // Simulate API call to Figma API to fetch the artboard as an image
    // In a real implementation, this would:
    // 1. Parse the Figma URL to extract file ID and node ID
    // 2. Call Figma REST API with authentication token
    // 3. Fetch the rendered image of the specific artboard

    setTimeout(() => {
      // Mock successful fetch - in production, this would be the actual image from Figma
      // For demo purposes, we'll use a placeholder that indicates it came from Figma URL
      const mockImageUrl = `data:image/svg+xml,${encodeURIComponent(`
        <svg width="500" height="400" xmlns="http://www.w3.org/2000/svg">
          <rect width="500" height="400" fill="#F5F5F5"/>
          <text x="250" y="180" text-anchor="middle" font-family="Arial" font-size="16" fill="#666">
            Figma Design Loaded
          </text>
          <text x="250" y="210" text-anchor="middle" font-family="Arial" font-size="12" fill="#999">
            ${figmaUrl.substring(0, 50)}...
          </text>
          <text x="250" y="240" text-anchor="middle" font-family="Arial" font-size="10" fill="#BBB">
            (In production, this would be your actual Figma artboard)
          </text>
        </svg>
      `)}`;

      onImageLoaded(mockImageUrl);
      setIsLoading(false);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageLoaded(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      {/* Mode Toggle */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            setInputMode('upload');
            setError(null);
          }}
          className={`px-3 py-2 border transition-colors flex items-center justify-center gap-2 ${
            inputMode === 'upload'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'
          }`}
          style={{ borderRadius: 'var(--radius-button)' }}
        >
          <Upload className="w-4 h-4" />
          <span style={{ fontSize: 'var(--text-label)' }}>Upload File</span>
        </button>
        <button
          onClick={() => {
            setInputMode('url');
            setError(null);
          }}
          className={`px-3 py-2 border transition-colors flex items-center justify-center gap-2 ${
            inputMode === 'url'
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'
          }`}
          style={{ borderRadius: 'var(--radius-button)' }}
        >
          <Link2 className="w-4 h-4" />
          <span style={{ fontSize: 'var(--text-label)' }}>Figma URL</span>
        </button>
      </div>

      {/* Upload Mode */}
      {inputMode === 'upload' && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-3 bg-input-background border border-border hover:bg-muted/20 transition-colors flex items-center justify-center gap-2"
            style={{ borderRadius: 'var(--radius-button)' }}
          >
            <Upload className="w-4 h-4" />
            {currentImage ? 'Change Image' : 'Upload Image'}
          </button>
        </>
      )}

      {/* URL Mode */}
      {inputMode === 'url' && (
        <div className="space-y-2">
          <div>
            <input
              type="url"
              value={figmaUrl}
              onChange={(e) => {
                setFigmaUrl(e.target.value);
                setError(null);
              }}
              placeholder="https://www.figma.com/file/..."
              className="w-full px-3 py-2 bg-input-background border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              style={{ borderRadius: 'var(--radius-button)' }}
            />
          </div>

          <button
            onClick={handleUrlSubmit}
            disabled={isLoading}
            className="w-full px-4 py-3 bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ borderRadius: 'var(--radius-button)' }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Fetching from Figma...
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" />
                Load from Figma
              </>
            )}
          </button>

          {error && (
            <div className="flex items-start gap-2 p-2 bg-destructive/10 border border-destructive/30 text-destructive" style={{ borderRadius: 'var(--radius)' }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span style={{ fontSize: 'var(--text-label)' }}>{error}</span>
            </div>
          )}

          <div className="bg-accent/10 border border-accent/30 p-3" style={{ borderRadius: 'var(--radius)' }}>
            <h4 className="mb-2" style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>
              How to get Figma URL:
            </h4>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open your design in Figma</li>
              <li>Select the artboard/frame you want</li>
              <li>Click "Share" in the top right</li>
              <li>Copy the link and paste it here</li>
            </ol>
          </div>
        </div>
      )}

      {/* Success indicator */}
      {currentImage && (
        <div className="flex items-center gap-2 text-primary">
          <CheckCircle2 className="w-4 h-4" />
          <span style={{ fontSize: 'var(--text-label)' }}>
            {inputMode === 'url' ? 'Loaded from Figma' : 'Image loaded'}
          </span>
        </div>
      )}
    </div>
  );
}
