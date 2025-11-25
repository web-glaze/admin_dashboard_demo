import { API_HOST } from "@/constants";
import { getToken } from "@/helpers";
import { IResponse } from "@/types/responseError";
import { responseHandler } from "./error";
import { IDashboardData } from "@/types/dashboard";

export async function dashboardData(): Promise<IResponse<IDashboardData>> {
  const endpoint = `${API_HOST}/homepage`;
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
