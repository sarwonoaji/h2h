import { authApi } from "../api.instances";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await authApi.post<any>("authenticate", data);
    // Ambil token dari res.data
    return { token: res.data };
  }
};