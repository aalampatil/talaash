import { axiosApi } from "@/lib/api/client";

export const adminApi = {
  users: () => axiosApi.get("/admin/allUsers"),
  landlords: () => axiosApi.get("/admin/allLandlords"),
  properties: () => axiosApi.get("/admin/allProperties"),
};
