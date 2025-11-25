"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import useAuthStore from "@/store/useAuthStore";
import {
  getAllAssignedKra,
  getKrasAssignedToEmployee,
  getAllKras,
  sendRequestToCheckKra,
  changeKraProgressStatus,
} from "@/api/kra";
import type { IKra, IKraAssignment } from "@/types/kra";
import type { IUser } from "@/types/user";
import { USER_ROLE, CHECK_STATUS } from "@/constants";
import { KraAssignmentCard } from "@/components/kra/KraAssignmentCard";
import { LoadingState } from "@/components/kra/LoadingState";
import { ErrorState } from "@/components/kra/ErrorState";
import { EmptyState } from "@/components/kra/EmptyState";
import { PageHeader } from "@/components/kra/PageHeader";
import { getAllUsers, getAllUsersForDropDown } from "@/api/users";
import { useEntityContext } from "@/components/entity-components/enittyContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  InlineLoading,
  LoadMoreTrigger,
  EndOfList,
} from "@/components/LoadingComponents";
import { useToast } from "@/hooks/toast";

// Infinite Scroll Hook
interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
  threshold?: number;
  enabled?: boolean;
}

const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = "200px",
  threshold = 0.1,
  enabled = true,
}: UseInfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading && enabled) {
        console.log("📍 Infinite scroll triggered - loading more...");
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore, enabled]
  );

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!enabled) return;

    const options: IntersectionObserverInit = {
      root: null,
      rootMargin,
      threshold,
    };

    observerRef.current = new IntersectionObserver(handleObserver, options);

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, rootMargin, threshold, enabled]);

  return { sentinelRef };
};

