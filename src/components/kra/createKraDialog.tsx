import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateKra, IKra } from "@/types/kra";
import { KRA_TYPE, KRA_STATUS } from "@/constants";
import { createKra } from "@/api/kra";

interface CreateKraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateKraDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateKraDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateKra>({
    code: "",
    name: "",
    description: "",
    kra_type: KRA_TYPE.QUANTITY,
    status: KRA_STATUS.ACTIVE,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createKra(formData);
      if (response && response.data) {
        onSuccess();
        onOpenChange(false);
        setFormData({
          code: "",
          name: "",
          description: "",
          kra_type: KRA_TYPE.QUANTITY,
          status: KRA_STATUS.ACTIVE,
        });
      }
    } catch (error) {
      console.error("Failed to create KRA:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateKra, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create KRA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New KRA</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => handleInputChange("code", e.target.value)}
              placeholder="Enter KRA code"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter KRA name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter KRA description"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={formData.kra_type}
              onValueChange={(value) => handleInputChange("kra_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select KRA type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={KRA_TYPE.QUANTITY}>QUANTITY</SelectItem>

                <SelectItem value={KRA_TYPE.VALUE}>VALUE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={KRA_STATUS.ACTIVE}>Active</SelectItem>
                <SelectItem value={KRA_STATUS.INACTIVE}>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create KRA"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
