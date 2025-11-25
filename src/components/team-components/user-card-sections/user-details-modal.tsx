"use client";

import { IUser } from "@/types/user";
import { USER_STATUS, USER_ROLE } from "@/constants";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Users,
  Shield,
  Target,
  Activity,
  Zap,
  Crown,
  RefreshCw,
  MapPin,
  Calendar,
  Hash,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/toast";

interface UserDetailsModalProps {
  user: IUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsModal({
  user,
  open,
  onOpenChange,
  getUserById,
  getTeamMembers,
  teamMember,
  users,
}: UserDetailsModalProps & {
  getUserById: (id: string) => Promise<IUser | null>;
  getTeamMembers: (id: string) => Promise<void>;
  teamMember: IUser[];
  users: IUser[]; // If needed for display/lookup
}) {
  const [currentUser, setCurrentUser] = useState<IUser | null>(user);
  const [loading, setLoading] = useState(false);
  // const { getUserById, users, getTeamMembers, teamMember } = useUsersByRole();

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  useEffect(() => {
    if (open && currentUser?._id) {
      getTeamMembers(currentUser._id);
    }
  }, [open, currentUser?._id]);
  if (!currentUser) return null;

  const safeString = (
    value: string | number | null | undefined | { name?: string }
  ): string => {
    if (value === null || value === undefined) return "Not specified";
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (
      typeof value === "object" &&
      "name" in value &&
      typeof value.name === "string"
    ) {
      return value.name;
    }
    return String(value);
  };

  const getInitials = (fullName?: string) => {
    console.log("getInitials input:", fullName, typeof fullName);
    if (!fullName || typeof fullName !== "string") return "";
    return fullName
      .trim()
      .split(/\s+/)
      .map((word) => word[0]?.toUpperCase() || "")
      .join("");
  };

  const refreshUserData = async () => {
    if (!currentUser.id) console.log("Error in id");

    setLoading(true);
    try {
      const updatedUser = await getUserById(currentUser.id);
      if (updatedUser) {
        setCurrentUser(updatedUser);
        toast({
          title: "Success",
          description: "User data refreshed successfully",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh user data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<USER_STATUS, string> = {
    [USER_STATUS.ACTIVE]:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800",
    [USER_STATUS.INACTIVE]:
      "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-300 dark:border-gray-800",
    [USER_STATUS.PENDING]:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800",
    [USER_STATUS.SUSPENDED]:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800",
    [USER_STATUS.BLOCK]:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800",
    [USER_STATUS.VERIFIED]:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800",
    [USER_STATUS.REJECTED]:
      "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-300 dark:border-gray-800",
  };

  const roleColors: Record<USER_ROLE, string> = {
    [USER_ROLE.PARTNER]:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800",
    [USER_ROLE.MANAGER]:
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800",
    [USER_ROLE.USER]:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
    [USER_ROLE.ADMIN]:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-800",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white dark:bg-slate-900">
        {/* Header Section */}
        <div className="relative p-8 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-b border-slate-200 dark:border-slate-700">
          <DialogHeader className="relative">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="size-20 w-20 h-20 border-4 border-white dark:border-slate-700 shadow-lg">
                  <AvatarImage
                    src={currentUser?.imageUrl?.trim() || "/default-avatar.png"}
                    alt={currentUser?.name || "User Avatar"}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.onerror = null;
                      img.src = "/default-avatar.png";
                    }}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xl">
                    {getInitials(currentUser?.name || "User")}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <DialogTitle className="text-3xl font-bold text-slate-900 dark:text-white">
                    {currentUser.name}
                  </DialogTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshUserData}
                    disabled={loading}
                    className="w-fit mx-auto sm:mx-0 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600"
                  >
                    <RefreshCw
                      className={`size-4 mr-2 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 flex-wrap justify-center sm:justify-start">
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <Briefcase className="size-4 text-amber-600" />
                    {currentUser.designation}
                  </p>

                  <Badge
                    variant="outline"
                    className={`${
                      statusColors[currentUser.status]
                    } font-medium px-3 py-1 text-sm border`}
                  >
                    <Activity className="size-3 mr-1" />
                    {currentUser.status}
                  </Badge>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2 justify-center sm:justify-start">
                  <Building className="size-4" />
                  {safeString(currentUser.entity)} •{" "}
                  {safeString(currentUser.group)}
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Content Sections */}
        <div className="p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900/50">
          {/* Contact Information */}
          <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-xl font-semibold">
                <Mail className="size-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <Mail className="size-4 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Email Address
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {currentUser.mail || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <Phone className="size-4 text-green-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Phone Number
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {currentUser.phoneNumber || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <User className="size-4 text-purple-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Employee Number
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {currentUser.employeeNumber || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <Shield className="size-4 text-indigo-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Type/Role
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {currentUser.role || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300 text-xl font-semibold">
                <Briefcase className="size-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <Calendar className="size-4 text-blue-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Date of Joining
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {currentUser.dateOfJoining || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <Briefcase className="size-4 text-amber-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Designation
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {currentUser.designation || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <Building className="size-4 text-indigo-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Entity
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {safeString(currentUser.entity)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <Users className="size-4 text-green-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Group
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {typeof currentUser.group === "object" &&
                      currentUser.group.name
                        ? currentUser.group.name
                        : "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <Building className="size-4 text-orange-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Department
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {currentUser.department || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <MapPin className="size-4 text-red-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Work Location City
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {currentUser.workCity || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <MapPin className="size-4 text-green-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Work Location Country
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {currentUser.workCountry || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <Activity className="size-4 text-emerald-500 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Employee Status
                    </p>
                    <Badge
                      variant="outline"
                      className={`${
                        statusColors[currentUser.status]
                      } font-medium px-2 py-1 text-xs border`}
                    >
                      {currentUser.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hierarchy Information */}
          <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300 text-xl font-semibold">
                <Target className="size-5" />
                Hierarchy & Reporting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <Crown className="size-5 text-amber-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Employee Manager
                    </p>
                    <p className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                      {typeof currentUser.employeeManager === "object"
                        ? currentUser.employeeManager?.name || "No Manager"
                        : currentUser.employeeManager || "No Manager"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <Hash className="size-4 text-teal-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                      Manager Code
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {currentUser.managerCode || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {teamMember.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="size-5 text-blue-500" />
                    <h4 className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                      Team Members ({teamMember.length})
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {teamMember.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {getInitials(member.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate text-slate-900 dark:text-slate-100">
                            {member.name}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {member.designation}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs font-medium border-slate-300 dark:border-slate-600"
                        >
                          {member.role}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Targets */}
          {/* {currentUser.currentTargets &&
            currentUser.currentTargets.length > 0 && (
              <Card className="border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-300 text-xl font-semibold">
                    <Zap className="size-5" />
                    Current Targets & Goals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentUser.currentTargets.map((target, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600"
                      >
                        <Target className="size-4 text-orange-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 dark:text-slate-100">
                            {target}
                          </p>
                          {currentUser.assignedBy && (
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              Assigned by:{" "}
                              {users.find(
                                (u) => u.id === currentUser.assignedBy
                              )?.name || "Unknown"}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )} */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
