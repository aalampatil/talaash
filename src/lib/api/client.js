import axios from "axios";

export const axiosApi = axios.create({
  baseURL: "/api",
  timeout: 15000,
  withCredentials: true,
});
