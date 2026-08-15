import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Code, Eye, AlertTriangle } from 'lucide-react';
import { BioNode, GraphData, compileGraph, validateGraph } from '../utils/compiler';
import { soundEngine } from '../utils/soundEngine';

interface CodeCompilerProps {
  graphData: GraphData;
  selectedNode: BioNode | null;
  onNodeUpdate: (nodeId: string, updates: Partial<BioNode>) => void;
}

export type ViewMode = 'code' | 'preview';

/**
 * Code Compiler Component
 * Displays Monaco editor with compiled Tailwind HTML and live preview
 */
export const CodeCompiler: React.FC<CodeCompilerProps> = ({
  graphData,
  selectedNode,
  onNodeUpdate,
}) => {
  const [compiledCode, setCompiledCode] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('code');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);

  // Compile graph whenever it changes
  useEffect(() => {
    const validation = validateGraph(graphData);
    setIsValid(validation.valid);
    setValidationErrors(validation.errors);

    if (validation.valid) {
      const code = compileGraph(graphData);
      setCompiledCode(code);
      
      if (graphData.nodes.length > 0) {
        soundEngine.playSuccess();
      }
    } else {
      setValidationErrors(validation.errors);
      soundEngine.playError();
    }
  }, [graphData]);

  /**
   * Render live preview in iframe
   */
  const renderPreview = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            :root {
              --bio-green: #00FF88;
              --bio-violet: #8B00FF;
              --bio-cyan: #00FFFF;
              --bio-dark: #0A0A0F;
              --bio-darker: #050508;
            }
            body { 
              background-color: var(--bio-darker);
              color: white;
            }
          </style>
        </head>
        <body>
          ${compiledCode}
        </body>
      </html>
    `;

    return (
      <iframe
        srcDoc={htmlContent}
        className="w-full h-full bg-bio-darker"
        title="Live Preview"
        sandbox="allow-scripts"
      />
    );
  };

  return (
    <div className="flex flex-col h-full bg-bio-dark border-l border-bio-violet/20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-bio-violet/20">
        <h3 className="text-sm font-bold text-bio-green uppercase tracking-wider">
          Live Compiler
        </h3>

        {/* View mode toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              setViewMode('code');
              soundEngine.playHover();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              viewMode === 'code'
                ? 'bg-bio-green text-bio-darker'
                : 'bg-bio-darker text-gray-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            CODE
          </button>
          <button
            onClick={() => {
              setViewMode('preview');
              soundEngine.playHover();
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              viewMode === 'preview'
                ? 'bg-bio-cyan text-bio-darker'
                : 'bg-bio-darker text-gray-400 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            PREVIEW
          </button>
        </div>
      </div>

      {/* Validation warnings */}
      {!isValid && validationErrors.length > 0 && (
        <div className="mx-4 mt-3 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2 text-red-400 text-xs mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-semibold">Compilation Warnings</span>
          </div>
          <ul className="text-xs text-red-300/80 list-disc list-inside space-y-1">
            {validationErrors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'code' ? (
          <Editor
            height="100%"
            defaultLanguage="html"
            value={compiledCode}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
            }}
          />
        ) : (
          renderPreview()
        )}
      </div>

      {/* Selected node editor */}
      {selectedNode && (
        <div className="p-4 border-t border-bio-violet/20 bg-bio-darker/50">
          <h4 className="text-xs font-bold text-bio-cyan mb-3">
            Edit Node: {selectedNode.label}
          </h4>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Label</label>
              <input
                type="text"
                value={selectedNode.label}
                onChange={(e) =>
                  onNodeUpdate(selectedNode.id, { label: e.target.value })
                }
                className="w-full px-3 py-2 bg-bio-dark border border-bio-violet/30 rounded text-white text-sm focus:outline-none focus:border-bio-green"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">
                CSS Classes
              </label>
              <input
                type="text"
                value={selectedNode.data?.className || ''}
                onChange={(e) =>
                  onNodeUpdate(selectedNode.id, {
                    data: { ...selectedNode.data, className: e.target.value },
                  })
                }
                className="w-full px-3 py-2 bg-bio-dark border border-bio-violet/30 rounded text-white text-sm focus:outline-none focus:border-bio-green font-mono"
                placeholder="Tailwind classes..."
              />
            </div>

            {(selectedNode.type === 'receptor' || selectedNode.type === 'synapse') && (
              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Content / Placeholder
                </label>
                <input
                  type="text"
                  value={selectedNode.data?.content || ''}
                  onChange={(e) =>
                    onNodeUpdate(selectedNode.id, {
                      data: { ...selectedNode.data, content: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-bio-dark border border-bio-violet/30 rounded text-white text-sm focus:outline-none focus:border-bio-green"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer stats */}
      <div className="px-4 py-2 border-t border-bio-violet/20 bg-bio-darker/30">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{graphData.nodes.length} nodes</span>
          <span>{graphData.links.length} connections</span>
          <span className={isValid ? 'text-bio-green' : 'text-red-400'}>
            {isValid ? '✓ Valid' : '⚠ Invalid'}
          </span>
        </div>
      </div>
    </div>
  );
};
