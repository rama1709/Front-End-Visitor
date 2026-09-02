export type { Employee, EmployeeStatus } from './types'
export {
  getEmployees,
  generateEmployees,
  DEPARTMENTS,
} from './api/mock-employees'
export { useEmployeeStore } from './hooks/useEmployeeStore'
export { EmployeesPage } from './components/EmployeesPage'
