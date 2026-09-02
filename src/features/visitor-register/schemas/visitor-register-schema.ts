import { z } from 'zod'

export const visitorRegisterFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  company: z.string().min(1, 'Company / organization is required'),
  phone: z.string().min(6, 'Enter a valid phone number'),
  email: z
    .string()
    .email('Enter a valid email address')
    .optional()
    .or(z.literal('')),
  purpose: z.string().min(1, 'Purpose of visit is required'),
  hostEmployeeId: z.string().min(1, 'Please select who you are visiting'),
  visitDate: z.string().min(1, 'Visit date is required'),
  visitTime: z.string().min(1, 'Visit time is required'),
  notes: z.string().optional(),
})

export type VisitorRegisterFormSchema = z.infer<
  typeof visitorRegisterFormSchema
>
