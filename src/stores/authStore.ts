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
  // Actions
  login: (user: User, accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  checkSession: () => void;
  getAccessToken: () => string | null;
}

const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  path: '/',
  sameSite: 'Lax' as const,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user: User, accessToken: string, refreshToken?: string) => {
    // Store tokens in cookies (httpOnly would be ideal but js-cookie can't set httpOnly)
    Cookies.set('accessToken', accessToken, COOKIE_OPTIONS);
    if (refreshToken) {
      Cookies.set('refreshToken', refreshToken, COOKIE_OPTIONS);
    }
    // Store user data in cookie (simplified - in production you'd encrypt this)
    Cookies.set('user', JSON.stringify(user), COOKIE_OPTIONS);

    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
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
}));

// Call checkSession on module load to restore session from cookies
if (typeof window !== 'undefined') {
  useAuthStore.getState().checkSession();
}