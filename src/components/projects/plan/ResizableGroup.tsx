import { memo } from "react";
import {
  useReactFlow,
  Handle,
  Position,
  NodeResizer,
  type NodeProps,
} from "reactflow";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react";

const ResizableNode = ({ selected, id }: NodeProps) => {
  const rf = useReactFlow();

  const deleteNode = () => {
    const node = rf.getNode(id);
    if (node) {
      rf.deleteElements({ nodes: [node] });
    }
  };

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
        {selected ? (
          <Button
            variant="destructive"
            className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0"
            onClick={deleteNode}
          >
            <X className="h-3 w-3" />
          </Button>
        ) : null}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export default memo(ResizableNode);
