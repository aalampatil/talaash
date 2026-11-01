import { axiosApi } from "@/lib/api/client";

export const authApi = {
  me: () => axiosApi.get("/user/me"),
  becomeLandlord: () => axiosApi.post("/user/become-landlord"),
};
