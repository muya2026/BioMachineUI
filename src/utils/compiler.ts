/**
 * Graph Compiler for BioMachineUI
 * Transforms node graph topology into Tailwind CSS HTML
 */

import { NodeObject, LinkObject } from '3d-force-graph';

export interface BioNode extends NodeObject {
  id: string;
  type: 'nucleus' | 'receptor' | 'synapse' | 'membrane';
  label: string;
  data?: {
    className?: string;
    content?: string;
    attributes?: Record<string, string>;
  };
}

export interface BioLink extends LinkObject {
  source: string | BioNode;
  target: string | BioNode;
}

export interface GraphData {
  nodes: BioNode[];
  links: BioLink[];
}

/**
 * Compile a node to its HTML/Tailwind representation
 */
function compileNode(node: BioNode): string {
  const { type, label, data } = node;
  
  switch (type) {
    case 'nucleus':
      // Root wrapper with theme classes
      return `<div class="${data?.className || 'min-h-screen bg-bio-dark text-white p-8'}">\n  <!-- Nucleus: ${label} -->\n  $CONTENT$\n</div>`;
    
    case 'membrane':
      // Container/Flexbox wrapper
      return `<div class="${data?.className || 'flex flex-col gap-4 p-6 border border-bio-violet/30 rounded-lg bg-bio-darker/50'}">\n  $CONTENT$\n</div>`;
    
    case 'receptor':
      // Form inputs and buttons
      const inputType = data?.attributes?.type || 'text';
      return `<input \n    type="${inputType}" \n    class="${data?.className || 'px-4 py-2 bg-bio-darker border border-bio-green/50 rounded text-white focus:outline-none focus:border-bio-green'}"\n    placeholder="${data?.content || label}"\n  />`;
    
    case 'synapse':
      // Interactive triggers/buttons
      return `<button \n    class="${data?.className || 'px-6 py-3 bg-gradient-to-r from-bio-green to-bio-cyan text-bio-darker font-bold rounded hover:shadow-lg hover:shadow-bio-green/50 transition-all'}"\n  >\n    ${data?.content || label}\n  </button>`;
    
    default:
      return `<!-- Unknown node type: ${type} -->`;
  }
}

/**
 * Traverse the graph and build HTML structure
 * Uses topological sort to determine nesting order
 */
export function compileGraph(graphData: GraphData): string {
  const { nodes, links } = graphData;
  
  if (nodes.length === 0) {
    return '<!-- No nodes in graph -->';
  }

  // Find root node (nucleus or node with no incoming edges)
  const incomingEdges = new Map<string, number>();
  const adjacencyList = new Map<string, string[]>();
  
  // Initialize
  nodes.forEach(node => {
    incomingEdges.set(node.id, 0);
    adjacencyList.set(node.id, []);
  });
  
  // Build adjacency list and count incoming edges
  links.forEach(link => {
    const sourceId = typeof link.source === 'string' ? link.source : (link.source as BioNode).id;
    const targetId = typeof link.target === 'string' ? link.target : (link.target as BioNode).id;
    
    const current = incomingEdges.get(targetId) || 0;
    incomingEdges.set(targetId, current + 1);
    
    const children = adjacencyList.get(sourceId) || [];
    children.push(targetId);
    adjacencyList.set(sourceId, children);
  });
  
  // Find root (node with no incoming edges, prefer nucleus)
  let rootId = nodes.find(n => (incomingEdges.get(n.id) || 0) === 0 && n.type === 'nucleus')?.id;
  
  if (!rootId) {
    rootId = nodes.find(n => (incomingEdges.get(n.id) || 0) === 0)?.id || nodes[0].id;
  }
  
  // Build HTML recursively
  function buildHTML(nodeId: string, indent: number = 0): string {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return '';
    
    const indentStr = '  '.repeat(indent);
    const children = adjacencyList.get(nodeId) || [];
    
    let html = compileNode(node);
    
    if (children.length > 0 && (node.type === 'nucleus' || node.type === 'membrane')) {
      // Replace $CONTENT$ placeholder with children
      const childrenHtml = children.map(childId => 
        `${indentStr}  ${buildHTML(childId, indent + 1)}`
      ).join('\n');
      
      html = html.replace('$CONTENT$', `\n${childrenHtml}\n${indentStr}`);
    } else {
      html = html.replace('$CONTENT$', '');
    }
    
    return html;
  }
  
  const result = buildHTML(rootId);
  return result || '<!-- Failed to compile graph -->';
}

/**
 * Validate graph structure
 */
export function validateGraph(graphData: GraphData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for at least one nucleus node
  const hasNucleus = graphData.nodes.some(n => n.type === 'nucleus');
  if (!hasNucleus && graphData.nodes.length > 0) {
    errors.push('Graph should contain at least one Nucleus node as root');
  }
  
  // Check for orphaned nodes (no connections)
  const connectedNodes = new Set<string>();
  graphData.links.forEach(link => {
    const sourceId = typeof link.source === 'string' ? link.source : (link.source as BioNode).id;
    const targetId = typeof link.target === 'string' ? link.target : (link.target as BioNode).id;
    connectedNodes.add(sourceId);
    connectedNodes.add(targetId);
  });
  
  graphData.nodes.forEach(node => {
    if (!connectedNodes.has(node.id)) {
      errors.push(`Node "${node.label}" (${node.id}) is not connected`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}
