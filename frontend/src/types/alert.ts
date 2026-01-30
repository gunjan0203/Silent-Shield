export interface Alert {
  id: number;
  code: string;
  message?: string;
  panic_level: string;
  latitude: number;
  longitude: number;
  user_id?: number;
}

export interface CreateAlertData {
  code: string;
  message?: string;
  latitude: number;
  longitude: number;
}

export interface Report {
  id: number;
  description: string;
  risk_level: string;
  latitude: number;
  longitude: number;
  user_id?: number;
}