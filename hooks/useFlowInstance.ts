// src/hooks/useFlowInstance.ts
import { useCallback, useRef } from 'react';
import { ReactFlowInstance, FitViewOptions } from '@xyflow/react';

export function useFlowInstance() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

    const onInit = useCallback((instance: ReactFlowInstance) => {
        reactFlowInstance.current = instance;
    }, []);

    const fitView = useCallback((options?: FitViewOptions) => {
        if (reactFlowInstance.current) {
            reactFlowInstance.current.fitView(options);
        }
    }, []);

    const getViewport = useCallback(() => {
        if (!reactFlowInstance.current) return { x: 0, y: 0, zoom: 1 };
        return reactFlowInstance.current.getViewport();
    }, []);

    const project = useCallback((position: { x: number, y: number }) => {
        if (!reactFlowInstance.current) return position;
        throw new Error('The "project" method is not available on ReactFlowInstance.');
    }, []);

    return {
        reactFlowWrapper,
        reactFlowInstance,
        onInit,
        fitView,
        getViewport,
        project
    };
}