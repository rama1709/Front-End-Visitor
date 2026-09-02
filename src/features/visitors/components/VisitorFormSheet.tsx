import { VisitorForm } from './VisitorForm'
import type { Visitor, VisitorFormValues } from '../types'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '#/shared/components/ui/sheet'

function toFormValues(
  visitor?: Visitor | null,
): Partial<VisitorFormValues> | undefined {
  if (!visitor) return undefined
  return {
    fullName: visitor.fullName,
    company: visitor.company,
    phone: visitor.phone,
    email: visitor.email,
    identityNumber: visitor.identityNumber,
    purpose: visitor.purpose,
    hostEmployeeId: visitor.hostEmployeeId,
    vehicleNumber: visitor.vehicleNumber ?? '',
    visitorType: visitor.visitorType,
  }
}

export function VisitorFormSheet({
  open,
  onOpenChange,
  visitor,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  visitor?: Visitor | null
  onSubmit: (values: VisitorFormValues) => void
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {visitor ? 'Edit Visitor' : 'Register New Visitor'}
          </SheetTitle>
          <SheetDescription>
            {visitor
              ? 'Update the visitor details below.'
              : 'Fill in the details to register a new visitor.'}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 px-4 pb-4">
          <VisitorForm
            defaultValues={toFormValues(visitor)}
            submitLabel={visitor ? 'Save Changes' : 'Register Visitor'}
            onCancel={() => onOpenChange(false)}
            onSubmit={(values) => {
              onSubmit(values)
              onOpenChange(false)
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
