export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  department: string
  avatarInitials: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResult {
  success: boolean
  message?: string
}
