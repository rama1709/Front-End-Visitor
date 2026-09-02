import { create } from 'zustand'

import {
  createEmployeeApi,
  deleteEmployeeApi,
  getEmployeesFromApi,
  updateEmployeeApi,
} from '../api/employees-api'

import type { Employee } from '../types'

interface EmployeeFormValues {
  name: string
  department: string
  position: string
  phone: string
  email: string
  status: Employee['status']
}

interface EmployeeState {
  employees: Employee[]

  isLoading: boolean

  error: string | null

  loadEmployees: () => Promise<void>

  addEmployee: (
    values: EmployeeFormValues,
  ) => Promise<Employee>

  updateEmployee: (
    id: string,
    values: Partial<EmployeeFormValues>,
  ) => Promise<void>

  deleteEmployee: (
    id: string,
  ) => Promise<void>
}

export const useEmployeeStore =
  create<EmployeeState>((set) => ({
    employees: [],

    isLoading: false,

    error: null,

    // ========================================
    // LOAD EMPLOYEES
    // ========================================

    loadEmployees: async () => {
      set({
        isLoading: true,
        error: null,
      })

      try {
        const employees =
          await getEmployeesFromApi()

        set({
          employees,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        console.error(
          'Failed to load employees:',
          error,
        )

        set({
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to load employees',
        })
      }
    },

    // ========================================
    // ADD EMPLOYEE
    // ========================================

    addEmployee: async (values) => {
      const employee =
        await createEmployeeApi(values)

      set((state) => ({
        employees: [
          employee,
          ...state.employees,
        ],
      }))

      return employee
    },

    // ========================================
    // UPDATE EMPLOYEE
    // ========================================

    updateEmployee: async (
      id,
      values,
    ) => {
      const employee =
        await updateEmployeeApi(
          id,
          values,
        )

      set((state) => ({
        employees:
          state.employees.map(
            (item) =>
              item.id === id
                ? employee
                : item,
          ),
      }))
    },

    // ========================================
    // DELETE EMPLOYEE
    // ========================================

    deleteEmployee: async (id) => {
      await deleteEmployeeApi(id)

      set((state) => ({
        employees:
          state.employees.filter(
            (employee) =>
              employee.id !== id,
          ),
      }))
    },
  }))