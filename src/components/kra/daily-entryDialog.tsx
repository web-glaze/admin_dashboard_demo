"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from "lucide-react";
// import { toast } from "sonner"

interface DailyEntry {
  id: string;
  kraAssignmentId: string;
  week: number;
  day: string;
  value: number;
  date: string;
}

interface DailyEntryDialogProps {
  kraAssignmentId: string;
  kraTitle: string;
  onEntryAdded: () => void;
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function DailyEntryDialog({
  kraAssignmentId,
  kraTitle,
  onEntryAdded,
}: DailyEntryDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    week: "",
    day: "",
    value: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.week || !formData.day || !formData.value) {
      //   toast.error("Please fill in all fields")
      return;
    }

    setLoading(true);

    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const entry: DailyEntry = {
        id: Date.now().toString(),
        kraAssignmentId,
        week: Number.parseInt(formData.week),
        day: formData.day,
        value: Number.parseFloat(formData.value),
        date: formData.date,
      };

      // Store in localStorage for demo (replace with actual API)
      const existingEntries = JSON.parse(
        localStorage.getItem("dailyEntries") || "[]"
      );
      existingEntries.push(entry);
      localStorage.setItem("dailyEntries", JSON.stringify(existingEntries));

      //   toast.success("Daily entry added successfully!")
      setOpen(false);
      setFormData({
        week: "",
        day: "",
        value: "",
        date: new Date().toISOString().split("T")[0],
      });
      onEntryAdded();
    } catch (error) {
      //   toast.error("Failed to add daily entry")
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Daily Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Daily Entry</DialogTitle>
          <DialogDescription>
            Record your daily progress for: {kraTitle}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="week">Week</Label>
              <Select
                value={formData.week}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, week: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Week 1</SelectItem>
                  <SelectItem value="2">Week 2</SelectItem>
                  <SelectItem value="3">Week 3</SelectItem>
                  <SelectItem value="4">Week 4</SelectItem>
                  <SelectItem value="4a">Week 4a</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Select
                value={formData.day}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, day: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Achievement Value</Label>
            <Input
              id="value"
              type="number"
              step="0.01"
              placeholder="Enter your achievement"
              value={formData.value}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, value: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
