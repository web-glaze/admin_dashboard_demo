"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { AssignKraDialog } from "@/components/kra/assignkraDialog";
import { USER_ROLE } from "@/constants";

interface PageHeaderProps {
  title: string;
  description: string;
  onRefresh: () => void;
  children?: React.ReactNode;
  currentUser: USER_ROLE;
  entityId?: string;
}

export function PageHeader({
  title,
  description,
  onRefresh,
  children,
  currentUser,
  entityId,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ">
      {/* Title + Description */}
      <div className="flex-1 space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          {description}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {children}

        {/* Conditionally render AssignKraDialog */}
        {(currentUser === USER_ROLE.PARTNER ||
          currentUser === USER_ROLE.MANAGER) && (
          <AssignKraDialog entityId={entityId} />
        )}

        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          className="gap-2 text-sm font-medium px-4 py-2 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
}
