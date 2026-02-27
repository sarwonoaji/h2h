import environment from "../config/environment";
import { createApi } from "./api";

export const authApi = createApi(environment.AUTH_API);
export const dlSupportApi = createApi(environment.DL_SUPPORT_API);
export const tpbApi = createApi(environment.TPB_API);
export const pebApi = createApi(environment.PEB_API);
export const ceisaApi = createApi(environment.CEISA_API);
