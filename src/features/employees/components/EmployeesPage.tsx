import { useEffect, useMemo, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { toast } from 'sonner'

import { useEmployeeStore } from '../hooks/useEmployeeStore'
import { createEmployeeColumns } from './employee-columns'
import { EmployeeForm } from './EmployeeForm'
import type { Employee } from '../types'

import { PageHeader } from '#/shared/components'
import { DataTable } from '#/shared/components/DataTable'
import { Button } from '#/shared/components/ui/button'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '#/shared/components/ui/sheet'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/shared/components/ui/alert-dialog'

import { exportToCsv } from '#/shared/lib/export-csv'
import { useSearchStore } from '#/shared/hooks/useSearchStore'

export function EmployeesPage() {
  // =========================
  // EMPLOYEE STORE
  // =========================

  const employees = useEmployeeStore(
    (state) => state.employees,
  )

  const addEmployee = useEmployeeStore(
    (state) => state.addEmployee,
  )

  const updateEmployee = useEmployeeStore(
    (state) => state.updateEmployee,
  )

  const deleteEmployee = useEmployeeStore(
    (state) => state.deleteEmployee,
  )

  const loadEmployees = useEmployeeStore(
    (state) => state.loadEmployees,
  )

  const isLoading = useEmployeeStore(
    (state) => state.isLoading,
  )

  const error = useEmployeeStore(
    (state) => state.error,
  )

  // =========================
  // SEARCH
  // =========================

  const searchQuery = useSearchStore(
    (state) => state.query,
  )

  // =========================
  // LOCAL STATE
  // =========================

  const [formOpen, setFormOpen] = useState(false)

  const [editingEmployee, setEditingEmployee] =
    useState<Employee | null>(null)

  const [deleteTarget, setDeleteTarget] =
    useState<Employee | null>(null)

  const [isDeleting, setIsDeleting] =
    useState(false)

  // =========================
  // LOAD EMPLOYEES FROM BACKEND
  // =========================

  useEffect(() => {
    loadEmployees()
  }, [loadEmployees])

  // =========================
  // ERROR HANDLING
  // =========================

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  // =========================
  // FILTER EMPLOYEES
  // =========================

  const filteredEmployees = useMemo(() => {
    const term = searchQuery.trim().toLowerCase()

    if (!term) {
      return employees
    }

    return employees.filter((employee) =>
      [
        employee.name,
        employee.employeeId,
        employee.department,
        employee.position,
        employee.email,
        employee.phone,
      ].some((field) =>
        field?.toLowerCase().includes(term),
      ),
    )
  }, [employees, searchQuery])

  // =========================
  // TABLE COLUMNS
  // =========================

  const columns = useMemo(
    () =>
      createEmployeeColumns({
        onEdit: (employee) => {
          setEditingEmployee(employee)
          setFormOpen(true)
        },

        onDelete: (employee) => {
          setDeleteTarget(employee)
        },
      }),
    [],
  )

  // =========================
  // ADD / UPDATE EMPLOYEE
  // =========================

  const handleSubmit = async (values: {
    name: string
    department: string
    position: string
    phone: string
    email: string
    status: Employee['status']
  }) => {
    try {
      if (editingEmployee) {
        await updateEmployee(
          editingEmployee.id,
          values,
        )

        toast.success('Employee updated successfully')
      } else {
        await addEmployee(values)

        toast.success('Employee added successfully')
      }

      setFormOpen(false)
      setEditingEmployee(null)
    } catch (error) {
      console.error(
        'Failed to save employee:',
        error,
      )

      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to save employee',
      )
    }
  }

  // =========================
  // DELETE EMPLOYEE
  // =========================

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      setIsDeleting(true)

      await deleteEmployee(deleteTarget.id)

      toast.success('Employee removed successfully')

      setDeleteTarget(null)
    } catch (error) {
      console.error(
        'Failed to delete employee:',
        error,
      )

      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to delete employee',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  // =========================
  // OPEN ADD FORM
  // =========================

  const handleAddEmployee = () => {
    setEditingEmployee(null)
    setFormOpen(true)
  }

  // =========================
  // CLOSE FORM
  // =========================

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open)

    if (!open) {
      setEditingEmployee(null)
    }
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="flex flex-col gap-6">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <PageHeader
        title="Hosts / Employees"
        description="Manage the employee directory used to assign visitor hosts."
        actions={
          <Button onClick={handleAddEmployee}>
            <PlusIcon />
            Add Employee
          </Button>
        }
      />

      {/* =========================
          DATA TABLE
      ========================= */}

      {isLoading && employees.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-lg border">
          <p className="text-sm text-muted-foreground">
            Loading employees...
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredEmployees}
          searchKey="name"
          searchPlaceholder="Search by employee name..."
          onExport={(rows) =>
            exportToCsv('employees', rows)
          }
          emptyMessage={
            searchQuery
              ? 'No employees match your search.'
              : 'No employees found.'
          }
        />
      )}

      {/* =========================
          ADD / EDIT EMPLOYEE SHEET
      ========================= */}

      <Sheet
        open={formOpen}
        onOpenChange={handleFormOpenChange}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">

          <SheetHeader>
            <SheetTitle>
              {editingEmployee
                ? 'Edit Employee'
                : 'Add Employee'}
            </SheetTitle>

            <SheetDescription>
              {editingEmployee
                ? 'Update the employee details below.'
                : 'Add a new employee to the host directory.'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 px-4 pb-4">
            <EmployeeForm
              defaultValues={
                editingEmployee ?? undefined
              }
              submitLabel={
                editingEmployee
                  ? 'Save Changes'
                  : 'Add Employee'
              }
              onCancel={() =>
                handleFormOpenChange(false)
              }
              onSubmit={handleSubmit}
            />
          </div>

        </SheetContent>
      </Sheet>

      {/* =========================
          DELETE CONFIRMATION
      ========================= */}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteTarget(null)
          }
        }}
      >
        <AlertDialogContent>

          <AlertDialogHeader>
            <AlertDialogTitle>
              Remove employee?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will remove{' '}
              <strong>
                {deleteTarget?.name}
              </strong>{' '}
              from the host directory.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting
                ? 'Removing...'
                : 'Remove'}
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}