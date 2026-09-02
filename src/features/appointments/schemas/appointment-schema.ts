import { z } from 'zod'

export const appointmentFormSchema = z.object({
  visitorId: z.coerce
    .number()
    .min(1, 'Please select a visitor'),

  hostEmployeeId: z
    .string()
    .min(1, 'Please select a host employee'),

  meetingRoom: z
    .string()
    .min(1, 'Please select a meeting room'),

  visitDate: z
    .string()
    .min(1, 'Visit date is required'),

  visitTime: z
    .string()
    .min(1, 'Visit time is required'),

  durationMinutes: z.coerce
    .number()
    .min(15, 'Duration must be at least 15 minutes'),

  purpose: z
    .string()
    .min(1, 'Purpose is required'),
})

export type AppointmentFormSchema =
  z.infer<typeof appointmentFormSchema>