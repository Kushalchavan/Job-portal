import { Application } from "./application.types";
import { Company } from "./company.types";

export enum Level {
  JUNIOR = "JUNIOR",
  MID = "MID",
  SENIOR = "SENIOR",
  LEAD = "LEAD",
}

export enum EmploymentType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
}

export type CreateJobInput = {
  title: string;
  description: string;

  minSalary: number;
  maxSalary: number;

  location: string;

  minExperience: number;
  maxExperience: number;

  level?: Level;
  employmentType?: EmploymentType;
  companyId: number;
};

export type UpdateJobInput = Partial<CreateJobInput>;

export type Job = {
  id: number;

  title: string;
  description: string;

  minSalary: number;
  maxSalary: number;

  location: string;

  minExperience: number;
  maxExperience: number;

  level: Level;
  employmentType: EmploymentType;

  isActive: boolean;
  company: Company;

  applications: Application[];

  companyId: number;
  createdById: number;

  createdAt: string;
  updatedAt: string;
};
