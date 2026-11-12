import { axiosApi } from "@/lib/api/client";
import type { ApiResponse,Property,SearchParams } from "@/types/domain";
import type { AxiosRequestConfig } from "axios";

export const propertiesApi = {
  all: () => axiosApi.get<ApiResponse<Property[]>>("/property/"),
  search: (params: SearchParams, config?: AxiosRequestConfig) => axiosApi.get<ApiResponse<Property[]>>("/property/search", { ...config, params }),
  byId: (id: string, config?: AxiosRequestConfig) => axiosApi.get<ApiResponse<Property>>(`/property/${id}`, config),
};
