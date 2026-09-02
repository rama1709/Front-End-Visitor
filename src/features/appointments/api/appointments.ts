import { useAuthStore } from '../../auth/hooks/useAuthStore'

import type {
  Appointment,
  AppointmentFormValues,
  ApprovalStatus,
} from '../types'

const API_URL = 'http://localhost:8080/api'

export const MEETING_ROOMS = [
  'Boardroom A',
  'Boardroom B',
  'Meeting Room 1',
  'Meeting Room 2',
  'Conference Hall',
  'Huddle Room 3',
  'Executive Suite',
]

export const APPOINTMENT_PURPOSES = [
  'Business Meeting',
  'Contract Discussion',
  'Product Demo',
  'Job Interview',
  'Partnership Review',
  'Site Inspection',
  'Training Session',
  'Vendor Onboarding',
]

export const TIME_SLOTS = [
  '08:00',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '13:00',
  '13:30',
  '14:00',
  '15:00',
  '15:30',
  '16:00',
]

export const DURATIONS = [30, 45, 60, 90, 120]

/* ================================
   AMBIL TOKEN DARI ZUSTAND
================================ */

function getToken(): string | null {
  return useAuthStore.getState().token
}

/* ================================
   REQUEST HELPER
================================ */

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...(options.headers ?? {}),
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        'Terjadi kesalahan pada server',
    )
  }

  return data
}

/* ================================
   BACKEND RESPONSE
================================ */

interface VisitorRequestResponse {
  id: number
  visitor_id: number
  employee_id: number

  visitor_name: string
  visitor_company: string

  employee_name: string
  department: string

  purpose: string
  status: string

  visit_date: string
  visit_time?: string | null
  duration_minutes?: number | null
  meeting_room?: string | null

  check_in?: string | null
  check_out?: string | null

  created_at: string
  updated_at: string
}

/* ================================
   MAPPER
================================ */

function mapResponse(
  item: VisitorRequestResponse,
): Appointment {
  return {
    id: String(item.id),

    appointmentId: `APT-${String(item.id).padStart(5, '0')}`,

    visitorId: item.visitor_id,

    visitorName: item.visitor_name ?? '',
    visitorCompany: item.visitor_company ?? '',

    hostEmployeeId: String(item.employee_id),

    hostEmployeeName: item.employee_name ?? '',
    department: item.department ?? '',

    meetingRoom: item.meeting_room ?? '',

    visitDate: item.visit_date ?? '',
    visitTime: item.visit_time ?? '',

    durationMinutes: item.duration_minutes ?? 0,

    purpose: item.purpose ?? '',

    approvalStatus:
      (item.status?.toLowerCase() ||
        'requested') as ApprovalStatus,

    createdDate: item.created_at,
    updatedDate: item.updated_at,

    checkIn: item.check_in ?? null,
    checkOut: item.check_out ?? null,
  }
}

/* ================================
   GET ALL
================================ */

export async function getAppointments(): Promise<Appointment[]> {
  const data = await request<VisitorRequestResponse[]>(
    '/visitor-requests',
  )

  return data.map(mapResponse)
}

/* ================================
   CREATE
================================ */

export async function createAppointment(
  values: AppointmentFormValues,
): Promise<Appointment> {
  const data = await request<VisitorRequestResponse>(
    '/visitor-requests',
    {
      method: 'POST',

      body: JSON.stringify({
        visitor_id: Number(values.visitorId),

        employee_id: Number(
          values.hostEmployeeId,
        ),

        purpose: values.purpose,

        status: 'requested',

        visit_date: values.visitDate,

        visit_time: values.visitTime,

        duration_minutes:
          Number(values.durationMinutes),

        meeting_room:
          values.meetingRoom,
      }),
    },
  )

  return mapResponse(data)
}

/* ================================
   UPDATE
================================ */

export async function updateAppointment(
  id: string,
  values: Partial<AppointmentFormValues> & {
    status?: ApprovalStatus
  },
): Promise<void> {
  const body: Record<string, unknown> = {}

  if (values.visitorId !== undefined) {
    body.visitor_id = Number(values.visitorId)
  }

  if (values.hostEmployeeId !== undefined) {
    body.employee_id = Number(
      values.hostEmployeeId,
    )
  }

  if (values.purpose !== undefined) {
    body.purpose = values.purpose
  }

  if (values.visitDate !== undefined) {
    body.visit_date = values.visitDate
  }

  if (values.visitTime !== undefined) {
    body.visit_time = values.visitTime
  }

  if (values.durationMinutes !== undefined) {
    body.duration_minutes =
      Number(values.durationMinutes)
  }

  if (values.meetingRoom !== undefined) {
    body.meeting_room =
      values.meetingRoom
  }

  if (values.status !== undefined) {
    body.status = values.status
  }

  await request(
    `/visitor-requests/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(body),
    },
  )
}

/* ================================
   DELETE
================================ */

export async function deleteAppointment(
  id: string,
): Promise<void> {
  await request(
    `/visitor-requests/${id}`,
    {
      method: 'DELETE',
    },
  )
}