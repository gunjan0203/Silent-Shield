export * from './user';
export * from './alert';

// Common Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: Array<{
    value: string;
    label: string;
  }>;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  };
}

// Map Types
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location extends Coordinates {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  timestamp?: Date;
}

export interface HeatmapPoint extends Coordinates {
  intensity: number;
  radius?: number;
  count?: number;
  timestamp?: Date;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'alert' | 'report' | 'system' | 'volunteer';
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  data?: any;
}

// Settings Types
export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    emergencyAlerts: boolean;
    safetyReports: boolean;
    volunteerAlerts: boolean;
  };
  privacy: {
    shareLocation: boolean;
    shareWithVolunteers: boolean;
    anonymousReporting: boolean;
    dataSharing: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    fontSize: 'small' | 'medium' | 'large';
    language: string;
  };
  emergency: {
    contacts: EmergencyContact[];
    autoSOS: boolean;
    sosCountdown: number;
    shareWithContacts: boolean;
  };
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  primary: boolean;
}

// Statistics Types
export interface UserStats {
  alertsSent: number;
  reportsFiled: number;
  responsesReceived: number;
  volunteerActions: number;
  safeDays: number;
  riskScore: number;
  lastActive: Date;
}

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalAlerts: number;
  todayAlerts: number;
  totalVolunteers: number;
  activeVolunteers: number;
  averageResponseTime: number;
  successRate: number;
}

// AI Analysis Types
export interface RiskAnalysis {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  score: number;
  factors: string[];
  recommendations: string[];
  confidence: number;
}

export interface PanicAnalysis {
  panicLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  code: string;
  analysis: string;
  recommendedActions: string[];
  confidence: number;
}

// Socket Events Types
export interface SocketEvent {
  type: string;
  data: any;
  timestamp: Date;
  userId?: string;
  room?: string;
}

export interface AlertEvent {
  alertId: string;
  type: string;
  severity: string;
  location: Coordinates;
  userId?: string;
  timestamp: Date;
}

export interface LocationEvent {
  userId: string;
  location: Coordinates;
  accuracy?: number;
  timestamp: Date;
}

// File Types
export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  metadata?: Record<string, any>;
}

// Volunteer Types
export interface VolunteerProfile {
  userId: string;
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  verification: {
    idVerified: boolean;
    phoneVerified: boolean;
    emailVerified: boolean;
    verifiedAt?: Date;
  };
  availability: {
    status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
    schedule?: {
      days: number[];
      hours: {
        start: string;
        end: string;
      };
    };
    lastActive: Date;
  };
  stats: {
    totalResponses: number;
    successfulResponses: number;
    averageResponseTime: number;
    rating: number;
  };
  preferences: {
    alertTypes: string[];
    maxDistance: number;
    notifications: boolean;
  };
}

// Export everything
export type {
  User,
  LoginData,
  SignupData,
  VolunteerSignupData,
} from './user';

export type {
  Alert,
  CreateAlertData,
  Report,
} from './alert';