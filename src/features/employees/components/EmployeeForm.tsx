import { z } from 'zod'

import { DEPARTMENTS } from '../api/mock-employees'
import type { Employee } from '../types'
import { useAppForm } from '#/shared/hooks/useAppForm'
import { Button } from '#/shared/components/ui/button'

const employeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  department: z.string().min(1, 'Department is required'),
  position: z.string().min(1, 'Position is required'),
  phone: z.string().min(6, 'Enter a valid phone number'),
  email: z.email('Enter a valid email address'),
  status: z.enum(['active', 'inactive', 'on-leave']),
})

const DEPARTMENT_OPTIONS = DEPARTMENTS.map((department) => ({
  label: department,
  value: department,
}))

const STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'On Leave', value: 'on-leave' },
  { label: 'Inactive', value: 'inactive' },
]

interface EmployeeFormValues {
  name: string
  department: string
  position: string
  phone: string
  email: string
  status: Employee['status']
}

export function EmployeeForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = 'Add Employee',
}: {
  defaultValues?: Partial<EmployeeFormValues>
  onSubmit: (values: EmployeeFormValues) => void
  onCancel?: () => void
  submitLabel?: string
}) {
  const form = useAppForm({
    defaultValues: {
      name: defaultValues?.name ?? '',
      department: defaultValues?.department ?? '',
      position: defaultValues?.position ?? '',
      phone: defaultValues?.phone ?? '',
      email: defaultValues?.email ?? '',
      status: defaultValues?.status ?? 'active',
    },
    validators: {
      onChange: employeeSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })

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
        <form.AppField name="name">
          {(field) => (
            <field.TextField label="Employee Name" placeholder="John Smith" />
          )}
        </form.AppField>
        <form.AppField name="department">
          {(field) => (
            <field.SelectField
              label="Department"
              options={DEPARTMENT_OPTIONS}
            />
          )}
        </form.AppField>
        <form.AppField name="position">
          {(field) => (
            <field.TextField label="Position" placeholder="Manager" />
          )}
        </form.AppField>
        <form.AppField name="status">
          {(field) => (
            <field.SelectField label="Status" options={STATUS_OPTIONS} />
          )}
        </form.AppField>
        <form.AppField name="phone">
          {(field) => (
            <field.TextField label="Phone" placeholder="+1 555 0100" />
          )}
        </form.AppField>
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label="Email"
              type="email"
              placeholder="john@company.com"
            />
          )}
        </form.AppField>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? 'Saving...' : submitLabel}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}
