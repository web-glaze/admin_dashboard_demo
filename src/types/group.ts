export interface IGroup {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  code: string;
  createdAt: string;
  imageUrl?: string;
}

export interface CreateGroup extends Partial<IGroup> {
  name: string;
  code: string;
  description?: string;
  imageUrl?: string;
}

export interface GroupFilter {
  name?: string;
  code?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}
