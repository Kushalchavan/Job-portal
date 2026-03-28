import api from "@/lib/api";
import {
  Company,
  CreateCompanyInput,
  UpdateCompanyInput,
} from "@/types/company.types";

export const getMyCompanies = async (): Promise<Company[]> => {
  const res = await api.get("/companies/my");
  return res.data.data;
};

export const createCompany = async (
  data: CreateCompanyInput,
): Promise<Company> => {
  const res = await api.post("/companies", data);
  return res.data.data;
};

export const updateCompany = async (
  id: number,
  data: UpdateCompanyInput,
): Promise<Company> => {
  const res = await api.put(`/companies/${id}`, data);
  return res.data.data;
};

export const getCompanyById = async (id: number): Promise<Company> => {
  const res = await api.get(`/companies/${id}`);
  console.log(res);
  return res.data.data;
}

export const deleteCompany = async (id: number): Promise<void> => {
  await api.delete(`/companies/${id}`);
};
