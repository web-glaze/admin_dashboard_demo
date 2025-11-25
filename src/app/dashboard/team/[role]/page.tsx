"use client";
import { useParams } from "next/navigation";
import type { IUser, CreateUserData } from "@/types/user";
import { USER_ROLE, USER_STATUS } from "@/constants";
import { UserInfoCard } from "@/components/team-components/user-card-sections/user-info-card";
import { AddUserForm } from "@/components/team-components/form-sections/add-user-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Users,
  UserCheck,
  Briefcase,
  Handshake,
  Activity,
  Star,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { useUsersByRole } from "@/hooks/userByRole";
import useAuthStore from "@/store/useAuthStore";
import { useEntityContext } from "@/components/entity-components/enittyContext";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import {
  InlineLoading,
  LoadMoreTrigger,
  EndOfList,
  PageLoading,
  ErrorState,
  EmptyState,
} from "@/components/LoadingComponents";

const TeamPage = () => {
  const { role } = useParams();
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const user = useAuthStore();

  const getCurrentRole = (): USER_ROLE => {
    const roleParam = role as string;
    if (roleParam === "employee") return USER_ROLE.USER;
    if (roleParam === "manager") return USER_ROLE.MANAGER;
    if (roleParam === "partner") return USER_ROLE.PARTNER;
    return roleParam.toUpperCase() as USER_ROLE;
  };

  const { selectedEntityId } = useEntityContext();
  const currentRole = getCurrentRole();

  // Fetch data with pagination support
  const {
    users: allUsers,
    loading,
    loadingMore,
    error,
    totalCount,
    hasMore,
    refreshUsers,
    loadMore,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleStatusChange,
    getUserById,
    getTeamMembers,
    teamMember,
  } = useUsersByRole(selectedEntityId ?? undefined, currentRole);

  // Filter locally by role
  // const allMembers = allUsers?.filter((user) => user.role === currentRole);

  // Setup infinite scroll
  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoading: loadingMore,
    onLoadMore: loadMore,
    rootMargin: "200px",
    threshold: 0.1,
    enabled: !loading, // Only enable after initial load
  });

  const getRoleInfo = () => {
    const roleParam = role as string;
    switch (roleParam) {
      case "partner":
        return {
          title: "Partners",
          description:
            "Manage your business partners and external collaborators",
          icon: Handshake,
          addButtonText: "Add New Partner",
          gradient: "from-green-500 to-green-600",
        };
      case "manager":
        return {
          title: "Managers",
          description:
            "Manage your organization's managers and leadership team",
          icon: Users,
          addButtonText: "Add New Manager",
          gradient: "from-purple-500 to-purple-600",
        };
      case "employee":
        return {
          title: "Employees",
          description: "Manage your organization's employees and team members",
          icon: Briefcase,
          addButtonText: "Add New Employee",
          gradient: "from-blue-500 to-blue-600",
        };
      default:
        return {
          title: roleParam.charAt(0).toUpperCase() + roleParam.slice(1) + "s",
          description: `Manage your organization's ${roleParam}s`,
          icon: Users,
          addButtonText: `Add New ${
            roleParam.charAt(0).toUpperCase() + roleParam.slice(1)
          }`,
          gradient: "from-gray-500 to-gray-600",
        };
    }
  };

  const stats = {
    total: totalCount || 0,
    active: allUsers.filter((user) => user.status === USER_STATUS.ACTIVE)
      .length,
    inactive: allUsers.filter((user) => user.status === USER_STATUS.INACTIVE)
      .length,
  };

  const handleCreateOrUpdateUser = async (userData: CreateUserData) => {
    if (editingUser) {
      await handleUpdateUser(editingUser.id, userData);
    } else {
      await handleCreateUser(userData);
    }
  };

  const handleEditUser = (user: IUser) => {
    setEditingUser(user);
    setIsEditing(true);
    setShowAddUserForm(true);
  };

  const handleDeleteUserConfirm = async (userId: string) => {
    await handleDeleteUser(userId);
  };

  const handleStatusChangeConfirm = async (
    userId: string,
    status: USER_STATUS
  ) => {
    await handleStatusChange(userId, status);
  };

  const handleCloseForm = () => {
    setShowAddUserForm(false);
    setEditingUser(null);
    setIsEditing(false);
  };

  const roleInfo = getRoleInfo();
  const RoleIcon = roleInfo.icon;

  // Initial loading state
  if (loading) {
    return (
      <PageLoading
        message={`Loading  ${roleInfo.title.toLowerCase()}...`}
      />
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto p-6">
          <ErrorState message={error} onRetry={refreshUsers} />
        </div>
      </div>
    );
  }

  // Dynamic grid classes based on item count
  const totalMembersOnPage = allUsers.length || 0;
  let gridClasses = "grid gap-6";
  if (totalMembersOnPage === 1) {
    gridClasses += " grid-cols-1 w-full";
  } else if (totalMembersOnPage >= 2) {
    gridClasses += " grid-cols-1 sm:grid-cols-2 w-full";
  } else {
    gridClasses += " grid-cols-1 sm:grid-cols-2 w-full";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-6 space-y-8 max-w-7xl">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-background to-muted/50 border shadow-sm">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${roleInfo.gradient} text-white shadow-lg`}
                  >
                    <RoleIcon className="size-6" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {roleInfo.title}
                    </h1>
                    <p className="text-muted-foreground text-lg">
                      {roleInfo.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={refreshUsers}
                  variant="outline"
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-all duration-200 bg-transparent"
                  disabled={loading || loadingMore}
                >
                  <RefreshCw
                    className={`size-5 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
                {user.isAuthenticated &&
                  user.user?.role === USER_ROLE.ADMIN && (
                    <Button
                      onClick={() => setShowAddUserForm(true)}
                      size="lg"
                      className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Plus className="size-5 mr-2" />
                      {roleInfo.addButtonText}
                    </Button>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-bold text-white/90 uppercase tracking-wide">
                Total {roleInfo.title}
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <RoleIcon className="size-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold text-white mb-2">
                {stats.total}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Star className="size-4" />
                <span className="font-medium">Total registered</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-bold text-white/90 uppercase tracking-wide">
                Active Users
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <UserCheck className="size-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold text-white mb-2">
                {stats.active}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Activity className="size-4" />
                <span className="font-medium">Currently active</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-500 to-gray-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full -ml-8 -mb-8"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-bold text-white/90 uppercase tracking-wide">
                Inactive Users
              </CardTitle>
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="size-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-4xl font-bold text-white mb-2">
                {stats.inactive}
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <span className="font-medium">Not currently active</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <div className="space-y-6">
          {totalMembersOnPage === 0 && !loading ? (
            <EmptyState
              icon={<RoleIcon className="size-12 text-muted-foreground" />}
              title={`No ${roleInfo.title.toLowerCase()} found`}
              description={`Create your first ${role} to get started`}
              action={
                user.isAuthenticated && user.user?.role === USER_ROLE.ADMIN
                  ? {
                      label: roleInfo.addButtonText,
                      onClick: () => setShowAddUserForm(true),
                    }
                  : undefined
              }
            />
          ) : (
            <>
              <div className={gridClasses}>
                {allUsers.map((member) => (
                  <UserInfoCard
                    key={member.id}
                    user={member}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUserConfirm}
                    onStatusChange={handleStatusChangeConfirm}
                    currentUserRole={user.user?.role}
                    getUserById={getUserById}
                    getTeamMembers={getTeamMembers}
                    teamMember={teamMember}
                    users={allUsers}
                  />
                ))}
              </div>

              {/* Loading More Indicator */}
              {loadingMore && <InlineLoading message="Loading more users..." />}

              {/* Infinite Scroll Trigger */}
              {hasMore && !loadingMore && (
                <LoadMoreTrigger sentinelRef={sentinelRef} />
              )}

              {/* End of List */}
              {!hasMore && totalMembersOnPage > 0 && (
                <EndOfList
                  totalCount={stats.total}
                  itemName={roleInfo.title.toLowerCase()}
                />
              )}
            </>
          )}
        </div>

        {/* Add/Edit User Form */}
        <AddUserForm
          open={showAddUserForm}
          isEditing={isEditing}
          onOpenChange={handleCloseForm}
          onSubmit={handleCreateOrUpdateUser}
          defaultRole={currentRole}
          editingUser={editingUser}
          users={allUsers}
        />
      </div>
    </div>
  );
};

export default TeamPage;
