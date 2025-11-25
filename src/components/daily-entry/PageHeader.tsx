"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";

const PageHeader: FC<{
  kraName: string;
  employeeName: string;
  periodDisplayString: string;
  completionRate: number;
}> = ({ kraName, employeeName, periodDisplayString, completionRate }) => {
  const router = useRouter();

  return (
    <div className="space-y-0">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left Section */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
            {kraName}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-300 text-xs">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-blue-500" />
              <span className="font-semibold">{periodDisplayString}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3 text-green-500" />
              <span className="font-semibold">{employeeName}</span>
            </div>
          </div>
        </div>

        {/* Right Section - Completion Rate */}
        <div className="flex items-center">
          <div className="text-center px-3 py-2 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200/30 dark:border-blue-800/30 shadow-inner">
            <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(completionRate)}%
            </div>
            <div className="text-[9px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
              Complete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
