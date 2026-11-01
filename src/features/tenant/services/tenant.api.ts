import { axiosApi } from "@/lib/api/client";
import type { ApiResponse,Preferences,TenantProfile,Visit } from "@/types/domain";

export const tenantApi = {
  profile: () => axiosApi.get<ApiResponse<TenantProfile>>("/tenant/profile"),
  visits: () => axiosApi.get<ApiResponse<Visit[]>>("/tenant/visits"),
  updatePreferences: (data: Preferences) => axiosApi.patch<ApiResponse<null>>("/tenant/preferences", data),
  saveProperty: (id: string) => axiosApi.post<ApiResponse<null>>(`/tenant/save-property/${id}`),
  removeProperty: (id: string) => axiosApi.post<ApiResponse<null>>(`/tenant/remove-property/${id}`),
  requestVisit: (propertyId: string, visitDate: string) => axiosApi.post<ApiResponse<Visit>>("/tenant/request-visit", { propertyId, visitDate }),
  cancelVisit: (id: string) => axiosApi.post<ApiResponse<{ visitId: string }>>(`/tenant/cancel-visit/${id}`),
};
