export interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'USER' | 'VOLUNTEER';
  is_active: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  full_name: string;
  email: string;
  password: string;
  role: 'USER' | 'VOLUNTEER';
}

export interface VolunteerSignupData {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  id_photo: File;
}