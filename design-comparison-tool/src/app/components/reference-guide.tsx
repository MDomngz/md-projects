import { Info, AlertCircle, AlertTriangle } from "lucide-react";

export function ReferenceGuide() {
  return (
    <div className="space-y-4">
      <h3>Quick Reference</h3>

      <div className="space-y-3">
        <div>
          <h4 className="mb-2 text-muted-foreground">Severity Levels</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-card border border-border" style={{ borderRadius: 'var(--radius)' }}>
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
              <div className="flex-1">
                <div style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>High Priority</div>
                <div className="text-xs text-muted-foreground">Critical issues affecting user experience or brand consistency</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-card border border-border" style={{ borderRadius: 'var(--radius)' }}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: 'rgba(189, 87, 39, 1.00)' }} />
              <div className="flex-1">
                <div style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>Medium Priority</div>
                <div className="text-xs text-muted-foreground">Noticeable differences that should be addressed</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-card border border-border" style={{ borderRadius: 'var(--radius)' }}>
              <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <div style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>Low Priority</div>
                <div className="text-xs text-muted-foreground">Minor discrepancies that can be fixed during regular updates</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-muted-foreground">Issue Categories</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-muted/20" style={{ borderRadius: 'var(--radius)' }}>
              <div className="text-xs" style={{ fontWeight: 'var(--font-weight-medium)' }}>Content</div>
              <div className="text-xs text-muted-foreground">Missing, formatting</div>
            </div>
            <div className="p-2 bg-muted/20" style={{ borderRadius: 'var(--radius)' }}>
              <div className="text-xs" style={{ fontWeight: 'var(--font-weight-medium)' }}>Visual</div>
              <div className="text-xs text-muted-foreground">Colors, typography, borders</div>
            </div>
            <div className="p-2 bg-muted/20" style={{ borderRadius: 'var(--radius)' }}>
              <div className="text-xs" style={{ fontWeight: 'var(--font-weight-medium)' }}>Layout</div>
              <div className="text-xs text-muted-foreground">Size, alignment</div>
            </div>
            <div className="p-2 bg-muted/20" style={{ borderRadius: 'var(--radius)' }}>
              <div className="text-xs" style={{ fontWeight: 'var(--font-weight-medium)' }}>Spacing</div>
              <div className="text-xs text-muted-foreground">Padding, margin, gaps</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-muted-foreground">Marker Colors</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 bg-card border border-border" style={{ borderRadius: 'var(--radius)' }}>
              <div className="w-5 h-5 border border-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: 'rgba(181, 9, 9, 1.00)' }}>
                <span className="text-white" style={{ fontSize: '10px', fontWeight: 'var(--font-weight-medium)' }}>#</span>
              </div>
              <div className="flex-1">
                <div style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>Red Markers</div>
                <div className="text-xs text-muted-foreground">High priority issues</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-card border border-border" style={{ borderRadius: 'var(--radius)' }}>
              <div className="w-5 h-5 border border-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: 'rgba(189, 87, 39, 1.00)' }}>
                <span className="text-white" style={{ fontSize: '10px', fontWeight: 'var(--font-weight-medium)' }}>#</span>
              </div>
              <div className="flex-1">
                <div style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>Orange Markers</div>
                <div className="text-xs text-muted-foreground">Medium priority issues</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-card border border-border" style={{ borderRadius: 'var(--radius)' }}>
              <div className="w-5 h-5 border border-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: 'rgba(117, 117, 117, 1.00)' }}>
                <span className="text-white" style={{ fontSize: '10px', fontWeight: 'var(--font-weight-medium)' }}>#</span>
              </div>
              <div className="flex-1">
                <div style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>Gray Markers</div>
                <div className="text-xs text-muted-foreground">Low priority issues</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-accent/10 border border-accent/30 p-3" style={{ borderRadius: 'var(--radius)' }}>
          <h4 className="mb-2">How to Use</h4>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Load Figma design via URL or file upload, and production screenshot</li>
            <li>Optional: Click "Select Area to Scan" and drag to focus on specific regions</li>
            <li>Choose Quick Scan or Deep Analysis depth</li>
            <li>Click "Analyze" to detect issues</li>
            <li>Review color-coded numbered markers on images</li>
            <li>Hover markers for detailed tooltips with values</li>
            <li>Switch between Insights, All Issues, and Spacing views</li>
            <li>Filter by category or severity as needed</li>
            <li>Export detailed JSON report for your development team</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
