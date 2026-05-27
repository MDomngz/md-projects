import { Layers, GitCompare, Blend } from "lucide-react";

interface ComparisonModeProps {
  mode: 'side-by-side' | 'overlay' | 'difference';
  onModeChange: (mode: 'side-by-side' | 'overlay' | 'difference') => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
}

export function ComparisonMode({ mode, onModeChange, opacity, onOpacityChange }: ComparisonModeProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-3">
          Comparison Mode
        </label>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => onModeChange('side-by-side')}
            className={`px-4 py-3 border transition-colors flex items-center gap-3 ${
              mode === 'side-by-side'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-input-background border-border hover:bg-muted/20'
            }`}
            style={{ borderRadius: 'var(--radius-button)' }}
          >
            <GitCompare className="w-4 h-4" />
            <div className="text-left flex-1">
              <div style={{ fontSize: 'var(--text-base)' }}>Side-by-Side</div>
              <div className="text-xs opacity-80">Compare images next to each other</div>
            </div>
          </button>

          <button
            onClick={() => onModeChange('overlay')}
            className={`px-4 py-3 border transition-colors flex items-center gap-3 ${
              mode === 'overlay'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-input-background border-border hover:bg-muted/20'
            }`}
            style={{ borderRadius: 'var(--radius-button)' }}
          >
            <Layers className="w-4 h-4" />
            <div className="text-left flex-1">
              <div style={{ fontSize: 'var(--text-base)' }}>Overlay</div>
              <div className="text-xs opacity-80">Layer images on top of each other</div>
            </div>
          </button>

          <button
            onClick={() => onModeChange('difference')}
            className={`px-4 py-3 border transition-colors flex items-center gap-3 ${
              mode === 'difference'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-input-background border-border hover:bg-muted/20'
            }`}
            style={{ borderRadius: 'var(--radius-button)' }}
          >
            <Blend className="w-4 h-4" />
            <div className="text-left flex-1">
              <div style={{ fontSize: 'var(--text-base)' }}>Difference</div>
              <div className="text-xs opacity-80">Highlight pixel differences</div>
            </div>
          </button>
        </div>
      </div>

      {mode === 'overlay' && (
        <div className="space-y-2">
          <label className="block">
            Overlay Opacity: {opacity}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => onOpacityChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Figma only</span>
            <span>Production only</span>
          </div>
        </div>
      )}
    </div>
  );
}
