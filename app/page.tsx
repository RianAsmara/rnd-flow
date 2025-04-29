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
  NodeTypes,
  ReactFlowInstance,
  Panel,
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
}: {
  data: { label: string; description?: string; type?: string };
}) => {
  return (
    <div className="custom-node bg-white border border-gray-200 rounded-md shadow-sm p-3 min-w-[150px]">
      <div className="font-medium text-sm">{data.label}</div>
      {data.description && (
        <div className="text-xs text-gray-500 mt-1">{data.description}</div>
      )}
      {data.type && (
        <div className="text-xs mt-2 inline-block px-2 py-1 bg-gray-100 rounded-full">
          {data.type}
        </div>
      )}
    </div>
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
  const [nodes, setNodes] = useState<Node[]>([
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

  const [edges, setEdges] = useState<Edge[]>([
    { id: "e1-2", source: "1", target: "2", animated: true },
  ]);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeFormOpen, setNodeFormOpen] = useState(false);
  const [newNodeFormOpen, setNewNodeFormOpen] = useState(false);
  const [newNodeData, setNewNodeData] = useState({
    label: "New Node",
    description: "",
    type: "Process",
  });

  // Flow configuration options
  const fitViewOptions: FitViewOptions = {
    padding: 0.2,
  };

  const defaultEdgeOptions: DefaultEdgeOptions = {
    animated: true,
  };

  // Event handlers
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setNodeFormOpen(true);
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
  }, [reactFlowInstance, nodes.length, newNodeData]);

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
  }, [selectedNode]);

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
  }, [selectedNode]);

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
          onNodeDrag={onNodeDrag}
          onInit={onInit}
          fitView
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
            <div className="text-sm font-medium mb-2">Node Types</div>
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
