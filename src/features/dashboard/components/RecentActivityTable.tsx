import { format } from 'date-fns'

import type { Visitor } from '#/features/visitors'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/shared/components/ui/table'
import { Avatar, AvatarFallback } from '#/shared/components/ui/avatar'
import { StatusBadge } from '#/shared/components/StatusBadge'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function RecentActivityTable({ visitors }: { visitors: Visitor[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest visitor registrations</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Visitor</TableHead>
              <TableHead>Host</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitors.map((visitor) => (
              <TableRow key={visitor.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-primary/10 text-[10px] font-semibold text-primary">
                        {initials(visitor.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <p className="font-medium">{visitor.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {visitor.company}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {visitor.hostEmployeeName}
                </TableCell>
                <TableCell className="text-sm">{visitor.purpose}</TableCell>
                <TableCell>
                  <StatusBadge status={visitor.status} />
                </TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {format(new Date(visitor.createdDate), 'MMM d, HH:mm')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
