import { generateURI, getToken } from "@/helpers";
import { IResponse } from "@/types/responseError";
import { responseHandler } from "./error";
import { API_HOST } from "@/constants";
import { CreateGroup, GroupFilter, IGroup } from "@/types/group";

export interface GroupResponse {
  groups: IGroup[];
  totalCount: number;
}

export async function getAllGropus(): Promise<IResponse<GroupResponse>> {
  const endpoint = generateURI(`/groups`);
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

export async function createGroup(
  body: CreateGroup
): Promise<IResponse<IGroup>> {
  const endpoint = `${API_HOST}/groups`;
  const token = getToken();
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return await responseHandler(response);
}

export async function deleteGroup(
  id: string
): Promise<IResponse<{ acknowledged: boolean }>> {
  const endpoint = `${API_HOST}/groups/${id}`;
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

export async function updateGroup(
  id: string,
  body: CreateGroup
): Promise<IResponse<{ acknowledged: boolean }>> {
  const endpoint = `${API_HOST}/groups/${id}`;
  const token = getToken();
  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return await responseHandler(response);
}
