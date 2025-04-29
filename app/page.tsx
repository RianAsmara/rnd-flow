"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  addEdge,
  OnNodeDrag,
  FitViewOptions,
  DefaultEdgeOptions,
  ReactFlowInstance,
  Panel,
  useNodesState,
  useEdgesState,
  NodeTypes,
  MiniMap,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Custom node component
const CustomNode = ({
  data,
  isConnectable,
}: {
  data: { label: string; description?: string; type?: string };
  isConnectable: boolean;
}) => {
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
            className={`text-xs text-gray-400 mt-1 rounded-md px-2 py-1 bg-gray-100 
              ${data.type === "Output" ? "!bg-[#10b981] text-white" : ""}  
              ${data.type === "Process" ? "!bg-[#4299e1] text-white" : ""} 
              ${data.type === "Decision" ? "!bg-[#f59e0b] text-white" : ""}`}
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
        id="b"
        type="source"
        position={Position.Left}
        isConnectable={isConnectable}
      />
    </>
  );
};

// Node types mapping
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Node templates for adding new nodes
const nodeTemplates = [
  {
    type: "Process",
    description: "A standard process step",
    color: "#4299e1",
  },
  {
    type: "Decision",
    description: "A decision point in the flow",
    color: "#f59e0b",
  },
  {
    type: "Output",
    description: "Output or result",
    color: "#10b981",
  },
];

