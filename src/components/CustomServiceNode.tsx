import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface ServiceNodeData {
  team: number;
  repository: string;
  type: string;
}

const CustomServiceNode = ({ data }: NodeProps<ServiceNodeData>) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="text-center">
        <div className="font-semibold text-sm">Team {data.team}</div>
        <div className="text-xs opacity-80 mt-1">{data.repository}</div>
        <div className="text-xs opacity-60 mt-1 capitalize">{data.type}</div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default memo(CustomServiceNode);
