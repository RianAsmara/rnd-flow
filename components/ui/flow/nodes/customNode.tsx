import { CustomNodeProps, NodeType } from "@/types/flow.type";
import { Handle, Position } from "@xyflow/react";

export const CustomNode = ({ data, isConnectable }: CustomNodeProps) => {
  const nodeType = (data.type || "default") as NodeType;
  // const nodeColor = getNodeColor(nodeType);

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <div className="custom-node bg-white border border-gray-200 rounded-md shadow-sm p-3 min-w-[150px]">
        <div className="font-medium text-sm">{data.label}</div>
        {data.description && (
          <div className="text-xs text-gray-500 mt-1">{data.description}</div>
        )}
        {data.type && (
          <div
            className="text-xs mt-2 inline-block px-2 py-1 rounded-md"
            style={{
              // backgroundColor: nodeColor,
              color: ["Process", "Decision", "Output", "Start"].includes(
                nodeType
              )
                ? "white"
                : "inherit",
            }}
          >
            {data.type}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="b"
        isConnectable={isConnectable}
      />
    </>
  );
};
