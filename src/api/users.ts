import { API_HOST, USER_ROLE, USER_STATUS } from "@/constants";
import { generateURI, getToken, removeEmptyFields } from "@/helpers";
import { IResponse } from "@/types/responseError";
import { IUser, CreateUserData, IUserFilter } from "@/types/user";
import { responseHandler } from "./error";
import { get } from "http";
import { IEntity } from "@/types/entity";

// ✅ Utility for consistent debug logging
function debugLog(label: string, data?: any) {
  console.log(`🧩 [DEBUG] ${label}:`, data ?? "(no data)");
}

// ===================== FETCH ALL USERS =====================
export async function fetchAllUsers(): Promise<IResponse<IUser[]>> {
  const endpoint = `${API_HOST}/user`;
  const token = getToken();

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return await responseHandler<IUser[]>(response);
}

// ===================== CREATE USER =====================
export async function createUser(
  userData: CreateUserData
): Promise<IResponse<IUser>> {
  const endpoint = `${API_HOST}/user`;
  const token = getToken();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(userData),
  });

  return await responseHandler<IUser>(response);
}

// ===================== UPDATE USER =====================
export async function updateUser(
  userId: string,
  userData: Partial<CreateUserData>
): Promise<IResponse<IUser>> {
  const endpoint = `${API_HOST}/user/update/${userId}`;
  const token = getToken();

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(userData),
  });

  return await responseHandler<IUser>(response);
}

// ===================== DELETE USER =====================
export async function deleteUser(
  userId: string
): Promise<IResponse<{ message: string }>> {
  const endpoint = `${API_HOST}/user/delete/${userId}`;
  const token = getToken();

  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return await responseHandler<{ message: string }>(response);
}

// ===================== UPDATE USER STATUS =====================
export async function updateUserStatus(
  userId: string,
  status: USER_STATUS
): Promise<IResponse<IUser>> {
  const endpoint = `${API_HOST}/user/status/${userId}`;
  const token = getToken();

  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ status }),
  });

  return await responseHandler<IUser>(response);
}

// ===================== FETCH USER BY ID =====================
export async function fetchUserById(userId: string): Promise<IResponse<IUser>> {
  const endpoint = `${API_HOST}/user/byid/${userId}`;
  const token = getToken();

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  return await responseHandler(response);
}

// ===================== FETCH USERS BY ROLE =====================
export async function fetchUsersByRole(
  filter: IUserFilter,
  role?: USER_ROLE
): Promise<IResponse<IUser[]>> {
  const cleanedFilter = removeEmptyFields(filter);

  const endpoint = generateURI(`/user/${role}`, cleanedFilter);

  const token = getToken();

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await responseHandler(response);
}

// ===================== CREATE A USER (Alternate) =====================
export async function createAUser(
  userData: CreateUserData
): Promise<IResponse<IUser>> {
  const endpoint = `${API_HOST}/user`;
  const token = getToken();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  return await responseHandler(response);
}

// ===================== UPDATE A USER (Alternate) =====================
export async function updateAuser(
  id: string,
  userData: Partial<CreateUserData>
): Promise<IResponse<{ acknowledge: boolean }>> {
  const endpoint = `${API_HOST}/user/profile/${id}`;
  const token = getToken();

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  return await responseHandler(response);
}

// ===================== DELETE A USER (Alternate) =====================
export async function deleteAUser(
  userId: string
): Promise<IResponse<{ acknowledge: boolean }>> {
  const endpoint = `${API_HOST}/user/${userId}`;
  const token = getToken();

  const response = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await responseHandler(response);
}

// ===================== GET ALL USERS WITH FILTER =====================
export async function getAllUsers(
  filter: IUserFilter
): Promise<IResponse<IUser[]>> {
  const cleanedFilter = removeEmptyFields(filter);
  const hasFilter = cleanedFilter && Object.keys(cleanedFilter).length > 0;
  const endpoint = hasFilter
    ? generateURI("/user", cleanedFilter)
    : `${API_HOST}/user`;

  const token = getToken();

  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await responseHandler(response);
}

export async function getAllUsersForDropDown(
  filter?: IUserFilter
): Promise<IResponse<IUser[]>> {
  const cleanedFilter = removeEmptyFields(filter);
  const hasFilter = cleanedFilter && Object.keys(cleanedFilter).length > 0;
  const endpoint = hasFilter
    ? generateURI("/user/dropdown", cleanedFilter)
    : `${API_HOST}/user/dropdown`;

  const token = getToken();

  const response = await fetch(endpoint, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await responseHandler(response);
}
// ===================== GET TEAM MEMBERS =====================
export interface IUserResponse {
  users: IUser[];
  totalCount: number;
}

export async function getTeamMembersApi(
  userId: string,
  filter?: IUserFilter
): Promise<IResponse<IUserResponse>> {
  const cleanedFilter = removeEmptyFields(filter);
  const hasFilter = cleanedFilter && Object.keys(cleanedFilter).length > 0;

  const endpoint = hasFilter
    ? generateURI("/user/users-by-role", cleanedFilter)
    : `${API_HOST}/user/users-by-role`;

  const token = getToken();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }),
  });

  return await responseHandler(response);
}

export interface IManagerEntityResponse {
  entities: IEntity[];
  totalCount: number;
}

export async function getManagerEntities(): Promise<
  IResponse<IManagerEntityResponse>
> {
  const endpoint = `${API_HOST}/user/managers-entity`;
  const token = getToken();

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return await responseHandler(response);
}
