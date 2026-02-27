import { ceisaApi } from "../../api.instances";
import type { TPB } from "../TPB/BC23/AccessBC23";

export interface Ceisa {
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

export const ceisaService = {
    getLoginCeisa: () =>
       ceisaApi.get<any>("/login"),

    getRefreshToken: () =>
        ceisaApi.get<number>("/refresh-token"),

    getRate: (kode: string) =>
        ceisaApi.get<ApiResponse<any[]>>(`/getRate/${kode}`),

    getLartas: (id: number) =>
        ceisaApi.get<ApiResponse<any>>(`/getLartas/${id}`),

    getManifes: (kodeKantor: string, nomorHostBl: string, tglManifes: string, namaImport: string) =>
        ceisaApi.get<ApiResponse<any>>(`/getManifes?kodeKantor=${kodeKantor}&noHostBl=${nomorHostBl}&tglHostBl=${tglManifes}&nama=${namaImport}`),

    getPelabuhan: (kode: string) =>
        ceisaApi.get<ApiResponse<any[]>>(`/getPelabuhan/${kode}`),

    getTarifHS: (kode: string) =>
        ceisaApi.get<ApiResponse<any[]>>(`/getTarifHS/${kode}`),

    getBCPEB: (id: number) =>
        ceisaApi.get<ApiResponse<any>>(`/GetBC-PEB/${id}`),

    getBCTEB: (id: number) =>
        ceisaApi.get<ApiResponse<any>>(`/GetBC-TEB/${id}`),
};
