import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { 
  User, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiResponse 
} from './types';

export class AuthClient {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL?: string) {
    // Handle environment variables safely for both browser and Node.js
    const defaultURL = 'http://localhost:4000';
    const envURL = typeof window !== 'undefined' 
      ? (window as any).env?.NEXT_PUBLIC_AUTH_API_URL
      : typeof process !== 'undefined' 
        ? process.env?.NEXT_PUBLIC_AUTH_API_URL
        : undefined;
    
    const finalURL = baseURL || envURL || defaultURL;
    
    this.api = axios.create({
      baseURL: finalURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.token = null;
          this.removeTokenFromStorage();
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private saveTokenToStorage(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private removeTokenFromStorage() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    this.saveTokenToStorage(token);
  }

  clearToken() {
    this.token = null;
    this.removeTokenFromStorage();
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/auth/login', credentials);
      const { access_token } = response.data;
      this.setToken(access_token);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await this.api.post<RegisterResponse>('/users/register', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.api.post<User>('/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user');
    }
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    try {
      const response = await this.api.post<ApiResponse>('/auth/forgot-password', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send reset email');
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    try {
      const response = await this.api.post<ApiResponse>('/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  }

  async logout(): Promise<void> {
    this.clearToken();
    // Could also call a logout endpoint if you implement one
  }

  // Helper method for making authenticated requests
  async authenticatedRequest<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.request<T>(config);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Request failed');
    }
  }
}

// Create a default instance
export const authClient = new AuthClient();

// Helper hooks for React (optional)
export const useAuth = () => {
  return {
    client: authClient,
    isAuthenticated: authClient.isAuthenticated(),
    token: authClient.getToken(),
  };
};