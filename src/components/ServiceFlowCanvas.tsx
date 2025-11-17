import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Service } from '@/types/service';
import { createNodesAndEdges } from '@/utils/flowUtils';
import { getLayoutedElements } from '@/utils/layoutUtils';

interface ServiceFlowCanvasProps {
  services: Service[];
}

const ServiceFlowCanvas = ({ services }: ServiceFlowCanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (services.length > 0) {
      const { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges(services);
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges
      );
      
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [services, setNodes, setEdges]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="hsl(var(--border))" />
        <Controls className="bg-card border-border" />
        <MiniMap 
          nodeColor={(node) => {
            const style = node.style as any;
            return style?.background || 'hsl(var(--muted))';
          }}
          className="bg-card border-border"
        />
      </ReactFlow>
    </div>
  );
};

export default ServiceFlowCanvas;
