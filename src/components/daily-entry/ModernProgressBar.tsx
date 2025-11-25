// components/ui/ModernProgressBar.tsx
"use client";

import { FC } from "react";

const ModernProgressBar: FC<{
  value: number;
  max: number;
  label: string;
  size?: "default" | "large";
}> = ({ value, max, label, size = "default" }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const isLarge = size === "large";

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        {/* Label */}
        <span
          className={`font-extrabold text-slate-900 dark:text-slate-100 ${
            isLarge ? "text-lg" : "text-sm"
          }`}
        >
          {label}
        </span>

        {/* Numbers */}
        <div className="flex items-center gap-2">
          <span
            className={`font-extrabold text-blue-600 dark:text-blue-400 ${
              isLarge ? "text-xl" : "text-sm"
            }`}
          >
            {Math.round(percentage)}%
          </span>
          <span
            className={`font-semibold text-slate-700 dark:text-slate-300 ${
              isLarge ? "text-base" : "text-xs"
            }`}
          >
            ({value.toLocaleString()} / {max.toLocaleString()})
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner ${
          isLarge ? "h-6" : "h-3"
        }`}
      >
        <div
          className={`bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 rounded-full transition-all duration-700 ease-out shadow-lg relative overflow-hidden ${
            isLarge ? "h-6" : "h-3"
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          {isLarge && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-sm font-extrabold drop-shadow-md">
                {value.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernProgressBar;
