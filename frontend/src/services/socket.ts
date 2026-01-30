import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private baseURL: string;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.baseURL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:8000';
  }

  // Connect to socket server
  connect(token?: string): void {
    if (this.socket?.connected) return;

    const options = {
      transports: ['websocket', 'polling'],
      auth: token ? { token } : undefined,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    };

    this.socket = io(this.baseURL, options);

    this.setupEventListeners();
  }

  // Setup default event listeners
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.emitEvent('socket:connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.emitEvent('socket:disconnected', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.emitEvent('socket:error', error);
    });

    // Listen for alerts
    this.socket.on('alert:new', (alert) => {
      console.log('New alert received:', alert);
      this.emitEvent('alert:new', alert);
    });

    this.socket.on('alert:update', (alert) => {
      console.log('Alert updated:', alert);
      this.emitEvent('alert:update', alert);
    });

    this.socket.on('volunteer:available', (data) => {
      console.log('Volunteer available:', data);
      this.emitEvent('volunteer:available', data);
    });

    this.socket.on('location:update', (data) => {
      console.log('Location update:', data);
      this.emitEvent('location:update', data);
    });

    this.socket.on('emergency:broadcast', (data) => {
      console.log('Emergency broadcast:', data);
      this.emitEvent('emergency:broadcast', data);
    });
  }

  // Send an alert
  sendAlert(alertData: any): void {
    if (this.socket?.connected) {
      this.socket.emit('alert:create', alertData);
    } else {
      console.warn('Socket not connected, cannot send alert');
    }
  }

  // Update alert status
  updateAlert(alertId: string, status: string): void {
    if (this.socket?.connected) {
      this.socket.emit('alert:update', { alertId, status });
    }
  }

  // Join a specific room (e.g., city-based)
  joinRoom(roomId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('room:join', roomId);
    }
  }

  // Leave a room
  leaveRoom(roomId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('room:leave', roomId);
    }
  }

  // Update user location
  updateLocation(location: { lat: number; lng: number }): void {
    if (this.socket?.connected) {
      this.socket.emit('location:update', location);
    }
  }

  // Volunteer response to alert
  respondToAlert(alertId: string, volunteerId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('alert:respond', { alertId, volunteerId });
    }
  }

  // Add event listener
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  // Remove event listener
  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit event to listeners
  private emitEvent(event: string, data?: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // Disconnect socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  // Check if connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Get socket ID
  getSocketId(): string | null {
    return this.socket?.id || null;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;