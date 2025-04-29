// src/components/flow/dialogs/NodeFormDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { NodeFormDialogProps } from "@/types/flow.type";

export const NodeFormDialog = ({
  open,
  onOpenChange,
  node,
  onUpdate,
  onDelete,
  templates,
}: NodeFormDialogProps) => {
  if (!node) return null;

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ label: e.target.value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ description: e.target.value });
  };

  const handleTypeChange = (value: string) => {
    onUpdate({ type: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Node</DialogTitle>
          <DialogDescription>
            Customize the properties of this node.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nodeName" className="text-right">
              Name
            </Label>
            <Input
              id="nodeName"
              value={node.data.label}
              className="col-span-3"
              onChange={handleLabelChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nodeDescription" className="text-right">
              Description
            </Label>
            <Input
              id="nodeDescription"
              value={node.data.description || ""}
              className="col-span-3"
              onChange={handleDescriptionChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nodeType" className="text-right">
              Type
            </Label>
            <Select
              value={node.data.type || ""}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template, i) => (
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
        <DialogFooter className="flex justify-between">
          <Button variant="destructive" onClick={onDelete}>
            Delete Node
          </Button>
          <Button onClick={() => onOpenChange(false)}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
