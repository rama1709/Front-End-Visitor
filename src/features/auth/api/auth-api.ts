import type {
  AuthUser,
  LoginCredentials,
} from "../types";

const API_URL = "http://localhost:8080/api";

interface BackendLoginResponse {
  message: string;
  token: string;
  firebaseToken: string;
  employee: {
    id: number;
    full_name: string;
    email: string;
    role: string;
    department: string;
  };
}

export async function loginToBackend(
  credentials: LoginCredentials,
): Promise<{
  user: AuthUser;
  token: string;
  firebaseToken: string;
} | null> {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email.trim().toLowerCase(),
        password: credentials.password,
      }),
    });

    if (!response.ok) return null;

    const data: BackendLoginResponse = await response.json();

    const user: AuthUser = {
      id: data.employee.id,
      name: data.employee.full_name,
      email: data.employee.email,
      role: data.employee.role,
      department: data.employee.department,
      avatarInitials: getInitials(data.employee.full_name),
    };

    return {
      user,
      token: data.token,
      firebaseToken: data.firebaseToken,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}