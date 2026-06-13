export interface CreateJobPayload {
  title: string;
  description: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  minExperience: number;
  maxExperience: number;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  level: "JUNIOR" | "MID" | "SENIOR" | "LEAD";
  companyId: number;
}