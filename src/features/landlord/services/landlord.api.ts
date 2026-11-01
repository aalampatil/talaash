import { axiosApi } from "@/lib/api/client";
import type { ApiResponse,Landlord,Property,Visit } from "@/types/domain";

export const landlordApi = {
  profile: () => axiosApi.get<ApiResponse<Landlord>>("/landlord/profile"),
  properties: () => axiosApi.get<ApiResponse<Property[]>>("/landlord/property"),
  visits: () => axiosApi.get<ApiResponse<Visit[]>>("/landlord/visits"),
  createProperty: (data: FormData) => axiosApi.post<ApiResponse<Property>>("/landlord/property", data),
  deleteProperty: (id: string) => axiosApi.delete<ApiResponse<null>>(`/landlord/property/${id}`),
  approveVisit: (id: string) => axiosApi.patch<ApiResponse<Visit>>(`/landlord/visit/approve/${id}`),
  rejectVisit: (id: string) => axiosApi.patch<ApiResponse<Visit>>(`/landlord/visit/reject/${id}`),
};
