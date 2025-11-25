// FILE: src/components/kra/KraAssignmentCard.tsx
"use client";

import type React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { AssignKra, IKraAssignment, Weeks } from "@/types/kra";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  User,
  Trophy,
  Target,
  MinusCircle,
  TrendingUp,
} from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { USER_ROLE } from "@/constants";

// --- Helper Functions ---
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

const calculateAchieved = (weeklyTarget: Weeks): number =>
  weeklyTarget.week1 +
  weeklyTarget.week2 +
  weeklyTarget.week3 +
  weeklyTarget.week4 +
  (weeklyTarget.week4a ?? 0);

const getProgressColor = (percentage: number): string => {
  if (percentage >= 100) return "from-emerald-500 to-green-500";
  if (percentage >= 75) return "from-blue-500 to-indigo-500";
  if (percentage >= 50) return "from-yellow-500 to-orange-500";
  return "from-red-500 to-pink-500";
};

// --- Reusable StatBox ---
interface StatBoxProps {
  icon: React.ElementType;
  title: string;
  value: string;
  color: "green" | "blue" | "purple";
}

function StatBox({ icon: Icon, title, value, color }: StatBoxProps) {
  const colorClasses = {
    green:
      "from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200/60",
    blue: "from-blue-50 to-blue-100 text-blue-700 border-blue-200/60",
    purple: "from-purple-50 to-purple-100 text-purple-700 border-purple-200/60",
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} border p-4 rounded-lg text-center shadow-sm`}
    >
      <Icon className="mx-auto h-4 w-4 mb-2 opacity-80" />
      <div className="text-base font-bold">{value}</div>
      <div className="text-xs font-medium uppercase tracking-wide opacity-75">
        {title}
      </div>
    </div>
  );
}

// --- Circular Progress ---
interface CircularProgressProps {
  percentage: number;
  size?: number;
}

function CircularProgress({ percentage, size = 64 }: CircularProgressProps) {
  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-slate-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progress-gradient)"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
        <defs>
          <linearGradient
            id="progress-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-slate-700">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

// --- Main Card ---
interface KraAssignmentCardProps {
  assignment: IKraAssignment;
  userRole: string;
}

export function KraAssignmentCard({
  assignment,
  userRole,
}: KraAssignmentCardProps) {
  const loggedInUser = useAuthStore(); // ✅ move here
  const user = loggedInUser.user;
  const achieved = assignment.monthlyAchieved ?? 0;
  const target = assignment.monthlyTarget;
  const remaining = Math.max(0, target - achieved);
  const progressPercentage = assignment.progressPercent ?? 0;
  const dataToPass = encodeURIComponent(JSON.stringify(assignment));
  // const user = useAuthStore();

  return (
    <Card className="overflow-hidden border bg-white/90 dark:bg-slate-900/90 border-slate-300 dark:border-slate-700 backdrop-blur-sm shadow-[0_6px_20px_rgba(0,0,0,0.15),-2px_0_10px_rgba(0,0,0,0.06),0_-4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2),-3px_0_12px_rgba(0,0,0,0.08),0_-6px_12px_rgba(0,0,0,0.07)] transition-all duration-300 mt-8 mb-4 p-2">
      <CardContent className="p-6">
        {/* --- Header --- */}
        <div className="flex justify-between items-start gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
              {assignment.kra.name}
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 text-base text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                <span>
                  {monthNames[assignment.month - 1]} {assignment.year}
                </span>
              </div>
              {userRole !== "user" && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="truncate">{assignment.employee.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Progress Circle */}
          <div className="flex-shrink-0">
            <CircularProgress percentage={progressPercentage} size={60} />
          </div>
        </div>

        {/* --- Performance --- */}
        <div className="bg-slate-50/80 p-4 rounded-lg border border-slate-100 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Trophy className="h-4 w-4 text-amber-600" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700">
              Performance Overview
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatBox
              icon={Trophy}
              title="Achieved"
              value={achieved.toLocaleString()}
              color="green"
            />
            <StatBox
              icon={Target}
              title="Target"
              value={target.toLocaleString()}
              color="blue"
            />
            <StatBox
              icon={MinusCircle}
              title="Remaining"
              value={remaining.toLocaleString()}
              color="purple"
            />
          </div>

          {/* Modern Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-medium text-slate-700">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Period Progress
              </span>
              <span>
                {achieved.toLocaleString()} / {target.toLocaleString()}
              </span>
            </div>

            <div className="relative">
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${getProgressColor(
                    progressPercentage
                  )} h-2.5 rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>

            <div className="text-center">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  progressPercentage >= 100
                    ? "bg-green-100 text-green-800"
                    : progressPercentage >= 75
                    ? "bg-blue-100 text-blue-800"
                    : progressPercentage >= 50
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {progressPercentage >= 100
                  ? "🎉 Target Achieved!"
                  : progressPercentage >= 75
                  ? "🔥 Excellent Progress"
                  : progressPercentage >= 50
                  ? "⚡ Good Progress"
                  : "📈 Keep Going"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* --- Actions --- */}
          {(() => {
            // user apne hi KRA me entry kar sakta hai
            const canUserAdd = userRole === USER_ROLE.USER;

            // manager sirf apne assigned KRA me entry kar sakta hai
            const canManagerAdd =
              userRole === USER_ROLE.MANAGER &&
              assignment.employee?._id === user?._id;

            // partner sirf view karega
            const canPartnerView = userRole === USER_ROLE.PARTNER;
            const canManagerView =
              userRole === USER_ROLE.MANAGER &&
              assignment.employee?._id !== user?._id;

            if (canUserAdd || canManagerAdd) {
              return (
                <div className="flex flex-wrap gap-3 pt-2 justify-start">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 
            hover:from-indigo-700 hover:to-blue-700 text-white font-medium 
            py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                  >
                    <Link
                      href={`/dashboard/daily-entry/${assignment._id}/entry?kra=${assignment.kra._id}&employee=${assignment.employee._id}&month=${assignment.month}&year=${assignment.year}`}
                    >
                      + Add Entry
                    </Link>
                  </Button>
                </div>
              );
            } else if (canPartnerView || canManagerView) {
              return (
                <div className="flex flex-wrap gap-3 pt-2 justify-start">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 
            hover:from-indigo-700 hover:to-blue-700 text-white font-medium 
            py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                  >
                    <Link
                      href={`/dashboard/daily-entry/${assignment._id}/entry?kra=${assignment.kra._id}&employee=${assignment.employee._id}&month=${assignment.month}&year=${assignment.year}`}
                    >
                      View Record
                    </Link>
                  </Button>
                </div>
              );
            }

            return null;
          })()}

          {/* --- Show Progress --- */}
          {(userRole === USER_ROLE.MANAGER ||
            userRole === USER_ROLE.USER ||
            userRole === USER_ROLE.PARTNER) && (
            <div className="flex flex-wrap gap-3 pt-2 justify-start">
              <Button
                asChild
                variant="outline"
                className="bg-white border-slate-300 hover:bg-slate-50 
        hover:border-indigo-500 hover:text-indigo-600 font-medium 
        py-2 px-4 rounded-lg transition-all duration-300 text-sm"
              >
                <Link
                  href={`/dashboard/daily-entry/${assignment._id}/progress?kra=${assignment.kra._id}&employee=${assignment.employee._id}&month=${assignment.month}&year=${assignment.year}`}
                >
                  Show Progress
                </Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
