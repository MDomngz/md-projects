import { Info, ExternalLink } from "lucide-react";

export function FigmaApiNotice() {
  return (
    <div className="bg-accent/10 border border-accent/30 p-3 space-y-2" style={{ borderRadius: 'var(--radius)' }}>
      <div className="flex items-start gap-2">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-accent" />
        <div className="flex-1">
          <h4 className="mb-1" style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-medium)' }}>
            Figma URL Integration
          </h4>
          <p className="text-xs text-muted-foreground mb-2">
            To enable direct Figma URL loading in production, you'll need:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside ml-2">
            <li>A Figma API access token (Personal or OAuth)</li>
            <li>Server-side endpoint to handle Figma API requests</li>
            <li>Proper CORS configuration for image loading</li>
          </ul>
          <a
            href="https://www.figma.com/developers/api"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-2"
          >
            <span>Learn more about Figma API</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
