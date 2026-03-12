import { Company } from "./company.types";

export interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  minExperience: number;
  maxExperience: number;
  level: LevelType;
  employmentType: EmploymentType;
  company: Company;
  createdAt: string;
}

export type LevelType = "JUNIOR" | "MID" | "SENIOR" | "LEAD";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP";
