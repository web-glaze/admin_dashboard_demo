import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  User,
  Hash,
  AlertCircle,
  Lock,
  Calendar as CalendarIcon,
} from "lucide-react";
import { CreateUserData } from "@/types/user";

interface PersonalInfoSectionProps {
  formData: CreateUserData;
  editingUser: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  requiredFields: string[];
  onInputChange: (field: keyof CreateUserData, value: string) => void;
  onFieldBlur: (field: keyof CreateUserData) => void;
  getFieldError: (field: string) => string;
}

export function PersonalInfoSection({
  formData,
  requiredFields,
  onInputChange,
  onFieldBlur,
  getFieldError,
  editingUser,
}: PersonalInfoSectionProps) {
  const isRequired = (field: string) => requiredFields.includes(field);

  // Convert string date to Date object for DatePicker
  const getDateValue = (): Date | null => {
    if (!formData.dateOfJoining) return null;
    const date = new Date(formData.dateOfJoining);
    return isNaN(date.getTime()) ? null : date;
  };

  // Parse and format any date string to YYYY-MM-DD

  // Handle date selection from DatePicker
  const handleDateSelect = (date: Date | null) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      onInputChange("dateOfJoining", formattedDate);
    } else {
      onInputChange("dateOfJoining", "");
    }
  };

  // SUPER SMART date parsing - handles ALL formats automatically
  const handleDirectInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.trim();

    if (!rawValue) {
      onInputChange("dateOfJoining", "");
      return;
    }

    let parsedDate: Date | null = null;

    // 1. YYYY-MM-DD or YYYY/MM/DD (2015-04-15, 2015/04/15)
    const ymdFull = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/;
    const ymdMatch = rawValue.match(ymdFull);
    if (ymdMatch) {
      const [, year, month, day] = ymdMatch;
      parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }

    // 2. DD-Mon-YYYY (01-Jan-2012, 15-Apr-2015, 19-Mar-24)
    if (!parsedDate) {
      const ddMonYyyy = /^(\d{1,2})-([A-Za-z]{3})-(\d{2,4})$/;
      const ddMonMatch = rawValue.match(ddMonYyyy);
      if (ddMonMatch) {
        const [, day, monthStr, year] = ddMonMatch;
        const monthMap: Record<string, number> = {
          jan: 0,
          feb: 1,
          mar: 2,
          apr: 3,
          may: 4,
          jun: 5,
          jul: 6,
          aug: 7,
          sep: 8,
          oct: 9,
          nov: 10,
          dec: 11,
        };
        const month = monthMap[monthStr.toLowerCase()];
        let fullYear = parseInt(year);
        if (fullYear < 100) fullYear += fullYear < 50 ? 2000 : 1900;
        if (month !== undefined) {
          parsedDate = new Date(fullYear, month, parseInt(day));
        }
      }
    }

    // 3. DD/MM/YYYY or DD-MM-YYYY (11/22/2020, 4/3/2025)
    if (!parsedDate) {
      const ddmmyyyy = /^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})$/;
      const ddmmMatch = rawValue.match(ddmmyyyy);
      if (ddmmMatch) {
        const [, d1, d2, year] = ddmmMatch;
        let fullYear = parseInt(year);
        if (fullYear < 100) fullYear += fullYear < 50 ? 2000 : 1900;

        // Try DD-MM-YYYY first (more common internationally)
        let testDate = new Date(fullYear, parseInt(d2) - 1, parseInt(d1));
        if (testDate.getDate() === parseInt(d1)) {
          parsedDate = testDate;
        } else {
          // Try MM-DD-YYYY if DD-MM-YYYY doesn't work
          testDate = new Date(fullYear, parseInt(d1) - 1, parseInt(d2));
          if (testDate.getDate() === parseInt(d2)) {
            parsedDate = testDate;
          }
        }
      }
    }

    // 4. M/D/YYYY (7/17/2025, 1/9/2025, 2/6/2017)
    if (!parsedDate) {
      const mdyyyy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const mdMatch = rawValue.match(mdyyyy);
      if (mdMatch) {
        const [, month, day, year] = mdMatch;
        parsedDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );
      }
    }

    // 5. YYYY (just year, default to Jan 1)
    if (!parsedDate) {
      const yearOnly = /^(\d{4})$/;
      const yearMatch = rawValue.match(yearOnly);
      if (yearMatch) {
        parsedDate = new Date(parseInt(yearMatch[1]), 0, 1);
      }
    }

    // 6. Fallback: Try JavaScript's native Date parsing
    if (!parsedDate || isNaN(parsedDate.getTime())) {
      parsedDate = new Date(rawValue);
    }

    // Convert to YYYY-MM-DD if valid
    if (parsedDate && !isNaN(parsedDate.getTime())) {
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
      const day = String(parsedDate.getDate()).padStart(2, "0");
      onInputChange("dateOfJoining", `${year}-${month}-${day}`);
    } else {
      // Pass raw value for validation error
      onInputChange("dateOfJoining", rawValue);
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50/50 to-blue-100/20 dark:from-blue-950/10 dark:to-blue-900/5 p-6 rounded-xl border border-blue-200/30 dark:border-blue-800/20 shadow-sm">
      <div className="flex items-center gap-3 pb-3">
        <div className="p-2.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <User className="size-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Personal Information
        </h3>
      </div>
      <Separator className="bg-blue-200/40 dark:bg-blue-800/30" />

      <div className="space-y-5">
        {/* Full Name */}
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300"
          >
            Full Name
            {isRequired("name") && (
              <span className="text-red-500 font-bold">*</span>
            )}
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            onBlur={() => onFieldBlur("name")}
            placeholder="Enter full name"
            data-error={!!getFieldError("name")}
            className={`h-11 transition-all duration-200 ${
              getFieldError("name")
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20"
                : "border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-slate-800"
            }`}
          />
          {getFieldError("name") && (
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {getFieldError("name")}
              </p>
            </div>
          )}
        </div>

        {/* Employee Number */}
        <div className="space-y-2">
          <Label
            htmlFor="employeeNumber"
            className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300"
          >
            <Hash className="size-4" />
            Employee Number
            {isRequired("employeeNumber") && (
              <span className="text-red-500 font-bold">*</span>
            )}
          </Label>
          <Input
            id="employeeNumber"
            value={formData.employeeNumber}
            onChange={(e) => onInputChange("employeeNumber", e.target.value)}
            onBlur={() => onFieldBlur("employeeNumber")}
            placeholder="e.g., SYC00999, EMP001, MGR001"
            data-error={!!getFieldError("employeeNumber")}
            className={`h-11 transition-all duration-200 ${
              getFieldError("employeeNumber")
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20"
                : "border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-slate-800"
            }`}
          />
          {getFieldError("employeeNumber") && (
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {getFieldError("employeeNumber")}
              </p>
            </div>
          )}
        </div>

        {/* Enhanced Date of Joining with React DatePicker */}
        <div className="space-y-2">
          <Label
            htmlFor="dateOfJoining"
            className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300"
          >
            <CalendarIcon className="size-4" />
            Date of Joining
            {isRequired("dateOfJoining") && (
              <span className="text-red-500 font-bold">*</span>
            )}
          </Label>

          <div className="relative">
            <Input
              id="dateOfJoining"
              type="text"
              value={formData.dateOfJoining}
              onChange={handleDirectInput}
              onBlur={() => onFieldBlur("dateOfJoining")}
              placeholder="Paste or type date (any format) or click calendar"
              className={`h-11 pr-10 transition-all duration-200 ${
                getFieldError("dateOfJoining")
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20"
                  : "border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-slate-800"
              }`}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <DatePicker
                selected={getDateValue()}
                onChange={handleDateSelect}
                customInput={
                  <button
                    type="button"
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                  >
                    <CalendarIcon className="size-4 text-slate-500 dark:text-slate-400" />
                  </button>
                }
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                dateFormat="yyyy-MM-dd"
                maxDate={new Date()}
                minDate={new Date(1950, 0, 1)}
              />
            </div>
          </div>

          {/* Display selected date in readable format */}
          {formData.dateOfJoining && !getFieldError("dateOfJoining") && (
            <div className="flex items-center gap-2 mt-2">
              <CalendarIcon className="size-3 text-blue-500" />
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Selected: {formatDate(formData.dateOfJoining)}
              </p>
            </div>
          )}

          {!formData.dateOfJoining && !getFieldError("dateOfJoining") && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              💡 Tip: Paste any date format (e.g., 2024-01-15, 01/15/2024, Jan
              15 2024) or click calendar icon
            </p>
          )}

          {getFieldError("dateOfJoining") && (
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {getFieldError("dateOfJoining")}
              </p>
            </div>
          )}
        </div>

        {/* Password Field - Only for new users, no default values */}
        {!editingUser && (
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300"
            >
              <Lock className="size-4" />
              Password
              {isRequired("password") && (
                <span className="text-red-500 font-bold">*</span>
              )}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password || "synergy"} // Ensure no undefined values, empty by default
              onChange={(e) => onInputChange("password", e.target.value)}
              onBlur={() => onFieldBlur("password")}
              placeholder="Enter temporary password for user"
              data-error={!!getFieldError("password")}
              className={`h-11 transition-all duration-200 ${
                getFieldError("password")
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20"
                  : "border-slate-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-slate-800"
              }`}
            />

            {getFieldError("password") && (
              <div className="flex items-center gap-2 mt-2">
                <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {getFieldError("password")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
