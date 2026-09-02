import type { AuthUser, LoginCredentials } from '../types'

interface MockAccount extends AuthUser {
  password: string
}

// Demo accounts for the front desk console. In a real deployment this
// would be replaced by a call to an authentication API.
const MOCK_ACCOUNTS: MockAccount[] = [
  {
    id: 'usr-001',
    name: 'Reza Santoso',
    email: 'admin@vms.com',
    password: 'admin123',
    role: 'Front Desk Administrator',
    department: 'Front Office',
    avatarInitials: 'RS',
  },
  {
    id: 'usr-002',
    name: 'Amanda Cole',
    email: 'amanda.cole@vms.com',
    password: 'password123',
    role: 'Security Supervisor',
    department: 'Security',
    avatarInitials: 'AC',
  },
]

function delay<T>(value: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export async function authenticate(
  credentials: LoginCredentials,
): Promise<{ user: AuthUser; token: string } | null> {
  const email = credentials.email.trim().toLowerCase()
  const account = MOCK_ACCOUNTS.find(
    (candidate) => candidate.email.toLowerCase() === email,
  )

  if (!account || account.password !== credentials.password) {
    return delay(null)
  }

  const user: AuthUser = {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    department: account.department,
    avatarInitials: account.avatarInitials,
  }
  const token = `mock-token.${user.id}.${Date.now()}`

  return delay({ user, token })
}

export function getDemoAccounts(): { email: string; password: string }[] {
  return MOCK_ACCOUNTS.map(({ email, password }) => ({ email, password }))
}
