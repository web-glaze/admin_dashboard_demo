export enum USER_ROLE {
  ADMIN = "admin",
  USER = "user",
  MANAGER = "manager",
  PARTNER = "partner",
  EMPLOYEE = USER,
}
export enum USER_STATUS {
  ACTIVE = "active",
  BLOCK = "block",
  INACTIVE = "inactive",
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
  SUSPENDED = "suspended",
}
export enum USER_VERIFICATION_STATUS {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}
export enum KRA_TYPE {
  VALUE = "value",
  QUANTITY = "quantity",
}
export enum KRA_STATUS {
  ACTIVE = "active",
  INACTIVE = "inactive",
}
export enum CHECK_STATUS {
  VIEW_ONLY = "view-only",
  DISABLED = "disabled",
  ENABLED = "enabled",
  REQUESTSEND = "requested",
}
export enum MessageType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
}


