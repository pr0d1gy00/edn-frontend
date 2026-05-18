import Cookies from 'js-cookie';
import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Token refresh
  refreshIntervalId: ReturnType<typeof setInterval> | null;
  // Actions
  login: (user: User, accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  checkSession: () => void;
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<boolean>;
  startTokenRefresh: () => void;
  stopTokenRefresh: () => void;
}

const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  path: '/',
  sameSite: 'Lax' as const,
};

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  refreshIntervalId: null,

  login: (user: User, accessToken: string, refreshToken?: string) => {
    // Store tokens in cookies (httpOnly would be ideal but js-cookie can't set httpOnly)
    Cookies.set('accessToken', accessToken, COOKIE_OPTIONS);
    if (refreshToken) {
      Cookies.set('refreshToken', refreshToken, COOKIE_OPTIONS);
    }
    // Store user data in cookie (simplified - in production you'd encrypt this)
    Cookies.set('user', JSON.stringify(user), COOKIE_OPTIONS);

    set({ user, isAuthenticated: true, isLoading: false });

    // Start automatic token refresh
    get().startTokenRefresh();
  },

  logout: () => {
    // Stop token refresh interval
    get().stopTokenRefresh();

    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });
    Cookies.remove('user', { path: '/' });

    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  checkSession: () => {
    const accessToken = Cookies.get('accessToken');
    const userStr = Cookies.get('user');

    if (accessToken && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, isAuthenticated: true, isLoading: false });
        // Start token refresh if authenticated
        get().startTokenRefresh();
      } catch {
        // Invalid user data in cookie
        Cookies.remove('accessToken', { path: '/' });
        Cookies.remove('user', { path: '/' });
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  getAccessToken: () => {
    return Cookies.get('accessToken') || null;
  },

  refreshAccessToken: async (): Promise<boolean> => {
    const refreshToken = Cookies.get('refreshToken');
    if (!refreshToken) {
      // No refresh token, must logout
      get().logout();
      return false;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        // Refresh failed, logout
        get().logout();
        return false;
      }

      const data = await response.json();
      const newAccessToken = data.accessToken || data.data?.accessToken;

      if (newAccessToken) {
        // Update access token cookie
        Cookies.set('accessToken', newAccessToken, COOKIE_OPTIONS);
        return true;
      }

      // No new token in response, logout
      get().logout();
      return false;
    } catch {
      // Network error, logout
      get().logout();
      return false;
    }
  },

  startTokenRefresh: () => {
    const { refreshIntervalId } = get();
    if (refreshIntervalId) {
      // Already running
      return;
    }

    // Refresh immediately on start
    get().refreshAccessToken();

    // Set interval for subsequent refreshes
    const intervalId = setInterval(() => {
      get().refreshAccessToken();
    }, REFRESH_INTERVAL_MS);

    set({ refreshIntervalId: intervalId });
  },

  stopTokenRefresh: () => {
    const { refreshIntervalId } = get();
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
      set({ refreshIntervalId: null });
    }
  },
}));

// Call checkSession on module load to restore session from cookies
if (typeof window !== 'undefined') {
  useAuthStore.getState().checkSession();
}