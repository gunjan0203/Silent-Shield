import { ALERT_TYPES, RISK_LEVELS, EMERGENCY_NUMBERS, COLORS } from './constants';

// Format date to readable string
export const formatDate = (dateString: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (format === 'relative') {
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  if (format === 'short') {
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get alert type information
export const getAlertTypeInfo = (code: string) => {
  return ALERT_TYPES[code as keyof typeof ALERT_TYPES] || ALERT_TYPES.OTHER;
};

// Get risk level information
export const getRiskLevelInfo = (score: number) => {
  if (score >= RISK_LEVELS.HIGH.threshold) return RISK_LEVELS.HIGH;
  if (score >= RISK_LEVELS.MEDIUM.threshold) return RISK_LEVELS.MEDIUM;
  return RISK_LEVELS.LOW;
};

// Calculate distance between two coordinates (in km)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Format distance with unit
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

// Get current location
export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

// Vibrate device (if supported)
export const vibrate = (pattern: number | number[]): void => {
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

// Play emergency sound
export const playEmergencySound = (): void => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 880;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.log('Audio not supported');
  }
};

// Generate random ID
export const generateId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate phone number (Indian)
export const isValidPhone = (phone: string): boolean => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(phone);
};

// Format phone number
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

// Capitalize first letter
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Truncate text
export const truncate = (text: string, maxLength: number, suffix: string = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

// Get color for percentage
export const getPercentageColor = (percentage: number): string => {
  if (percentage >= 80) return COLORS.DANGER;
  if (percentage >= 60) return COLORS.WARNING;
  if (percentage >= 40) return '#38a169';
  if (percentage >= 20) return COLORS.INFO;
  return COLORS.SUCCESS;
};

// Open emergency call
export const callEmergency = (number: string = EMERGENCY_NUMBERS.POLICE): void => {
  window.open(`tel:${number}`, '_self');
};

// Copy to clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

// Get browser information
export const getBrowserInfo = (): {
  name: string;
  version: string;
  isMobile: boolean;
  isOnline: boolean;
} => {
  const userAgent = navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';

  // Detect browser
  if (userAgent.indexOf('Chrome') > -1) {
    browserName = 'Chrome';
    const temp = userAgent.match(/Chrome\/(\d+)/);
    browserVersion = temp ? temp[1] : 'Unknown';
  } else if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
    const temp = userAgent.match(/Firefox\/(\d+)/);
    browserVersion = temp ? temp[1] : 'Unknown';
  } else if (userAgent.indexOf('Safari') > -1) {
    browserName = 'Safari';
    const temp = userAgent.match(/Version\/(\d+)/);
    browserVersion = temp ? temp[1] : 'Unknown';
  } else if (userAgent.indexOf('Edge') > -1) {
    browserName = 'Edge';
    const temp = userAgent.match(/Edge\/(\d+)/);
    browserVersion = temp ? temp[1] : 'Unknown';
  }

  return {
    name: browserName,
    version: browserVersion,
    isMobile: /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent),
    isOnline: navigator.onLine,
  };
};

// Storage helpers
export const storage = {
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  get: (key: string): any => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

// Export all helpers
export default {
  formatDate,
  getAlertTypeInfo,
  getRiskLevelInfo,
  calculateDistance,
  formatDistance,
  getCurrentLocation,
  vibrate,
  playEmergencySound,
  generateId,
  debounce,
  throttle,
  isValidEmail,
  isValidPhone,
  formatPhone,
  capitalize,
  truncate,
  getPercentageColor,
  callEmergency,
  copyToClipboard,
  getBrowserInfo,
  storage,
};