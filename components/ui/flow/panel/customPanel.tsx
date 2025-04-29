// src/components/flow/panels/NodeTypesPanel.tsx
import { NodeTypeItemProps, NodeTypesPanelProps } from "@/types/flow.type";
import { Panel } from "@xyflow/react";

export const NodeTypesPanel = ({
  nodeTemplates,
  onSelectTemplate,
  onDragStart,
}: NodeTypesPanelProps) => {
  return (
    <Panel position="top-left" className="bg-white p-2 rounded-md shadow-sm">
      <h1 className="font-medium mb-2">Node Types</h1>
      <div className="flex flex-col gap-2">
        {nodeTemplates.map((template, i) => (
          <NodeTypeItem
            key={i}
            template={template}
            onClick={() => onSelectTemplate(template)}
            onDragStart={
              onDragStart ? (e) => onDragStart(e, template) : undefined
            }
          />
        ))}
      </div>
    </Panel>
  );
};

const NodeTypeItem = ({
  template,
  onClick,
  onDragStart,
}: NodeTypeItemProps) => {
  return (
    <div
      className="relative group"
      draggable={!!onDragStart}
      onDragStart={onDragStart}
    >
      <div
        className="flex items-center p-2 bg-gray-50 rounded-md cursor-pointer hover:bg-gray-100"
        onClick={onClick}
      >
        <div
          className="w-3 h-3 rounded-full mr-2"
          style={{ backgroundColor: template.color }}
        />
        <span className="text-xs">{template.type}</span>
      </div>
      <div className="absolute z-50 bg-black text-white p-2 rounded text-xs -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <p>{template.description}</p>
      </div>
    </div>
  );
};
