/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useConnectionHandling.ts
import { useCallback } from 'react';
import { Edge, Connection, OnConnect } from '@xyflow/react';
import { generateEdgeId } from '../utils/flow';

export function useConnectionHandling(
    updateEdges: (updater: (edges: Edge[]) => Edge[]) => void
) {
    const onConnect: OnConnect = useCallback((connection: Connection) => {
        const newConnection = {
            ...connection,
            id: generateEdgeId(connection.source, connection.target),
            type: "smoothstep",
            animated: true,
            style: { strokeWidth: 2, stroke: "#4a5568" },
            data: { label: "Connection" },
        };

        updateEdges((edges) => [...edges, newConnection as Edge]);
    }, [updateEdges]);

    const updateEdgeStyle = useCallback((edgeId: string, style: any) => {
        updateEdges((edges) =>
            edges.map((edge) => {
                if (edge.id === edgeId) {
                    return { ...edge, style: { ...edge.style, ...style } };
                }
                return edge;
            })
        );
    }, [updateEdges]);

    const updateEdgeData = useCallback((edgeId: string, data: any) => {
        updateEdges((edges) =>
            edges.map((edge) => {
                if (edge.id === edgeId) {
                    return { ...edge, data: { ...edge.data, ...data } };
                }
                return edge;
            })
        );
    }, [updateEdges]);

    const setEdgeType = useCallback((edgeId: string, type: string) => {
        updateEdges((edges) =>
            edges.map((edge) => {
                if (edge.id === edgeId) {
                    return { ...edge, type };
                }
                return edge;
            })
        );
    }, [updateEdges]);

    const removeEdge = useCallback((edgeId: string) => {
        updateEdges((edges) => edges.filter((edge) => edge.id !== edgeId));
    }, [updateEdges]);

    return {
        onConnect,
        updateEdgeStyle,
        updateEdgeData,
        setEdgeType,
        removeEdge
    };
}