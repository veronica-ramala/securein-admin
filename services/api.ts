import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT || '10000');

// Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: string;
  };
  expiresAt: string;
}

export interface Resident {
  id: string;
  name: string;
  unit: string;
  phone: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
  applicationDate: string;
  approvedDate?: string;
  documents: {
    type: string;
    status: 'pending' | 'approved' | 'rejected';
    url?: string;
  }[];
  personalInfo: {
    dateOfBirth: string;
    occupation: string;
    nationality: string;
    idNumber: string;
    maritalStatus: string;
    monthlyIncome: string;
  };
  familyMembers: {
    name: string;
    relationship: string;
    age: number;
  }[];
  vehicles: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
  }[];
  pets: {
    name: string;
    type: string;
    breed: string;
    age: number;
  }[];
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

export interface Staff {
  id: string;
  name: string;
  position: string;
  department: string;
  phone: string;
  email: string;
  joinDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: 'available' | 'occupied' | 'maintenance';
  bookings: {
    id: string;
    residentId: string;
    residentName: string;
    date: string;
    timeSlot: string;
    status: 'pending' | 'approved' | 'rejected';
  }[];
}

// API Client
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_TIMEOUT;
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return token;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Authentication endpoints
  async login(username: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
    });
  }

  // Residents endpoints
  async getResidents(): Promise<ApiResponse<Resident[]>> {
    return this.request<Resident[]>('/residents');
  }

  async getResident(id: string): Promise<ApiResponse<Resident>> {
    return this.request<Resident>(`/residents/${id}`);
  }

  async approveResident(id: string): Promise<ApiResponse<Resident>> {
    return this.request<Resident>(`/residents/${id}/approve`, {
      method: 'POST',
    });
  }

  async rejectResident(id: string, reason?: string): Promise<ApiResponse<Resident>> {
    return this.request<Resident>(`/residents/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async updateResident(id: string, data: Partial<Resident>): Promise<ApiResponse<Resident>> {
    return this.request<Resident>(`/residents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteResident(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/residents/${id}`, {
      method: 'DELETE',
    });
  }

  // Staff endpoints
  async getStaff(): Promise<ApiResponse<Staff[]>> {
    return this.request<Staff[]>('/staff');
  }

  async createStaff(data: Omit<Staff, 'id'>): Promise<ApiResponse<Staff>> {
    return this.request<Staff>('/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStaff(id: string, data: Partial<Staff>): Promise<ApiResponse<Staff>> {
    return this.request<Staff>(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStaff(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/staff/${id}`, {
      method: 'DELETE',
    });
  }

  // Facilities endpoints
  async getFacilities(): Promise<ApiResponse<Facility[]>> {
    return this.request<Facility[]>('/facilities');
  }

  async approveFacilityBooking(facilityId: string, bookingId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/facilities/${facilityId}/bookings/${bookingId}/approve`, {
      method: 'POST',
    });
  }

  async rejectFacilityBooking(facilityId: string, bookingId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/facilities/${facilityId}/bookings/${bookingId}/reject`, {
      method: 'POST',
    });
  }

  // Dashboard endpoints
  async getDashboardStats(): Promise<ApiResponse<{
    pendingResidents: number;
    pendingFacilities: number;
    pendingMaintenance: number;
    totalResidents: number;
    totalStaff: number;
    totalFacilities: number;
  }>> {
    return this.request('/dashboard/stats');
  }

  async getPendingItems(): Promise<ApiResponse<{
    residents: any[];
    facilities: any[];
    maintenance: any[];
  }>> {
    return this.request('/dashboard/pending');
  }
}

export const api = new ApiClient();