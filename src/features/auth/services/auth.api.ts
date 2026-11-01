import { axiosApi } from "@/lib/api/client";
import type { ApiResponse,User } from "@/types/domain";

export const authApi = {
  me: () => axiosApi.get<ApiResponse<User>>("/user/me"),
  becomeLandlord: () => axiosApi.post<ApiResponse<User>>("/user/become-landlord"),
};
