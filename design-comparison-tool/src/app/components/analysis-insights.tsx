import { TrendingUp, AlertTriangle, CheckCircle2, Target } from "lucide-react";
import type { Discrepancy } from "./design-comparison";

interface AnalysisInsightsProps {
  discrepancies: Discrepancy[];
}

export function AnalysisInsights({ discrepancies }: AnalysisInsightsProps) {
  const highCount = discrepancies.filter(d => d.severity === 'high').length;
  const mediumCount = discrepancies.filter(d => d.severity === 'medium').length;
  const lowCount = discrepancies.filter(d => d.severity === 'low').length;

  // Analyze patterns
  const contentIssues = discrepancies.filter(d =>
    ['missing', 'content', 'formatting'].includes(d.type)
  ).length;

  const spacingIssues = discrepancies.filter(d =>
    ['padding', 'margin', 'spacing', 'line-height', 'space-after'].includes(d.type)
  ).length;

  const visualIssues = discrepancies.filter(d =>
    ['color', 'typography', 'border'].includes(d.type)
  ).length;

  const layoutIssues = discrepancies.filter(d =>
    ['size', 'alignment'].includes(d.type)
  ).length;

  // Calculate scores
  const totalPossibleScore = 100;
  const deductions = (highCount * 10) + (mediumCount * 5) + (lowCount * 2);
  const accuracyScore = Math.max(0, totalPossibleScore - deductions);

  // Get primary concern
  const getPrimaryConcern = () => {
    const concerns = [
      { label: 'Content & Formatting', count: contentIssues, color: 'rgba(181, 9, 9, 1.00)' },
      { label: 'Spacing & Rhythm', count: spacingIssues, color: 'rgba(77, 128, 85, 1.00)' },
      { label: 'Visual Consistency', count: visualIssues, color: 'rgba(63, 87, 166, 1.00)' },
      { label: 'Layout Structure', count: layoutIssues, color: 'rgba(142, 112, 79, 1.00)' }
    ];

    return concerns.sort((a, b) => b.count - a.count)[0];
  };

  const primaryConcern = getPrimaryConcern();

  // Get recommendations
  const getRecommendations = () => {
    const recommendations = [];

    if (highCount > 0) {
      recommendations.push({
        priority: 'high',
        text: `Address ${highCount} critical issue${highCount > 1 ? 's' : ''} first - these significantly impact user experience`
      });
    }

    const missingCount = discrepancies.filter(d => d.type === 'missing').length;
    if (missingCount >= 3) {
      recommendations.push({
        priority: 'high',
        text: `${missingCount} missing elements detected - verify component rendering and data binding`
      });
    }

    const formattingCount = discrepancies.filter(d => d.type === 'formatting').length;
    if (formattingCount >= 2) {
      recommendations.push({
        priority: 'medium',
        text: 'Review data formatting logic - phone numbers, dates, and currency need standardization'
      });
    }

    const contentCount = discrepancies.filter(d => d.type === 'content').length;
    if (contentCount >= 2) {
      recommendations.push({
        priority: 'medium',
        text: 'Content discrepancies found - verify copy matches latest design specifications'
      });
    }

    if (spacingIssues >= 5) {
      recommendations.push({
        priority: 'medium',
        text: 'Review spacing system implementation - consider using CSS variables consistently'
      });
    }

    if (visualIssues >= 3) {
      recommendations.push({
        priority: 'medium',
        text: 'Audit design tokens and ensure proper mapping to CSS custom properties'
      });
    }

    if (discrepancies.filter(d => d.type === 'typography').length >= 2) {
      recommendations.push({
        priority: 'low',
        text: 'Verify font loading and typography scale matches design system'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'low',
        text: 'Implementation quality is good - review remaining minor discrepancies'
      });
    }

    return recommendations.slice(0, 5); // Limit to 5 recommendations
  };

  const recommendations = getRecommendations();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h3>Analysis Insights</h3>
      </div>

      {/* Accuracy Score */}
      <div className="bg-card border border-border p-4" style={{ borderRadius: 'var(--radius-card)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4>Implementation Accuracy</h4>
            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
              Based on {discrepancies.length} detected discrepanc{discrepancies.length === 1 ? 'y' : 'ies'}
            </p>
          </div>
          <div className="text-center">
            <div
              className="mb-1"
              style={{
                fontSize: '32px',
                fontWeight: 'var(--font-weight-medium)',
                color: accuracyScore >= 80 ? 'rgba(77, 128, 85, 1.00)' :
                       accuracyScore >= 60 ? 'rgba(189, 87, 39, 1.00)' :
                       'rgba(181, 9, 9, 1.00)'
              }}
            >
              {accuracyScore}%
            </div>
            <div className="text-xs text-muted-foreground">Score</div>
          </div>
        </div>

        {/* Score bar */}
        <div className="w-full bg-muted h-2 overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${accuracyScore}%`,
              backgroundColor: accuracyScore >= 80 ? 'rgba(77, 128, 85, 1.00)' :
                             accuracyScore >= 60 ? 'rgba(189, 87, 39, 1.00)' :
                             'rgba(181, 9, 9, 1.00)',
              borderRadius: 'var(--radius)'
            }}
          />
        </div>
      </div>

      {/* Issue Breakdown */}
      <div className="bg-card border border-border p-4" style={{ borderRadius: 'var(--radius-card)' }}>
        <h4 className="mb-3">Issue Breakdown</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ backgroundColor: 'rgba(181, 9, 9, 1.00)', borderRadius: 'var(--radius-tag)' }}></div>
              <span style={{ fontSize: 'var(--text-label)' }}>Content & Formatting</span>
            </div>
            <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>
              {contentIssues}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ backgroundColor: 'rgba(77, 128, 85, 1.00)', borderRadius: 'var(--radius-tag)' }}></div>
              <span style={{ fontSize: 'var(--text-label)' }}>Spacing Issues</span>
            </div>
            <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>
              {spacingIssues}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ backgroundColor: 'rgba(63, 87, 166, 1.00)', borderRadius: 'var(--radius-tag)' }}></div>
              <span style={{ fontSize: 'var(--text-label)' }}>Visual Issues</span>
            </div>
            <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>
              {visualIssues}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3" style={{ backgroundColor: 'rgba(142, 112, 79, 1.00)', borderRadius: 'var(--radius-tag)' }}></div>
              <span style={{ fontSize: 'var(--text-label)' }}>Layout Issues</span>
            </div>
            <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>
              {layoutIssues}
            </span>
          </div>
        </div>
      </div>

      {/* Primary Concern */}
      <div className="bg-muted/20 border border-border p-4" style={{ borderRadius: 'var(--radius-card)' }}>
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 flex-shrink-0" style={{ color: primaryConcern.color }} />
          <div className="flex-1">
            <h4 className="mb-1">Primary Concern</h4>
            <p style={{ fontSize: 'var(--text-label)' }}>
              <span style={{ fontWeight: 'var(--font-weight-medium)', color: primaryConcern.color }}>
                {primaryConcern.label}
              </span>
              {' '}with {primaryConcern.count} issue{primaryConcern.count !== 1 ? 's' : ''} detected
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-card border border-border p-4" style={{ borderRadius: 'var(--radius-card)' }}>
        <h4 className="mb-3">Recommendations</h4>
        <div className="space-y-2">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-2">
              {rec.priority === 'high' ? (
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-destructive" />
              ) : rec.priority === 'medium' ? (
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'rgba(189, 87, 39, 1.00)' }} />
              ) : (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-muted-foreground" />
              )}
              <p style={{ fontSize: 'var(--text-label)' }} className="flex-1">
                {rec.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
