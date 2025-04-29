// src/stores/flowStore.ts
import { create } from 'zustand';
import {
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    Connection
} from '@xyflow/react';
import { FlowEdge, FlowNode, FlowState } from '../types/flow.type';


// Helper function to ensure type safety with addEdge
const typedAddEdge = (connection: Connection, edges: FlowEdge[]): FlowEdge[] => {
    return addEdge(connection, edges) as FlowEdge[];
};

export const useFlowStore = create<FlowState>((set, get) => ({
    nodes: [
        {
            id: "1",
            data: {
                label: "Start Process",
                description: "Beginning of workflow",
                type: "Start",
            },
            position: { x: 250, y: 50 },
            type: "custom",
        } as FlowNode,
        {
            id: "2",
            data: {
                label: "Process Step",
                description: "Main processing logic",
                type: "Process",
            },
            position: { x: 250, y: 150 },
            type: "custom",
        } as FlowNode,
    ],
    edges: [],
    selectedNode: null,
    selectedEdge: null,

    // Set entire collections
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    // React Flow handlers
    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes) as FlowNode[],
        });
    },

    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges) as FlowEdge[],
        });
    },

    onConnect: (connection) => {
        const newConnection = {
            ...connection,
            type: "smoothstep",
            animated: true,
            style: { strokeWidth: 2, stroke: "#3182ce" },
            data: { label: "Connection" }
        } as const;

        set({
            edges: typedAddEdge(newConnection, get().edges),
        });
    },

    // Node operations
    addNode: (node) => {
        set({ nodes: [...get().nodes, node] });
    },

    updateNode: (nodeId, data) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    return {
                        ...node,
                        data: { ...node.data, ...data }
                    };
                }
                return node;
            }),
        });
    },

    removeNode: (nodeId) => {
        set({
            nodes: get().nodes.filter((node) => node.id !== nodeId),
            edges: get().edges.filter(
                (edge) => edge.source !== nodeId && edge.target !== nodeId
            ),
            // Clear selection if the node was selected
            selectedNode: get().selectedNode?.id === nodeId ? null : get().selectedNode
        });
    },

    // Edge operations
    updateEdge: (edgeId, data) => {
        set({
            edges: get().edges.map((edge) => {
                if (edge.id === edgeId) {
                    return { ...edge, ...data };
                }
                return edge;
            }),
        });
    },

    removeEdge: (edgeId) => {
        set({
            edges: get().edges.filter((edge) => edge.id !== edgeId),
            // Clear selection if the edge was selected
            selectedEdge: get().selectedEdge?.id === edgeId ? null : get().selectedEdge
        });
    },

    // Selection
    selectNode: (node) => set({ selectedNode: node, selectedEdge: null }),
    selectEdge: (edge) => set({ selectedEdge: edge, selectedNode: null }),
}));