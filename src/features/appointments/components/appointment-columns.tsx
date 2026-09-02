import { format } from 'date-fns'

import {
  CheckIcon,
  MoreHorizontalIcon,
  XIcon,
} from 'lucide-react'

import type {
  ColumnDef,
} from '@tanstack/react-table'

import type {
  Appointment,
} from '../types'

import {
  Button,
} from '#/shared/components/ui/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/shared/components/ui/dropdown-menu'

import {
  StatusBadge,
} from '#/shared/components/StatusBadge'

export function createAppointmentColumns({
  onEdit,
  onDelete,
  onApprove,
  onReject,
}: {
  onEdit:
    (
      appointment: Appointment,
    ) => void | Promise<void>

  onDelete:
    (
      appointment: Appointment,
    ) => void | Promise<void>

  onApprove:
    (
      appointment: Appointment,
    ) => void | Promise<void>

  onReject:
    (
      appointment: Appointment,
    ) => void | Promise<void>
}): ColumnDef<Appointment>[] {

  return [

    {
      accessorKey:
        'visitorName',

      header:
        'Visitor',

      cell: ({ row }) => (

        <div className="leading-tight">

          <p className="font-medium">
            {row.original.visitorName}
          </p>

          <p className="text-xs text-muted-foreground">
            {row.original.visitorCompany}
          </p>

        </div>
      ),
    },

    {
      accessorKey:
        'hostEmployeeName',

      header:
        'Host',
    },

    {
      accessorKey:
        'meetingRoom',

      header:
        'Room',
    },

    {
      accessorKey:
        'visitDate',

      header:
        'Date',

      cell: ({ row }) => (

        <span>

          {format(
            new Date(
              row.original.visitDate,
            ),
            'MMM d, yyyy',
          )}

          {' · '}

          {row.original.visitTime}

        </span>
      ),
    },

    {
      accessorKey:
        'durationMinutes',

      header:
        'Duration',

      cell: ({ row }) =>
        `${row.original.durationMinutes} min`,
    },

    {
      accessorKey:
        'purpose',

      header:
        'Purpose',
    },

    {
      accessorKey:
        'approvalStatus',

      header:
        'Status',

      cell: ({ row }) => (

        <StatusBadge
          status={
            row.original.approvalStatus
          }
        />

      ),

      filterFn:
        (row, id, value) =>
          value.includes(
            row.getValue(id),
          ),
    },

    {
      id:
        'actions',

      header:
        '',

      enableHiding:
        false,

      cell: ({ row }) => {

        const appointment =
          row.original

        return (

          <div className="flex items-center justify-end gap-1">

            {appointment.approvalStatus ===
              'requested' && (

              <>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-emerald-600 hover:text-emerald-700"
                  onClick={() =>
                    onApprove(
                      appointment,
                    )
                  }
                >

                  <CheckIcon
                    className="size-4"
                  />

                </Button>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() =>
                    onReject(
                      appointment,
                    )
                  }
                >

                  <XIcon
                    className="size-4"
                  />

                </Button>

              </>
            )}

            <DropdownMenu>

              <DropdownMenuTrigger
                asChild
              >

                <Button
                  variant="ghost"
                  size="icon-sm"
                >

                  <MoreHorizontalIcon
                    className="size-4"
                  />

                </Button>

              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
              >

                <DropdownMenuItem
                  onClick={() =>
                    onEdit(
                      appointment,
                    )
                  }
                >
                  Edit
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() =>
                    onDelete(
                      appointment,
                    )
                  }
                >
                  Delete
                </DropdownMenuItem>

              </DropdownMenuContent>

            </DropdownMenu>

          </div>
        )
      },
    },
  ]
}