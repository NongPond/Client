import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${API}/login`, data);
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return axios.post(`${API}/register`, data);
};

export const getMe = async () => {
  const res = await axios.get("http://localhost:5000/api/auth/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  return res.data;

};
