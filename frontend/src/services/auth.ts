import api from './api';
import { LoginData, SignupData, VolunteerSignupData, User } from '../types/user';

export const authService = {
  // User Login
  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    
    // Store user data and token (if available)
    if (response.data.id) {
      localStorage.setItem('user', JSON.stringify(response.data));
      // Note: Your backend currently doesn't return a token
      // You might want to update backend to return JWT token
    }
    
    return response.data;
  },

  // User Signup
  signup: async (data: SignupData) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  // Volunteer Signup (with file upload)
  volunteerSignup: async (data: VolunteerSignupData) => {
    const formData = new FormData();
    formData.append('full_name', data.full_name);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('phone', data.phone);
    formData.append('city', data.city);
    formData.append('id_photo', data.id_photo);

    const response = await api.post('/volunteers/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const user = localStorage.getItem('user');
    return !!user;
  },

  // Get stored user
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};