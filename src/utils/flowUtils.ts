import {Edge, Node} from 'reactflow';
import {Service} from '@/types/service';

export const createNodesAndEdges = (services: Service[]) => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Create a map for quick lookup of backend services by team
  const backendMap = new Map<number, Service>();
  services.forEach(service => {
    if (service.type === 'backend') {
      backendMap.set(service.team, service);
    }
  });

  // Create nodes for each service
  services.forEach((service) => {
    const nodeColor =
      service.type === 'frontend' ? 'hsl(var(--node-frontend))' :
        service.type === 'backend' ? 'hsl(var(--node-backend))' :
          service.type === "infra" ? 'hsl(var(--node-infra))' :
            'hsl(var(--node-null))';

    nodes.push({
      id: `${service.team}-${service.type || 'null'}`,
      type: 'custom',
      data: {
        team: service.team,
        repository: service.reposiory,
        type: service.type || 'Unknown',
      },
      position: service.position || {x: 0, y: 0}, // Use stored position if available
      style: {
        background: nodeColor,
        color: '#ffffff',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        padding: '12px',
        width: 220,
        fontSize: '12px',
      },
    });

    // Create edges for connections
    service.connetions.forEach((connection, index) => {
      // Find target service - prefer backend if exists, otherwise any service from that team
      const targetBackend = backendMap.get(connection.team);
      const targetService = targetBackend || services.find(s => s.team === connection.team);

      if (targetService) {
        const sourceId = `${service.team}-${service.type || 'null'}`;
        const targetId = `${targetService.team}-${targetService.type || 'null'}`;

        // Filter out edges that point to the same node (self-loops)
        if (sourceId === targetId) {
          return;
        }

        edges.push({
          id: `e${service.team}-${service.type}-${connection.team}-${index}`,
          source: sourceId,
          target: targetId,
          animated: true,
          style: {stroke: 'hsl(var(--primary))', strokeWidth: 2},
        });
      }
    });
  });

  return {nodes, edges};
};
