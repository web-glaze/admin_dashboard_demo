"use client";

import { useState, useMemo } from "react";
import type {
  IKraProgress,
  Weeks,
  WeeklyProgress,
  Days,
  DayInfo,
} from "@/types/assignment";
import PageHeader from "./PageHeader";
import PerformanceOverview from "./PerformanceOverview";
import WeeklyEntryCard from "./WeeklyEntryCard";
import { TrendingUp, Send, CheckCircle, XCircle } from "lucide-react";
import {
  createDailyRecords,
  sendRequestToCheckKra,
  changeKraProgressStatus,
} from "@/api/kra";
import { USER_ROLE, CHECK_STATUS, MessageType } from "@/constants";
import { IUser } from "@/types/user";
import toast from "react-hot-toast";

export default function WeeklyEntryManager({
  initialAssignment,
  userRole,
  user,
}: {
  initialAssignment: IKraProgress;
  userRole: USER_ROLE;
  user: IUser;
}) {
  const [assignment, setAssignment] = useState<IKraProgress>(initialAssignment);
  const [editingCell, setEditingCell] = useState<{
    week: keyof Weeks;
    day: keyof Days;
  } | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<
    "sendRequest" | "approveKra" | "rejectKra" | null
  >(null);

  const showToastAlert = (
    message: string,
    type: MessageType = MessageType.INFO
  ) => {
    switch (type) {
      case MessageType.SUCCESS:
        toast.success(`${message}`);
        break;
      case MessageType.ERROR:
        toast.error(`${message}`);
        break;
      case MessageType.INFO:
      default:
        toast.custom(`${message}`);
        break;
    }
  };

  const isViewOnly =
    userRole === USER_ROLE.ADMIN ||
    userRole === USER_ROLE.PARTNER ||
    (userRole === USER_ROLE.MANAGER &&
      user._id !==
        (typeof assignment.employee === "object"
          ? assignment.employee._id
          : assignment.employee));

  // Check if current user is the employee
  const isCurrentUserEmployee =
    user._id ===
    (typeof assignment.employee === "object"
      ? assignment.employee._id
      : assignment.employee);

  // Check if cards should be disabled based on CheckStatus
  const isKraDisabled =
    assignment.CheckStatus === CHECK_STATUS.DISABLED ||
    assignment.CheckStatus === CHECK_STATUS.VIEW_ONLY ||
    assignment.CheckStatus === CHECK_STATUS.REQUESTSEND;

  const { totalAchieved, weeklyAchieved } = useMemo(() => {
    let monthlyTotal = 0;
    const weeklyTotals: Weeks = {
      week1: 0,
      week2: 0,
      week3: 0,
      week4: 0,
      week4a: 0,
    };
    if (assignment.dailyAchieved) {
      (
        Object.keys(assignment.dailyAchieved) as Array<keyof WeeklyProgress>
      ).forEach((weekKey) => {
        const weekData = assignment.dailyAchieved[weekKey];
        if (weekData) {
          const weekTotal = (Object.values(weekData) as number[]).reduce(
            (sum, val) => sum + (val || 0),
            0
          );
          if (weekKey in weeklyTotals) {
            weeklyTotals[weekKey] = weekTotal;
            monthlyTotal += weekTotal;
          }
        }
      });
    }
    return { totalAchieved: monthlyTotal, weeklyAchieved: weeklyTotals };
  }, [assignment.dailyAchieved]);

  const handleEdit = (
    week: keyof Weeks,
    day: keyof Days,
    currentValue: number,
    isDisabled: boolean
  ) => {
    if (isDisabled || isViewOnly || isKraDisabled) return;
    setEditingCell({ week, day });
    setEditingValue(String(currentValue));
  };

  const handleSave = async () => {
    if (!editingCell || isNaN(Number(editingValue))) return;
    const { week, day } = editingCell;

    const nextDailyAchieved = (() => {
      const cloned = JSON.parse(JSON.stringify(assignment.dailyAchieved || {}));
      if (!cloned[week]) cloned[week] = {};
      cloned[week][day] = Number(editingValue);
      return cloned;
    })();

    setAssignment((prev) => ({ ...prev, dailyAchieved: nextDailyAchieved }));
    setEditingCell(null);

    const kraId =
      typeof assignment.kra === "object" && assignment.kra
        ? assignment.kra.id || assignment.kra.name || assignment.kra.toString()
        : String(assignment.kra);

    const employeeId =
      typeof assignment.employee === "object" && assignment.employee
        ? assignment.employee.id ||
          assignment.employee._id ||
          assignment.employee.name ||
          assignment.employee.toString()
        : String(assignment.employee);

    try {
      const res = await createDailyRecords({
        kra: String(kraId),
        employee: String(employeeId),
        month: assignment.month,
        year: assignment.year,
        dailyAchieved: nextDailyAchieved,
      });

      if (!res.data) {
        console.error("[v0] createDailyRecords failed:", res);
        setAssignment((prev) => ({
          ...prev,
          dailyAchieved: assignment.dailyAchieved,
        }));
      } else if (res.data) {
        setAssignment((prev) => ({ ...prev, ...res.data }));
      }
    } catch (err) {
      console.error(
        "[v0] createDailyRecords error:",
        (err as Error)?.message || err
      );
    }
  };
  const employeeManagerId =
    typeof assignment.employee === "object" &&
    assignment.employee?.employeeManager
      ? typeof assignment.employee.employeeManager === "object"
        ? assignment.employee.employeeManager._id ||
          assignment.employee.employeeManager.id
        : assignment.employee.employeeManager
      : null;

  const isCurrentUserManagerOfEmployee = user._id === employeeManagerId;

  console.log(`User ID: ${user._id} | Manager ID: ${employeeManagerId}`);
  console.log(
    `Is current user manager of employee? ${isCurrentUserManagerOfEmployee}`
  );
  // Handle user sending request to close KRA
  const handleSendRequest = async () => {
    if (!isCurrentUserEmployee) return;

    // Close dialog first
    setShowConfirmDialog(false);
    setConfirmAction(null);

    setIsSubmitting(true);
    try {
      console.log("Sending request to check KRA...");
      const res = await sendRequestToCheckKra(assignment.id ?? "");
      console.log("API Response:", res);

      if (res.data) {
        // Update the CheckStatus to REQUESTSEND
        setAssignment((prev) => ({
          ...prev,
          CheckStatus: CHECK_STATUS.REQUESTSEND,
        }));
        showToastAlert(
          "Request sent successfully to manager for KRA review!",
          MessageType.SUCCESS
        );
      } else {
        console.error("API returned no data:", res);
      }
    } catch (err) {
      console.error("[v0] sendRequestToCheckKra error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle manager approving KRA (disabling it)
  const handleApproveKra = async () => {
    if (!isCurrentUserManagerOfEmployee) return;

    // Close dialog first
    setShowConfirmDialog(false);
    setConfirmAction(null);
    setIsSubmitting(true);
    try {
      const res = await changeKraProgressStatus(
        assignment?.id ?? "",
        CHECK_STATUS.DISABLED
      );
      if (res.data) {
        setAssignment((prev) => ({
          ...prev,
          CheckStatus: CHECK_STATUS.DISABLED,
        }));
        showToastAlert(
          "KRA approved and locked successfully! User can no longer edit entries.",
          MessageType.SUCCESS
        );
      } else {
        showToastAlert(
          "Failed to approve KRA. Please try again.",
          MessageType.ERROR
        );
      }
    } catch (err) {
      showToastAlert(
        "Error approving KRA. Please try again.",
        MessageType.ERROR
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle manager rejecting KRA request (re-enabling for edits)
  const handleRejectKra = async () => {
    if (!isCurrentUserManagerOfEmployee) return;

    // Close dialog first
    setShowConfirmDialog(false);
    setConfirmAction(null);
    setIsSubmitting(true);
    try {
      const res = await changeKraProgressStatus(
        assignment.id ?? "",
        CHECK_STATUS.ENABLED
      );

      console.log("API Response:", res);

      if (res.data) {
        setAssignment((prev) => ({
          ...prev,
          CheckStatus: CHECK_STATUS.ENABLED,
        }));
        showToastAlert(
          "Request rejected. User can now edit entries again.",
          MessageType.SUCCESS
        );
      } else {
        showToastAlert(
          "Failed to reject request. Please try again.",
          MessageType.ERROR
        );
      }
    } catch (err) {
      showToastAlert(
        " Error rejecting request. Please try again.",
        MessageType.ERROR
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open confirmation dialog
  const openConfirmDialog = (
    action: "sendRequest" | "approveKra" | "rejectKra"
  ) => {
    setConfirmAction(action);
    setShowConfirmDialog(true);
  };

  // Handle confirmation
  const handleConfirm = () => {
    if (confirmAction === "sendRequest") {
      handleSendRequest();
    } else if (confirmAction === "approveKra") {
      handleApproveKra();
    } else if (confirmAction === "rejectKra") {
      handleRejectKra();
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const getCustomPeriodDates = () => {
    const currentMonth = assignment.month - 1;
    const currentYear = assignment.year;
    const periodStart = new Date(currentYear, currentMonth, 15);
    const periodEnd = new Date(currentYear, currentMonth + 1, 14);
    return { periodStart, periodEnd };
  };

  const getWeekDays = (weekIndex: number): DayInfo[] => {
    const { periodStart, periodEnd } = getCustomPeriodDates();
    const weekStartDate = new Date(periodStart);
    weekStartDate.setDate(periodStart.getDate() + weekIndex * 7);

    const weekDays: DayInfo[] = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(weekStartDate);
      currentDate.setDate(weekStartDate.getDate() + i);
      const isInPeriod = currentDate >= periodStart && currentDate <= periodEnd;

      weekDays.push({
        short: `${dayNames[currentDate.getDay()]}(${currentDate.getDate()} ${
          monthNames[currentDate.getMonth()]
        })`,
        full: `${dayNames[currentDate.getDay()]} ${currentDate.getDate()} ${
          monthNames[currentDate.getMonth()]
        } ${currentDate.getFullYear()}`,
        date: isInPeriod ? currentDate.getDate() : null,
        month: currentDate.getMonth(),
        year: currentDate.getFullYear(),
        isValid: isInPeriod,
        isDisabled: !isInPeriod,
        actualDate: currentDate,
      });
    }
    return weekDays;
  };

  const getPeriodDisplayString = () => {
    const { periodStart, periodEnd } = getCustomPeriodDates();
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
    const startMonth = monthNames[periodStart.getMonth()];
    const endMonth = monthNames[periodEnd.getMonth()];
    return `${startMonth} 15, ${periodStart.getFullYear()} - ${endMonth} 14, ${periodEnd.getFullYear()}`;
  };

  const kraName =
    typeof assignment.kra === "object" && assignment.kra
      ? assignment.kra.name
      : String(assignment.kra);
  const employeeName =
    typeof assignment.employee === "object" && assignment.employee
      ? assignment.employee.name
      : String(assignment.employee);

  const completionRate =
    assignment.monthlyTarget > 0
      ? (totalAchieved / assignment.monthlyTarget) * 100
      : 0;
  const periodDisplayString = getPeriodDisplayString();

  // Get confirmation dialog message based on action
  const getConfirmMessage = () => {
    switch (confirmAction) {
      case "sendRequest":
        return "Are you sure you want to send a request to your manager? This will notify them that you've completed your KRA work and it's ready for review. You won't be able to edit entries until the request is reviewed.";
      case "approveKra":
        return "Are you sure you want to approve this KRA? This will lock all entries and the user will no longer be able to make any edits. This action confirms that the work is completed and approved.";
      case "rejectKra":
        return "Are you sure you want to reject this request? This will allow the user to continue editing their entries. Use this if you need the user to make corrections or updates.";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto p-8 space-y-6">
        <PageHeader
          kraName={kraName}
          employeeName={employeeName}
          periodDisplayString={periodDisplayString}
          completionRate={completionRate}
        />

        <PerformanceOverview
          totalAchieved={totalAchieved}
          monthlyTarget={assignment.monthlyTarget}
          periodDisplayString={periodDisplayString}
        />

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-full ${
                    confirmAction === "approveKra"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : confirmAction === "rejectKra"
                      ? "bg-red-100 dark:bg-red-900/30"
                      : "bg-yellow-100 dark:bg-yellow-900/30"
                  }`}
                >
                  <svg
                    className={`h-6 w-6 ${
                      confirmAction === "approveKra"
                        ? "text-green-600 dark:text-green-400"
                        : confirmAction === "rejectKra"
                        ? "text-red-600 dark:text-red-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Confirm Action
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {getConfirmMessage()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-slate-100 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2.5 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    confirmAction === "approveKra"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : confirmAction === "rejectKra"
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Yes, Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons for User and Manager */}
        {(userRole === USER_ROLE.USER ||
          userRole === USER_ROLE.MANAGER ||
          userRole === USER_ROLE.PARTNER) && (
          <div className="flex items-center justify-between gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            {/* Left side - Information text */}
            <div className="flex-1">
              {/* USER VIEW */}
              {isCurrentUserEmployee && (
                <div className="space-y-1">
                  {assignment.CheckStatus === CHECK_STATUS.REQUESTSEND ? (
                    <>
                      <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                        ⏳ Request Pending
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Your request has been sent to the manager. Waiting for
                        approval. You cannot edit entries until the request is
                        reviewed.
                      </p>
                    </>
                  ) : assignment.CheckStatus === CHECK_STATUS.DISABLED ? (
                    <>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        ✅ KRA Approved & Locked
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Your manager has approved your KRA. All entries are now
                        locked and cannot be edited.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        ✅ Completed your KRA work?
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Send a request to your manager for review and approval.
                        Once sent, you won&apos;t be able to edit until
                        reviewed.
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* MANAGER VIEW */}

              {isCurrentUserManagerOfEmployee && (
                <div className="space-y-1">
                  {assignment.CheckStatus === CHECK_STATUS.REQUESTSEND ? (
                    <>
                      <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                        📋 Review Pending
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        The user has submitted their KRA for review. Approve to
                        lock entries or reject to allow further edits.
                      </p>
                    </>
                  ) : assignment.CheckStatus === CHECK_STATUS.DISABLED ? (
                    <>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        ✅ KRA Approved
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        This KRA has been approved and locked. The user cannot
                        make any further edits.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        🔍 Manage KRA Status
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        No pending requests. You can review and approve KRA
                        entries when the user submits a request.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Right side - Action buttons and status */}
            <div className="flex items-center gap-4">
              {/* USER BUTTON */}
              {isCurrentUserEmployee && (
                <button
                  onClick={() => openConfirmDialog("sendRequest")}
                  disabled={
                    isSubmitting ||
                    assignment.CheckStatus === CHECK_STATUS.REQUESTSEND ||
                    assignment.CheckStatus === CHECK_STATUS.DISABLED
                  }
                  className={`flex items-center gap-2 px-6 py-2.5 font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap ${
                    assignment.CheckStatus === CHECK_STATUS.REQUESTSEND
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 cursor-not-allowed"
                      : assignment.CheckStatus === CHECK_STATUS.DISABLED
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white"
                  }`}
                >
                  {assignment.CheckStatus === CHECK_STATUS.REQUESTSEND ? (
                    <>
                      <Send className="h-4 w-4" />
                      Request Sent
                    </>
                  ) : assignment.CheckStatus === CHECK_STATUS.DISABLED ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Approved
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Request
                    </>
                  )}
                </button>
              )}

              {/* Approval and Rejected Buttons */}
              {isCurrentUserManagerOfEmployee &&
                assignment.CheckStatus === CHECK_STATUS.REQUESTSEND && (
                  <>
                    <button
                      onClick={() => openConfirmDialog("approveKra")}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve KRA
                    </button>
                    <button
                      onClick={() => openConfirmDialog("rejectKra")}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject Request
                    </button>
                  </>
                )}

              {/* Status Indicator */}
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Status:
                </span>
                <span
                  className={`text-sm font-semibold ${
                    assignment.CheckStatus === CHECK_STATUS.DISABLED
                      ? "text-green-600 dark:text-green-400"
                      : assignment.CheckStatus === CHECK_STATUS.REQUESTSEND
                      ? "text-yellow-600 dark:text-yellow-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {assignment.CheckStatus === CHECK_STATUS.DISABLED
                    ? "Approved"
                    : assignment.CheckStatus === CHECK_STATUS.REQUESTSEND
                    ? "Pending"
                    : "Active"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-950 dark:to-blue-950 rounded-xl shadow-sm">
              <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                Daily Entry
              </h2>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                Update your daily achievements for each week
              </p>
            </div>
          </div>

          {/* {isKraDisabled && (
            <div
              className={`p-4 rounded-lg border ${
                assignment.CheckStatus === CHECK_STATUS.DISABLED
                  ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                  : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
              }`}
            >
              <p
                className={`text-sm font-medium ${
                  assignment.CheckStatus === CHECK_STATUS.DISABLED
                    ? "text-green-800 dark:text-green-200"
                    : "text-yellow-800 dark:text-yellow-200"
                }`}
              >
                {assignment.CheckStatus === CHECK_STATUS.DISABLED
                  ? "✅ This KRA has been approved and locked. No further edits are allowed."
                  : "⏳ Your request is pending manager approval. You cannot edit entries at this time."}
              </p>
            </div>
          )} */}

          <div className="grid gap-4">
            {Object.keys(assignment.weeklyTarget).map((weekKeyStr, index) => {
              const weekKey = weekKeyStr as keyof Weeks;
              return (
                <WeeklyEntryCard
                  key={weekKey}
                  weekKey={weekKey}
                  weekIndex={index}
                  weekTarget={assignment.weeklyTarget[weekKey] || 0}
                  weekAchieved={weeklyAchieved[weekKey] || 0}
                  dailyData={assignment.dailyAchieved?.[weekKey] || {}}
                  getWeekDays={getWeekDays}
                  editingCell={editingCell}
                  editingValue={editingValue}
                  setEditingValue={setEditingValue}
                  handleEdit={handleEdit}
                  handleSave={handleSave}
                  setEditingCell={setEditingCell}
                  isViewOnly={isViewOnly || isKraDisabled}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
