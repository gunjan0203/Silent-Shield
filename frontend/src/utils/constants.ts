// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
  },
  ALERTS: {
    CREATE: '/alerts/',
    GUEST: '/alerts/guest',
    // Additional endpoints would be added as backend expands
  },
  REPORTS: {
    CREATE: '/reports/',
  },
  VOLUNTEERS: {
    SIGNUP: '/volunteers/signup',
  },
  USERS: {
    ME: '/users/me',
    ALL: '/users/',
  },
  HEATMAP: {
    GET: '/heatmap/',
  },
  AI: {
    PANIC: '/ai/panic',
    REPORT_RISK: '/ai/report_risk',
  },
};

// Emergency Contact Numbers
export const EMERGENCY_NUMBERS = {
  POLICE: '100',
  AMBULANCE: '108',
  FIRE: '101',
  WOMEN_HELPLINE: '1091',
  CHILD_HELPLINE: '1098',
  DISASTER_MANAGEMENT: '108',
  POISON_CONTROL: '1066',
  MENTAL_HEALTH: '08046110007',
  ROAD_ACCIDENT: '1073',
  TOURIST_HELPLINE: '1363',
};

// Alert Types
export const ALERT_TYPES = {
  SOS: {
    code: 'SOS',
    label: 'Emergency SOS',
    icon: '🚨',
    priority: 'HIGH',
    color: '#ff0000',
  },
  MEDICAL: {
    code: 'MEDICAL',
    label: 'Medical Emergency',
    icon: '🏥',
    priority: 'HIGH',
    color: '#ff0000',
  },
  FIRE: {
    code: 'FIRE',
    label: 'Fire Emergency',
    icon: '🔥',
    priority: 'HIGH',
    color: '#ff6600',
  },
  POLICE: {
    code: 'POLICE',
    label: 'Police Assistance',
    icon: '🚔',
    priority: 'MEDIUM',
    color: '#0000ff',
  },
  SAFETY: {
    code: 'SAFETY',
    label: 'Safety Concern',
    icon: '⚠️',
    priority: 'MEDIUM',
    color: '#ffcc00',
  },
  OTHER: {
    code: 'OTHER',
    label: 'Other Alert',
    icon: '📢',
    priority: 'LOW',
    color: '#666666',
  },
};

// Risk Levels
export const RISK_LEVELS = {
  HIGH: {
    label: 'High Risk',
    color: '#ff0000',
    bgColor: '#ffebee',
    threshold: 70,
  },
  MEDIUM: {
    label: 'Medium Risk',
    color: '#ff9900',
    bgColor: '#fff3e0',
    threshold: 40,
  },
  LOW: {
    label: 'Low Risk',
    color: '#00aa00',
    bgColor: '#e8f5e9',
    threshold: 0,
  },
};

// User Roles
export const USER_ROLES = {
  USER: 'USER',
  VOLUNTEER: 'VOLUNTEER',
  ADMIN: 'ADMIN',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'silent_shield_token',
  USER_DATA: 'silent_shield_user',
  THEME: 'silent_shield_theme',
  LANGUAGE: 'silent_shield_language',
  LOCATION: 'silent_shield_location',
};

// App Configuration
export const APP_CONFIG = {
  NAME: 'Silent Shield',
  VERSION: '1.0.0',
  DESCRIPTION: 'Your personal safety companion',
  DEFAULT_LOCATION: {
    lat: 28.6139,
    lng: 77.2090,
    city: 'Delhi',
    country: 'India',
  },
  MAP: {
    DEFAULT_ZOOM: 12,
    MAX_ZOOM: 18,
    MIN_ZOOM: 8,
  },
  ALERTS: {
    AUTO_REFRESH_INTERVAL: 30000, // 30 seconds
    HISTORY_LIMIT: 50,
  },
  SOCKET: {
    RECONNECTION_ATTEMPTS: 5,
    RECONNECTION_DELAY: 1000,
  },
};

// Cities for dropdowns
export const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad',
  'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
];

// Safety Tips
export const SAFETY_TIPS = [
  'Always share your live location with trusted contacts when traveling alone',
  'Keep emergency contacts saved with ICE (In Case of Emergency) prefix',
  'Use well-lit and populated routes, especially at night',
  'Trust your instincts - if something feels wrong, leave immediately',
  'Keep your phone charged and carry a power bank',
  'Learn basic self-defense techniques',
  'Save local emergency numbers in your phone',
  'Avoid sharing real-time location on social media',
  'Use the SOS feature only for real emergencies',
  'Report suspicious activities to help keep your community safe',
];

// Validation Constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[6-9]\d{9}$/, // Indian phone numbers
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  MESSAGE_MAX_LENGTH: 255,
};

// Colors for UI
export const COLORS = {
  PRIMARY: '#667eea',
  PRIMARY_DARK: '#5a67d8',
  SECONDARY: '#764ba2',
  SUCCESS: '#38a169',
  DANGER: '#e53e3e',
  WARNING: '#d69e2e',
  INFO: '#3182ce',
  LIGHT: '#f7fafc',
  DARK: '#2d3748',
  BACKGROUND: '#f5f7fa',
  CARD_BACKGROUND: '#ffffff',
  TEXT_PRIMARY: '#2d3748',
  TEXT_SECONDARY: '#4a5568',
  TEXT_LIGHT: '#718096',
  BORDER: '#e2e8f0',
};

// Breakpoints for responsive design
export const BREAKPOINTS = {
  XS: 0,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1400,
};

export default {
  API_ENDPOINTS,
  EMERGENCY_NUMBERS,
  ALERT_TYPES,
  RISK_LEVELS,
  USER_ROLES,
  STORAGE_KEYS,
  APP_CONFIG,
  INDIAN_CITIES,
  SAFETY_TIPS,
  VALIDATION,
  COLORS,
  BREAKPOINTS,
};