import { axiosApi } from "@/lib/api/client";

export const landlordApi = {
  profile: () => axiosApi.get("/landlord/profile"),
  properties: () => axiosApi.get("/landlord/property"),
  visits: () => axiosApi.get("/landlord/visits"),
  createProperty: (data) => axiosApi.post("/landlord/property", data),
  deleteProperty: (id) => axiosApi.delete(`/landlord/property/${id}`),
  approveVisit: (id) => axiosApi.patch(`/landlord/visit/approve/${id}`),
  rejectVisit: (id) => axiosApi.patch(`/landlord/visit/reject/${id}`),
};
