import { API_HOST, CHECK_STATUS } from "@/constants";
import { generateURI, getToken, removeEmptyFields } from "@/helpers";
import {
  AssignKra,
  CreateKra,
  CreateKraAssignment,
  ICreateDailyEntry,
  IKra,
  IKraAssignmentFilter,
  IKraProgress,
  ISinglekraProgress,
  KraFilter,
} from "@/types/kra";
import { IResponse } from "@/types/responseError";
import { responseHandler } from "./error";

export async function createKra(body: CreateKra): Promise<IResponse<IKra>> {
  const endpoint = `${API_HOST}/kra`;
  const token = getToken();
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return await responseHandler(res);
}

export interface KraResponse {
  kraKpis: IKra[];
  totalCount: number;
}

export async function getAllKras(
  filter: KraFilter
): Promise<IResponse<KraResponse>> {
  const cleanedFilter = removeEmptyFields(filter); // remove null, undefined, empty arrays
  const endpoint = generateURI(`/kra`, cleanedFilter);
  const token = getToken();
  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await responseHandler(res);
}

export async function assignKra(
  body: CreateKraAssignment
): Promise<IResponse<AssignKra>> {
  const endpoint = `${API_HOST}/kra-assignment`;
  const token = getToken();
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return await responseHandler(res);
}

export interface AssignedKraResponse {
  kraAssignments: AssignKra[];
  totalCount: number;
}
export async function getAllAssignedKra(
  filter: IKraAssignmentFilter
): Promise<IResponse<AssignedKraResponse>> {
  const cleanedFilter = removeEmptyFields(filter);
  const endpoint = generateURI(`/kra-assignment`, cleanedFilter);
  const token = getToken();
  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await responseHandler(res);
}

export async function getKrasAssignedToEmployee(
  employeeId: string,
  filter: IKraAssignmentFilter
): Promise<IResponse<AssignedKraResponse>> {
  const cleanedFilter = removeEmptyFields(filter);
  const endpoint = generateURI(
    `/kra-assignment/employee/${employeeId}`,
    cleanedFilter
  );

  const token = getToken();
  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await responseHandler(res);
}

export interface ProgressKraResponse {
  kraProgress: IKraProgress[];
  totalCount: number;
}
export async function getAllProgress(
  filter: KraFilter
): Promise<IResponse<ProgressKraResponse>> {
  const cleanedFilter = removeEmptyFields(filter);
  const endpoint = generateURI(`/kra-progress`, cleanedFilter);
  const token = getToken();
  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await responseHandler(res);
}

export interface StartProgress {
  employee: string;
  kra: string;
  month: number;
  year: number;
}
export async function startProgress(
  body: StartProgress
): Promise<IResponse<IKraProgress>> {
  const endpoint = `${API_HOST}/kra-progress`;
  const token = getToken();
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  return await responseHandler(res);
}

export async function getOneProgress(
  filter: ISinglekraProgress
): Promise<IResponse<IKraProgress>> {
  const cleanedFilter = removeEmptyFields(filter);
  const endpoint = `${API_HOST}/kra-progress/one/kra`;
  const token = getToken();
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(filter),
  });

  return await responseHandler(res);
}

export async function createDailyRecords(
  create: ICreateDailyEntry
): Promise<IResponse<IKraProgress>> {
  const endpoint = `${API_HOST}/kra-progress`;
  const token = getToken();
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(create),
  });

  return await responseHandler(res);
}

export async function sendRequestToCheckKra(
  id: string
): Promise<IResponse<any>> {
  const endpoint = `${API_HOST}/kra-progress/check`;
  const token = getToken();

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id }),
  });

  return await responseHandler(res);
}

export async function changeKraProgressStatus(
  id: string,
  status: CHECK_STATUS
): Promise<IResponse<IKraProgress>> {
  const endpoint = `${API_HOST}/kra-progress/status`;
  const token = getToken();

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id, status }),
  });

  return await responseHandler(res);
}
