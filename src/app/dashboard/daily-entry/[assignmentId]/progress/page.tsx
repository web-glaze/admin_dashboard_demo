"use client";

import type React from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { IKraProgress } from "@/types/assignment";
import {
  BarChart,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  User,
  Trophy,
  Activity,
  Zap,
} from "lucide-react";
import { WeeklyPerformanceChart } from "@/components/progress-chart/WeeklyPerformanceChart";
import { OverallProgressChart } from "@/components/progress-chart/OverallProgressChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOneProgress } from "@/api/kra";

// Custom hook to fetch assignment data
function useAssignmentData() {
  const searchParams = useSearchParams();
  const kra = searchParams.get("kra");
  const employee = searchParams.get("employee");
  const month = Number(searchParams.get("month"));
  const year = Number(searchParams.get("year"));

  const [assignment, setAssignment] = useState<IKraProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!kra || !employee || !month || !year) {
      setError("Missing required params");
      setLoading(false);
      return;
    }

    const filters = { kra, employee, month, year };

    async function fetchAssignment() {
      try {
        setLoading(true);
        const res = await getOneProgress(filters);
        if (res?.data) {
          setAssignment(res.data);
        } else {
          setError("No assignment data found");
        }
      } catch (err) {
        console.error("Failed to fetch assignment:", err);
        setError("Failed to load assignment data");
      } finally {
        setLoading(false);
      }
    }

    fetchAssignment();
  }, [kra, employee, month, year]);

  return { assignment, loading, error };
}

// Helper function to get KRA name safely
function getKraName(kra: string | { name: string } | undefined): string {
  if (!kra) return "Unknown KRA";
  if (typeof kra === "string") return kra;
  return kra.name || "Unknown KRA";
}

// Helper function to get employee name safely
function getEmployeeName(
  employee: string | { name: string } | undefined
): string {
  if (!employee) return "Unknown Employee";
  if (typeof employee === "string") return employee;
  return employee.name || "Unknown Employee";
}

// Helper function to format the period string
const getPeriodString = (month: number, year: number): string => {
  const monthNames = [
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
  ];

  const startDate = new Date(year, month - 1, 15);
  const endDate = new Date(year, month, 14);

  const startMonthName = monthNames[startDate.getMonth()];
  const endMonthName = monthNames[endDate.getMonth()];

  return `${startMonthName} 15, ${startDate.getFullYear()} - ${endMonthName} 14, ${endDate.getFullYear()}`;
};

// Stat Card component
function StatCard({
  icon: Icon,
  title,
  value,
  description,
  colorClass,
  trend,
  trendValue,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
  colorClass: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}) {
  return (
    <Card
      className={`transition-all hover:shadow-md border-l-4 ${colorClass} h-full`}
    >
      <CardContent className="p-2 lg:p-1">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex-shrink-0">
            <Icon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              {title}
            </p>
            <p className="text-xl lg:text-2xl font-bold text-foreground mb-1">
              {value}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs text-muted-foreground">{description}</p>
              {trend && trendValue && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    trend === "up"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : trend === "down"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  {trendValue}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProgressPage() {
  const { assignment, loading, error } = useAssignmentData();

  const safeAssignment = useMemo(() => {
    if (!assignment) return null;
    return {
      ...assignment,
      weeklyAchieved: assignment.weeklyAchieved || {},
      weeklyTarget: assignment.weeklyTarget || {},
      monthlyTarget: assignment.monthlyTarget || 0,
    };
  }, [assignment]);

  const totalAchieved = useMemo(() => {
    if (!safeAssignment?.weeklyAchieved) return 0;
    return Object.values(safeAssignment.weeklyAchieved).reduce(
      (sum, val) => sum + (val || 0),
      0
    );
  }, [safeAssignment]);

  const progressPercentage = useMemo(() => {
    if (!safeAssignment) return 0;
    const target = safeAssignment.monthlyTarget || 1;
    return Math.round((totalAchieved / target) * 100);
  }, [totalAchieved, safeAssignment]);

  const remaining = useMemo(() => {
    if (!safeAssignment) return 0;
    return Math.max(0, (safeAssignment.monthlyTarget || 0) - totalAchieved);
  }, [safeAssignment, totalAchieved]);

  const numberOfWeeks = useMemo(() => {
    if (!safeAssignment?.weeklyAchieved) return 1;
    const weekCount = Object.keys(safeAssignment.weeklyAchieved).length;
    return weekCount > 0 ? weekCount : 1;
  }, [safeAssignment?.weeklyAchieved]);

  const kraName = safeAssignment
    ? getKraName(safeAssignment.kra)
    : "Unknown KRA";
  const employeeName = safeAssignment
    ? getEmployeeName(safeAssignment.employee)
    : "Unknown Employee";
  const periodString = safeAssignment
    ? getPeriodString(safeAssignment.month, safeAssignment.year)
    : "";

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !safeAssignment) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Activity className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-foreground">
              Data Loading Error
            </h2>
            <p className="text-muted-foreground mb-6">
              {error || "Could not load assignment data."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Performance Dashboard
            </h1>
            <div className="flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4 sm:gap-6 text-sm text-muted-foreground">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{kraName}</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <User className="h-4 w-4 text-emerald-500" />
                <span>{employeeName}</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <Calendar className="h-4 w-4 text-amber-500" />
                <span>Track your progress for the period: {periodString}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          <StatCard
            icon={Target}
            title="Monthly Target"
            value={(safeAssignment.monthlyTarget || 0).toLocaleString()}
            description="Goal for this period"
            colorClass="border-blue-500"
          />
          <StatCard
            icon={TrendingUp}
            title="Total Achieved"
            value={totalAchieved.toLocaleString()}
            description="Current progress"
            colorClass="border-emerald-500"
            trend={totalAchieved > 0 ? "up" : "neutral"}
            trendValue={
              totalAchieved > 0 ? `+${totalAchieved.toLocaleString()}` : "0"
            }
          />
          <StatCard
            icon={Clock}
            title="Remaining"
            value={remaining.toLocaleString()}
            description="Still to achieve"
            colorClass="border-amber-500"
          />
          <StatCard
            icon={Zap}
            title="Completion Rate"
            value={`${progressPercentage}%`}
            description="Overall progress"
            colorClass="border-purple-500"
            trend={
              progressPercentage >= 100
                ? "up"
                : progressPercentage >= 75
                ? "up"
                : "neutral"
            }
            trendValue={
              progressPercentage >= 100
                ? "Complete!"
                : progressPercentage >= 75
                ? "Almost there"
                : "In progress"
            }
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          <Card className="xl:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart className="h-5 w-5 text-indigo-500" />
                Weekly Performance Analysis
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Detailed breakdown of target vs achieved performance for each
                week
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[400px] lg:h-[450px]">
                <WeeklyPerformanceChart assignment={safeAssignment} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-emerald-500" />
                Overall Progress
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Visual summary of your total achievement
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[400px] lg:h-[450px]">
                <OverallProgressChart assignment={safeAssignment} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5 text-blue-500" />
              Performance Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              <div className="text-center p-4 lg:p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                  Target Achievement
                </h4>
                <p className="text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {progressPercentage}%
                </p>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                  {totalAchieved.toLocaleString()} /{" "}
                  {(safeAssignment.monthlyTarget || 0).toLocaleString()}
                </p>
              </div>

              <div className="text-center p-4 lg:p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
                <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
                  Weekly Average
                </h4>
                <p className="text-2xl lg:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round(totalAchieved / numberOfWeeks).toLocaleString()}
                </p>
                <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                  Per week achieved
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
