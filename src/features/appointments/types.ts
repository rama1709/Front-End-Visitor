export type ApprovalStatus =
  | 'requested'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'pending'

export interface Appointment {
  id: string
  appointmentId: string

  visitorId: number
  visitorName: string
  visitorCompany: string

  hostEmployeeId: string
  hostEmployeeName: string
  department: string

  meetingRoom: string

  visitDate: string
  visitTime: string
  durationMinutes: number

  purpose: string
  approvalStatus: ApprovalStatus

  createdDate: string
  updatedDate?: string

  checkIn?: string | null
  checkOut?: string | null
}

export interface AppointmentFormValues {
  visitorId: number
  hostEmployeeId: string

  meetingRoom: string
  visitDate: string
  visitTime: string
  durationMinutes: number
  purpose: string
}