/* eslint-disable @typescript-eslint/no-explicit-any */
import { XYPosition } from "@xyflow/react";

// src/utils/flowUtils.ts
export const generateNodeId = () => `node-${Date.now()}`;

export const generateEdgeId = (source: string, target: string) =>
    `edge-${source}-${target}-${Date.now()}`;

export const createDefaultNode = (type: string, position: XYPosition, data: any) => ({
    id: generateNodeId(),
    type: 'custom',
    position,
    data,
});