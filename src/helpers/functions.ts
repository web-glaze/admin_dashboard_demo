import { API_HOST, CLIENT_TOKEN_STORAGE_KEY, HOST } from "@/constants";

export async function waitForSeconds(seconds: number) {
  return new Promise((res) => {
    setTimeout(res, 1000 * seconds);
  });
}

export function isNotEmpty<T>(obj: T | null | undefined): obj is T {
  return !isEmpty(obj);
}

export function isEmpty(obj: unknown): obj is null | undefined {
  return obj == null || obj == undefined;
}

export function generateURI<T>(
  path: string,
  query?: Record<string, string | number | boolean> | T
): string {
  const serializedQuery = querySerialize<T>(query);
  const queryString = serializedQuery !== "" ? `?${serializedQuery}` : "";
  return `${HOST}${path}${queryString}`;
}

export function querySerialize<T>(
  queryObj?:
    | Record<string, string | number | boolean | (string | number | boolean)[]>
    | T
): string {
  if (!queryObj) {
    return "";
  }
  const queryString = Object.entries(queryObj)
    .filter(
      ([_, value]) =>
        (typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean" ||
          Array.isArray(value)) &&
        value !== ""
    )
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map(
            (val) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
          )
        : `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  return queryString;
}

export function removeEmptyFields(obj: any): any {
  if (!obj || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    // Remove null, undefined, and empty elements from the array
    return obj.filter(
      (item) =>
        item !== null &&
        item !== undefined &&
        !(Array.isArray(item) && item.length === 0)
    );
  }

  // Remove null, undefined, and empty array fields from the object
  const result: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = removeEmptyFields(obj[key]);
      if (
        value !== null &&
        value !== undefined &&
        !(Array.isArray(value) && value.length === 0) &&
        !(typeof value === "object" && Object.keys(value).length === 0)
      ) {
        result[key] = value;
      }
    }
  }
  return result;
}

// Helper function to handle nested objects
export const serializeParams = (
  obj: Record<string, any>,
  prefix = ""
): URLSearchParams => {
  const params = new URLSearchParams();

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const paramKey = prefix ? `${prefix}[${key}]` : key;

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      const nestedParams = serializeParams(value, paramKey);
      nestedParams.forEach((nestedValue, nestedKey) => {
        params.append(nestedKey, nestedValue);
      });
    } else {
      params.append(paramKey, String(value));
    }
  });

  return params;
};

export function getCoockieExpiryDate(expDays: number = 30) {
  // default tp 30 days
  let date = new Date();
  date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
  return date;
}

export function setCookie(
  name: string,
  value: string,
  minutesToExpire: number,
  path = "/",
  domain = "",
  secure = false
) {
  const date = new Date();
  date.setTime(date.getTime() + minutesToExpire * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  const cookiePath = path ? `; path=${path}` : "";
  const cookieDomain = domain ? `; domain=${domain}` : "";
  const cookieSecure = secure ? "; secure" : "";

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; ${expires}${cookiePath}${cookieDomain}${cookieSecure}; SameSite=Lax`;
}

export function removeUserToken() {
  var d = new Date();
  d.setTime(d.getTime());
  var expires = "expires=" + d.toUTCString();
  document.cookie =
    CLIENT_TOKEN_STORAGE_KEY + "=" + "" + "; " + expires + "; path=/";
}

export function getToken() {
  if (document && window) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${CLIENT_TOKEN_STORAGE_KEY}=`);
    if (parts.length === 2) return parts?.pop()?.split(";").shift();
  }
}

export function formatDate(date: any) {
  const currentDate = new Date(date);

  // Define the format options
  const options = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  };

  // Format the date
  const formattedDate = new Intl.DateTimeFormat("en-US", options as any).format(
    currentDate
  );
  return formattedDate;
}

// get day
export function getDay(date: string) {
  return new Date(date).getDate();
}

// get month name
export function getMonthName(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
  });
}
// get full year
export function getFullYear(date: string) {
  return new Date(date).getFullYear();
}

const getInitials = (name: string) => {
  let initials;
  const nameSplit = name.split(" ");
  const nameLength = nameSplit.length;

  initials = nameSplit[0].substring(0, 1);

  return initials.toUpperCase();
};

export function isStrongPassword(password: string) {
  let isValid = true;
  let message = "";

  // Check if the password length is at least 8 characters
  if (password.length < 8) {
    isValid = false;
    message = "Password must be at least 8 characters long.";
  }

  // Check if the password contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    isValid = false;
    message = "Password must contain at least one uppercase letter.";
  }

  // Check if the password contains at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    isValid = false;
    message = "Password must contain at least one lowercase letter.";
  }

  // Check if the password contains at least one digit
  if (!/\d/.test(password)) {
    isValid = false;
    message = "Password must contain at least one digit.";
  }

  // Check if the password contains at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    isValid = false;
    message = "Password must contain at least one special character.";
  }

  // Check if the password is not a common word or easily guessable pattern
  const commonWords = ["password", "123456", "qwerty", "abc123", "test"]; // Add more common words/patterns as needed
  if (commonWords.includes(password.toLowerCase())) {
    isValid = false;
    message =
      "Please choose a password that is not a common word or easily guessable pattern.";
  }

  return { isValid, message };
}
