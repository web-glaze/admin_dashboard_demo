import { CHECK_STATUS, KRA_STATUS, KRA_TYPE } from "@/constants";
import { IUser } from "./user";

export interface CreateKra {
  code: string;
  kra_type: KRA_TYPE;
  description: string;
  name: string;
  status: KRA_STATUS;
}

export interface IKra extends CreateKra {
  _id: string;
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface KraFilter {
  kra_type?: KRA_TYPE;
  status?: KRA_STATUS;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ISinglekraProgress {
  kra: string;
  employee: string;
  month: number;
  year: number;
}

export interface Weeks {
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  week4a?: number;
}
export interface AssignKra {
  id: string;
  kra: IKra;
  employee: IUser;
  month: number;
  year: number;
  monthlyTarget: number;
  weeklyTarget: Weeks;
}

export interface CreateKraAssignment {
  kra: string;
  employee: string;
  month: number;
  year: number;
  monthlyTarget: number;
}
export interface IKraAssignment {
  id?: string;
  _id?: string;
  kra: IKra;
  employee: IUser;
  month: number;
  year: number;
  status : string;
  monthlyTarget: number;
  weeklyTarget: Weeks;
  monthlyAchieved?: number;
  progressPercent?: number;
  progress?: number;
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
export interface WeeklyProgress {
  week1: Days;
  week2: Days;
  week3: Days;
  week4: Days;
  week4a?: Days;
}
export interface IKraProgress extends IKraAssignment {
  id?: string;
  kra: IKra;
  employee: IUser;
  monthlyTarget: number;
  monthlyAchieved: number;
  progressPercent: number;
  weeklyTarget: Weeks;
  weeklyAchieved: Weeks;
  dailyAchieved: WeeklyProgress;
  createdAt: string;
  updatedAt: string;
  status: KRA_STATUS;
  CheckStatus: CHECK_STATUS;
  progress: number;
}

export interface ICreateDailyEntry {
  kra: string;
  employee: string;
  month: number;
  year: number;
  dailyAchieved?: WeeklyProgress;
}

export interface IKraFilter {
  name?: string;
  code?: string;
  kra_type?: KRA_TYPE;
  status?: KRA_STATUS;
}

export interface IKraAssignmentFilter {
  selectedEntityId?: string;
  month?: number;
  year?: number;
  employee?: string;
  kra?: string;
  limit?: number;
  page?: number;
}
