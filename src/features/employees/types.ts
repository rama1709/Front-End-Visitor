export type EmployeeStatus = 'active' | 'inactive' | 'on-leave'

export interface Employee {
  id: string
  employeeId: string
  name: string
  department: string
  position: string
  phone: string
  email: string
  avatarSeed: string
  status: EmployeeStatus
  joinedDate: string
}
