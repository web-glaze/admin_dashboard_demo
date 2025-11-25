import {
  createAUser,
  deleteAUser,
  fetchUsersByRole,
  updateAuser,
  updateUserStatus,
  fetchUserById,
  getAllUsers,
  getTeamMembersApi,
} from "@/api/users";
import { USER_ROLE, USER_STATUS } from "@/constants";
import { CreateUserData, IUser } from "@/types/user";
import { useEffect, useState, useCallback, useRef } from "react";
import { ErrorResponseSchema } from "@/types/responseError";
import toast from "react-hot-toast";

const ITEMS_PER_PAGE = 10;

export function useUsersByRole(entityId?: string, role?: USER_ROLE) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [teamMember, setTeamMember] = useState<IUser[]>([]);
  const [teamMemberTotalCount, setTeamMemberTotalCount] = useState<number>(0);

  // ✅ Prevent duplicate API hits
  const isFetchingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // ✅ Fetch users with page-based pagination
  const fetchUserList = useCallback(
    async (pageNum: number, isAppending = false) => {
      // Prevent duplicate calls
      if (isFetchingRef.current) {
        console.warn("⚠️ Skipping duplicate fetch (already fetching)");
        return;
      }

      isFetchingRef.current = true;

      if (!isAppending) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setError(null);

      try {
        const params = {
          limit: ITEMS_PER_PAGE.toString(),
          page: pageNum.toString(),
          entityId,
        };

        let response;
        if (role) {
          response = await fetchUsersByRole(params, role);
        } else {
          response = await getAllUsers(params);
        }

        if (response.data) {
          const newUsers = response.data;
          const total = response.totalCount ?? 0;

          setTotalCount(total);

          if (isAppending) {
            // Append new users, prevent duplicates
            setUsers((prev) => {
              const existingIds = new Set(prev.map(u => u.id));
              const uniqueNewUsers = newUsers.filter(u => !existingIds.has(u.id));
              return [...prev, ...uniqueNewUsers];
            });
          } else {
            // Replace all users (first page)
            setUsers(newUsers);
          }

          // Calculate if there's more to load
          const currentLoadedCount = isAppending 
            ? users.length + newUsers.length 
            : newUsers.length;
          
          setHasMore(currentLoadedCount < total);

          console.log(`✅ Loaded ${currentLoadedCount} of ${total} users (page ${pageNum})`);
        }
      } catch (err) {
        const message =
          (err as ErrorResponseSchema).error?.displayMessage ??
          "Failed to fetch users";
        
        setError(message);
        
        // Only show toast on initial load failure
        if (!isAppending) {
          toast.error(message);
        }
        
        console.error("❌ Fetch error:", err);
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [role, entityId, users.length]
  );

  // ✅ Load more function for infinite scroll
  const loadMore = useCallback(() => {
    if (!hasMore || loadingMore || isFetchingRef.current) {
      console.log("⏸️ Skipping loadMore:", { hasMore, loadingMore, isFetching: isFetchingRef.current });
      return;
    }

    const nextPage = currentPage + 1;
    console.log(`📄 Loading page ${nextPage}...`);
    
    setCurrentPage(nextPage);
    fetchUserList(nextPage, true);
  }, [hasMore, loadingMore, currentPage, fetchUserList]);

  // ✅ Refresh users (reset to page 1)
  const refreshUsers = useCallback(() => {
    console.log("🔄 Refreshing users...");
    setCurrentPage(1);
    setHasMore(true);
    setUsers([]);
    setError(null);
    hasInitializedRef.current = false;
    fetchUserList(1, false);
  }, [fetchUserList]);

  // ✅ Initial load - ONLY once when role or entityId changes
  useEffect(() => {
    // Prevent multiple initializations
    if (hasInitializedRef.current) {
      return;
    }

    console.log("🚀 Initializing user fetch for role:", role);
    hasInitializedRef.current = true;
    
    setCurrentPage(1);
    setUsers([]);
    setHasMore(true);
    setError(null);
    
    fetchUserList(1, false);

    // Cleanup on unmount
    return () => {
      hasInitializedRef.current = false;
      isFetchingRef.current = false;
    };
  }, [role, entityId]); // Re-initialize when role or entityId changes

  // ✅ Create user
  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      const response = await createAUser(userData);
      if (response.data) {
        toast.success("User Created Successfully");
        
        // Optimistically add to list
        setUsers((prev) => [response.data as IUser, ...prev]);
        setTotalCount((prev) => prev + 1);
      }
    } catch (err) {
      toast.error(
        (err as ErrorResponseSchema).error?.displayMessage ??
          "Failed to create user"
      );
      throw err;
    }
  };

  // ✅ Update user
  const handleUpdateUser = async (
    userId: string,
    userData: Partial<CreateUserData>
  ) => {
    try {
      const response = await updateAuser(userId, userData);
      if (response.data) {
        toast.success("User Updated Successfully");
        
        // Update in local state
        setUsers((prev) =>
          prev.map((u) => 
            u.id === userId ? { ...u, ...response.data } as IUser : u
          )
        );
      }
    } catch (err) {
      toast.error(
        (err as ErrorResponseSchema).error?.displayMessage ??
          "Failed to update user"
      );
      throw err;
    }
  };

  // ✅ Delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteAUser(userId);
      toast.success("User Deleted Successfully");
      
      // Remove from local state
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      toast.error(
        (err as ErrorResponseSchema).error?.displayMessage ??
          "Failed to delete user"
      );
      throw err;
    }
  };

  // ✅ Update user status
  const handleStatusChange = async (userId: string, status: USER_STATUS) => {
    try {
      const response = await updateUserStatus(userId, status);
      if (response.data) {
        // Update in local state
        setUsers((prev) =>
          prev.map((u) => 
            u.id === userId ? { ...u, status } as IUser : u
          )
        );
        toast.success("Status Updated Successfully");
      }
    } catch (err) {
      toast.error(
        (err as ErrorResponseSchema).error?.displayMessage ??
          "Failed to update status"
      );
      throw err;
    }
  };

  // ✅ Fetch single user
  const getUserById = async (userId: string) => {
    try {
      const response = await fetchUserById(userId);
      return response.data as IUser;
    } catch (err) {
      toast.error(
        (err as ErrorResponseSchema).error?.displayMessage ??
          "Failed to fetch user"
      );
      return null;
    }
  };

  // ✅ Get team members
  const getTeamMembers = async (userId: string) => {
    try {
      const response = await getTeamMembersApi(userId);
      setTeamMember(response.data?.users || []);
      setTeamMemberTotalCount(response.data?.totalCount || 0);
    } catch (err) {
      toast.error(
        (err as ErrorResponseSchema).error?.displayMessage ??
          "Failed to fetch Team Members"
      );
    }
  };

  return {
    users,
    loading,
    loadingMore,
    error,
    totalCount,
    currentPage,
    hasMore,
    getTeamMembers,
    teamMember,
    teamMemberTotalCount,
    refreshUsers,
    loadMore,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleStatusChange,
    getUserById,
  };
}