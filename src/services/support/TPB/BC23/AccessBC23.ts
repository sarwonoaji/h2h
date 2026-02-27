import { tpbApi } from "../../../api.instances";

export interface TPB {
  id: number;
  ajuNo: string;
}
export interface ApiResponse<T> {
  apiVersion: string;
  data: T;
  info: any;
  message: string;
  statusCode: number;
}

export const bc23Service = {
  getUrutNoAju: () =>
    tpbApi.get<number>("/23/count"),

  getTPB: () =>
    tpbApi.get<ApiResponse<any[]>>("/23"),

  getById: (id: number) =>
    tpbApi.get<ApiResponse<any>>(`/23/${id}`),

  postTPB: (data: unknown) =>
    tpbApi.post<TPB>("/23", data),

  updateTPB: (id: number, data: unknown) =>
    tpbApi.put<TPB>(`/23/${id}`, data),

  deleteTPB: (id: number) =>
    tpbApi.delete<void>(`/23/${id}`),

  postingTPB: (id: number, data: unknown) =>
    tpbApi.put(`/23/support-TPB/${id}`, data)
};
