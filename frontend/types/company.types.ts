export interface Company {
  id: number;
  name: string;
  description: string;
  website?: string;
  location: string;

  createdAt: string;
  updatedAt: string;
}

export type CreateCompanyInput = {
  name: string;
  description: string;
  website?: string;
  location: string;
};

export type UpdateCompanyInput = Partial<CreateCompanyInput>;
