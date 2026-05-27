import { Ruler } from "lucide-react";
import type { Discrepancy } from "./design-comparison";

interface SpacingDetailsProps {
  discrepancies: Discrepancy[];
}

export function SpacingDetails({ discrepancies }: SpacingDetailsProps) {
  const spacingIssues = discrepancies.filter(d =>
    ['padding', 'margin', 'line-height', 'space-after', 'spacing'].includes(d.type)
  );

  if (spacingIssues.length === 0) {
    return null;
  }

  const getSpacingTypeIcon = (type: Discrepancy['type']) => {
    return <Ruler className="w-4 h-4 text-muted-foreground" />;
  };

  const getSpacingCategory = (type: Discrepancy['type']) => {
    const categories = {
      padding: 'Internal Spacing',
      margin: 'External Spacing',
      'line-height': 'Vertical Rhythm',
      'space-after': 'Element Spacing',
      spacing: 'Layout Spacing'
    };
    return categories[type as keyof typeof categories] || 'Other';
  };

  // Group by spacing category
  const grouped = spacingIssues.reduce((acc, issue) => {
    const category = getSpacingCategory(issue.type);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(issue);
    return acc;
  }, {} as Record<string, Discrepancy[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Ruler className="w-5 h-5 text-primary" />
        <h3>Spacing Analysis</h3>
      </div>

      <div className="bg-muted/20 border border-border p-3" style={{ borderRadius: 'var(--radius)' }}>
        <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
          Found {spacingIssues.length} spacing-related discrepancies across padding, margin, line-height, and element spacing.
        </p>
      </div>

      {Object.entries(grouped).map(([category, issues]) => (
        <div key={category}>
          <h4 className="mb-2 text-muted-foreground">{category}</h4>
          <div className="space-y-2">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="bg-card border border-border p-3"
                style={{ borderRadius: 'var(--radius)' }}
              >
                <div className="flex items-start gap-2 mb-2">
                  {getSpacingTypeIcon(issue.type)}
                  <div className="flex-1">
                    <div className="mb-1">
                      <span
                        className="px-2 py-0.5 text-white inline-block"
                        style={{
                          fontSize: 'var(--text-label)',
                          backgroundColor: issue.severity === 'high'
                            ? 'rgba(181, 9, 9, 1.00)'
                            : issue.severity === 'medium'
                            ? 'rgba(189, 87, 39, 1.00)'
                            : 'rgba(117, 117, 117, 1.00)',
                          borderRadius: 'var(--radius-tag)'
                        }}
                      >
                        {issue.type.charAt(0).toUpperCase() + issue.type.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                    <p style={{ fontSize: 'var(--text-label)' }}>
                      {issue.description}
                    </p>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-border">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Figma Spec</div>
                      <div
                        className="px-2 py-1 bg-accent/10 border border-accent/30"
                        style={{ borderRadius: 'var(--radius)', fontFamily: 'monospace', fontSize: '12px' }}
                      >
                        {issue.figmaValue}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Production</div>
                      <div
                        className="px-2 py-1 bg-destructive/10 border border-destructive/30"
                        style={{ borderRadius: 'var(--radius)', fontFamily: 'monospace', fontSize: '12px' }}
                      >
                        {issue.productionValue}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
