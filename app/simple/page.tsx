"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  OnConnect,
  OnNodesDelete,
  ReactFlowInstance,
  Node,
  Controls,
  MiniMap,
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

// const initialNodes = [
//   {
//     id: "1",
//     type: "input",
//     data: { label: "Start here..." },
//     position: { x: -150, y: 0 },
//   },
//   {
//     id: "2",
//     type: "input",
//     data: { label: "...or here!" },
//     position: { x: 150, y: 0 },
//   },
//   { id: "3", data: { label: "Delete me." }, position: { x: 0, y: 100 } },
//   { id: "4", data: { label: "Then me!" }, position: { x: 0, y: 200 } },
//   {
//     id: "5",
//     type: "output",
//     data: { label: "End here!" },
//     position: { x: 0, y: 300 },
//   },
// ];

// const initialEdges = [
//   { id: "1->3", source: "1", target: "3" },
//   { id: "2->3", source: "2", target: "3" },
//   { id: "3->4", source: "3", target: "4" },
//   { id: "4->5", source: "4", target: "5" },
// ];

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

export default function SimpleFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);

  const [selectedNode, setSelectedNode] = useNodesState<Node>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([
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
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // state for controlling the flow
  const [nodeFormOpen, setNodeFormOpen] = useState(false);
  const [newNodeData, setNewNodeData] = useState({
    label: "New Node",
    description: "",
    type: "Process",
  });

  const onConnect: OnConnect = useCallback(
    (params) => setEdges(addEdge(params, edges)),
    [edges, setEdges]
  );
  //   const onNodesDelete: OnNodesDelete = useCallback(
  //     (deleted) => {
  //       setEdges(
  //         deleted.reduce((acc, node) => {
  //           const incomers = getIncomers(node, nodes, edges);
  //           const outgoers = getOutgoers(node, nodes, edges);
  //           const connectedEdges = getConnectedEdges([node], edges);

  //           const remainingEdges = acc.filter(
  //             (edge) => !connectedEdges.includes(edge)
  //           );

  //           const createdEdges = incomers.flatMap(({ id: source }) =>
  //             outgoers.map(({ id: target }) => ({
  //               id: `${source}->${target}`,
  //               source,
  //               target,
  //             }))
  //           );

  //           return [...remainingEdges, ...createdEdges];
  //         }, edges)
  //       );
  //     },
  //     [nodes, edges]
  //   );

  // Add a new node
  const addNode = useCallback(() => {
    console.log("Adding node", newNodeData);
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
    setNodeFormOpen(false);
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
  }, [selectedNode]);

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-6">
      <div className="toolbar flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Flow Editor</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setNodeFormOpen(true)}
            variant="outline"
            size="sm"
          >
            Add Node
          </Button>
          <Button variant="outline" size="sm">
            Fit View
          </Button>
        </div>
      </div>
      <div ref={reactFlowWrapper} className="border rounded-md w-full h-[70vh]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
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
                          setNodeFormOpen(true);
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

      {/* Node Form */}
      <Dialog open={nodeFormOpen} onOpenChange={setNodeFormOpen}>
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
            <Button onClick={addNode} className="cursor-pointer">
              Add Node
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
