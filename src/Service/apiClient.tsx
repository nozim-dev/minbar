import axios from "axios";
const userData = JSON.parse(localStorage.getItem("user") || "{}");
const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${userData.jwt}`,
  },
});
