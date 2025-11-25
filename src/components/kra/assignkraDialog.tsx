"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { IUser, USER_ROLE } from "@/types/user";
import { CreateKraAssignment, IKra } from "@/types/kra";
import { assignKra, getAllKras, startProgress } from "@/api/kra";
import { getAllUsers, getAllUsersForDropDown } from "@/api/users";
import toast from "react-hot-toast";
import { ErrorResponseSchema } from "@/types/responseError";
import useAuthStore from "@/store/useAuthStore";

interface AssignKraDialogProps {
  onAssignmentCreated?: () => void;
  entityId?: string;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function AssignKraDialog({
  onAssignmentCreated,
  entityId,
}: AssignKraDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [kpis, setKpis] = useState<IKra[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [formData, setFormData] = useState<{
    selectedUser: string;
    selectedKra: string;
    month: number;
    year: number;
    monthlyTarget: number;
  }>({
    selectedUser: "",
    selectedKra: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    monthlyTarget: 0,
  });

  useEffect(() => {
    if (open) {
      loadInitialData();
    }
  }, [open]);

  const loadInitialData = async () => {
    try {
      setLoadingData(true);

      const [usersResponse, kpisResponse] = await Promise.all([
        getAllUsersForDropDown({
          limit: "50",
          page: "1",
          entityId: entityId,
          role: USER_ROLE.MANAGER,
        }),
        getAllKras({ limit: 1000, page: 1 }),
      ]);

      if (usersResponse.data && usersResponse.data) {
        setUsers(usersResponse.data || []);
      } else {
        toast.error("Failed to load users");
      }

      if (kpisResponse && kpisResponse.data) {
        setKpis(kpisResponse.data.kraKpis || []);
      } else {
        toast.error("Failed to load KRAs/KPIs");
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("An error occurred while loading data");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.selectedUser ||
      !formData.selectedKra ||
      !formData.monthlyTarget
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const selectedUser = users.find((u) => u.id === formData.selectedUser);
    const selectedKra = kpis.find((k) => k.id === formData.selectedKra);

    if (!selectedUser || !selectedKra) {
      toast.error("Invalid user or KRA selection");
      return;
    }

    try {
      setLoading(true);

      const assignmentData: CreateKraAssignment = {
        kra: selectedKra.id,
        employee: selectedUser.id,
        month: formData.month,
        year: formData.year,
        monthlyTarget: formData.monthlyTarget,
      };

      const response = await assignKra(assignmentData);

      if (response.data) {
        await startProgress({
          kra: selectedKra.id,
          employee: selectedUser.id,
          month: formData.month,
          year: formData.year,
        });

        toast.success("KRA assigned successfully");

        // Reset form
        setFormData({
          selectedUser: "",
          selectedKra: "",
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          monthlyTarget: 0,
        });

        setOpen(false);
        onAssignmentCreated?.();
        window.location.reload();
      } else {
        toast.error("Failed to assign KRA");
      }
    } catch (error: any) {
      const errData = error as ErrorResponseSchema;
      const message =
        errData?.error?.displayMessage ||
        errData?.error?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Assign KRA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign KRA to Employee</DialogTitle>
          <DialogDescription>
            Select an employee and KRA to create a new assignment with monthly
            targets.
          </DialogDescription>
        </DialogHeader>

        {loadingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading data...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employee *</Label>
              <Select
                value={formData.selectedUser}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, selectedUser: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="kra">KRA/KPI *</Label>
              <Select
                value={formData.selectedKra}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, selectedKra: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a KRA/KPI" />
                </SelectTrigger>
                <SelectContent>
                  {kpis.map((kra) => (
                    <SelectItem key={kra.id} value={kra.id}>
                      {kra.name}
                      {kra.kra_type && ` (${kra.kra_type})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month *</Label>
                <Select
                  value={formData.month.toString()}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      month: Number.parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthNames.map((month, index) => (
                      <SelectItem
                        key={index + 1}
                        value={(index + 1).toString()}
                      >
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Select
                  value={formData.year.toString()}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      year: Number.parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyTarget">Monthly Target *</Label>
              <Input
                id="monthlyTarget"
                type="number"
                min="0"
                step="0.01"
                value={formData.monthlyTarget || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    monthlyTarget: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="Enter monthly target"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Assign KRA
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
