import { IResponse } from "@/types/responseError";
import { responseHandler } from "./Error/ErrorHandler";
import { API_HOST } from "@/constants";
import { ChangePasswordPayload, IUser, UpdateUserPayload } from "@/types/user";
import { getToken } from "@/helpers";

export async function authLogin(body: {
  mail: string;
  password: string;
}): Promise<IResponse<{ access_token: string; role: string }>> {
  const endpoint = `${API_HOST}/auth/login`;
  const res = await fetch(endpoint, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return await responseHandler(res);
}

export async function getCurrentUser(token: string): Promise<IResponse<IUser>> {
  const endpoint = `${API_HOST}/user/profile/me`;
  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return await responseHandler(res);
}

export async function updateProfile(
  body: UpdateUserPayload
): Promise<IResponse<{ acknowledged: boolean }>> {
  const token = getToken();
  const endpoint = `${API_HOST}/user/profile`;
  const res = await fetch(endpoint, {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return await responseHandler(res);
}

export async function uploadProfileImage(
  body: UpdateUserPayload
): Promise<IResponse<IUser>> {
  const token = getToken();
  const endpoint = `${API_HOST}/user/profile`;
  const res = await fetch(endpoint, {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return await responseHandler(res);
}

export async function changePassword(
  body: ChangePasswordPayload
): Promise<IResponse<{ acknowledged: boolean }>> {
  // Retrieve the authentication token from storage.
  const token = getToken();

  // Construct the full API endpoint URL.
  const endpoint = `${API_HOST}/user/profile`;

  // Perform the fetch request to the server.
  const res = await fetch(endpoint, {
    method: "PUT",
    mode: "cors",
    cache: "no-cache", // Ensures the request is not served from cache.
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      // Include the Bearer token for authentication.
      Authorization: `Bearer ${token}`,
    },
    // Convert the JavaScript object to a JSON string for the request body.
    body: JSON.stringify(body),
  });

  // Use a centralized handler to process the response,
  // which will parse JSON and handle HTTP errors consistently.
  return await responseHandler(res);
}

// Send OTP to email for password reset
export async function sendPasswordResetOTP(
  email: string
): Promise<IResponse<any>> {
  const endpoint = `${API_HOST}/auth/forgot-otp`;
  const res = await fetch(endpoint, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mail: email }),
  });
  return await responseHandler(res);
}

// Verify OTP for password reset
export async function verifyPasswordResetOTP(
  email: string,
  otp: string
): Promise<IResponse<{ token?: string }>> {
  const endpoint = `${API_HOST}/auth/forgot-session`;
  const res = await fetch(endpoint, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mail: email, otp }),
  });
  return await responseHandler(res);
}

// Reset password with OTP
export async function resetPasswordWithOTP(
  password: string,
  token: string
): Promise<IResponse<{ message: string }>> {
  const endpoint = `${API_HOST}/auth/reset-password`;
  const res = await fetch(endpoint, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password, token }),
  });
  return await responseHandler(res);
}
