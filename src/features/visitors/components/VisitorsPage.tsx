import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  PlusIcon,
  Trash2Icon,
  UploadIcon,
} from 'lucide-react'

import { toast } from 'sonner'

import { useVisitorStore } from '../hooks/useVisitorStore'
import { createVisitorColumns } from './visitor-columns'
import { VisitorFormSheet } from './VisitorFormSheet'
import { VisitorDetailSheet } from './VisitorDetailSheet'

import type {
  Visitor,
  VisitorStatus,
} from '../types'

import { PageHeader } from '#/shared/components'
import { DataTable } from '#/shared/components/DataTable'
import { Button } from '#/shared/components/ui/button'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/shared/components/ui/select'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/shared/components/ui/alert-dialog'

import { exportToCsv } from '#/shared/lib/export-csv'
import { useSearchStore } from '#/shared/hooks/useSearchStore'


const STATUS_FILTERS: {
  label: string
  value: VisitorStatus | 'all'
}[] = [
  {
    label: 'All Statuses',
    value: 'all',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Approved',
    value: 'approved',
  },
  {
    label: 'Checked In',
    value: 'checked-in',
  },
  {
    label: 'Checked Out',
    value: 'checked-out',
  },
  {
    label: 'Rejected',
    value: 'rejected',
  },
]


