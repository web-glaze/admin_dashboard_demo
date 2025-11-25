// FILE: src/components/kra/StatsGrid.tsx
"use client";

import type React from "react";
import { Target, Calendar, TrendingUp } from "lucide-react";
import type { AssignKra, IKraAssignment } from "@/types/kra";

interface StatsGridProps {
  assignments: IKraAssignment[];
  totalCount: number;
}

export function StatsGrid({ assignments, totalCount }: StatsGridProps) {
  const stats = [
    { icon: Target, title: "Total KRAs Assigned", value: totalCount },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <StatItem key={idx} {...stat} />
      ))}
    </div>
  );
}

interface StatItemProps {
  icon: React.ElementType;
  title: string;
  value: string | number;
}

function StatItem({ icon: Icon, title, value }: StatItemProps) {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
