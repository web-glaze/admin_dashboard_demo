export interface IUserCount {
  admins: number;
  users: number;
  partners: number;
  managers: number;
}

export interface IDashboardData {
  totalentities: number;
  usersCount: IUserCount;
  totalGropus: number;
}
