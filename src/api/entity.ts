import { API_HOST } from "@/constants";
import { generateURI, getToken } from "@/helpers";
import { CreateEntity, EntityFilter, IEntity } from "@/types/entity";
import { IResponse } from "@/types/responseError";
import { responseHandler } from "./error";

export interface EntityResponse {
  entites: IEntity[];
  totalCount: number;
}

export async function getAllEntities(): Promise<IResponse<EntityResponse>> {
  // const endpoint = `${API_HOST}/entity`;

  const endpoint = generateURI(`/entity`);
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

export async function createEntity(
  body: CreateEntity
): Promise<IResponse<IEntity>> {
  const endpoint = `${API_HOST}/entity`;
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

export async function deleteEnity(
  id: string
): Promise<IResponse<{ acknowledged: boolean }>> {
  const endpoint = `${API_HOST}/entity/${id}`;
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

export async function updateEntity(
  id: string,
  body: CreateEntity
): Promise<IResponse<{ acknowledged: boolean }>> {
  const endpoint = `${API_HOST}/entity/${id}`;
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
