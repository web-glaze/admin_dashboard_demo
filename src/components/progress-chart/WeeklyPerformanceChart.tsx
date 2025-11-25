// FILE: src/components/progress-chart/WeeklyPerformanceChart.tsx

"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts"
import { ChartContainer, ChartTooltip, ChartLegend } from "@/components/ui/chart"
import type { IKraProgress } from "@/types/assignment"
import * as React from "react"

const chartConfig = {
  target: {
    label: "Weekly Target",
    color: "#3B82F6", // Blue 500
  },
  achieved: {
    label: "Achieved",
    color: "#059669", // Emerald 600
  },
}

interface WeekData {
  week: string
  weekNumber: number
  target: number
  achieved: number
  difference: number
  achievementRate: number
  status: "exceeded" | "met" | "below"
}

// Define tooltip props
interface TooltipProps {
  active?: boolean
  payload?: Array<{
    payload: WeekData
    value: number
    dataKey: string
    color: string
  }>
  label?: string
}

export function WeeklyPerformanceChart({ assignment }: { assignment: IKraProgress }) {
  const chartData: WeekData[] = React.useMemo(() => {
    if (!assignment.weeklyTarget || !assignment.weeklyAchieved) {
      return []
    }

    // Dynamically get and sort week keys to handle a variable number of weeks (e.g., 4 or 5).
    // Uses a natural sort to handle keys like 'week4' and 'week4a' correctly.
    const weekKeys = Object.keys(assignment.weeklyTarget).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
    )

    return weekKeys.map((weekKey, index) => {
      const target = assignment.weeklyTarget[weekKey as keyof typeof assignment.weeklyTarget] || 0
      const achieved = assignment.weeklyAchieved[weekKey as keyof typeof assignment.weeklyAchieved] || 0
      const difference = achieved - target
      const achievementRate = target > 0 ? (achieved / target) * 100 : 0

      let status: "exceeded" | "met" | "below" = "below"
      if (achievementRate >= 100) status = achieved > target ? "exceeded" : "met"

      return {
        week: `Week ${index + 1}`, // Label remains sequential
        weekNumber: index + 1,
        target,
        achieved,
        difference,
        achievementRate,
        status,
      }
    })
  }, [assignment.weeklyTarget, assignment.weeklyAchieved])

  // Custom tooltip component
  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const data = payload[0].payload as WeekData

    return (
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 min-w-[220px]">
        <p className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{label}</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-blue-600 dark:text-blue-400">Target:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{data.target.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-emerald-600 dark:text-emerald-400">Achieved:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{data.achieved.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">Difference:</span>
            <span
              className={`font-medium ${
                data.difference >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {data.difference >= 0 ? "+" : ""}
              {data.difference.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-600">
            <span className="text-sm text-slate-500 dark:text-slate-400">Achievement Rate:</span>
            <span
              className={`font-bold ${
                data.achievementRate >= 100
                  ? "text-emerald-600 dark:text-emerald-400"
                  : data.achievementRate >= 80
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-red-600 dark:text-red-400"
              }`}
            >
              {data.achievementRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col">
      <ChartContainer config={chartConfig} className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            barGap={10}
            barCategoryGap={15}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
            <XAxis
              dataKey="week"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />

            {chartData.length > 0 && (
              <ReferenceLine
                y={Math.max(...chartData.map((d) => d.target))}
                stroke="#059669"
                strokeDasharray="5 5"
                opacity={0.7}
                label={{
                  value: "Target Line",
                  fontSize: 11,
                  fill: "#059669",
                  position: "insideTopRight",
                }}
              />
            )}

            <ChartTooltip cursor={{ fill: "rgba(59, 130, 246, 0.05)", radius: 4 }} content={<CustomTooltip />} />

            <ChartLegend
              content={() => (
                <div className="flex justify-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-3 rounded-sm border border-white shadow-sm"
                      style={{ backgroundColor: chartConfig.target.color }}
                    />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Weekly Target</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-3 rounded-sm border border-white shadow-sm"
                      style={{ backgroundColor: chartConfig.achieved.color }}
                    />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Achieved</span>
                  </div>
                </div>
              )}
            />

            <Bar
              dataKey="target"
              fill={chartConfig.target.color}
              radius={[4, 4, 0, 0]}
              opacity={0.8}
              name="Target"
              minPointSize={2}
            />
            <Bar
              dataKey="achieved"
              fill={chartConfig.achieved.color}
              radius={[4, 4, 0, 0]}
              name="Achieved"
              minPointSize={2}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="flex justify-center gap-3 mt-6 mb-2">
        {chartData.map((week, index) => (
          <div
            key={index}
            className={`w-12 h-3 rounded-full shadow-sm border border-white transition-all hover:scale-110 ${
              week.status === "exceeded"
                ? "bg-emerald-500"
                : week.status === "met"
                  ? "bg-green-500"
                  : week.achievementRate >= 80
                    ? "bg-amber-500"
                    : week.achievementRate > 0
                      ? "bg-orange-500"
                      : "bg-red-500"
            }`}
            title={`${week.week}: ${week.achievementRate.toFixed(1)}% (${week.achieved.toLocaleString()}/${week.target.toLocaleString()})`}
          />
        ))}
      </div>
      <p className="text-center text-xs text-slate-500 dark:text-slate-400">Weekly Performance Indicators</p>
    </div>
  )
}
