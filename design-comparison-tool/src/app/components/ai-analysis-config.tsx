import { useState } from "react";
import { Sparkles, Key, AlertCircle, Eye, CheckCircle2 } from "lucide-react";

interface AIAnalysisConfigProps {
  onAnalyze: (apiKey: string, provider: 'openai' | 'anthropic') => void;
  isAnalyzing: boolean;
  hasImages: boolean;
}

export function AIAnalysisConfig({ onAnalyze, isAnalyzing, hasImages }: AIAnalysisConfigProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'openai' | 'anthropic'>('openai');
  const [saveKey, setSaveKey] = useState(false);

  const handleAnalyze = () => {
    if (!apiKey.trim() && !isStoredKey()) {
      setShowConfig(true);
      return;
    }

    const keyToUse = apiKey.trim() || getStoredKey() || '';
    
    if (saveKey && apiKey.trim()) {
      localStorage.setItem('ai_vision_api_key', apiKey.trim());
      localStorage.setItem('ai_vision_provider', provider);
    }

    onAnalyze(keyToUse, provider);
  };

  const isStoredKey = () => {
    return !!localStorage.getItem('ai_vision_api_key');
  };

  const getStoredKey = () => {
    return localStorage.getItem('ai_vision_api_key');
  };

  const clearStoredKey = () => {
    localStorage.removeItem('ai_vision_api_key');
    localStorage.removeItem('ai_vision_provider');
    setApiKey('');
  };

  return (
    <div className="space-y-3">
      <label className="block flex items-center gap-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>
        <Sparkles className="w-4 h-4 text-primary" />
        AI Vision Analysis
      </label>

      {!showConfig ? (
        <div className="space-y-2">
          <button
            onClick={handleAnalyze}
            disabled={!hasImages || isAnalyzing}
            className="w-full px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ borderRadius: 'var(--radius-button)' }}
            title={!hasImages ? 'Upload images first' : 'Analyze with AI'}
          >
            <Eye className="w-4 h-4" />
            {isAnalyzing ? 'Analyzing with AI...' : 'Auto-Detect Differences'}
          </button>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="w-full px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2 text-xs"
            style={{ borderRadius: 'var(--radius-button)' }}
          >
            <Key className="w-3 h-3" />
            {isStoredKey() ? 'Change API Settings' : 'Configure API Key'}
          </button>

          {isStoredKey() && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/10 p-2" style={{ borderRadius: 'var(--radius)' }}>
              <CheckCircle2 className="w-3 h-3 text-primary" />
              <span>API key saved</span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-muted/10 border border-border p-4 space-y-3" style={{ borderRadius: 'var(--radius-card)' }}>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p style={{ fontWeight: 'var(--font-weight-medium)' }} className="mb-1">AI-Powered Analysis</p>
              <p>Uses GPT-4 Vision or Claude Vision to automatically detect visual differences between your images.</p>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-xs" style={{ fontWeight: 'var(--font-weight-medium)' }}>
              AI Provider
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setProvider('openai')}
                className={`px-3 py-2 border transition-colors text-xs ${
                  provider === 'openai'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'
                }`}
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                OpenAI GPT-4V
              </button>
              <button
                onClick={() => setProvider('anthropic')}
                className={`px-3 py-2 border transition-colors text-xs ${
                  provider === 'anthropic'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary text-secondary-foreground border-border hover:bg-secondary/80'
                }`}
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                Claude 3.5
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-xs" style={{ fontWeight: 'var(--font-weight-medium)' }}>
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={isStoredKey() ? '••••••••••••••••' : `Enter ${provider === 'openai' ? 'OpenAI' : 'Anthropic'} API key`}
              className="w-full px-3 py-2 bg-input-background border border-border text-xs"
              style={{ borderRadius: 'var(--radius)' }}
            />
            <a
              href={provider === 'openai' ? 'https://platform.openai.com/api-keys' : 'https://console.anthropic.com/settings/keys'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline mt-1 inline-block"
            >
              Get API key from {provider === 'openai' ? 'OpenAI' : 'Anthropic'} →
            </a>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="save-key"
              checked={saveKey}
              onChange={(e) => setSaveKey(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="save-key" className="text-xs text-muted-foreground">
              Save API key locally (stored in browser)
            </label>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShowConfig(false)}
              className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-xs"
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Cancel
            </button>
            {isStoredKey() && (
              <button
                onClick={clearStoredKey}
                className="flex-1 px-3 py-2 bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20 transition-colors text-xs"
                style={{ borderRadius: 'var(--radius-button)' }}
              >
                Clear Saved
              </button>
            )}
            <button
              onClick={() => {
                handleAnalyze();
                setShowConfig(false);
              }}
              disabled={!apiKey.trim() && !isStoredKey()}
              className="flex-1 px-3 py-2 bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Analyze
            </button>
          </div>
        </div>
      )}

      <div className="bg-accent/10 border border-accent/30 p-3 space-y-1 text-xs text-muted-foreground" style={{ borderRadius: 'var(--radius)' }}>
        <p style={{ fontWeight: 'var(--font-weight-medium)' }}>How it works:</p>
        <ul className="space-y-1 ml-4 list-disc">
          <li>Sends both images to AI for analysis</li>
          <li>AI detects visual differences automatically</li>
          <li>Returns discrepancies with locations & severity</li>
          <li>API key is never sent to our servers</li>
        </ul>
      </div>

      <div className="bg-destructive/10 border border-destructive/30 p-3 space-y-2 text-xs" style={{ borderRadius: 'var(--radius)' }}>
        <p style={{ fontWeight: 'var(--font-weight-medium)' }} className="text-destructive">⚠️ CORS Limitation</p>
        <p className="text-muted-foreground">
          Browser security prevents direct API calls from frontend apps. To use AI analysis, you need:
        </p>
        <ol className="ml-4 list-decimal space-y-1 text-muted-foreground">
          <li>A backend server that proxies API requests</li>
          <li>A browser extension that disables CORS (dev only)</li>
          <li>Use manual markers + JSON import from your own scripts</li>
        </ol>
        <details className="mt-2">
          <summary className="cursor-pointer hover:text-foreground transition-colors" style={{ fontWeight: 'var(--font-weight-medium)' }}>
            Show CORS proxy example
          </summary>
          <div className="mt-2 p-2 bg-background/50 font-mono text-xs overflow-x-auto" style={{ borderRadius: 'var(--radius)' }}>
            <pre className="text-muted-foreground">{`// Example Node.js proxy
app.post('/api/ai-analyze', async (req, res) => {
  const response = await fetch(
    'https://api.openai.com/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${API_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    }
  );
  const data = await response.json();
  res.json(data);
});`}</pre>
          </div>
        </details>
      </div>
    </div>
  );
}