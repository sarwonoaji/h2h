import { useState, useEffect, useCallback } from "react";
import { authService, type LoginRequest, type LoginResponse } from "../services/auth/auth.services";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    isLoading: true,
    error: null
  });

  // Check if user is already authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const expired = localStorage.getItem("tokenExpired");

    if (token && expired) {
      const expirationDate = new Date(expired);
      const now = new Date();

      if (now < expirationDate) {
        setAuthState({
          isAuthenticated: true,
          token,
          isLoading: false,
          error: null
        });
      } else {
        // Token expired, clear storage
        localStorage.removeItem("AuthorizationCeisa");
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpired");
        setAuthState({
          isAuthenticated: false,
          token: null,
          isLoading: false,
          error: null
        });
      }
    } else {
      setAuthState({
        isAuthenticated: false,
        token: null,
        isLoading: false,
        error: null
      });
    }
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<LoginResponse> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authService.login(credentials);

      localStorage.setItem("token", response.token);

      setAuthState({
        isAuthenticated: true,
        token: response.token,
        isLoading: false,
        error: null
      });

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpired");
    localStorage.removeItem("AuthorizationCeisa");
    setAuthState({
      isAuthenticated: false,
      token: null,
      isLoading: false,
      error: null
    });
  }, []);

  const clearError = useCallback(() => {
    setAuthState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    login,
    logout,
    clearError
  };
};
