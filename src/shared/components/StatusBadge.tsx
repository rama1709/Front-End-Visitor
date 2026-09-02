import { Badge } from '#/shared/components/ui/badge'
import { cn } from '#/shared/lib/utils'

type StatusVariant =
  'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'

const STATUS_MAP: Record<string, { label: string; variant: StatusVariant }> = {
  pending: { label: 'Pending', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'destructive' },
  'checked-in': { label: 'Checked In', variant: 'default' },
  'checked-out': { label: 'Checked Out', variant: 'secondary' },
  requested: { label: 'Requested', variant: 'warning' },
  completed: { label: 'Completed', variant: 'secondary' },
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'outline' },
  'on-leave': { label: 'On Leave', variant: 'warning' },
}

export function StatusBadge({
  status,
  className,
}: {
  status: string
  className?: string
}) {
  const config = STATUS_MAP[status] ?? {
    label: status,
    variant: 'outline' as const,
  }

  return (
    <Badge variant={config.variant} className={cn('capitalize', className)}>
      {config.label}
    </Badge>
  )
}
