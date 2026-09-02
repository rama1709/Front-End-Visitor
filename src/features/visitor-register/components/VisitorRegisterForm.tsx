import { useEffect } from 'react'

import { visitorRegisterFormSchema } from '../schemas/visitor-register-schema'
import type { VisitorRegisterFormValues } from '../types'

import {
  APPOINTMENT_PURPOSES,
  TIME_SLOTS,
} from '#/features/appointments'

import { useEmployeeStore } from '#/features/employees'

import { useAppForm } from '#/shared/hooks/useAppForm'
import { Button } from '#/shared/components/ui/button'

const PURPOSE_OPTIONS = APPOINTMENT_PURPOSES.map(
  (purpose) => ({
    label: purpose,
    value: purpose,
  }),
)

const TIME_OPTIONS = TIME_SLOTS.map((time) => ({
  label: time,
  value: time,
}))

const TODAY = new Date()
  .toISOString()
  .slice(0, 10)

export function VisitorRegisterForm({
  onSubmit,
}: {
  onSubmit: (
    values: VisitorRegisterFormValues,
  ) => void | Promise<void>
}) {
  /*
   * Ambil employee dari Zustand
   */
  const employees = useEmployeeStore(
    (state) => state.employees,
  )

  /*
   * Fungsi untuk mengambil employee
   * dari backend.
   */
  const loadEmployees = useEmployeeStore(
    (state) => state.loadEmployees,
  )

  /*
   * Status loading employee
   */
  const isLoadingEmployees = useEmployeeStore(
    (state) => state.isLoading,
  )

  /*
   * Ketika halaman register visitor dibuka,
   * ambil employee dari backend jika store
   * masih kosong.
   */
  useEffect(() => {
    if (employees.length === 0) {
      loadEmployees()
    }
  }, [
    employees.length,
    loadEmployees,
  ])

  /*
   * Ubah employee dari backend menjadi
   * option untuk Person to Meet.
   */
  const hostOptions = employees.map(
    (employee) => ({
      label: `${employee.name} — ${employee.department}`,
      value: employee.id,
    }),
  )

  const form = useAppForm({
    defaultValues: {
      fullName: '',
      company: '',
      phone: '',
      email: '',
      purpose: '',
      hostEmployeeId: '',
      visitDate: TODAY,
      visitTime: '',
      notes: '',
    } as VisitorRegisterFormValues,

    validators: {
      onChange: visitorRegisterFormSchema,
    },

    onSubmit: async ({
      value,
      formApi,
    }) => {
      await onSubmit(value)

      formApi.reset()
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
      noValidate
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* FULL NAME */}
        <form.AppField name="fullName">
          {(field) => (
            <field.TextField
              label="Full Name"
              placeholder="Jane Doe"
              className="sm:col-span-2"
            />
          )}
        </form.AppField>

        {/* COMPANY */}
        <form.AppField name="company">
          {(field) => (
            <field.TextField
              label="Company / Organization"
              placeholder="Acme Corp"
            />
          )}
        </form.AppField>

        {/* PHONE */}
        <form.AppField name="phone">
          {(field) => (
            <field.TextField
              label="Phone Number"
              type="tel"
              placeholder="+62 812-3456-7890"
            />
          )}
        </form.AppField>

        {/* EMAIL */}
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              label="Email"
              type="email"
              placeholder="you@company.com (optional)"
            />
          )}
        </form.AppField>

        {/* PERSON TO MEET */}
        <form.AppField name="hostEmployeeId">
          {(field) => (
            <field.ComboboxField
              label="Person to Meet"
              options={hostOptions}
              placeholder={
                isLoadingEmployees
                  ? 'Loading employees...'
                  : 'Select host'
              }
              searchPlaceholder="Search employee..."
            />
          )}
        </form.AppField>

        {/* PURPOSE */}
        <form.AppField name="purpose">
          {(field) => (
            <field.ComboboxField
              label="Purpose of Visit"
              options={PURPOSE_OPTIONS}
              placeholder="Select purpose"
              searchPlaceholder="Search purpose..."
            />
          )}
        </form.AppField>

        {/* VISIT DATE */}
        <form.AppField name="visitDate">
          {(field) => (
            <field.TextField
              label="Visit Date"
              type="date"
            />
          )}
        </form.AppField>

        {/* VISIT TIME */}
        <form.AppField name="visitTime">
          {(field) => (
            <field.SelectField
              label="Visit Time"
              options={TIME_OPTIONS}
            />
          )}
        </form.AppField>

        {/* NOTES */}
        <form.AppField name="notes">
          {(field) => (
            <field.TextAreaField
              label="Notes"
              placeholder="Anything the front desk should know (optional)"
              rows={3}
              className="sm:col-span-2"
            />
          )}
        </form.AppField>
      </div>

      {/* SUBMIT */}
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
            size="lg"
            className="mt-1 w-full"
            disabled={
              !canSubmit ||
              isSubmitting
            }
          >
            {isSubmitting
              ? 'Submitting...'
              : 'Submit Registration'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}