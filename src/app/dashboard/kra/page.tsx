"use client";
import React, { useEffect, useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { IKra, KraFilter } from "@/types/kra";
import { getAllKras } from "@/api/kra";
import { KRA_STATUS, USER_ROLE } from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateKraDialog from "@/components/kra/createKraDialog";
import useAuthStore from "@/store/useAuthStore";

export default function App() {
  const [kras, setKras] = useState<IKra[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const fetchKras = async () => {
    try {
      const filter: KraFilter = {
        limit: 50,
        page: 1,
        ...(searchTerm && { name: searchTerm }),
      };
      const res = await getAllKras(filter); // add more filters accrodingly check KraFilter type in /types/kra.ts
      if (res.data) {
        setKras(res.data.kraKpis);
        setTotalCount(res.data.totalCount);
      }
    } catch (error) {
      console.error("Failed to fetch KRAs:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchKras();
  }, [searchTerm]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchKras();
  };
  const user = useAuthStore();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case KRA_STATUS.ACTIVE:
        return <Badge variant="default">Active</Badge>;
      case KRA_STATUS.INACTIVE:
        return <Badge variant="destructive">Inactive</Badge>;

      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 px-16">
      <div className="container  p-6  space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              KRA Management
            </h1>
            <p className="text-muted-foreground">
              Manage your Key Result Areas effectively
            </p>
          </div>
          {user.user?.role === USER_ROLE.MANAGER && (
            <CreateKraDialog
              open={showCreateDialog}
              onOpenChange={setShowCreateDialog}
              onSuccess={fetchKras}
            />
          )}
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search KRAs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg border shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Loading KRAs...</span>
              </div>
            </div>
          ) : kras.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-muted-foreground">
                  No KRAs found
                </p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm
                    ? "Try adjusting your search criteria"
                    : "Get started by creating your first KRA"}
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Code</TableHead>
                  <TableHead className="min-w-[200px]">Name</TableHead>
                  <TableHead className="min-w-[250px]">Description</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[130px]">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kras.map((kra) => (
                  <TableRow key={kra._id} className="hover:bg-gray-50/50">
                    <TableCell className="font-mono text-sm">
                      {kra.code}
                    </TableCell>
                    <TableCell className="font-medium">{kra.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[250px] truncate">
                      {kra.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{kra.kra_type}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(kra.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(kra.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Footer Stats */}
        {kras.length > 0 && (
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              Showing {totalCount} KRA{totalCount !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
