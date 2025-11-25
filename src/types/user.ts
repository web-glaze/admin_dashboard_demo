import { USER_ROLE, USER_STATUS, USER_VERIFICATION_STATUS } from "@/constants";
import { IEntity } from "./entity";
import { IGroup } from "./group";

export interface IUser {
  id: string;
  _id?: string;
  name: string;
  mail?: string;
  phoneNumber?: string;
  employeeNumber: string;
  designation: string;
  dateOfJoining: string;
  workCity: string;
  workCountry: string;
  department: string;
  entity: IEntity;
  group: IGroup | string;
  password?: string;
  role: USER_ROLE;
  status: USER_STATUS;
  managerCode?: string;
  employeeManager?: IUser | string;
  verificationStatus: USER_VERIFICATION_STATUS;
  imageUrl?: string;
  lastLoginAt?: Date;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface CreateUserData {
  name: string;
  mail?: string;
  phoneNumber?: string;
  role: USER_ROLE;
  employeeNumber: string;
  designation: string;
  entity: IEntity | string;
  group: IGroup | string;
  password?: string;
  employeeManager?: string;
  imageUrl?: string;
  dateOfJoining: string;
  managerCode?: string;
  workCity: string;
  workCountry: string;
  department: string;
  status?: USER_STATUS;
}

export interface IUserFilter {
  name?: string;
  mail?: string;
  phoneNumber?: string;
  role?: USER_ROLE;
  status?: USER_STATUS;
  verificationStatus?: USER_VERIFICATION_STATUS;
  page?: string;
  limit?: string;
  entityId?: string;
}

export interface UpdateUserPayload extends Partial<IUser> {
  name?: string;
  phoneNumber?: string;
}

export interface ChangePasswordPayload {
  password?: string;
}

export { USER_ROLE };
