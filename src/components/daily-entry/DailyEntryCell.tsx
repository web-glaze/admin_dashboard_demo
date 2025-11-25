"use client";

import { FC } from "react";
import { DayInfo } from "@/types/assignment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Save, X } from "lucide-react";

const DailyEntryCell: FC<{
  dayInfo: DayInfo;
  dayIndex: number;
  dayValue: number;
  isEditing: boolean;
  editingValue: string;
  setEditingValue: (value: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  isViewOnly?: boolean; // new prop
}> = ({
  dayInfo,
  dayIndex,
  dayValue,
  isEditing,
  editingValue,
  setEditingValue,
  onEdit,
  onSave,
  onCancel,
  isViewOnly = false,
}) => {
  const canEdit = !dayInfo.isDisabled && !isViewOnly;

  return (
    <div
      className={`group relative rounded-xl border text-center transition-all duration-300 ${
        dayInfo.isDisabled
          ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed"
          : `
        bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 
        dark:from-slate-800 dark:via-slate-700 dark:to-slate-600 
        border-slate-200 dark:border-slate-600 
        hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600
        hover:from-blue-100 hover:via-indigo-100 hover:to-purple-200
        dark:hover:from-slate-700 dark:hover:via-slate-600 dark:hover:to-slate-500
        cursor-pointer
      `
      }`}
    >
      <div className="p-2">
        {/* Day Label */}
        <div
          className={`mb-1 text-[10px] font-semibold uppercase tracking-wide ${
            dayInfo.isDisabled
              ? "text-gray-400 dark:text-gray-500"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          Day {dayIndex + 1}
          <span className="block text-[9px] text-gray-400 dark:text-gray-500 font-normal normal-case">
            ({dayInfo.short})
          </span>
        </div>

        {/* Editing Mode */}
        {isEditing && canEdit ? (
          <div className="space-y-1.5">
            <Input
              type="number"
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              className="h-7 text-center text-xs border-blue-300 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") onSave();
                if (e.key === "Escape") onCancel();
              }}
            />
            <div className="flex justify-center gap-1.5">
              <Button
                size="sm"
                onClick={onSave}
                className="h-6 w-6 p-0 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
              >
                <Save className="h-2.5 w-2.5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onCancel}
                className="h-6 w-6 p-0 border-slate-300 dark:border-slate-600"
              >
                <X className="h-2.5 w-2.5" />
              </Button>
            </div>
          </div>
        ) : (
          /* Normal Mode */
          <div
            className={`rounded-lg py-1 px-2 transition-colors ${
              canEdit
                ? "hover:bg-blue-50/70 dark:hover:bg-blue-950/40 cursor-pointer"
                : "cursor-not-allowed"
            }`}
            onClick={canEdit ? onEdit : undefined}
            title={
              canEdit
                ? `Click to edit ${dayInfo.full}`
                : dayInfo.isDisabled
                ? "This date is not in the current period"
                : "View only"
            }
          >
            <div
              className={`text-lg font-bold ${
                dayInfo.isDisabled
                  ? "text-gray-400 dark:text-gray-500"
                  : "text-slate-800 dark:text-slate-200"
              }`}
            >
              {dayInfo.isDisabled ? "–" : dayValue.toLocaleString()}
            </div>
            {canEdit && (
              <Edit className="mx-auto h-2.5 w-2.5 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyEntryCell;
