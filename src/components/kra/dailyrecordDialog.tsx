"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock } from "lucide-react";

interface DailyEntry {
  id: string;
  kraAssignmentId: string;
  week: number;
  day: string;
  value: number;
  date: string;
}

interface DailyRecordsDisplayProps {
  kraAssignmentId: string;
  weeklyTargets: {
    week1: number;
    week2: number;
    week3: number;
    week4: number;
  };
}

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function DailyRecordsDisplay({
  kraAssignmentId,
  weeklyTargets,
}: DailyRecordsDisplayProps) {
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);

  useEffect(() => {
    loadDailyEntries();
  }, [kraAssignmentId]);

  const loadDailyEntries = () => {
    // Load from localStorage (replace with actual API call)
    const allEntries = JSON.parse(localStorage.getItem("dailyEntries") || "[]");
    const kraEntries = allEntries.filter(
      (entry: DailyEntry) => entry.kraAssignmentId === kraAssignmentId
    );
    setDailyEntries(kraEntries);
  };

  const getWeeklyAchievement = (week: number): number => {
    return dailyEntries
      .filter((entry) => entry.week === week)
      .reduce((sum, entry) => sum + entry.value, 0);
  };

  const getDayEntry = (week: number, day: string): DailyEntry | undefined => {
    return dailyEntries.find(
      (entry) => entry.week === week && entry.day === day
    );
  };

  const getWeekTarget = (week: number): number => {
    switch (week) {
      case 1:
        return weeklyTargets.week1;
      case 2:
        return weeklyTargets.week2;
      case 3:
        return weeklyTargets.week3;
      case 4:
        return weeklyTargets.week4;
      default:
        return 0;
    }
  };

  const getWeekProgress = (week: number): number => {
    const achievement = getWeeklyAchievement(week);
    const target = getWeekTarget(week);
    return target > 0 ? Math.round((achievement / target) * 100) : 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        <h3 className="text-lg font-semibold">
          Daily Records & Weekly Progress
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((week) => {
          const weeklyAchievement = getWeeklyAchievement(week);
          const weeklyTarget = getWeekTarget(week);
          const progress = getWeekProgress(week);

          return (
            <Card key={week} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Week {week}</CardTitle>
                  <Badge
                    variant={
                      progress >= 100
                        ? "default"
                        : progress >= 50
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {progress}%
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Target: {weeklyTarget} | Achieved: {weeklyAchievement}
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                {/* Progress Bar */}
                <div className="w-full bg-muted rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progress >= 100
                        ? "bg-green-500"
                        : progress >= 50
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>

                {/* Daily Entries */}
                <div className="space-y-1">
                  {daysOfWeek.map((day) => {
                    const entry = getDayEntry(week, day);
                    return (
                      <div
                        key={day}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-1">
                          {entry ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <Clock className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span
                            className={
                              entry
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }
                          >
                            {day.slice(0, 3)}
                          </span>
                        </div>
                        <span
                          className={
                            entry ? "font-medium" : "text-muted-foreground"
                          }
                        >
                          {entry ? entry.value : "-"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Entries */}
      {dailyEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dailyEntries
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .slice(0, 5)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        W{entry.week}
                      </Badge>
                      <span>{entry.day}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {entry.date}
                      </span>
                    </div>
                    <span className="font-medium">{entry.value}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
