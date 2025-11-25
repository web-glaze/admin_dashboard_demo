// FILE: src/components/charts/OverallProgressChart.tsx

"use client"

import * as React from "react"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import type { IKraProgress } from "@/types/assignment"

// Define the chart data item type
interface ChartDataItem {
  name: string
  value: number
  color: string
  percentage: number
}

// Define props for custom label
interface CustomLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percentage: number
}

// Custom label component for displaying percentages on the pie slices
const renderCustomLabel = (props: CustomLabelProps) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percentage } = props
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  // Always show label, even if percentage is 100
  if (percentage < 2) return null

  return (
    <text
      x={x}
      y={y}
      fill="#ffffff"
      textAnchor="middle"
      dominantBaseline="central"
      className="font-bold text-[13px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]"
    >
      {`${percentage.toFixed(0)}%`}
    </text>
  )
}

// Define props for custom legend
interface LegendPayload {
  value: string
  color: string
  payload: ChartDataItem
}

interface CustomLegendProps {
  payload?: LegendPayload[]
}

// Custom legend component
const CustomLegend: React.FC<CustomLegendProps> = ({ payload }) => {
  if (!payload) return null

  return (
    <div className="flex justify-center gap-6 mt-4 flex-wrap">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full shadow-sm border border-slate-200 dark:border-slate-600"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {entry.value}: <span className="font-bold">{entry.payload.value.toLocaleString()}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

export function OverallProgressChart({
  assignment,
}: {
  assignment: IKraProgress
}) {
  const totalAchieved = React.useMemo(() => {
    if (!assignment.weeklyAchieved) return 0
    return Object.values(assignment.weeklyAchieved).reduce((sum, val) => sum + (val || 0), 0)
  }, [assignment.weeklyAchieved])

  const remaining = Math.max(0, assignment.monthlyTarget - totalAchieved)
  const total = assignment.monthlyTarget || 1 // Prevent division by zero

  const chartData: ChartDataItem[] = React.useMemo(() => {
    const achievedPercentage = (totalAchieved / total) * 100
    const remainingPercentage = (remaining / total) * 100

    return [
      {
        name: "Achieved",
        value: totalAchieved,
        color: "#10B981", // Emerald 500 (bright green)
        percentage: achievedPercentage,
      },
      {
        name: "Remaining",
        value: remaining,
        color: "#E5E7EB", // Gray 200 (soft gray)
        percentage: remainingPercentage,
      },
    ]
  }, [totalAchieved, remaining, total])

  const progressPercentage = Math.round((totalAchieved / total) * 100)

  const displayData = chartData.map((item) => ({
    ...item,
    displayValue: item.value === 0 ? 0.1 : item.value,
  }))

  return (
    <div className="w-full h-full flex flex-col">
      <ChartContainer config={{}} className="flex-1 aspect-square">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null
                const data = payload[0].payload as ChartDataItem
                return (
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{data.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Value:{" "}
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {data.value.toLocaleString()}
                      </span>
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Percentage:{" "}
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {data.percentage.toFixed(1)}%
                      </span>
                    </p>
                  </div>
                )
              }}
            />
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={90}
              innerRadius={50}
              dataKey="displayValue"
              stroke="white"
              strokeWidth={2}
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} opacity={entry.value === 0 ? 0.3 : 1} />
              ))}
            </Pie>
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Progress Summary */}
      <div className="text-center mt-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/30 border-4 border-white dark:border-slate-700 shadow-lg -mt-10 relative z-10">
          <div className="text-center">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block">
              {progressPercentage}%
            </span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Complete</span>
          </div>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-400 mt-1">Overall Progress</p>
      </div>
    </div>
  )
}
