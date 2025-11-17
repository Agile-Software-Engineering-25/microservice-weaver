import { useCallback, useEffect, useState, useMemo } from 'react';
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
import CustomServiceNode from '@/components/CustomServiceNode';
import { createNodesAndEdges } from '@/utils/flowUtils';
import { getLayoutedElements } from '@/utils/layoutUtils';

interface ServiceFlowCanvasProps {
  services: Service[];
}

const ServiceFlowCanvas = ({ services }: ServiceFlowCanvasProps) => {
  const nodeTypes = useMemo(() => ({ custom: CustomServiceNode }), []);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (services.length > 0) {
      const { nodes: initialNodes, edges: initialEdges } = createNodesAndEdges(services);
      
      // Only apply dagre layout if no positions are predefined
      const hasPositions = services.some(s => s.position);
      if (hasPositions) {
        setNodes(initialNodes);
        setEdges(initialEdges);
      } else {
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
          initialNodes,
          initialEdges
        );
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      }
    }
  }, [services, setNodes, setEdges]);

  const handleNodesChange = useCallback((changes: any) => {
    onNodesChange(changes);
    
    // Check if any change is a position change (drag end)
    const hasPositionChange = changes.some((change: any) => 
      change.type === 'position' && change.dragging === false
    );
    
    if (hasPositionChange) {
      // Get current nodes after the change
      setNodes((currentNodes) => {
        // Create updated services JSON with new positions
        const updatedServices = services.map(service => {
          const nodeId = `${service.team}-${service.type || 'null'}`;
          const node = currentNodes.find(n => n.id === nodeId);
          
          if (node) {
            return {
              ...service,
              position: {
                x: Math.round(node.position.x),
                y: Math.round(node.position.y)
              }
            };
          }
          return service;
        });
        
        console.log('Updated Services JSON with positions:');
        console.log(JSON.stringify(updatedServices, null, 2));
        
        return currentNodes;
      });
    }
  }, [onNodesChange, services, setNodes]);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
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
