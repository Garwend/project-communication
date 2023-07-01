import React from "react";
import { Handle, Position } from "reactflow";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Trash } from "lucide-react";

export default function PlanNode() {
  const [items, setItems] = React.useState<string[]>([]);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="group flex flex-col gap-4 bg-white p-3 pb-1">
        <input
          id="text"
          name="text"
          className="nodrag bg-transparent text-black outline-none"
          placeholder="nazwa bloku..."
        />
        {items.length > 0 ? <Separator /> : null}
        {items.map((item) => (
          <div
            key={item}
            className="group/input flex h-6 flex-row items-center justify-between"
          >
            <input
              name="text"
              className="nodrag bg-transparent text-xs text-black outline-none"
              placeholder="podpunkt..."
            />
            <Button
              size="sm"
              variant="destructive"
              className="hidden h-5 w-5 p-0 group-hover/input:inline-flex"
              onClick={() =>
                setItems((prev) => prev.filter((value) => value !== item))
              }
            >
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="hidden text-black group-hover:block"
          onClick={() =>
            setItems((prev) => [...prev, new Date().getTime().toString()])
          }
        >
          Dodaj podpunkt
        </Button>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}
