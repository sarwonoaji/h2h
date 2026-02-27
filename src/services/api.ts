type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export const createApi = (baseURL: string) => {
  const getToken = () => {
    return localStorage.getItem("token");
  };

  async function request<T>(
    endpoint: string,
    method: HttpMethod,
    data?: unknown
  ): Promise<T> {
    const token = getToken();

    const response = await fetch(baseURL + endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : ""
      },
      body: data ? JSON.stringify(data) : undefined
    });
    if (!response.ok) {
      throw new Error(`API Error ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  return {
    get: <T>(endpoint: string) =>
      request<T>(endpoint, "GET"),

    post: <T>(endpoint: string, data?: unknown) =>
      request<T>(endpoint, "POST", data),

    put: <T>(endpoint: string, data?: unknown) =>
      request<T>(endpoint, "PUT", data),

    delete: <T>(endpoint: string) =>
      request<T>(endpoint, "DELETE")
  };
};
