import { format } from 'date-fns'
import { MoreHorizontalIcon } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'

import type { Visitor } from '../types'
import { Checkbox } from '#/shared/components/ui/checkbox'
import { Avatar, AvatarFallback } from '#/shared/components/ui/avatar'
import { Button } from '#/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/shared/components/ui/dropdown-menu'
import { StatusBadge } from '#/shared/components/StatusBadge'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function createVisitorColumns({
  onView,
  onEdit,
  onDelete,
}: {
  onView: (visitor: Visitor) => void
  onEdit: (visitor: Visitor) => void
  onDelete: (visitor: Visitor) => void
}): ColumnDef<Visitor>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'fullName',
      header: 'Visitor',
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onView(row.original)}
          className="flex items-center gap-2.5 text-left hover:underline"
        >
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {initials(row.original.fullName)}
            </AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <p className="font-medium">{row.original.fullName}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.visitorId}
            </p>
          </div>
        </button>
      ),
    },
    {
      accessorKey: 'company',
      header: 'Company',
    },
    {
      accessorKey: 'hostEmployeeName',
      header: 'Host',
    },
    {
      accessorKey: 'purpose',
      header: 'Purpose',
    },
    {
      accessorKey: 'visitorType',
      header: 'Type',
      cell: ({ row }) => (
        <span className="capitalize">{row.original.visitorType}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'createdDate',
      header: 'Date',
      cell: ({ row }) =>
        format(new Date(row.original.createdDate), 'MMM d, yyyy'),
    },
    {
      id: 'actions',
      header: '',
      enableHiding: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(row.original)}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(row.original)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]
}
