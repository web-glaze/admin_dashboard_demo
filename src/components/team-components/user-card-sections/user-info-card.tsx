"use client";

import { IUser } from "@/types/user";
import { USER_STATUS, USER_ROLE } from "@/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building,
  Users,
  Activity,
  User,
  Briefcase,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { UserDetailsModal } from "./user-details-modal";

interface UserInfoCardProps {
  user: IUser;
  onEdit: (user: IUser) => void;
  onDelete: (userId: string) => void;
  onStatusChange: (userId: string, status: USER_STATUS) => void;
  currentUserRole?: USER_ROLE;
  getUserById: (id: string) => Promise<IUser | null>;
  getTeamMembers: (id: string) => Promise<void>;
  teamMember: IUser[];
  users: IUser[];
}

export function UserInfoCard({
  user,
  onEdit,
  onDelete,
  onStatusChange,
  currentUserRole,
  getUserById,
  getTeamMembers,
  teamMember,
  users,
}: UserInfoCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getInitials = (fullName?: string) => {
    if (!fullName || typeof fullName !== "string") return "U";
    const trimmed = fullName.trim();
    if (!trimmed) return "U";
    return trimmed
      .split(/\s+/)
      .map((word) => word[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2); // Limit to 2 characters max
  };

  function safeString<T extends { name?: string; id?: string | number }>(
    value: T | string | number | null | undefined
  ): string {
    if (value === null || value === undefined || value === "")
      return "Not specified";

    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
    if (typeof value === "object") {
      if (value.name) return value.name;
      if (value.id) return String(value.id);
    }

    return "Not specified";
  }

  // Ensure user data exists with fallbacks
  const userData = {
    id: user?.id || "",
    name: user?.name || "Unknown User",
    designation: user?.designation || "Not specified",
    role: user?.role || USER_ROLE.USER,
    status: user?.status || USER_STATUS.INACTIVE,
    mail: user?.mail || "",
    phoneNumber: user?.phoneNumber || "",
    entity: user?.entity || "",
    group: user?.group || "",
    employeeNumber: user?.employeeNumber || "",
    imageUrl: user?.imageUrl || "",
  };

  const statusColors = {
    [USER_STATUS.ACTIVE]:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-700",
    [USER_STATUS.INACTIVE]:
      "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/30 dark:text-slate-300 dark:border-slate-700",
    [USER_STATUS.PENDING]:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-700",
    [USER_STATUS.SUSPENDED]:
      "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-700",
    [USER_STATUS.BLOCK]:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-700",
    [USER_STATUS.VERIFIED]:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-700",
    [USER_STATUS.REJECTED]:
      "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950/30 dark:text-gray-300 dark:border-gray-700",
  };
  const getStatusIcon = (status: USER_STATUS) => {
    switch (status) {
      case USER_STATUS.ACTIVE:
        return <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>;
      case USER_STATUS.INACTIVE:
        return <div className="w-2 h-2 bg-slate-500 rounded-full"></div>;
      case USER_STATUS.PENDING:
        return <div className="w-2 h-2 bg-amber-500 rounded-full"></div>;
      case USER_STATUS.SUSPENDED:
        return <div className="w-2 h-2 bg-rose-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-slate-500 rounded-full"></div>;
    }
  };

  return (
    <>
      <Card className="group relative overflow-hidden border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-200 bg-white dark:bg-slate-800 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            {/* Header Section with Avatar and Actions */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="size-16 w-16 h-16 border-2 border-slate-200 dark:border-slate-600 shadow-md">
                    {/* Only show AvatarImage if we have a valid imageUrl, otherwise skip it entirely */}
                    {userData.imageUrl && (
                      <AvatarImage
                        src={userData.imageUrl}
                        alt={userData.name}
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = "none";
                        }}
                      />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold text-lg">
                      {getInitials(userData.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* User Basic Info */}
                <div className="space-y-2 flex-1">
                  <div>
                    <h3 className="text-lg sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      {userData.name}
                    </h3>
                    <p className="text-base font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2 mt-1">
                      <Briefcase className="size-4 text-amber-600" />
                      {userData.designation}
                    </p>
                  </div>

                  {/* Role and Status Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={`${
                        statusColors[
                          userData.status as keyof typeof statusColors
                        ]
                      } font-medium px-3 py-1 text-xs rounded-full flex items-center gap-1.5 border`}
                    >
                      {getStatusIcon(userData.status)}
                      <span className="leading-none">{userData.status}</span>
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDetails(true)}
                  className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg px-3 py-2"
                >
                  <Eye className="size-4 mr-2" />
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    View
                  </span>
                </Button>
                {currentUserRole === USER_ROLE.ADMIN && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 rounded-lg h-9 w-9 p-0"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 rounded-lg shadow-lg border bg-white dark:bg-slate-800 p-1"
                    >
                      <DropdownMenuItem
                        onClick={() => setShowDetails(true)}
                        className="rounded-md p-2.5 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/50"
                      >
                        <Eye className="size-4 mr-2 text-blue-500" />
                        <span>View Details</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => onEdit(user)}
                        className="rounded-md p-2.5 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-green-950/50"
                      >
                        <Edit className="size-4 mr-2 text-green-500" />
                        <span>Edit User</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator className="my-1" />

                      {userData.status === USER_STATUS.ACTIVE ? (
                        <DropdownMenuItem
                          onClick={() =>
                            onStatusChange(userData.id, USER_STATUS.INACTIVE)
                          }
                          className="rounded-md p-2.5 text-sm cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-950/50 text-orange-600"
                        >
                          <Activity className="size-4 mr-2" />
                          <span>Deactivate</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() =>
                            onStatusChange(userData.id, USER_STATUS.ACTIVE)
                          }
                          className="rounded-md p-2.5 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-green-950/50 text-green-600"
                        >
                          <Zap className="size-4 mr-2" />
                          <span>Activate</span>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        onClick={() => onDelete(userData.id)}
                        className="rounded-md p-2.5 text-sm cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/50 text-red-600"
                      >
                        <Trash2 className="size-4 mr-2" />
                        <span>Delete User</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* Information Grid - Updated with dynamic responsive classes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Email */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                  <Mail className="size-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    EMAIL
                  </p>
                  <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                    {userData.mail || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-md">
                  <Phone className="size-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">
                    PHONE
                  </p>
                  <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                    {userData.phoneNumber || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Entity */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                  <Building className="size-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                    ENTITY
                  </p>
                  <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                    {safeString(userData.entity)}
                  </p>
                </div>
              </div>

              {/* Team/Group */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-md">
                  <Users className="size-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                    Group
                  </p>
                  <p className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                    {safeString(userData.group)}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Info Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <User className="size-4" />
                <span>
                  <strong>ID:</strong>{" "}
                  {userData.employeeNumber || "Not assigned"}
                </span>
              </div>
              {currentUserRole === USER_ROLE.ADMIN && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(user)}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg px-3 py-2"
                >
                  <Edit className="size-4 mr-2" />
                  <span className="font-medium">Edit Profile</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <UserDetailsModal
        user={user} // Pass this card's user directly!
        open={showDetails}
        onOpenChange={setShowDetails}
        getUserById={getUserById}
        getTeamMembers={getTeamMembers}
        teamMember={teamMember}
        users={users}
      />
    </>
  );
}
