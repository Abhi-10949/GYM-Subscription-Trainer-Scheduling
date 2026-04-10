import api from "./api";

export const registerAdmin = async (payload) => (await api.post("/auth/admin/register", payload)).data;
export const loginAdmin = async (payload) => (await api.post("/auth/admin/login", payload)).data;
export const registerMember = async (payload) => (await api.post("/auth/member/register", payload)).data;
export const loginMember = async (payload) => (await api.post("/auth/member/login", payload)).data;
