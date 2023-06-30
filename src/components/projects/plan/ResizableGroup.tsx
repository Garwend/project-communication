import { memo } from "react";
import { Handle, Position, NodeResizer, type NodeProps } from "reactflow";

const ResizableNode = ({ data, selected }: NodeProps) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={100}
        minHeight={30}
      />
      <div>
        <input
          id="text"
          name="text"
          className="nodrag bg-transparent text-4xl text-white outline-none"
          placeholder="nazwa grupy..."
        />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default memo(ResizableNode);
