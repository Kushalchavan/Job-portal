export interface Job {
  id: number
  title: string
  description: string
  location: string
  minSalary: number
  maxSalary: number
  minExperience: number
  maxExperience: number
  employmentType: EmploymentType
  company: Company
  createdAt: string
}

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"

export interface Company {
  id: number
  name: string
  location: string
}