export default function FlowEditor() {
  // Reference to the React Flow instance
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  // Node and edge state
  const [nodes, setNodes] = useNodesState<Node>([
    {
      id: "1",
      data: {
        label: "Start Process",
        description: "Beginning of workflow",
        type: "Start",
      },
      position: { x: 250, y: 50 },
      type: "custom",
    },
    {
      id: "2",
      data: {
        label: "Process Step",
        description: "Main processing logic",
        type: "Process",
      },
      position: { x: 250, y: 150 },
      type: "custom",
    },
  ]);

  const [edges, setEdges] = useEdgesState<Edge>([]);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeFormOpen, setNodeFormOpen] = useState(false);
  const [newNodeFormOpen, setNewNodeFormOpen] = useState(false);
  const [newNodeData, setNewNodeData] = useState({
    label: "New Node",
    description: "",
    type: "Process",
  });

  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [edgeFormOpen, setEdgeFormOpen] = useState(false);

  // Flow configuration options
  const fitViewOptions: FitViewOptions = {
    padding: 0.2,
  };

  const defaultEdgeOptions: DefaultEdgeOptions = {
    animated: true,
    type: "smoothstep",
    style: { strokeWidth: 2, stroke: "#4a5568" },
  };

  // Event handlers
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect: OnConnect = useCallback(
    (connection) => {
      const newConnection = {
        ...connection,
        type: "smoothstep",
        animated: true,
      };
      return setEdges((eds) => addEdge(newConnection, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setNodeFormOpen(true);
  }, []);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
    setEdgeFormOpen(true);
  }, []);

  const onNodeDrag: OnNodeDrag = (_, node) => {
    console.log("Node dragged:", node);
  };

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, []);

  // Add a new node
  const addNode = useCallback(() => {
    if (!reactFlowInstance) return;

    const { x, y, zoom } = reactFlowInstance.getViewport();
    const position = {
      x: (Math.random() * 400 + 50 - x) / zoom,
      y: (Math.random() * 400 + 50 - y) / zoom,
    };

    const newNode: Node = {
      id: `node-${nodes.length + 1}`,
      type: "custom",
      position,
      data: newNodeData,
    };

    setNodes((nds) => [...nds, newNode]);
    setNewNodeFormOpen(false);
    setNewNodeData({
      label: "New Node",
      description: "Example description",
      type: "Process",
    });
  }, [reactFlowInstance, nodes.length, newNodeData, setNodes]);

  // Remove selected node
  const removeNode = useCallback(() => {
    if (!selectedNode) return;

    setNodes((nodes) => nodes.filter((node) => node.id !== selectedNode.id));
    setEdges((edges) =>
      edges.filter(
        (edge) =>
          edge.source !== selectedNode.id && edge.target !== selectedNode.id
      )
    );

    setSelectedNode(null);
    setNodeFormOpen(false);
  }, [selectedNode, setEdges, setNodes]);

  // Update node data
  const updateNodeData = useCallback(() => {
    if (!selectedNode) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...selectedNode.data,
            },
          };
        }
        return node;
      })
    );

    setNodeFormOpen(false);
  }, [selectedNode, setNodes]);

  const updateEdgeData = useCallback(() => {
    if (!selectedEdge) return;

    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === selectedEdge.id) {
          return {
            ...selectedEdge,
          };
        }
        return edge;
      })
    );

    setEdgeFormOpen(false);
  }, [selectedEdge, setEdges]);

  const removeEdge = useCallback(() => {
    if (!selectedEdge) return;

    setEdges((edges) => edges.filter((edge) => edge.id !== selectedEdge.id));

    setSelectedEdge(null);
    setEdgeFormOpen(false);
  }, [selectedEdge, setEdges]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-6">
      {/* Toolbar */}
      <div className="toolbar flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Flow Editor</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setNewNodeFormOpen(true)}
            variant="outline"
            size="sm"
          >
            Add Node
          </Button>
          <Button
            onClick={() => {
              if (reactFlowInstance) {
                reactFlowInstance.fitView(fitViewOptions);
              }
            }}
            variant="outline"
            size="sm"
          >
            Fit View
          </Button>
        </div>
      </div>

      {/* Flow Editor */}
      <div ref={reactFlowWrapper} className="border rounded-md w-full h-[70vh]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onNodeDrag={onNodeDrag}
          onInit={onInit}
          // fitView
          fitViewOptions={fitViewOptions}
          defaultEdgeOptions={defaultEdgeOptions}
          nodeTypes={nodeTypes}
        >
          <Background />
          <Controls />
          <Panel
            position="top-left"
            className="bg-white p-2 rounded-md shadow-sm"
          >
            <h1 className="font-medium mb-2">Node Types</h1>
            <div className="flex flex-col gap-2">
              {nodeTemplates.map((template, i) => (
                <TooltipProvider key={i}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="flex items-center p-2 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setNewNodeData({
                            ...newNodeData,
                            type: template.type,
                            description: template.description,
                          });
                          setNewNodeFormOpen(true);
                        }}
                      >
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: template.color }}
                        />
                        <span className="text-xs">{template.type}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{template.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </Panel>
          <MiniMap />
        </ReactFlow>
      </div>

      {/* Edit Node Form Dialog */}
      <Dialog open={nodeFormOpen} onOpenChange={setNodeFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
            <DialogDescription>
              Customize the properties of this node.
            </DialogDescription>
          </DialogHeader>
          {selectedNode && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nodeName" className="text-right">
                  Name
                </Label>
                <Input
                  id="nodeName"
                  value={selectedNode.data.label as string}
                  className="col-span-3"
                  onChange={(e) =>
                    setSelectedNode({
                      ...selectedNode,
                      data: { ...selectedNode.data, label: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nodeDescription" className="text-right">
                  Description
                </Label>
                <Input
                  id="nodeDescription"
                  value={(selectedNode.data.description as string) || ""}
                  className="col-span-3"
                  onChange={(e) =>
                    setSelectedNode({
                      ...selectedNode,
                      data: {
                        ...selectedNode.data,
                        description: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nodeType" className="text-right">
                  Type
                </Label>
                <Select
                  value={(selectedNode.data.type as string) || ""}
                  onValueChange={(value) =>
                    setSelectedNode({
                      ...selectedNode,
                      data: { ...selectedNode.data, type: value },
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {nodeTemplates.map((template, i) => (
                      <SelectItem key={i} value={template.type}>
                        {template.type}
                      </SelectItem>
                    ))}
                    <SelectItem value="Start">Start</SelectItem>
                    <SelectItem value="End">End</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={removeNode}>
              Delete Node
            </Button>
            <Button onClick={updateNodeData}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Node Dialog */}
      <Dialog open={newNodeFormOpen} onOpenChange={setNewNodeFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Node</DialogTitle>
            <DialogDescription>
              Configure properties for the new node.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newNodeName" className="text-right">
                Name
              </Label>
              <Input
                id="newNodeName"
                value={newNodeData.label}
                className="col-span-3"
                onChange={(e) =>
                  setNewNodeData({ ...newNodeData, label: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newNodeDescription" className="text-right">
                Description
              </Label>
              <Input
                id="newNodeDescription"
                value={newNodeData.description}
                className="col-span-3"
                onChange={(e) =>
                  setNewNodeData({
                    ...newNodeData,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newNodeType" className="text-right">
                Type
              </Label>
              <Select
                value={newNodeData.type}
                onValueChange={(value) =>
                  setNewNodeData({ ...newNodeData, type: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  {nodeTemplates.map((template, i) => (
                    <SelectItem key={i} value={template.type}>
                      {template.type}
                    </SelectItem>
                  ))}
                  <SelectItem value="Start">Start</SelectItem>
                  <SelectItem value="End">End</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addNode}>Add Node</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edge Form Dialog */}
      <Dialog open={edgeFormOpen} onOpenChange={setEdgeFormOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Edge</DialogTitle>
            <DialogDescription>
              Customize the properties of this connection.
            </DialogDescription>
          </DialogHeader>
          {selectedEdge && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edgeLabel" className="text-right">
                  Label
                </Label>
                <Input
                  id="edgeLabel"
                  value={(selectedEdge.data?.label as string) || ""}
                  className="col-span-3"
                  onChange={(e) =>
                    setSelectedEdge({
                      ...selectedEdge,
                      data: { ...selectedEdge.data, label: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edgeType" className="text-right">
                  Edge Type
                </Label>
                <Select
                  value={selectedEdge.type || "smoothstep"}
                  onValueChange={(value) =>
                    setSelectedEdge({
                      ...selectedEdge,
                      type: value,
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select edge type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smoothstep">Smooth Step</SelectItem>
                    <SelectItem value="step">Step</SelectItem>
                    <SelectItem value="straight">Straight</SelectItem>
                    <SelectItem value="bezier">Bezier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edgeStyle" className="text-right">
                  Stroke Width
                </Label>
                <Select
                  value={String(selectedEdge.style?.strokeWidth || "2")}
                  onValueChange={(value) =>
                    setSelectedEdge({
                      ...selectedEdge,
                      style: {
                        ...selectedEdge.style,
                        strokeWidth: parseInt(value),
                      },
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select stroke width" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Thin (1px)</SelectItem>
                    <SelectItem value="2">Normal (2px)</SelectItem>
                    <SelectItem value="3">Medium (3px)</SelectItem>
                    <SelectItem value="4">Thick (4px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edgeColor" className="text-right">
                  Color
                </Label>
                <Select
                  value={selectedEdge.style?.stroke || "#4a5568"}
                  onValueChange={(value) =>
                    setSelectedEdge({
                      ...selectedEdge,
                      style: {
                        ...selectedEdge.style,
                        stroke: value,
                      },
                    })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="#4a5568">Gray</SelectItem>
                    <SelectItem value="#3182ce">Blue</SelectItem>
                    <SelectItem value="#dd6b20">Orange</SelectItem>
                    <SelectItem value="#38a169">Green</SelectItem>
                    <SelectItem value="#e53e3e">Red</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edgeAnimated" className="text-right">
                  Animated
                </Label>
                <div className="col-span-3 flex items-center">
                  <input
                    type="checkbox"
                    id="edgeAnimated"
                    checked={selectedEdge.animated || false}
                    onChange={(e) =>
                      setSelectedEdge({
                        ...selectedEdge,
                        animated: e.target.checked,
                      })
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={removeEdge}>
              Delete Edge
            </Button>
            <Button onClick={updateEdgeData}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="flex gap-[24px] flex-wrap items-center justify-center mt-4">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
