import { useRef, useEffect, useState } from 'react';
import ForceGraph3D from '3d-force-graph';
import { BioNode, GraphData } from '../utils/compiler';
import { soundEngine } from '../utils/soundEngine';

interface BioCanvasProps {
  graphData: GraphData;
  onGraphChange: (data: GraphData) => void;
  onNodeSelect: (node: BioNode | null) => void;
  selectedNodeId: string | null;
}

/**
 * 3D Force-Directed Canvas Component
 * Renders biological organelle nodes that drift and react to physics
 */
export const BioCanvas: React.FC<BioCanvasProps> = ({
  graphData,
  onGraphChange,
  onNodeSelect,
  selectedNodeId,
}) => {
  const fgRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Node colors based on type
  const nodeColors: Record<string, string> = {
    nucleus: '#00FF88',    // Green
    membrane: '#8B00FF',   // Violet
    receptor: '#00FFFF',   // Cyan
    synapse: '#FF00FF',    // Magenta
  };

  // Handle window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize and update the force graph
  useEffect(() => {
    if (!containerRef.current || !graphData) return;

    // Create or update the graph instance
    if (!fgRef.current) {
      fgRef.current = ForceGraph3D()(containerRef.current as HTMLElement)
        .graphData(graphData)
        .nodeLabel('label')
        .nodeColor((node: BioNode) => nodeColors[node.type] || '#ffffff')
        .nodeVal(15)
        .linkColor(() => '#00FF8840')
        .linkWidth(2)
        .backgroundColor('transparent')
        .showNavInfo(false)
        .onNodeClick((node: BioNode) => {
          onNodeSelect(node);
          soundEngine.playHover(1000);
        })
        .onNodeDragEnd((node: BioNode) => {
          // Update node position in graph data
          node.fx = node.x;
          node.fy = node.y;
          node.fz = node.z;
          onGraphChange(graphData);
        })
        .onBackgroundClick(() => {
          onNodeSelect(null);
        });

      // Add particle impulse animation on links
      fgRef.current
        .linkDirectionalParticles(2)
        .linkDirectionalParticleSpeed(0.005)
        .linkDirectionalParticleWidth(3)
        .linkDirectionalParticleColor(() => '#00FF88');
    } else {
      // Update existing graph with new data
      fgRef.current.graphData(graphData);
    }

    // Auto-fit view
    fgRef.current.zoomToFit(1000);

  }, [graphData, onGraphChange, onNodeSelect]);

  // Update node highlighting based on selection
  useEffect(() => {
    if (fgRef.current && graphData) {
      fgRef.current
        .nodeColor((node: BioNode) => 
          node.id === selectedNodeId 
            ? '#FFFFFF' 
            : nodeColors[node.type] || '#ffffff'
        )
        .nodeVal((node: BioNode) => 
          node.id === selectedNodeId ? 20 : 15
        );
    }
  }, [selectedNodeId, graphData]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative"
      id="bio-canvas-container"
      onMouseEnter={() => soundEngine.playHover()}
    >
      {/* Overlay info */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h2 className="text-lg font-bold text-bio-green neon-text">
          BIOLOGICAL CANVAS
        </h2>
        <p className="text-xs text-bio-cyan/70">
          {graphData.nodes.length} organelles • {graphData.links.length} synapses
        </p>
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none text-xs text-gray-400">
        <p>• Drag nodes to reposition</p>
        <p>• Click to select</p>
        <p>• Scroll to zoom</p>
      </div>
    </div>
  );
};
