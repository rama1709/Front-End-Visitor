import { useEffect } from 'react'

import { appointmentFormSchema } from '../schemas/appointment-schema'
import {
  APPOINTMENT_PURPOSES,
  DURATIONS,
  MEETING_ROOMS,
  TIME_SLOTS,
} from '../api/appointments'

import type { AppointmentFormValues } from '../types'

import { useAppForm } from '#/shared/hooks/useAppForm'
import { Button } from '#/shared/components/ui/button'
import { useEmployeeStore } from '#/features/employees'
import { useVisitorStore } from '#/features/visitors'

const ROOM_OPTIONS = MEETING_ROOMS.map((room) => ({
  label: room,
  value: room,
}))

const PURPOSE_OPTIONS = APPOINTMENT_PURPOSES.map((purpose) => ({
  label: purpose,
  value: purpose,
}))

const TIME_OPTIONS = TIME_SLOTS.map((time) => ({
  label: time,
  value: time,
}))

const DURATION_OPTIONS = DURATIONS.map((duration) => ({
  label: `${duration} minutes`,
  value: String(duration),
}))

interface AppointmentFormProps {
  defaultValues?: Partial<AppointmentFormValues>

  onSubmit: (
    values: AppointmentFormValues,
  ) => void | Promise<void>

  onCancel?: () => void

  submitLabel?: string
}

export function AppointmentForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = 'Book Appointment',
}: AppointmentFormProps) {
  const employees = useEmployeeStore(
    (state) => state.employees,
  )

  const visitors = useVisitorStore(
    (state) => state.visitors,
  )

  const loadVisitors = useVisitorStore(
    (state) => state.loadVisitors,
  )

  useEffect(() => {
    void loadVisitors()
  }, [loadVisitors])

  const hostOptions = employees.map((employee) => ({
    label: `${employee.name} — ${
      employee.department ?? 'General'
    }`,
    value: String(employee.id),
  }))

  const visitorOptions = visitors.map((visitor) => ({
    label: `${visitor.fullName}${
      visitor.company
        ? ` — ${visitor.company}`
        : ''
    }`,
    value: String(visitor.id),
  }))

  const form = useAppForm({
    defaultValues: {
      visitorId: defaultValues?.visitorId ?? 0,

      hostEmployeeId: defaultValues?.hostEmployeeId
        ? String(defaultValues.hostEmployeeId)
        : '',

      meetingRoom:
        defaultValues?.meetingRoom ?? '',

      visitDate: defaultValues?.visitDate
        ? defaultValues.visitDate.slice(0, 10)
        : '',

      visitTime:
        defaultValues?.visitTime ?? '',

      durationMinutes:
        defaultValues?.durationMinutes ?? 30,

      purpose:
        defaultValues?.purpose ?? '',
    },

    validators: {
      onChange: appointmentFormSchema,
    },

    onSubmit: async ({ value }) => {
      await onSubmit({
        visitorId: Number(value.visitorId),

        hostEmployeeId:
          String(value.hostEmployeeId),

        meetingRoom:
          value.meetingRoom,

        visitDate:
          value.visitDate,

        visitTime:
          value.visitTime,

        durationMinutes:
          Number(value.durationMinutes),

        purpose:
          value.purpose,
      })
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()

        void form.handleSubmit()
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <form.AppField name="visitorId">
          {(field) => (
            <field.ComboboxField
              label="Visitor"
              options={visitorOptions}
              placeholder="Select visitor"
              searchPlaceholder="Search visitor..."
            />
          )}
        </form.AppField>

        <form.AppField name="hostEmployeeId">
          {(field) => (
            <field.ComboboxField
              label="Host"
              options={hostOptions}
              placeholder="Select host"
              searchPlaceholder="Search employee..."
            />
          )}
        </form.AppField>

        <form.AppField name="meetingRoom">
          {(field) => (
            <field.SelectField
              label="Meeting Room"
              options={ROOM_OPTIONS}
            />
          )}
        </form.AppField>

        <form.AppField name="visitDate">
          {(field) => (
            <field.TextField
              label="Visit Date"
              type="date"
            />
          )}
        </form.AppField>

        <form.AppField name="visitTime">
          {(field) => (
            <field.SelectField
              label="Visit Time"
              options={TIME_OPTIONS}
            />
          )}
        </form.AppField>

        <form.AppField name="durationMinutes">
          {(field) => (
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-medium"
                htmlFor="duration"
              >
                Duration
              </label>

              <select
                id="duration"
                className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={String(field.state.value)}
                onChange={(event) => {
                  field.handleChange(
                    Number(event.target.value),
                  )
                }}
              >
                {DURATION_OPTIONS.map(
                  (option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>
            </div>
          )}
        </form.AppField>

        <form.AppField name="purpose">
          {(field) => (
            <field.ComboboxField
              label="Purpose"
              options={PURPOSE_OPTIONS}
              placeholder="Select purpose"
              searchPlaceholder="Search purpose..."
            />
          )}
        </form.AppField>
      </div>

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
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={
                !canSubmit || isSubmitting
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