import {useCallback, useEffect, useMemo, useState} from 'react';
import ReactFlow, {Background, BackgroundVariant, Controls, MiniMap, useEdgesState, useNodesState,} from 'reactflow';
import 'reactflow/dist/style.css';
import {Service} from '@/types/service';
import CustomServiceNode from '@/components/CustomServiceNode';
import {createNodesAndEdges} from '@/utils/flowUtils';
import {getLayoutedElements} from '@/utils/layoutUtils';

interface ServiceFlowCanvasProps {
  services: Service[];
}

const ServiceFlowCanvas = ({services}: ServiceFlowCanvasProps) => {
  const nodeTypes = useMemo(() => ({custom: CustomServiceNode}), []);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (services.length > 0) {
      const {nodes: initialNodes, edges: initialEdges} = createNodesAndEdges(services);

      // Only apply dagre layout if no positions are predefined
      const hasPositions = services.some(s => s.position);
      if (hasPositions) {
        setNodes(initialNodes);
        setEdges(initialEdges);
      } else {
        const {nodes: layoutedNodes, edges: layoutedEdges} = getLayoutedElements(
          initialNodes,
          initialEdges
        );
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
      }
    }
    setSelectedNodeId(null); // Reset selected node when services change
  }, [services, setNodes, setEdges]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: any) => {
    setSelectedNodeId((prevId) => (prevId === node.id ? null : node.id));
  }, []);

  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => {
        const isOutgoing = selectedNodeId && edge.source === selectedNodeId;
        const isIncomming = selectedNodeId && edge.target === selectedNodeId;
        const isConnected = isOutgoing || isIncomming;

        let strokeColor = 'hsl(var(--edges))';
        if (isOutgoing) {
          strokeColor = 'hsl(10, 80%, 60%)'; // Incoming requests in warm orange-red
        } else if (isIncomming) {
          strokeColor = 'hsl(210, 80%, 60%)'; // Outgoing requests in medium sky blue
        } else if (selectedNodeId) {
          // If a node is selected but this edge is not connected to it
          strokeColor = 'hsl(var(--edges))';
        }

        return {
          ...edge,
          animated: isConnected,
          style: {
            ...edge.style,
            strokeWidth: isConnected ? 3 : 1,
            stroke: strokeColor,
            opacity: selectedNodeId && !isConnected ? 0.3 : 1,
          },
        };
      })
    );
  }, [selectedNodeId, setEdges]);

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
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.3}
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="hsl(var(--border))"/>
        <Controls className="bg-card border-border"/>
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
