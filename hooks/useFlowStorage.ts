// src/hooks/useFlowStorage.ts
import { useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';

export function useFlowStorage(
    getNodes: () => Node[],
    getEdges: () => Edge[],
    setNodes: (nodes: Node[]) => void,
    setEdges: (edges: Edge[]) => void
) {
    const saveFlow = useCallback((name: string) => {
        const flow = {
            nodes: getNodes(),
            edges: getEdges(),
        };

        localStorage.setItem(`flow-${name}`, JSON.stringify(flow));
    }, [getNodes, getEdges]);

    const loadFlow = useCallback((name: string) => {
        const flowString = localStorage.getItem(`flow-${name}`);

        if (flowString) {
            try {
                const flow = JSON.parse(flowString);

                if (flow.nodes && flow.edges) {
                    setNodes(flow.nodes);
                    setEdges(flow.edges);
                    return true;
                }
            } catch (error) {
                console.error('Failed to parse flow:', error);
            }
        }

        return false;
    }, [setNodes, setEdges]);

    const getSavedFlows = useCallback(() => {
        const flows: string[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('flow-')) {
                flows.push(key.substring(5));
            }
        }

        return flows;
    }, []);

    const deleteFlow = useCallback((name: string) => {
        localStorage.removeItem(`flow-${name}`);
    }, []);

    return {
        saveFlow,
        loadFlow,
        getSavedFlows,
        deleteFlow
    };
}