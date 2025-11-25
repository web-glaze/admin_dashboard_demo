import { CHECK_STATUS, KRA_STATUS, KRA_TYPE } from "@/constants";
import { IUser } from "./user";

export interface IKraKpi {
  id?: string;
  code: string;
  kra_type: KRA_TYPE;
  description: string;
  name: string;
  status: KRA_STATUS;
}

export interface Weeks {
  week1?: number;
  week2?: number;
  week3?: number;
  week4?: number;
  week4a?: number;
}
export interface Days {
  day1?: number;
  day2?: number;
  day3?: number;
  day4?: number;
  day5?: number;
  day6?: number;
  day7?: number;
}

// 🔹 Weekly daily breakdown
export interface WeeklyProgress {
  week1: Days;
  week2: Days;
  week3: Days;
  week4: Days;
  week4a?: Days; // 31 din ke liye
}

export interface IKraAssignment {
  id?: string;
  kra: IKraKpi;
  employee: IUser;
  month: number;
  year: number;
  monthlyTarget: number;
  weeklyTarget: Weeks;
}

export interface IKraProgress extends IKraAssignment {
  id?: string;
  kra: IKraKpi;
  employee: IUser;
  monthlyTarget: number;
  monthlyAchieved: number;
  progressPercent: number;
  weeklyTarget: Weeks;
  weeklyAchieved: Weeks;
  dailyAchieved: WeeklyProgress;
  status: KRA_STATUS;
  CheckStatus: CHECK_STATUS;
  progress: number;
}

export interface DayInfo {
  date: number | null;
  month: number;
  isValid: boolean;
  year: number;
  isDisabled: boolean;
  actualDate: Date;
  short: string;
  full: string;
}
