"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Hash, FileText, ImageIcon, Clock } from "lucide-react";
import { IGroup } from "@/types/group";

interface GroupDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: IGroup;
}
export function GroupsDetailsDialog({
  open,
  onOpenChange,
  group,
}: GroupDetailsDialogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Group Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Avatar */}
          <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <Avatar className="w-16 h-16">
              <AvatarImage
                src={group.imageUrl || "/placeholder.svg"}
                alt={group.name}
              />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold">
                {group.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">{group.name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="font-mono">
                  {group.code}
                </Badge>
                <Badge
                  variant={group.isActive ? "default" : "secondary"}
                  className={
                    group.isActive ? "bg-green-100 text-green-800" : ""
                  }
                >
                  {group.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Hash className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Group ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">
                      {group.id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created At</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(group.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {group.imageUrl && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Image URL</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {group.imageUrl}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {group.isActive ? "Active " : "DeActivated "}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Description */}
          {group.description && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mt-1">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-2">Description</p>
                    <p className="text-gray-900 leading-relaxed">
                      {group.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Image Preview */}
          {group.imageUrl && (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500 mb-3">Image Preview</p>
                <div className="flex justify-center">
                  <img
                    src={group.imageUrl || "/placeholder.svg"}
                    alt={group.name}
                    className="max-w-full max-h-48 rounded-lg object-cover border border-gray-200"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
