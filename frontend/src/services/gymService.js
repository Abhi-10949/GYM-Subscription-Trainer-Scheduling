import api from "./api";

export const getPackages = async () => (await api.get("/packages")).data;
export const addPackage = async (payload) => (await api.post("/packages", payload)).data;
export const updatePackage = async (id, payload) => (await api.put(`/packages/${id}`, payload)).data;

export const getTrainers = async () => (await api.get("/trainers")).data;
export const addTrainer = async (payload) => (await api.post("/trainers", payload)).data;
export const updateTrainer = async (id, payload) => (await api.put(`/trainers/${id}`, payload)).data;
export const deleteTrainer = async (id) => (await api.delete(`/trainers/${id}`)).data;

export const getMembers = async () => (await api.get("/members")).data;
export const searchMembers = async (keyword) => (await api.get(`/members/search?keyword=${encodeURIComponent(keyword)}`)).data;
export const getMemberByClientId = async (clientId) => (await api.get(`/members/${clientId}`)).data;
export const updateMember = async (clientId, payload) => (await api.patch(`/members/${clientId}`, payload)).data;
export const changePassword = async (clientId, payload) => (await api.post(`/members/${clientId}/change-password`, payload)).data;
export const getAdminById = async (id) => (await api.get(`/admins/${id}`)).data;
export const updateAdmin = async (id, payload) => (await api.patch(`/admins/${id}`, payload)).data;

export const getMemberships = async () => (await api.get("/memberships")).data;
export const addMembership = async (payload) => (await api.post("/memberships", payload)).data;
export const updateMembership = async (id, payload) => (await api.put(`/memberships/${id}`, payload)).data;
export const getMembershipsByClientId = async (clientId) => (await api.get(`/memberships/member/${clientId}`)).data;
export const createMembershipRequest = async (payload) => (await api.post("/memberships/requests", payload)).data;
export const getPendingMembershipRequests = async () => (await api.get("/memberships/requests/pending")).data;
export const decideMembershipRequest = async (membershipId, payload) => (await api.patch(`/memberships/${membershipId}/decision`, payload)).data;
