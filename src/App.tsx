import { useState, useEffect } from 'react';
import { BiometricIntro } from './components/BiometricIntro';
import { BioCanvas } from './components/BioCanvas';
import { OrganellePalette, NodeType } from './components/OrganellePalette';
import { CodeCompiler } from './components/CodeCompiler';
import { BioNode, GraphData } from './utils/compiler';
import { soundEngine } from './utils/soundEngine';
import { Trash2 } from 'lucide-react';

/**
 * Main App Component for BioMachineUI
 * Orchestrates the neural interface experience
 */
function App() {
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState<BioNode | null>(null);
  const [nodeCounter, setNodeCounter] = useState(0);

  /**
   * Add a new node to the graph
   */
  const handleAddNode = (type: NodeType) => {
    const newNode: BioNode = {
      id: `node-${Date.now()}`,
      type,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodeCounter + 1}`,
      data: {
        className: '',
        content: '',
      },
      // Random position near center
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 200,
      z: (Math.random() - 0.5) * 200,
    };

    setGraphData(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }));

    setNodeCounter(prev => prev + 1);
    soundEngine.playSuccess();
  };

  /**
   * Update a node's properties
   */
  const handleUpdateNode = (nodeId: string, updates: Partial<BioNode>) => {
    setGraphData(prev => ({
      ...prev,
      nodes: prev.nodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    }));

    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  /**
   * Delete selected node
   */
  const handleDeleteNode = () => {
    if (!selectedNode) return;

    setGraphData(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== selectedNode.id),
      links: prev.links.filter(
        l =>
          (typeof l.source === 'string' ? l.source : (l.source as BioNode).id) !==
            selectedNode.id &&
          (typeof l.target === 'string' ? l.target : (l.target as BioNode).id) !==
            selectedNode.id
      ),
    }));

    setSelectedNode(null);
    soundEngine.playHover();
  };

  /**
   * Handle canvas click to potentially create links
   */
  const handleGraphChange = (newData: GraphData) => {
    setGraphData(newData);
  };

  /**
   * Initialize sound engine on first user interaction after calibration
   */
  useEffect(() => {
    if (isCalibrated && !soundEngine.getInitialized()) {
      soundEngine.initialize();
    }
  }, [isCalibrated]);

  // Show calibration intro
  if (!isCalibrated) {
    return <BiometricIntro onComplete={() => setIsCalibrated(true)} />;
  }

  return (
    <div className="flex h-screen w-screen bg-bio-darker overflow-hidden">
      {/* Left side: Palette + Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-14 border-b border-bio-violet/20 bg-bio-dark/80 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-bio-green to-bio-violet flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <h1 className="text-lg font-bold text-white">
              BioMachine<span className="text-bio-green">UI</span>
            </h1>
          </div>

          {/* Node actions */}
          <div className="flex items-center gap-2">
            {selectedNode && (
              <>
                <span className="text-xs text-gray-400 mr-2">
                  Selected: {selectedNode.label}
                </span>
                <button
                  onClick={handleDeleteNode}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded text-xs transition-colors"
                  onMouseEnter={() => soundEngine.playHover()}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            )}
          </div>
        </header>

        {/* Main canvas area */}
        <div className="flex-1 flex">
          {/* Organelle palette sidebar */}
          <OrganellePalette onNodeAdd={handleAddNode} />

          {/* 3D Canvas */}
          <div className="flex-1 relative">
            <BioCanvas
              graphData={graphData}
              onGraphChange={handleGraphChange}
              onNodeSelect={setSelectedNode}
              selectedNodeId={selectedNode?.id || null}
            />
          </div>
        </div>
      </div>

      {/* Right side: Code Compiler */}
      <div className="w-[45%] min-w-[400px]">
        <CodeCompiler
          graphData={graphData}
          selectedNode={selectedNode}
          onNodeUpdate={handleUpdateNode}
        />
      </div>
    </div>
  );
}

export default App;
