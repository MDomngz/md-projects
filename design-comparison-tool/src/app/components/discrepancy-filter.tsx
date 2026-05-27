import { Filter } from "lucide-react";
import type { Discrepancy } from "./design-comparison";
import { Button } from "./ui/button";

interface DiscrepancyFilterProps {
  selectedTypes: Set<Discrepancy['type']>;
  onTypesChange: (types: Set<Discrepancy['type']>) => void;
  discrepancies: Discrepancy[];
}

const FILTER_OPTIONS: Array<{ value: Discrepancy['type']; label: string; category: string }> = [
  { value: 'missing', label: 'Missing Elements', category: 'Filters' },
  { value: 'content', label: 'Major Visual Issues', category: 'Filters' },
  { value: 'color', label: 'Color Issues', category: 'Filters' },
  { value: 'spacing', label: 'Large Spacing', category: 'Filters' }
];

export function DiscrepancyFilter({ selectedTypes, onTypesChange, discrepancies }: DiscrepancyFilterProps) {
  const toggleType = (type: Discrepancy['type']) => {
    const newTypes = new Set(selectedTypes);
    if (newTypes.has(type)) {
      newTypes.delete(type);
    } else {
      newTypes.add(type);
    }
    onTypesChange(newTypes);
  };

  const selectAll = () => {
    onTypesChange(new Set(FILTER_OPTIONS.map(opt => opt.value)));
  };

  const selectNone = () => {
    onTypesChange(new Set());
  };

  const selectSpacingOnly = () => {
    onTypesChange(new Set(['spacing']));
  };

  const getCountByType = (type: Discrepancy['type']) => {
    return discrepancies.filter(d => d.type === type).length;
  };

  const groupedOptions = FILTER_OPTIONS.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, typeof FILTER_OPTIONS>);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <label>Filter by Type</label>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          onClick={selectAll}
          variant="secondary"
          size="sm"
          className="flex-1 text-xs"
        >
          All
        </Button>
        <Button
          onClick={selectNone}
          variant="secondary"
          size="sm"
          className="flex-1 text-xs"
        >
          None
        </Button>
        <Button
          onClick={selectSpacingOnly}
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
        >
          Spacing Only
        </Button>
      </div>

      {/* Grouped Filters */}
      <div className="space-y-3">
        {Object.entries(groupedOptions).map(([category, options]) => (
          <div key={category}>
            <div className="text-xs text-muted-foreground mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>
              {category}
            </div>
            <div className="space-y-1">
              {options.map(option => {
                const count = getCountByType(option.value);
                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer hover:bg-muted/10 px-2 py-1.5 transition-colors"
                    style={{ borderRadius: 'var(--radius)' }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTypes.has(option.value)}
                      onChange={() => toggleType(option.value)}
                      className="w-4 h-4"
                    />
                    <span className="flex-1" style={{ fontSize: 'var(--text-label)' }}>
                      {option.label}
                    </span>
                    <span 
                      className="px-2 py-0.5 bg-muted text-muted-foreground"
                      style={{ 
                        fontSize: '11px',
                        borderRadius: 'var(--radius-tag)'
                      }}
                    >
                      {count}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
