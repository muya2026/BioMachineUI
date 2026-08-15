import React from 'react';
import { Dna, Square, Zap, Box } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

export type NodeType = 'nucleus' | 'membrane' | 'receptor' | 'synapse';

interface OrganellePaletteProps {
  onNodeAdd: (type: NodeType) => void;
}

/**
 * Organelle Palette Component
 * Sidebar for selecting and adding biological node types
 */
export const OrganellePalette: React.FC<OrganellePaletteProps> = ({ onNodeAdd }) => {
  const nodeTypes: Array<{
    type: NodeType;
    label: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      type: 'nucleus',
      label: 'Nucleus',
      description: 'Global theme & state root',
      icon: <Dna className="w-6 h-6" />,
      color: 'text-bio-green',
    },
    {
      type: 'membrane',
      label: 'Membrane',
      description: 'Container / Flexbox wrapper',
      icon: <Box className="w-6 h-6" />,
      color: 'text-bio-violet',
    },
    {
      type: 'receptor',
      label: 'Receptor',
      description: 'Forms & input components',
      icon: <Square className="w-6 h-6" />,
      color: 'text-bio-cyan',
    },
    {
      type: 'synapse',
      label: 'Synapse',
      description: 'State triggers & actions',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-pink-500',
    },
  ];

  return (
    <div className="w-64 bg-bio-darker/90 border-r border-bio-violet/20 p-4 flex flex-col gap-3">
      <h3 className="text-sm font-bold text-bio-green uppercase tracking-wider mb-2">
        Organelle Palette
      </h3>

      {nodeTypes.map((nodeType) => (
        <button
          key={nodeType.type}
          onClick={() => {
            onNodeAdd(nodeType.type);
            soundEngine.playHover(1200);
          }}
          onMouseEnter={() => soundEngine.playHover()}
          className={`group flex items-start gap-3 p-3 rounded-lg border border-bio-violet/20 hover:border-${nodeType.color.split('-')[1]}-500/50 bg-bio-dark/50 hover:bg-bio-dark transition-all text-left`}
        >
          {/* Icon */}
          <div className={`${nodeType.color} group-hover:scale-110 transition-transform`}>
            {nodeType.icon}
          </div>

          {/* Content */}
          <div className="flex-1">
            <h4 className={`text-sm font-semibold ${nodeType.color}`}>
              {nodeType.label}
            </h4>
            <p className="text-xs text-gray-400 mt-1">
              {nodeType.description}
            </p>
          </div>

          {/* Add indicator */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className={`w-2 h-2 rounded-full bg-current ${nodeType.color}`} />
          </div>
        </button>
      ))}

      {/* Info footer */}
      <div className="mt-auto pt-4 border-t border-bio-violet/20">
        <p className="text-xs text-gray-500">
          Click to add nodes to the canvas
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Drag to connect organelles
        </p>
      </div>
    </div>
  );
};
