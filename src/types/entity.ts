export interface IEntity {
  id: string;
  name: string;
  code: string;
  description?: string;
  createdAt: string;
  imageUrl?: string;
}

export interface CreateEntity extends Partial<IEntity> {
  name: string;
  code: string;
  description?: string;
  imageUrl?: string;
}

export interface EntityFilter {
  name?: string;
  code?: string;
  page?: number;
  limit?: number;
}
