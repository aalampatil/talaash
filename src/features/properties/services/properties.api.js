import { axiosApi } from "@/lib/api/client";

export const propertiesApi = {
  all: () => axiosApi.get("/property/"),
  search: (params) => axiosApi.get("/property/search", { params }),
  byId: (id) => axiosApi.get(`/property/${id}`),
};
