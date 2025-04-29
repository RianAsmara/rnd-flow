// src/hooks/useFlowSelection.ts
import { useState, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';

export function useFlowSelection() {
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
    const [nodeFormOpen, setNodeFormOpen] = useState(false);
    const [edgeFormOpen, setEdgeFormOpen] = useState(false);

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
        setSelectedEdge(null);
        setNodeFormOpen(true);
    }, []);

    const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
        setSelectedEdge(edge);
        setSelectedNode(null);
        setEdgeFormOpen(true);
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedNode(null);
        setSelectedEdge(null);
    }, []);

    return {
        selectedNode,
        selectedEdge,
        nodeFormOpen,
        edgeFormOpen,
        setNodeFormOpen,
        setEdgeFormOpen,
        onNodeClick,
        onEdgeClick,
        clearSelection
    };
}