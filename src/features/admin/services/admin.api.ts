import { axiosApi } from "@/lib/api/client";
import type { ApiResponse,Property,User } from "@/types/domain";

export const adminApi = {
  users: () => axiosApi.get<ApiResponse<User[]>>("/admin/allUsers"),
  landlords: () => axiosApi.get<ApiResponse<User[]>>("/admin/allLandlords"),
  properties: () => axiosApi.get<ApiResponse<Property[]>>("/admin/allProperties"),
};
