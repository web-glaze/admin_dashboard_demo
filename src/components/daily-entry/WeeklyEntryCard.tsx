// components/daily-entry/WeeklyEntryCard.tsx
"use client";
import { FC } from "react";
import { Weeks, Days, DayInfo } from "@/types/assignment";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ModernProgressBar from "./ModernProgressBar";
import DailyEntryCell from "./DailyEntryCell";
import { Clock } from "lucide-react";

const WeeklyEntryCard: FC<{
  weekKey: keyof Weeks;
  weekIndex: number;
  weekTarget: number;
  weekAchieved: number;
  dailyData: Days;
  getWeekDays: (weekIndex: number) => DayInfo[];
  editingCell: { week: keyof Weeks; day: keyof Days } | null;
  editingValue: string;
  setEditingValue: (value: string) => void;
  handleEdit: (
    week: keyof Weeks,
    day: keyof Days,
    currentValue: number,
    isDisabled: boolean
  ) => void;
  handleSave: () => void;
  setEditingCell: (cell: { week: keyof Weeks; day: keyof Days } | null) => void;
  isViewOnly?: boolean;
}> = ({
  weekKey,
  weekIndex,
  weekTarget,
  weekAchieved,
  dailyData,
  getWeekDays,
  editingCell,
  editingValue,
  setEditingValue,
  handleEdit,
  handleSave,
  setEditingCell,
  isViewOnly,
}) => {
  const weekDays = getWeekDays(weekIndex);
  const getWeekDateRange = () => {
    const firstValidDay = weekDays.find((day) => day.isValid);
    const lastValidDay = weekDays.filter((day) => day.isValid).pop();
    if (firstValidDay && lastValidDay) {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const startDate = `${firstValidDay.date} ${
        monthNames[firstValidDay.month]
      }`;
      const endDate = `${lastValidDay.date} ${monthNames[lastValidDay.month]}`;
      return `${startDate} - ${endDate}`;
    }
    return `Week ${weekIndex + 1}`;
  };

  return (
    <Card className="overflow-hidden border bg-white/90 dark:bg-slate-900/90 border-slate-300 dark:border-slate-700 backdrop-blur-sm shadow-[0_6px_20px_rgba(0,0,0,0.15),-2px_0_10px_rgba(0,0,0,0.06),0_-4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.2),-3px_0_12px_rgba(0,0,0,0.08),0_-6px_12px_rgba(0,0,0,0.07)] transition-all duration-300 mt-6 mb-0 mx-0 pt-1">
      <CardHeader className="px-4 py-3 bg-gradient-to-r from-slate-100 via-blue-50 to-blue-100/70 dark:from-slate-900 dark:via-blue-950 dark:to-blue-900/60 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">
                Week {weekIndex + 1}{" "}
                {weekKey.includes("a") ? " (Extended)" : ""}
              </CardTitle>
              <CardDescription className="text-xs">
                <div className="font-medium text-blue-600 dark:text-blue-400">
                  📅 {getWeekDateRange()}
                </div>
              </CardDescription>
            </div>
          </div>
          {/* Right section */}
          <div className="flex flex-col items-end gap-0.5 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-right">
              <div>
                Target:{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {weekTarget.toLocaleString()}
                </span>
              </div>
              <div>
                Achieved:{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {weekAchieved.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="text-base font-bold text-blue-600 dark:text-blue-400">
              {weekTarget > 0
                ? Math.round((weekAchieved / weekTarget) * 100)
                : 0}{" "}
              %
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        <ModernProgressBar
          value={weekAchieved}
          max={weekTarget}
          label="Weekly Progress"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-1.5">
          {weekDays.map((dayInfo, dayIndex) => {
            const dayKey = `day${dayIndex + 1}` as keyof Days;
            const dayValue = dailyData?.[dayKey] || 0;
            const isEditing =
              editingCell?.week === weekKey && editingCell?.day === dayKey;
            return (
              <DailyEntryCell
                key={dayKey}
                dayInfo={dayInfo}
                dayIndex={dayIndex}
                dayValue={dayValue}
                isEditing={isEditing}
                editingValue={editingValue}
                setEditingValue={setEditingValue}
                onEdit={() =>
                  handleEdit(weekKey, dayKey, dayValue, dayInfo.isDisabled)
                }
                onSave={handleSave}
                onCancel={() => setEditingCell(null)}
                isViewOnly={isViewOnly} // pass prop to DailyEntryCell
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
export default WeeklyEntryCard;
