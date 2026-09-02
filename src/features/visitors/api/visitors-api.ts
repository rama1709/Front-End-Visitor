import { useAuthStore } from '../../auth/hooks/useAuthStore'
import type {
  Visitor,
  VisitorFormValues,
} from '../types'

const API_URL = 'http://localhost:8080/api'

interface BackendVisitor {
  id: number
  full_name: string
  email: string
  phone: string
  company: string

  created_at?: string
  updated_at?: string

  identity_number?: string | null
  purpose?: string | null

  host_employee_id?: number | null
  host_employee_name?: string | null
  department?: string | null

  visitor_type?: string | null
  vehicle_number?: string | null

  status?: string | null

  check_in_time?: string | null
  check_out_time?: string | null

  operator?: string | null
  badge_returned?: boolean | null
  remarks?: string | null
}

interface CreateVisitorPayload {
  full_name: string
  email: string
  phone: string
  company: string
  host_employee_id: number | null
  identity_number?: string
  purpose?: string
  visitor_type?: string
  vehicle_number?: string | null
}

interface UpdateVisitorPayload {
  full_name?: string
  email?: string
  phone?: string
  company?: string
  host_employee_id?: number | null
  identity_number?: string
  purpose?: string
  visitor_type?: string
  vehicle_number?: string | null
}

/**
 * GET AUTH TOKEN
 */
function getToken(): string {
  const token = useAuthStore.getState().token

  if (!token) {
    throw new Error('Authentication token not found')
  }

  return token
}

/**
 * REQUEST HEADERS
 */
function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

/**
 * VALIDATE VISITOR TYPE
 */
function isValidVisitorType(
  value: string | null | undefined,
): value is Visitor['visitorType'] {
  return (
    value === 'guest' ||
    value === 'contractor' ||
    value === 'vendor' ||
    value === 'interview' ||
    value === 'vip'
  )
}

/**
 * VALIDATE VISITOR STATUS
 */
function isValidVisitorStatus(
  value: string | null | undefined,
): value is Visitor['status'] {
  return (
    value === 'pending' ||
    value === 'approved' ||
    value === 'checked-in' ||
    value === 'checked-out' ||
    value === 'rejected'
  )
}

/**
 * MAP BACKEND DATA -> FRONTEND DATA
 */
function mapVisitor(
  visitor: BackendVisitor,
): Visitor {
  return {
    id: String(visitor.id),

    visitorId: `VIS-${String(visitor.id).padStart(5, '0')}`,

    fullName: visitor.full_name,

    company: visitor.company ?? '',

    phone: visitor.phone ?? '',

    email: visitor.email ?? '',

    identityNumber:
      visitor.identity_number ?? '',

    avatarSeed:
      visitor.full_name,

    purpose:
      visitor.purpose ?? '',

    hostEmployeeId:
      visitor.host_employee_id !== null &&
      visitor.host_employee_id !== undefined
        ? String(visitor.host_employee_id)
        : '',

    hostEmployeeName:
      visitor.host_employee_name ??
      'Unassigned',

    department:
      visitor.department ??
      'General',

    vehicleNumber:
      visitor.vehicle_number ?? null,

    visitorType:
      isValidVisitorType(
        visitor.visitor_type,
      )
        ? visitor.visitor_type
        : 'guest',

    status:
      isValidVisitorStatus(
        visitor.status,
      )
        ? visitor.status
        : 'pending',

    checkInTime:
      visitor.check_in_time ?? null,

    checkOutTime:
      visitor.check_out_time ?? null,

    operator:
      visitor.operator ?? null,

    badgeReturned:
      visitor.badge_returned ?? null,

    remarks:
      visitor.remarks ?? null,

    createdDate:
      visitor.created_at ??
      new Date().toISOString(),
  }
}

/**
 * GET ALL VISITORS
 */
export async function getVisitorsFromApi(): Promise<Visitor[]> {
  const response = await fetch(
    `${API_URL}/visitors`,
    {
      method: 'GET',
      headers: getHeaders(),
    },
  )

  if (!response.ok) {
    const errorText =
      await response.text()

    throw new Error(
      `Failed to fetch visitors: ${response.status} ${errorText}`,
    )
  }

  const data: BackendVisitor[] =
    await response.json()

  return data.map(mapVisitor)
}

