export type VisitorStatus =
  'pending' | 'approved' | 'checked-in' | 'checked-out' | 'rejected'

export type VisitorType =
  'guest' | 'contractor' | 'vendor' | 'interview' | 'vip'

export interface Visitor {
  id: string
  visitorId: string
  fullName: string
  company: string
  phone: string
  email: string
  identityNumber: string
  avatarSeed: string
  purpose: string
  hostEmployeeId: string
  hostEmployeeName: string
  department: string
  vehicleNumber: string | null
  visitorType: VisitorType
  status: VisitorStatus
  checkInTime: string | null
  checkOutTime: string | null
  operator: string | null
  badgeReturned: boolean | null
  remarks: string | null
  createdDate: string
}

export interface VisitorFormValues {
  fullName: string
  company: string
  phone: string
  email: string
  identityNumber: string
  purpose: string
  hostEmployeeId: string
  vehicleNumber: string
  visitorType: VisitorType
}
