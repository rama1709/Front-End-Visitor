import { useAuthStore } from '../../auth/hooks/useAuthStore'
import type { Employee } from '../types'

const API_URL = 'http://localhost:8080/api'

interface BackendEmployee {
  id: number
  full_name: string
  email: string
  role?: string | null
  department?: string | null
  position?: string | null
  phone?: string | null
  created_at?: string
  updated_at?: string
}

interface CreateEmployeePayload {
  full_name: string
  email: string
  role: string
  department: string
  position: string
  phone: string
}

interface UpdateEmployeePayload {
  full_name?: string
  email?: string
  department?: string
  position?: string
  phone?: string
}

interface ApiMessage {
  message: string
}

function getToken(): string {
  const token = useAuthStore.getState().token

  if (!token) {
    throw new Error('Authentication token not found')
  }

  return token
}

function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

/**
 * Backend Employee -> Frontend Employee
 */
function mapEmployee(
  employee: BackendEmployee,
): Employee {
  return {
    id: String(employee.id),

    employeeId: `EMP-${String(employee.id).padStart(4, '0')}`,

    name: employee.full_name ?? '',

    department: employee.department ?? '',

    position: employee.position ?? '',

    phone: employee.phone ?? '',

    email: employee.email ?? '',

    avatarSeed: employee.full_name ?? '',

    status: 'active',

    joinedDate:
      employee.created_at ??
      new Date().toISOString(),
  }
}

/**
 * GET ALL EMPLOYEES
 */
export async function getEmployeesFromApi(): Promise<Employee[]> {
  const response = await fetch(
    `${API_URL}/employees`,
    {
      method: 'GET',
      headers: getHeaders(),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(
      `Failed to fetch employees: ${response.status} ${errorText}`,
    )
  }

  const data: BackendEmployee[] =
    await response.json()

  return data.map(mapEmployee)
}

/**
 * CREATE EMPLOYEE
 */
export async function createEmployeeApi(
  values: {
    name: string
    department: string
    position: string
    phone: string
    email: string
    status: Employee['status']
  },
): Promise<Employee> {
  const payload: CreateEmployeePayload = {
    full_name: values.name,
    email: values.email,
    role: 'employee',
    department: values.department,
    position: values.position,
    phone: values.phone,
  }

  const response = await fetch(
    `${API_URL}/employees`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(
      `Failed to create employee: ${response.status} ${errorText}`,
    )
  }

  const result: ApiMessage =
    await response.json()

  console.log(
    'Create employee:',
    result.message,
  )

  // Ambil ulang data dari database
  const employees =
    await getEmployeesFromApi()

  const createdEmployee =
    employees.find(
      (employee) =>
        employee.email.toLowerCase() ===
        values.email.toLowerCase(),
    )

  if (!createdEmployee) {
    throw new Error(
      'Employee berhasil dibuat, tetapi data tidak ditemukan.',
    )
  }

  return createdEmployee
}

/**
 * UPDATE EMPLOYEE
 */
export async function updateEmployeeApi(
  id: string,
  values: {
    name?: string
    department?: string
    position?: string
    phone?: string
    email?: string
    status?: Employee['status']
  },
): Promise<Employee> {
  const payload: UpdateEmployeePayload = {
    full_name: values.name,
    email: values.email,
    department: values.department,
    position: values.position,
    phone: values.phone,
  }

  const response = await fetch(
    `${API_URL}/employees/${id}`,
    {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(
      `Failed to update employee: ${response.status} ${errorText}`,
    )
  }

  const result: ApiMessage =
    await response.json()

  console.log(
    'Update employee:',
    result.message,
  )

  // Ambil ulang data
  const employees =
    await getEmployeesFromApi()

  const updatedEmployee =
    employees.find(
      (employee) =>
        employee.id === String(id),
    )

  if (!updatedEmployee) {
    throw new Error(
      'Employee berhasil diupdate, tetapi data tidak ditemukan.',
    )
  }

  return updatedEmployee
}

/**
 * DELETE EMPLOYEE
 */
export async function deleteEmployeeApi(
  id: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/employees/${id}`,
    {
      method: 'DELETE',
      headers: getHeaders(),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(
      `Failed to delete employee: ${response.status} ${errorText}`,
    )
  }

  const result: ApiMessage =
    await response.json()

  console.log(
    'Delete employee:',
    result.message,
  )
}