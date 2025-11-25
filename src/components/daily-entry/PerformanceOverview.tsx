"use client";

import { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ModernProgressBar from "./ModernProgressBar";
import { Trophy } from "lucide-react";

const PerformanceOverview: FC<{
  totalAchieved: number;
  monthlyTarget: number;
  periodDisplayString: string;
}> = ({ totalAchieved, monthlyTarget, periodDisplayString }) => {
  const remaining = Math.max(0, monthlyTarget - totalAchieved);

  return (
    <Card className="overflow-hidden border bg-white/90 dark:bg-slate-900/90 border-slate-300 dark:border-slate-700 backdrop-blur-sm shadow-[0_6px_20px_rgba(0,0,0,0.15),-2px_0_10px_rgba(0,0,0,0.06),0_-4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2),-3px_0_12px_rgba(0,0,0,0.08),0_-6px_12px_rgba(0,0,0,0.07)] transition-all duration-300 mt-8 mb-8 p-2">
      <CardHeader className="pb-3 px-4">
        <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <div className="p-1.5 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-950 dark:to-red-950 rounded-lg shadow-sm">
            <Trophy className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <span className="bg-gradient-to-r from-orange-700 to-red-600 dark:from-orange-300 dark:to-red-400 bg-clip-text text-transparent text-base font-extrabold tracking-wide">
            Performance Overview
          </span>
        </CardTitle>
        <CardDescription className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
          Track your progress for the period:{" "}
          <span className="font-medium text-slate-900 dark:text-slate-200">
            {periodDisplayString}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 px-4 pb-4">
        <ModernProgressBar
          value={totalAchieved}
          max={monthlyTarget}
          label="Period Progress"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Achieved */}
          <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 rounded-lg border border-emerald-200/40 dark:border-emerald-800/40 shadow-sm hover:scale-[1.02] transition-transform">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">
              {totalAchieved.toLocaleString()}
            </div>
            <div className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
              Achieved
            </div>
          </div>

          {/* Target */}
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg border border-blue-200/40 dark:border-blue-800/40 shadow-sm hover:scale-[1.02] transition-transform">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-0.5">
              {monthlyTarget.toLocaleString()}
            </div>
            <div className="text-[9px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
              Target
            </div>
          </div>

          {/* Remaining */}
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border border-purple-200/40 dark:border-purple-800/40 shadow-sm hover:scale-[1.02] transition-transform">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-0.5">
              {remaining.toLocaleString()}
            </div>
            <div className="text-[9px] font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide">
              Remaining
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceOverview;
