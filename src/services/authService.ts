import api from "../utils/axios";

const ENDPOINT = "/api/auth";

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post(`${ENDPOINT}/login`, data);
  localStorage.setItem("token", res.data.token); 
  return res.data;
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return api.post(`${ENDPOINT}/register`, data);
};

export const getMe = async () => {
  const res = await api.get(`${ENDPOINT}/me`);
  return res.data;
};
