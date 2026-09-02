import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { loginToBackend } from '../api/auth-api'
import type { AuthUser, LoginCredentials, LoginResult } from '../types'

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<LoginResult>
  logout: () => void
}

// SSR-safe storage: TanStack Start renders on the server first,
// where window/localStorage do not exist.
const safeStorage = createJSONStorage(() => {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }
  }

  return window.localStorage
})

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

     login: async (credentials) => {
  set({ isLoading: true });

  const result = await loginToBackend(credentials);

  if (!result) {
    set({ isLoading: false });

    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  // simpan firebase custom token
  localStorage.setItem(
    "firebaseCustomToken",
    result.firebaseToken,
  );

  set({
    user: result.user,
    token: result.token,
    isAuthenticated: true,
    isLoading: false,
  });

  return { success: true };
},

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },
    }),
    {
      name: 'vms-auth',
      storage: safeStorage,

      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

/**
 * Reads current auth state outside React
 * (e.g. router beforeLoad guards).
 */
export function isSessionAuthenticated() {
  return useAuthStore.getState().isAuthenticated
}