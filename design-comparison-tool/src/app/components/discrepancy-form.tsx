import { useState } from "react";
import { X } from "lucide-react";
import type { Discrepancy } from "./design-comparison";

interface DiscrepancyFormProps {
  position: { x: number; y: number };
  onSave: (discrepancy: Omit<Discrepancy, 'id'>) => void;
  onCancel: () => void;
}

export function DiscrepancyForm({ position, onSave, onCancel }: DiscrepancyFormProps) {
  const [type, setType] = useState<Discrepancy['type']>('color');
  const [severity, setSeverity] = useState<Discrepancy['severity']>('medium');
  const [description, setDescription] = useState('');
  const [figmaValue, setFigmaValue] = useState('');
  const [productionValue, setProductionValue] = useState('');
  const [width, setWidth] = useState('60');
  const [height, setHeight] = useState('40');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onSave({
      type,
      severity,
      description: description.trim(),
      location: position,
      area: {
        width: parseInt(width) || 60,
        height: parseInt(height) || 40
      },
      figmaValue: figmaValue.trim() || undefined,
      productionValue: productionValue.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border max-w-lg w-full shadow-xl" style={{ borderRadius: 'var(--radius-card)' }}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3>Add Discrepancy Marker</h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-muted/20 transition-colors"
            style={{ borderRadius: 'var(--radius)' }}
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="text-xs text-muted-foreground bg-muted/10 p-2" style={{ borderRadius: 'var(--radius)' }}>
            Position: ({Math.round(position.x)}, {Math.round(position.y)})
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2" style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Discrepancy['type'])}
                className="w-full px-3 py-2 bg-input-background border border-border"
                style={{ borderRadius: 'var(--radius)' }}
              >
                <option value="color">Color</option>
                <option value="spacing">Spacing</option>
                <option value="typography">Typography</option>
                <option value="size">Size</option>
                <option value="border">Border</option>
                <option value="alignment">Alignment</option>
                <option value="padding">Padding</option>
                <option value="margin">Margin</option>
                <option value="line-height">Line Height</option>
                <option value="space-after">Space After</option>
                <option value="formatting">Formatting</option>
                <option value="content">Content</option>
                <option value="missing">Missing Element</option>
              </select>
            </div>

            <div>
              <label className="block mb-2" style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Discrepancy['severity'])}
                className="w-full px-3 py-2 bg-input-background border border-border"
                style={{ borderRadius: 'var(--radius)' }}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2" style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the discrepancy..."
              className="w-full px-3 py-2 bg-input-background border border-border resize-none"
              style={{ borderRadius: 'var(--radius)' }}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2" style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>
                Figma Value
              </label>
              <input
                type="text"
                value={figmaValue}
                onChange={(e) => setFigmaValue(e.target.value)}
                placeholder="Expected value"
                className="w-full px-3 py-2 bg-input-background border border-border"
                style={{ borderRadius: 'var(--radius)' }}
              />
            </div>

            <div>
              <label className="block mb-2" style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>
                Production Value
              </label>
              <input
                type="text"
                value={productionValue}
                onChange={(e) => setProductionValue(e.target.value)}
                placeholder="Actual value"
                className="w-full px-3 py-2 bg-input-background border border-border"
                style={{ borderRadius: 'var(--radius)' }}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2" style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>
              Highlight Area Size (px)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Width"
                min="1"
                className="w-full px-3 py-2 bg-input-background border border-border"
                style={{ borderRadius: 'var(--radius)' }}
              />
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Height"
                min="1"
                className="w-full px-3 py-2 bg-input-background border border-border"
                style={{ borderRadius: 'var(--radius)' }}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              style={{ borderRadius: 'var(--radius-button)' }}
              disabled={!description.trim()}
            >
              Add Marker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
