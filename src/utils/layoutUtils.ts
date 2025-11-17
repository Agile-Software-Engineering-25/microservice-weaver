import dagre from 'dagre';
import { Node, Edge } from 'reactflow';

const nodeWidth = 220;
const nodeHeight = 80;

export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'LR', ranksep: 150, nodesep: 50 });

  nodes.forEach((node) => {
    // Assign rank based on type to cluster similar services together
    const rank = node.data.type === 'frontend' ? '0' : node.data.type === 'backend' ? '1' : '2';
    dagreGraph.setNode(node.id, { 
      width: nodeWidth, 
      height: nodeHeight,
      rank
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};
