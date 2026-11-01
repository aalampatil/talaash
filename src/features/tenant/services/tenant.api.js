import { axiosApi } from "@/lib/api/client";

export const tenantApi = {
  profile: () => axiosApi.get("/tenant/profile"),
  visits: () => axiosApi.get("/tenant/visits"),
  updatePreferences: (data) => axiosApi.patch("/tenant/preferences", data),
  saveProperty: (id) => axiosApi.post(`/tenant/save-property/${id}`),
  removeProperty: (id) => axiosApi.post(`/tenant/remove-property/${id}`),
  requestVisit: (propertyId, visitDate) => axiosApi.post("/tenant/request-visit", { propertyId, visitDate }),
  cancelVisit: (id) => axiosApi.post(`/tenant/cancel-visit/${id}`),
};
