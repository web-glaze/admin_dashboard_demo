"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
} from "lucide-react";
import { CreateEntityDialog } from "@/components/entity-components/create-entity-dialog";
import { EditEntityDialog } from "@/components/entity-components/edit-entity-dialog";
import { EntityDetailsDialog } from "@/components/entity-components/entity-detials-dialog";
import { deleteGroup, getAllGropus } from "@/api/group";
import { IGroup } from "@/types/group";
import { EditGroupDialog } from "@/components/groups-components/edit-group-dialog";
import { CreateGroupDialog } from "@/components/groups-components/create_groups_dialog";
import { GroupsDetailsDialog } from "@/components/groups-components/group-details-dialog";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function GroupsPage() {
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filteredEntities, setFilteredEntities] = useState<IGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntity, setSelectedEntity] = useState<IGroup | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<IGroup | null>(null);

  useEffect(() => {
    fetchEntities();
  }, []);

  const fetchEntities = async () => {
    try {
      setLoading(true);
      const response = await getAllGropus(); // Pass appropriate filters  accordingly check api/group.ts;
      if (response.data) {
        const data = response.data.groups as IGroup[];
        setGroups(data);
        setTotalCount(response.data.totalCount);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await deleteGroup(id);
      if (response.data) {
        setGroups(groups.filter((group) => group.id !== id));
        setTotalCount(totalCount - 1);
        setShowDeleteDialog(false);
        toast.success("Group deleted successfully!");
        setGroupToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Failed to delete group. Please try again.");
    }
  };

  const handleEdit = (group: IGroup) => {
    setSelectedEntity(group);
    setShowEditDialog(true);
  };

  const handleView = (group: IGroup) => {
    setSelectedEntity(group);
    setShowDetailsDialog(true);
  };

  const confirmDelete = (group: IGroup) => {
    setGroupToDelete(group);
    setShowDeleteDialog(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            Group Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your groups with powerful tools for creation, editing, and
            organization
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-2xl font-medium text-blue-600  gap-2">
              <p className="">Total Groups</p>
              <p className=" text-3xl">{totalCount}</p>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Groups
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Manage and organize your groups efficiently
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-3">
                {/* <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-300 hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button> */}
                {/* <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button> */}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search and Filter */}
            {/* <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search groups by name, code, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div> */}

            {/* Table */}
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="uppercase tracking-wide text-xs font-bold text-gray-700">
                      Group
                    </TableHead>
                    <TableHead className="uppercase tracking-wide text-xs font-bold text-gray-700">
                      Code
                    </TableHead>
                    <TableHead className="uppercase tracking-wide text-xs font-bold text-gray-700">
                      Description
                    </TableHead>
                    <TableHead className="uppercase tracking-wide text-xs font-bold text-gray-700">
                      Created
                    </TableHead>
                    {/* <TableHead className="uppercase tracking-wide text-xs font-bold text-gray-700">
                      Status
                    </TableHead> */}
                    <TableHead className="uppercase tracking-wide text-xs font-bold text-gray-700 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={6}>
                          <div className="flex items-center space-x-4 animate-pulse">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : groups.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Search className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900">
                              No groups found 🎯
                            </h3>
                            <p className="text-gray-500">
                              {searchTerm
                                ? "Try adjusting your search terms"
                                : "Get started by creating your first group"}
                            </p>
                          </div>
                          {!searchTerm && (
                            <Button
                              onClick={() => setShowCreateDialog(true)}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Create Group
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    groups?.map((group, idx) => (
                      <TableRow
                        key={group.id}
                        className={cn(
                          "transition-colors hover:bg-gray-50",
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        )}
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={group.imageUrl || "/placeholder.svg"}
                                alt={group.name}
                              />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold">
                                {group.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {group.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: {group.id.substring(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="font-mono px-2 py-1"
                          >
                            {group.code}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-gray-700 truncate">
                            {group.description || "No description"}
                          </p>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {formatDate(group.createdAt)}
                        </TableCell>
                        {/* <TableCell>
                          <Badge
                            variant={group.isActive ? "default" : "secondary"}
                            className={cn(
                              "px-3 py-1 rounded-full text-sm font-medium",
                              group.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-200 text-gray-600"
                            )}
                          >
                            {group.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell> */}
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-8 h-8 p-0 hover:bg-gray-100"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => handleView(group)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEdit(group)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Group
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => confirmDelete(group)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Group
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <CreateGroupDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={fetchEntities}
      />

      {selectedEntity && (
        <>
          <EditGroupDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            group={selectedEntity}
            onSuccess={fetchEntities}
          />

          <GroupsDetailsDialog
            open={showDetailsDialog}
            onOpenChange={setShowDetailsDialog}
            group={selectedEntity}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{groupToDelete?.name}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => groupToDelete && handleDelete(groupToDelete.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
