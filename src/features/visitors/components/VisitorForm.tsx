import { useEffect } from 'react'

import { visitorFormSchema } from '../schemas/visitor-schema'
import type { VisitorFormValues } from '../types'

import { useAppForm } from '#/shared/hooks/useAppForm'
import { Button } from '#/shared/components/ui/button'

import { useEmployeeStore } from '#/features/employees'

const VISITOR_TYPE_OPTIONS = [
  {
    label: 'Guest',
    value: 'guest',
  },
  {
    label: 'Contractor',
    value: 'contractor',
  },
  {
    label: 'Vendor',
    value: 'vendor',
  },
  {
    label: 'Interview',
    value: 'interview',
  },
  {
    label: 'VIP',
    value: 'vip',
  },
]

const PURPOSE_OPTIONS = [
  {
    label: 'Business Meeting',
    value: 'Business Meeting',
  },
  {
    label: 'Job Interview',
    value: 'Job Interview',
  },
  {
    label: 'Delivery',
    value: 'Delivery',
  },
  {
    label: 'Maintenance',
    value: 'Maintenance',
  },
  {
    label: 'Client Visit',
    value: 'Client Visit',
  },
  {
    label: 'Vendor Meeting',
    value: 'Vendor Meeting',
  },
  {
    label: 'Site Inspection',
    value: 'Site Inspection',
  },
  {
    label: 'Training Session',
    value: 'Training Session',
  },
  {
    label: 'Contract Signing',
    value: 'Contract Signing',
  },
  {
    label: 'Consultation',
    value: 'Consultation',
  },
]

export function VisitorForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = 'Register Visitor',
}: {
  defaultValues?: Partial<VisitorFormValues>

  onSubmit: (
    values: VisitorFormValues,
  ) => void

  onCancel?: () => void

  submitLabel?: string
}) {
  // ========================================
  // EMPLOYEE STORE
  // ========================================

  const employees = useEmployeeStore(
    (state) => state.employees,
  )

  const loadEmployees = useEmployeeStore(
    (state) => state.loadEmployees,
  )

  const employeeLoading = useEmployeeStore(
    (state) => state.isLoading,
  )

  // ========================================
  // LOAD EMPLOYEES
  // ========================================

  useEffect(() => {
    /*
     * Kalau employee belum ada,
     * ambil langsung dari backend.
     *
     * Jadi VisitorForm tidak perlu
     * menunggu EmployeesPage dibuka.
     */
    if (employees.length === 0) {
      loadEmployees()
    }
  }, [
    employees.length,
    loadEmployees,
  ])

  // ========================================
  // HOST OPTIONS
  // ========================================

  const hostOptions = employees.map(
    (employee) => ({
      label: `${employee.name} — ${employee.department}`,
      value: employee.id,
    }),
  )

  // ========================================
  // FORM
  // ========================================

  const form = useAppForm({
    defaultValues: {
      fullName:
        defaultValues?.fullName ?? '',

      company:
        defaultValues?.company ?? '',

      phone:
        defaultValues?.phone ?? '',

      email:
        defaultValues?.email ?? '',

      identityNumber:
        defaultValues?.identityNumber ?? '',

      purpose:
        defaultValues?.purpose ?? '',

      hostEmployeeId:
        defaultValues?.hostEmployeeId ?? '',

      vehicleNumber:
        defaultValues?.vehicleNumber ?? '',

      visitorType:
        defaultValues?.visitorType ?? 'guest',
    },

    validators: {
      onChange: visitorFormSchema,
    },

    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })

  // ========================================
  // RENDER
  // ========================================

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()

        form.handleSubmit()
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* FULL NAME */}
        <form.AppField name="fullName">
          {(field) => (
            <field.TextField
              label="Full Name"
              placeholder="Jane Doe"
            />
          )}
        </form.AppField>

        {/* COMPANY */}
        <form.AppField name="company">
          {(field) => (
            <field.TextField
              label="Company"
              placeholder="Acme Corp"
            />
          )}
        </form.AppField>

        {/* PHONE */}
        <form.AppField name="phone">
          {(field) => (
            <field.TextField
              label="Phone"
              placeholder="+62 812 3456 7890"
            />
          )}
        </form.AppField>

        {/* EMAIL */}
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label="Email"
              type="email"
              placeholder="jane@acme.com"
            />
          )}
        </form.AppField>

        {/* IDENTITY NUMBER */}
        <form.AppField name="identityNumber">
          {(field) => (
            <field.TextField
              label="Identity Number"
              placeholder="National ID / Passport"
            />
          )}
        </form.AppField>

        {/* VISITOR TYPE */}
        <form.AppField name="visitorType">
          {(field) => (
            <field.SelectField
              label="Visitor Type"
              options={
                VISITOR_TYPE_OPTIONS
              }
            />
          )}
        </form.AppField>

        {/* PURPOSE */}
        <form.AppField name="purpose">
          {(field) => (
            <field.ComboboxField
              label="Purpose"
              options={
                PURPOSE_OPTIONS
              }
              placeholder="Select purpose"
              searchPlaceholder="Search purpose..."
            />
          )}
        </form.AppField>

        {/* HOST EMPLOYEE */}
        <form.AppField name="hostEmployeeId">
          {(field) => (
            <field.ComboboxField
              label="Person to Meet"
              options={hostOptions}
              placeholder={
                employeeLoading
                  ? 'Loading employees...'
                  : 'Select person to meet'
              }
              searchPlaceholder="Search employee..."
            />
          )}
        </form.AppField>

        {/* VEHICLE */}
        <form.AppField name="vehicleNumber">
          {(field) => (
            <field.TextField
              label="Vehicle Number"
              placeholder="Optional"
            />
          )}
        </form.AppField>
      </div>

      {/* BUTTON */}
      <div className="flex justify-end gap-2 pt-2">

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        )}

        <form.Subscribe
          selector={(state) => [
            state.canSubmit,
            state.isSubmitting,
          ]}
        >
          {([
            canSubmit,
            isSubmitting,
          ]) => (
            <Button
              type="submit"
              disabled={
                !canSubmit ||
                isSubmitting
              }
            >
              {isSubmitting
                ? 'Saving...'
                : submitLabel}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}