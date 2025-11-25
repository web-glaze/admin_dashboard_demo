"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface DailyEntry {
  id: string;
  kraAssignmentId: string;
  week: number;
  day: string;
  value: number;
  date: string;
}

interface KraProgressChartProps {
  kraAssignmentId: string;
  weeklyTargets: {
    week1: number;
    week2: number;
    week3: number;
    week4: number;
  };
  monthlyTarget: number;
}

export function KraProgressChart({
  kraAssignmentId,
  weeklyTargets,
  monthlyTarget,
}: KraProgressChartProps) {
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);

  useEffect(() => {
    // Load daily entries from localStorage (replace with actual API)
    const entries = JSON.parse(localStorage.getItem("dailyEntries") || "[]");
    const kraEntries = entries.filter(
      (entry: DailyEntry) => entry.kraAssignmentId === kraAssignmentId
    );
    setDailyEntries(kraEntries);
  }, [kraAssignmentId]);

  // Generate dummy data for demonstration
  const generateDummyData = () => {
    const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
    const targets = [
      weeklyTargets.week1,
      weeklyTargets.week2,
      weeklyTargets.week3,
      weeklyTargets.week4,
    ];

    return weeks.map((week, index) => {
      const weekEntries = dailyEntries.filter(
        (entry) => entry.week === index + 1
      );
      const actualValue =
        weekEntries.reduce((sum, entry) => sum + entry.value, 0) ||
        Math.floor(targets[index] * (0.7 + Math.random() * 0.6)); // Dummy data

      return {
        week,
        target: targets[index],
        actual: actualValue,
        percentage:
          targets[index] > 0
            ? Math.round((actualValue / targets[index]) * 100)
            : 0,
      };
    });
  };

  const chartData = generateDummyData();
  const totalActual = chartData.reduce((sum, item) => sum + item.actual, 0);
  const overallProgress =
    monthlyTarget > 0 ? Math.round((totalActual / monthlyTarget) * 100) : 0;

  // Daily progress data for line chart
  const dailyData = [
    { day: "Mon", week1: 12, week2: 15, week3: 18, week4: 14 },
    { day: "Tue", week1: 15, week2: 18, week3: 22, week4: 16 },
    { day: "Wed", week1: 18, week2: 20, week3: 25, week4: 19 },
    { day: "Thu", week1: 14, week2: 17, week3: 20, week4: 15 },
    { day: "Fri", week1: 16, week2: 19, week3: 23, week4: 18 },
    { day: "Sat", week1: 10, week2: 12, week3: 15, week4: 11 },
    { day: "Sun", week1: 8, week2: 10, week3: 12, week4: 9 },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">
            Overall Progress
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallProgress}%</div>
          <p className="text-xs text-muted-foreground">
            {totalActual} of {monthlyTarget} monthly target achieved
          </p>
          <div className="mt-3 w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(overallProgress, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
          <CardDescription>
            Target vs Actual achievement by week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              target: {
                label: "Target",
                color: "hsl(var(--chart-1))",
              },
              actual: {
                label: "Actual",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="target"
                  fill="var(--color-target)"
                  name="Target"
                />
                <Bar
                  dataKey="actual"
                  fill="var(--color-actual)"
                  name="Actual"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Daily Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Performance Trend</CardTitle>
          <CardDescription>Daily achievements across all weeks</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              week1: {
                label: "Week 1",
                color: "hsl(var(--chart-1))",
              },
              week2: {
                label: "Week 2",
                color: "hsl(var(--chart-2))",
              },
              week3: {
                label: "Week 3",
                color: "hsl(var(--chart-3))",
              },
              week4: {
                label: "Week 4",
                color: "hsl(var(--chart-4))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="week1"
                  stroke="var(--color-week1)"
                  name="Week 1"
                />
                <Line
                  type="monotone"
                  dataKey="week2"
                  stroke="var(--color-week2)"
                  name="Week 2"
                />
                <Line
                  type="monotone"
                  dataKey="week3"
                  stroke="var(--color-week3)"
                  name="Week 3"
                />
                <Line
                  type="monotone"
                  dataKey="week4"
                  stroke="var(--color-week4)"
                  name="Week 4"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
