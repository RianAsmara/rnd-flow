/* eslint-disable @typescript-eslint/no-explicit-any */

import { Node as ReactFlowNode, Edge as ReactFlowEdge, XYPosition, Connection } from '@xyflow/react';

// Node Types
export type NodeType = 'Process' | 'Decision' | 'Output' | 'Start' | 'End' | string;

export interface NodeData {
    label: string;
    description?: string;
    type?: NodeType;
    [key: string]: any; // Allow for extensibility
}

export interface FlowNode extends ReactFlowNode {
    data: NodeData;
}

// Edge Types
export type EdgeType = 'smoothstep' | 'step' | 'straight' | 'bezier' | string;

export interface EdgeData {
    label?: string;
    [key: string]: any; // Allow for extensibility
}

export interface FlowEdge extends ReactFlowEdge {
    type?: EdgeType;
    data?: EdgeData;
    animated?: boolean;
    style?: {
        strokeWidth?: number;
        stroke?: string;
        [key: string]: any;
    };
}

// Templates
export interface NodeTemplate {
    type: NodeType;
    description: string;
    color: string;
    defaultData?: Partial<NodeData>;
}

// Flow State
export interface FlowState {
    nodes: FlowNode[];
    edges: FlowEdge[];
    selectedNode: FlowNode | null;
    selectedEdge: FlowEdge | null;

    // Actions
    setNodes: (nodes: FlowNode[]) => void;
    setEdges: (edges: FlowEdge[]) => void;
    onNodesChange: (changes: any) => void;
    onEdgesChange: (changes: any) => void;
    onConnect: (connection: Connection) => void;
    addNode: (node: FlowNode) => void;
    updateNode: (nodeId: string, data: Partial<NodeData>) => void;
    removeNode: (nodeId: string) => void;
    updateEdge: (edgeId: string, data: Partial<FlowEdge>) => void;
    removeEdge: (edgeId: string) => void;
    selectNode: (node: FlowNode | null) => void;
    selectEdge: (edge: FlowEdge | null) => void;
}

// Custom Hooks Types
export interface FlowSelection {
    selectedNode: FlowNode | null;
    selectedEdge: FlowEdge | null;
    nodeFormOpen: boolean;
    edgeFormOpen: boolean;
    setNodeFormOpen: (open: boolean) => void;
    setEdgeFormOpen: (open: boolean) => void;
    onNodeClick: (event: React.MouseEvent, node: FlowNode) => void;
    onEdgeClick: (event: React.MouseEvent, edge: FlowEdge) => void;
    clearSelection: () => void;
}

export interface NodeManagement {
    newNodeData: NodeData;
    setNewNodeData: React.Dispatch<React.SetStateAction<NodeData>>;
    newNodeFormOpen: boolean;
    setNewNodeFormOpen: (open: boolean) => void;
    prepareNewNode: (template: NodeTemplate) => void;
    addNode: () => void;
    createNodeAtPosition: (position: XYPosition, data: NodeData) => FlowNode;
}

export interface FlowInstance {
    reactFlowWrapper: React.RefObject<HTMLDivElement>;
    reactFlowInstance: React.MutableRefObject<any>;
    onInit: (instance: any) => void;
    fitView: (options?: any) => void;
    getViewport: () => { x: number; y: number; zoom: number };
    project: (position: { x: number; y: number }) => XYPosition;
}

export interface ConnectionHandling {
    onConnect: (connection: Connection) => void;
    updateEdgeStyle: (edgeId: string, style: any) => void;
    updateEdgeData: (edgeId: string, data: Partial<EdgeData>) => void;
    setEdgeType: (edgeId: string, type: EdgeType) => void;
    removeEdge: (edgeId: string) => void;
}

export interface UndoRedoState {
    saveState: (nodes: FlowNode[], edges: FlowEdge[]) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export interface DragAndDrop {
    onDragStart: (event: React.DragEvent, template: NodeTemplate) => void;
    onDragOver: (event: React.DragEvent) => void;
    onDrop: (event: React.DragEvent) => void;
}

export interface FlowStorage {
    saveFlow: (name: string) => void;
    loadFlow: (name: string) => boolean;
    getSavedFlows: () => string[];
    deleteFlow: (name: string) => void;
}

// Component Props
export interface NodeTypesPanelProps {
    nodeTemplates: NodeTemplate[];
    onSelectTemplate: (template: NodeTemplate) => void;
    onDragStart?: (event: React.DragEvent, template: NodeTemplate) => void;
}

export interface NodeTypeItemProps {
    template: NodeTemplate;
    onClick: () => void;
    onDragStart?: (event: React.DragEvent) => void;
}

export interface NodeFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    node: FlowNode | null;
    onUpdate: (data: Partial<NodeData>) => void;
    onDelete: () => void;
    templates: NodeTemplate[];
}

export interface EdgeFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    edge: FlowEdge | null;
    onUpdate: (data: Partial<FlowEdge>) => void;
    onDelete: () => void;
}

export interface CustomNodeProps {
    data: NodeData;
    isConnectable: boolean;
}

// Utility Types
export interface ViewportType {
    x: number;
    y: number;
    zoom: number;
}

export interface FlowHistoryItem {
    nodes: FlowNode[];
    edges: FlowEdge[];
}

// Theme and Styling
export interface FlowTheme {
    nodeColors: {
        [key in NodeType]?: string;
    };
    edgeColors: {
        default: string;
        selected: string;
        success: string;
        error: string;
        warning: string;
    };
    background: {
        color: string;
        pattern: 'dots' | 'lines' | 'cross' | 'none';
    };
}

// Export aliases for compatibility
export type Node = FlowNode;
export type Edge = FlowEdge;