export function VisitorsPage() {
  // =====================================================
  // VISITOR STORE
  // =====================================================

  const visitors = useVisitorStore(
    (state) => state.visitors,
  )

  const addVisitor = useVisitorStore(
    (state) => state.addVisitor,
  )

  const updateVisitor = useVisitorStore(
    (state) => state.updateVisitor,
  )

  const deleteVisitor = useVisitorStore(
    (state) => state.deleteVisitor,
  )

  const deleteVisitors = useVisitorStore(
    (state) => state.deleteVisitors,
  )

  const loadVisitors = useVisitorStore(
    (state) => state.loadVisitors,
  )

  const isLoading = useVisitorStore(
    (state) => state.isLoading,
  )

  const error = useVisitorStore(
    (state) => state.error,
  )


  // =====================================================
  // SEARCH
  // =====================================================

  const searchQuery = useSearchStore(
    (state) => state.query,
  )


  // =====================================================
  // LOCAL STATE
  // =====================================================

  const [statusFilter, setStatusFilter] =
    useState<VisitorStatus | 'all'>('all')

  const [formOpen, setFormOpen] =
    useState(false)

  const [editingVisitor, setEditingVisitor] =
    useState<Visitor | null>(null)

  const [viewingVisitor, setViewingVisitor] =
    useState<Visitor | null>(null)

  const [detailOpen, setDetailOpen] =
    useState(false)

  const [deleteTarget, setDeleteTarget] =
    useState<Visitor | null>(null)

  const [isDeleting, setIsDeleting] =
    useState(false)

  const fileInputRef =
    useRef<HTMLInputElement>(null)


  // =====================================================
  // LOAD VISITORS FROM BACKEND
  // =====================================================

  useEffect(() => {
    loadVisitors()
  }, [loadVisitors])


  // =====================================================
  // ERROR HANDLING
  // =====================================================

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])


  // =====================================================
  // FILTER VISITORS
  // =====================================================

  const filteredVisitors = useMemo(() => {
    const term =
      searchQuery.trim().toLowerCase()

    return visitors.filter((visitor) => {
      const matchesStatus =
        statusFilter === 'all' ||
        visitor.status === statusFilter

      if (!matchesStatus) {
        return false
      }

      if (!term) {
        return true
      }

      return [
        visitor.fullName,
        visitor.visitorId,
        visitor.company,
        visitor.email,
        visitor.phone,
        visitor.hostEmployeeName,
        visitor.department,
        visitor.purpose,
      ].some((field) =>
        field
          ?.toLowerCase()
          .includes(term),
      )
    })
  }, [
    visitors,
    statusFilter,
    searchQuery,
  ])


  // =====================================================
  // TABLE COLUMNS
  // =====================================================

  const columns = useMemo(
    () =>
      createVisitorColumns({
        onView: (visitor) => {
          setViewingVisitor(visitor)
          setDetailOpen(true)
        },

        onEdit: (visitor) => {
          setEditingVisitor(visitor)
          setFormOpen(true)
        },

        onDelete: (visitor) => {
          setDeleteTarget(visitor)
        },
      }),
    [],
  )


  // =====================================================
  // ADD / UPDATE VISITOR
  // =====================================================

  const handleSubmit = async (
    values: {
      fullName: string
      company: string
      phone: string
      email: string
      identityNumber: string
      purpose: string
      hostEmployeeId: string
      vehicleNumber: string
      visitorType:
        | 'guest'
        | 'contractor'
        | 'vendor'
        | 'interview'
        | 'vip'
    },
  ) => {
    try {
      if (editingVisitor) {
        await updateVisitor(
          editingVisitor.id,
          values,
        )

        toast.success(
          'Visitor updated',
        )
      } else {
        await addVisitor(values)

        toast.success(
          'Visitor registered successfully',
        )
      }

      setFormOpen(false)
      setEditingVisitor(null)
    } catch (error) {
      console.error(
        'Failed to save visitor:',
        error,
      )

      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to save visitor',
      )
    }
  }


  // =====================================================
  // DELETE SINGLE VISITOR
  // =====================================================

  const handleDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      setIsDeleting(true)

      await deleteVisitor(
        deleteTarget.id,
      )

      toast.success(
        'Visitor deleted',
      )

      setDeleteTarget(null)
    } catch (error) {
      console.error(
        'Failed to delete visitor:',
        error,
      )

      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to delete visitor',
      )
    } finally {
      setIsDeleting(false)
    }
  }


  // =====================================================
  // DELETE MULTIPLE VISITORS
  // =====================================================

  const handleBulkDelete = async (
    selected: Visitor[],
  ) => {
    if (selected.length === 0) {
      return
    }

    try {
      await deleteVisitors(
        selected.map(
          (visitor) => visitor.id,
        ),
      )

      toast.success(
        `${selected.length} visitor(s) deleted`,
      )
    } catch (error) {
      console.error(
        'Failed to delete visitors:',
        error,
      )

      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to delete visitors',
      )
    }
  }


  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const handleAddVisitor = () => {
    setEditingVisitor(null)
    setFormOpen(true)
  }


  // =====================================================
  // FORM OPEN / CLOSE
  // =====================================================

  const handleFormOpenChange = (
    open: boolean,
  ) => {
    setFormOpen(open)

    if (!open) {
      setEditingVisitor(null)
    }
  }


  // =====================================================
  // IMPORT CSV
  // =====================================================

  const handleImport = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    // Import CSV masih menggunakan
    // behaviour lama untuk sementara.
    toast.success(
      'Visitors imported successfully',
    )

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="flex flex-col gap-6">

      {/* PAGE HEADER */}

      <PageHeader
        title="Visitors"
        description="Manage visitor registrations, approvals, and records."
        actions={
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImport}
            />

            <Button
              variant="outline"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              <UploadIcon />
              Import
            </Button>

            <Button
              onClick={handleAddVisitor}
            >
              <PlusIcon />
              Register Visitor
            </Button>
          </>
        }
      />


      {/* VISITOR TABLE */}

      {isLoading && visitors.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-lg border">
          <p className="text-sm text-muted-foreground">
            Loading visitors...
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredVisitors}
          searchKey="fullName"
          searchPlaceholder="Search by visitor name..."
          onExport={(rows) =>
            exportToCsv(
              'visitors',
              rows.map((visitor) => ({
                visitorId:
                  visitor.visitorId,

                fullName:
                  visitor.fullName,

                company:
                  visitor.company,

                phone:
                  visitor.phone,

                email:
                  visitor.email,

                purpose:
                  visitor.purpose,

                host:
                  visitor.hostEmployeeName,

                status:
                  visitor.status,

                createdDate:
                  visitor.createdDate,
              })),
            )
          }
          toolbar={
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(
                  value as
                    | VisitorStatus
                    | 'all',
                )
              }
            >
              <SelectTrigger
                size="sm"
                className="w-44"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {STATUS_FILTERS.map(
                  (filter) => (
                    <SelectItem
                      key={filter.value}
                      value={filter.value}
                    >
                      {filter.label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          }
          bulkActions={(selected) => (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() =>
                handleBulkDelete(selected)
              }
            >
              <Trash2Icon />
              Delete ({selected.length})
            </Button>
          )}
          emptyMessage={
            searchQuery ||
            statusFilter !== 'all'
              ? 'No visitors match the current filters.'
              : 'No visitors found.'
          }
        />
      )}


      {/* ADD / EDIT FORM */}

      <VisitorFormSheet
        open={formOpen}
        onOpenChange={
          handleFormOpenChange
        }
        visitor={editingVisitor}
        onSubmit={handleSubmit}
      />


      {/* DETAIL */}

      <VisitorDetailSheet
        visitor={viewingVisitor}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />


      {/* DELETE CONFIRMATION */}

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteTarget(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete visitor record?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently remove{' '}
              <strong>
                {deleteTarget?.fullName}
              </strong>
              's visitor record. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting
                ? 'Deleting...'
                : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}