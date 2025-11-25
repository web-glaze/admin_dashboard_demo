import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Edit,
  MoreVertical,
  Eye,
  EyeOff,
  Trash2,
  Building,
} from "lucide-react";
import { IGroup } from "@/types/group";

interface GroupsCardProps {
  group: IGroup;
  onEdit: (group: IGroup) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export default function GroupsCard({
  group,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
}: GroupsCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="group h-full">
      <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden relative hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div
          className={`h-2 w-full bg-gradient-to-r ${
            group.isActive
              ? "from-green-400 to-emerald-500"
              : "from-gray-400 to-slate-500"
          }`}
        />
        <CardContent className="p-6 relative z-10 h-full flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                {group.imageUrl ? (
                  <img
                    src={group.imageUrl || "/placeholder.svg"}
                    alt={group.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200 transition-colors flex-shrink-0">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
                    {group.name}
                  </h3>
                  <p className="text-sm text-slate-500 truncate">
                    Code: {group.code}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <Badge
                variant={group.isActive ? "default" : "secondary"}
                className={`${
                  group.isActive
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                    : "bg-gradient-to-r from-gray-400 to-slate-500 text-white"
                } shadow-sm`}
              >
                {group.isActive ? "Active" : "Inactive"}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white/95 backdrop-blur-sm"
                >
                  {onViewDetails && (
                    <>
                      <DropdownMenuItem
                        onClick={() => onViewDetails(group.id)}
                        className="cursor-pointer"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={() => onEdit(group)}
                    className="cursor-pointer"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Group
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onToggleStatus(group.id)}
                    className="cursor-pointer"
                  >
                    {group.isActive ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(group.id)}
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Group
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <p className="text-sm text-slate-600 mb-4 flex-1 line-clamp-3">
              {group.description || "No description provided"}
            </p>

            <div className="flex flex-col gap-2 text-sm text-slate-500 mt-auto">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  Created: {formatDate(group.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
