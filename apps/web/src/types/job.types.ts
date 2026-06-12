export interface Job {
  id: number;
  title: string;
  description: string;

  minSalary: number;
  maxSalary: number;

  location: string;

  minExperience: number;
  maxExperience: number;

  level: string;
  employmentType: string;

  isActive: boolean;

  companyId: number;

  requiredSkills: string[];

  createdAt: string;
  updatedAt: string;

  company: {
    id: number;
    name: string;
    description: string;
    website: string;
    location: string;
    createdById: number;
    createdAt: string;
    updatedAt: string;
  };
}
