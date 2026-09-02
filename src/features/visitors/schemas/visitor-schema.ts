import { z } from 'zod'

export const visitorFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  company: z.string().min(1, 'Company is required'),
  phone: z.string().min(6, 'Enter a valid phone number'),
  email: z.email('Enter a valid email address'),
  identityNumber: z.string().min(4, 'Identity number is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  hostEmployeeId: z.string().min(1, 'Please select a host employee'),
  vehicleNumber: z.string(),
  visitorType: z.enum(['guest', 'contractor', 'vendor', 'interview', 'vip']),
})

export type VisitorFormSchema = z.infer<typeof visitorFormSchema>