/**
 * CREATE VISITOR
 */
export async function createVisitorApi(
  values: VisitorFormValues,
): Promise<Visitor> {

  const hostEmployeeId =
    values.hostEmployeeId.trim() !== ''
      ? Number(values.hostEmployeeId)
      : null

  const payload: CreateVisitorPayload = {
    full_name: values.fullName,
    email: values.email,
    phone: values.phone,
    company: values.company,

    host_employee_id:
      hostEmployeeId,

    identity_number:
      values.identityNumber,

    purpose:
      values.purpose,

    visitor_type:
      values.visitorType,

    vehicle_number:
      values.vehicleNumber.trim() !== ''
        ? values.vehicleNumber
        : null,
  }

  const response = await fetch(
    `${API_URL}/visitors`,
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    },
  )

  if (!response.ok) {
    const errorText =
      await response.text()

    throw new Error(
      `Failed to create visitor: ${response.status} ${errorText}`,
    )
  }

  const data =
    await response.json()

  /**
   * Jika backend mengembalikan
   * object visitor langsung.
   */
  if (
    data &&
    typeof data === 'object' &&
    'id' in data
  ) {
    return mapVisitor(
      data as BackendVisitor,
    )
  }

  /**
   * Jika backend hanya mengembalikan
   * message, ambil ulang data visitor.
   */
  const visitors =
    await getVisitorsFromApi()

  const created =
    visitors.find(
      (visitor) =>
        visitor.email ===
          values.email &&
        visitor.fullName ===
          values.fullName,
    )

  if (!created) {
    throw new Error(
      'Visitor berhasil dibuat, tetapi data visitor tidak ditemukan.',
    )
  }

  return created
}

/**
 * UPDATE VISITOR
 */
export async function updateVisitorApi(
  id: string,
  values: Partial<VisitorFormValues>,
): Promise<Visitor> {

  const payload: UpdateVisitorPayload = {}

  if (values.fullName !== undefined) {
    payload.full_name =
      values.fullName
  }

  if (values.email !== undefined) {
    payload.email =
      values.email
  }

  if (values.phone !== undefined) {
    payload.phone =
      values.phone
  }

  if (values.company !== undefined) {
    payload.company =
      values.company
  }

  if (
    values.hostEmployeeId !== undefined
  ) {
    payload.host_employee_id =
      values.hostEmployeeId.trim() !== ''
        ? Number(values.hostEmployeeId)
        : null
  }

  if (
    values.identityNumber !== undefined
  ) {
    payload.identity_number =
      values.identityNumber
  }

  if (
    values.purpose !== undefined
  ) {
    payload.purpose =
      values.purpose
  }

  if (
    values.visitorType !== undefined
  ) {
    payload.visitor_type =
      values.visitorType
  }

  if (
    values.vehicleNumber !== undefined
  ) {
    payload.vehicle_number =
      values.vehicleNumber.trim() !== ''
        ? values.vehicleNumber
        : null
  }

  const response = await fetch(
    `${API_URL}/visitors/${id}`,
    {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    },
  )

  if (!response.ok) {
    const errorText =
      await response.text()

    throw new Error(
      `Failed to update visitor: ${response.status} ${errorText}`,
    )
  }

  const data =
    await response.json()

  /**
   * Jika backend mengembalikan
   * object visitor.
   */
  if (
    data &&
    typeof data === 'object' &&
    'id' in data
  ) {
    return mapVisitor(
      data as BackendVisitor,
    )
  }

  /**
   * Jika backend hanya mengembalikan
   * message, ambil ulang data.
   */
  const visitors =
    await getVisitorsFromApi()

  const updated =
    visitors.find(
      (visitor) =>
        visitor.id === id,
    )

  if (!updated) {
    throw new Error(
      'Visitor berhasil diupdate, tetapi data visitor tidak ditemukan.',
    )
  }

  return updated
}

/**
 * DELETE VISITOR
 */
export async function deleteVisitorApi(
  id: string,
): Promise<void> {

  const response = await fetch(
    `${API_URL}/visitors/${id}`,
    {
      method: 'DELETE',
      headers: getHeaders(),
    },
  )

  if (!response.ok) {
    const errorText =
      await response.text()

    throw new Error(
      `Failed to delete visitor: ${response.status} ${errorText}`,
    )
  }
}