export default function AssignedKrasPage() {
  const [assignments, setAssignments] = useState<IKraAssignment[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { user, isLoaded } = useAuthStore();
  const { selectedEntityId } = useEntityContext();
  const { toast } = useToast();

  const now = new Date();
  const [month, setMonth] = useState<number | undefined>(now.getMonth() + 1);
  const [year, setYear] = useState<number | undefined>(now.getFullYear());
  const [employee, setEmployee] = useState<string | undefined>();
  const [kra, setKra] = useState<string | undefined>();
  const [users, setUsers] = useState<IUser[]>([]);
  const [kras, setKras] = useState<IKra[]>([]);
  const [activeTab, setActiveTab] = useState("assignedToYou");

  const ITEMS_PER_PAGE = 20;

  // Load dropdown data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const requests: Promise<any>[] = [];
        if (user?.role !== USER_ROLE.USER) {
          requests.push(
            getAllUsersForDropDown({
              limit: "30",
              page: "1",
              ...(selectedEntityId ? { entityId: selectedEntityId } : {}),
            })
          );
        }
        requests.push(getAllKras({ limit: 50 }));

        const responses = await Promise.all(requests);

        if (user?.role !== USER_ROLE.USER && responses[0]?.data) {
          setUsers(responses[0].data as IUser[]);
        }

        const kraResponse = responses[responses.length - 1];
        if (kraResponse?.data) {
          setKras(kraResponse.data.kraKpis || []);
        }
      } catch (err) {
        console.error("Error loading dropdown data:", err);
      }
    };
    if (isLoaded && user) loadInitialData();
  }, [user, isLoaded, selectedEntityId]);

  // Fetch assignments with pagination
  const fetchAssignments = useCallback(
    async (pageNum: number, append: boolean = false) => {
      if (!user) return;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const filter = {
          ...(selectedEntityId ? { selectedEntityId } : {}),
          month,
          year,
          employee,
          kra,
          limit: ITEMS_PER_PAGE,
          page: pageNum,
        };

        let response;
        if (user.role === USER_ROLE.USER) {
          response = await getKrasAssignedToEmployee(user.id, filter);
        } else if (
          user.role === USER_ROLE.MANAGER &&
          activeTab === "assignedToYou"
        ) {
          response = await getKrasAssignedToEmployee(user.id, filter);
        } else if (
          user.role === USER_ROLE.MANAGER &&
          activeTab === "assignedByYou"
        ) {
          response = await getAllAssignedKra(filter);
        } else {
          response = await getAllAssignedKra(filter);
        }

        if (response.data) {
          const newAssignments = (response.data.kraAssignments ||
            []) as IKraAssignment[];
          const total = response.data.totalCount || 0;

          if (append) {
            setAssignments((prev) => [...prev, ...newAssignments]);
          } else {
            setAssignments(newAssignments);
          }

          setTotalCount(total);

          const loadedCount = append
            ? assignments.length + newAssignments.length
            : newAssignments.length;
          setHasMore(loadedCount < total);
        } else {
          setError(response.error?.displayMessage ?? "Failed to fetch data.");
        }
      } catch (err) {
        console.error("Error fetching KRA assignments:", err);
        setError(
          "An unexpected error occurred while fetching KRA assignments."
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [
      user,
      selectedEntityId,
      month,
      year,
      employee,
      kra,
      activeTab,
      assignments.length,
    ]
  );

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchAssignments(nextPage, true);
    }
  }, [page, loadingMore, hasMore, fetchAssignments]);

  // Infinite scroll hook
  const { sentinelRef } = useInfiniteScroll({
    hasMore,
    isLoading: loadingMore,
    onLoadMore: handleLoadMore,
    enabled: !loading && assignments.length > 0,
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
    setAssignments([]);
    setHasMore(true);
    fetchAssignments(1, false);
  }, [user, selectedEntityId, month, year, employee, kra, activeTab]);

  // Manual refresh handler
  const handleRefresh = () => {
    setPage(1);
    setAssignments([]);
    setHasMore(true);
    fetchAssignments(1, false);
  };

  // Handle send request to check KRA (USER only)
  const handleSendRequestToCheck = async (assignmentId: string) => {
    try {
      const response = await sendRequestToCheckKra(assignmentId);
      if (response.data) {
        toast({
          title: "Success",
          description: "Request sent to manager for verification",
          variant: "default",
        });

        // Refresh the assignments
        handleRefresh();
      } else {
        toast({
          title: "Error",
          description:
            response.error?.displayMessage ?? "Failed to send request",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error sending check request:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  // Handle change KRA status (MANAGER only)
  const handleChangeKraStatus = async (kraId: string, status: CHECK_STATUS) => {
    try {
      const response = await changeKraProgressStatus(kraId, status);

      if (response.data) {
        toast({
          title: "Success",
          description: `KRA status updated to ${status}`,
          variant: "default",
        });

        // Refresh the assignments
        handleRefresh();
      } else {
        toast({
          title: "Error",
          description:
            response.error?.displayMessage ?? "Failed to update status",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error updating KRA status:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  if (loading && assignments.length === 0) {
    return <LoadingState message="Loading KRA assignments..." />;
  }

  if (error && assignments.length === 0) {
    return <ErrorState message={error} onRetry={handleRefresh} />;
  }

  const pageTitle =
    user?.role === USER_ROLE.USER
      ? "My KRA Assignments"
      : "All KRA Assignments";
  const pageDescription =
    user?.role === USER_ROLE.USER
      ? "Track your Key Result Areas and targets."
      : "Overview of all employee KRA assignments.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <PageHeader
          title={pageTitle}
          description={pageDescription}
          onRefresh={handleRefresh}
          currentUser={user?.role ?? USER_ROLE.USER}
          entityId={selectedEntityId || undefined}
        />

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-6 mb-8 items-center">
          {/* Month Filter */}
          <select
            className="border px-4 py-3 pr-10 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-[140px]"
            value={month ?? ""}
            onChange={(e) =>
              setMonth(e.target.value ? Number(e.target.value) : undefined)
            }
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 12px center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "16px",
            }}
          >
            <option value="">All Months</option>
            {[
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
            ].map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            className="border px-4 py-3 pr-10 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-[120px]"
            value={year ?? ""}
            onChange={(e) =>
              setYear(e.target.value ? Number(e.target.value) : undefined)
            }
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 12px center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "16px",
            }}
          >
            <option value="">All Years</option>
            {Array.from({ length: 11 }, (_, i) => 2020 + i).map(
              (yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption}
                </option>
              )
            )}
          </select>

          {/* Employee Filter */}
          {user?.role !== USER_ROLE.USER && (
            <select
              className="border px-4 py-3 pr-10 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-[160px]"
              value={employee ?? ""}
              onChange={(e) => setEmployee(e.target.value || undefined)}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 12px center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "16px",
              }}
            >
              <option value="">All Employees</option>
              {users.map((u) => (
                <option key={u.id} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          )}

          {/* KRA Filter */}
          <select
            className="border px-4 py-3 pr-10 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm min-w-[140px]"
            value={kra ?? ""}
            onChange={(e) => setKra(e.target.value || undefined)}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 12px center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "16px",
            }}
          >
            <option value="">All KRAs</option>
            {kras.map((k) => (
              <option key={k.id} value={k.name.split(" (")[0].trim()}>
                {k.name}
              </option>
            ))}
          </select>
        </div>

        {/* Manager Tabs */}
        {user?.role === USER_ROLE.MANAGER ? (
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            className="mt-6"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-100 rounded-xl p-1">
              <TabsTrigger
                value="assignedToYou"
                className="data-[state=active]:bg-white data-[state=active]:shadow text-sm"
              >
                Assigned To You
              </TabsTrigger>
              <TabsTrigger
                value="assignedByYou"
                className="data-[state=active]:bg-white data-[state=active]:shadow text-sm"
              >
                Assigned By You
              </TabsTrigger>
            </TabsList>

            <TabsContent value="assignedToYou" className="mt-6">
              <AssignmentsGrid
                assignments={assignments}
                totalCount={totalCount}
                userRole={user.role}
                loadingMore={loadingMore}
                hasMore={hasMore}
                sentinelRef={sentinelRef}
                onSendRequest={handleSendRequestToCheck}
                onChangeStatus={handleChangeKraStatus}
              />
            </TabsContent>

            <TabsContent value="assignedByYou" className="mt-6">
              <AssignmentsGrid
                assignments={assignments}
                totalCount={totalCount}
                userRole={user.role}
                loadingMore={loadingMore}
                hasMore={hasMore}
                sentinelRef={sentinelRef}
                onSendRequest={handleSendRequestToCheck}
                onChangeStatus={handleChangeKraStatus}
              />
            </TabsContent>
            
          </Tabs>
        ) : (
          <AssignmentsGrid
            assignments={assignments}
            totalCount={totalCount}
            userRole={user?.role || ""}
            loadingMore={loadingMore}
            hasMore={hasMore}
            sentinelRef={sentinelRef}
            onSendRequest={handleSendRequestToCheck}
            onChangeStatus={handleChangeKraStatus}
          />
        )}
      </div>
    </div>
  );
}

function AssignmentsGrid({
  assignments,
  totalCount,
  userRole,
  loadingMore,
  hasMore,
  sentinelRef,
  onSendRequest,
  onChangeStatus,
}: {
  assignments: IKraAssignment[];
  totalCount: number;
  userRole: string;
  loadingMore: boolean;
  hasMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
  onSendRequest: (assignmentId: string) => void;
  onChangeStatus: (kraId: string, status: CHECK_STATUS) => void;
}) {
  if (assignments.length === 0)
    return (
      <EmptyState
        title="No KRA Assignments Found"
        description="No matching KRA records were found for this filter."
      />
    );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
            Assignments
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Showing {assignments.length} of {totalCount} assignment
            {totalCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 auto-rows-fr">
        {assignments.map((assignment) => (
          <KraAssignmentCard
            key={assignment._id}
            assignment={assignment}
            userRole={userRole}
          />
        ))}
      </div>

      {/* Loading More Indicator */}
      {loadingMore && <InlineLoading message="Loading more assignments..." />}

      {/* Infinite Scroll Trigger */}
      {hasMore && !loadingMore && (
        <LoadMoreTrigger sentinelRef={sentinelRef} isVisible={true} />
      )}

      {/* End of List */}
      {!hasMore && assignments.length > 0 && (
        <EndOfList totalCount={totalCount} itemName="assignments" />
      )}
    </>
  );
}
