import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  PlusIcon,
} from 'lucide-react'

import {
  toast,
} from 'sonner'

import {
  useAppointmentStore,
} from '../hooks/useAppointmentStore'

import {
  createAppointmentColumns,
} from './appointment-columns'

import {
  AppointmentForm,
} from './AppointmentForm'

import type {
  Appointment,
  ApprovalStatus,
} from '../types'

import {
  PageHeader,
} from '#/shared/components'

import {
  DataTable,
} from '#/shared/components/DataTable'

import {
  Button,
} from '#/shared/components/ui/button'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '#/shared/components/ui/sheet'

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '#/shared/components/ui/tabs'

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

import {
  exportToCsv,
} from '#/shared/lib/export-csv'

import {
  useSearchStore,
} from '#/shared/hooks/useSearchStore'

import {
  useEmployeeStore,
} from '#/features/employees/hooks/useEmployeeStore'

import {
  useVisitorStore,
} from '#/features/visitors/hooks/useVisitorStore'

// ========================================
// TABS
// ========================================

const TABS: {
  label: string
  value: ApprovalStatus | 'all'
}[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Requested',
    value: 'requested',
  },
  {
    label: 'Approved',
    value: 'approved',
  },
  {
    label: 'Completed',
    value: 'completed',
  },
  {
    label: 'Rejected',
    value: 'rejected',
  },
]

// ========================================
// PAGE
// ========================================

export function AppointmentsPage() {
  // ========================================
  // APPOINTMENT STORE
  // ========================================

  const appointments =
    useAppointmentStore(
      (state) =>
        state.appointments,
    )

  const loading =
    useAppointmentStore(
      (state) =>
        state.loading,
    )

  const fetchAppointments =
    useAppointmentStore(
      (state) =>
        state.fetchAppointments,
    )

  const addAppointment =
    useAppointmentStore(
      (state) =>
        state.addAppointment,
    )

  const updateAppointment =
    useAppointmentStore(
      (state) =>
        state.updateAppointment,
    )

  const deleteAppointment =
    useAppointmentStore(
      (state) =>
        state.deleteAppointment,
    )

  const approveAppointment =
    useAppointmentStore(
      (state) =>
        state.approveAppointment,
    )

  const rejectAppointment =
    useAppointmentStore(
      (state) =>
        state.rejectAppointment,
    )

  // ========================================
  // EMPLOYEE STORE
  // ========================================

  const loadEmployees =
    useEmployeeStore(
      (state) =>
        state.loadEmployees,
    )

  // ========================================
  // VISITOR STORE
  // ========================================

  const loadVisitors =
    useVisitorStore(
      (state) =>
        state.loadVisitors,
    )

  // ========================================
  // LOCAL STATE
  // ========================================

  const [tab, setTab] =
    useState<
      ApprovalStatus | 'all'
    >('all')

  const [
    formOpen,
    setFormOpen,
  ] = useState(false)

  const [
    editingAppointment,
    setEditingAppointment,
  ] = useState<Appointment | null>(
    null,
  )

  const [
    deleteTarget,
    setDeleteTarget,
  ] = useState<Appointment | null>(
    null,
  )

  const searchQuery =
    useSearchStore(
      (state) =>
        state.query,
    )

  // ========================================
  // LOAD ALL REQUIRED DATA
  // ========================================

  useEffect(() => {
    const loadData =
      async () => {
        try {
          await Promise.all([
            fetchAppointments(),
            loadEmployees(),
            loadVisitors(),
          ])
        } catch (error) {
          console.error(
            'Failed to load appointment page data:',
            error,
          )

          toast.error(
            'Gagal mengambil data appointments, visitors, dan employees.',
          )
        }
      }

    void loadData()
  }, [
    fetchAppointments,
    loadEmployees,
    loadVisitors,
  ])

  // ========================================
  // FILTER APPOINTMENTS
  // ========================================

  const filteredAppointments =
    useMemo(() => {
      const term =
        searchQuery
          .trim()
          .toLowerCase()

      return appointments.filter(
        (appointment) => {
          const matchesTab =
            tab === 'all' ||
            appointment.approvalStatus ===
              tab

          if (!matchesTab) {
            return false
          }

          if (!term) {
            return true
          }

          return [
            appointment.visitorName,
            appointment.appointmentId,
            appointment.visitorCompany,
            appointment.hostEmployeeName,
            appointment.meetingRoom,
            appointment.department,
            appointment.purpose,
          ].some(
            (field) =>
              field
                ?.toLowerCase()
                .includes(term),
          )
        },
      )
    }, [
      appointments,
      tab,
      searchQuery,
    ])

  // ========================================
  // TABLE COLUMNS
  // ========================================

  const columns = useMemo(
    () =>
      createAppointmentColumns({
        // ------------------------------------
        // EDIT
        // ------------------------------------

        onEdit:
          (appointment) => {
            setEditingAppointment(
              appointment,
            )

            setFormOpen(true)

            // Refresh data supaya
            // visitor dan host tetap tersedia.
            void Promise.all([
              loadEmployees(),
              loadVisitors(),
            ]).catch((error) => {
              console.error(
                'Failed to refresh employees/visitors:',
                error,
              )
            })
          },

        // ------------------------------------
        // DELETE
        // ------------------------------------

        onDelete:
          (appointment) => {
            setDeleteTarget(
              appointment,
            )
          },

        // ------------------------------------
        // APPROVE
        // ------------------------------------

        onApprove:
          async (appointment) => {
            try {
              await approveAppointment(
                appointment.id,
              )

              toast.success(
                'Appointment approved',
              )
            } catch (error) {
              console.error(error)

              toast.error(
                'Gagal approve appointment',
              )
            }
          },

        // ------------------------------------
        // REJECT
        // ------------------------------------

        onReject:
          async (appointment) => {
            try {
              await rejectAppointment(
                appointment.id,
              )

              toast.success(
                'Appointment rejected',
              )
            } catch (error) {
              console.error(error)

              toast.error(
                'Gagal reject appointment',
              )
            }
          },
      }),
    [
      approveAppointment,
      rejectAppointment,
      loadEmployees,
      loadVisitors,
    ],
  )

  // ========================================
  // OPEN NEW APPOINTMENT FORM
  // ========================================

  const handleOpenAppointmentForm =
    async () => {
      setEditingAppointment(null)

      // Pastikan visitor dan host
      // sudah dimuat sebelum form dibuka.
      try {
        await Promise.all([
          loadEmployees(),
          loadVisitors(),
        ])
      } catch (error) {
        console.error(
          'Failed to load form data:',
          error,
        )

        toast.error(
          'Gagal mengambil data visitor dan host.',
        )
      }

      setFormOpen(true)
    }

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="flex flex-col gap-6">
      {/* ====================================
          HEADER
      ==================================== */}

      <PageHeader
        title="Appointments"
        description="Book, approve, and manage visitor appointments."
        actions={
          <Button
            onClick={() => {
              void handleOpenAppointmentForm()
            }}
          >
            <PlusIcon />

            Book Appointment
          </Button>
        }
      />

      {/* ====================================
          STATUS TABS
      ==================================== */}

      <Tabs
        value={tab}
        onValueChange={(value) =>
          setTab(
            value as
              | ApprovalStatus
              | 'all',
          )
        }
      >
        <TabsList>
          {TABS.map((item) => (
            <TabsTrigger
              key={item.value}
              value={item.value}
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* ====================================
          TABLE
      ==================================== */}

      <DataTable
        columns={columns}
        data={filteredAppointments}
        searchKey="visitorName"
        searchPlaceholder="Search by visitor name..."
        onExport={(rows) =>
          exportToCsv(
            'appointments',
            rows.map(
              (appointment) => ({
                appointmentId:
                  appointment.appointmentId,

                visitorName:
                  appointment.visitorName,

                visitorCompany:
                  appointment.visitorCompany,

                host:
                  appointment.hostEmployeeName,

                meetingRoom:
                  appointment.meetingRoom,

                visitDate:
                  appointment.visitDate,

                visitTime:
                  appointment.visitTime,

                purpose:
                  appointment.purpose,

                status:
                  appointment.approvalStatus,
              }),
            ),
          )
        }
        emptyMessage={
          loading
            ? 'Loading appointments...'
            : 'No appointments match the current filters.'
        }
      />

      {/* ====================================
          APPOINTMENT FORM
      ==================================== */}

      <Sheet
        open={formOpen}
        onOpenChange={setFormOpen}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {editingAppointment
                ? 'Edit Appointment'
                : 'Book Appointment'}
            </SheetTitle>

            <SheetDescription>
              {editingAppointment
                ? 'Update the appointment details below.'
                : 'Schedule a new visitor appointment.'}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-4 px-4 pb-4">
            <AppointmentForm
              defaultValues={
                editingAppointment ??
                undefined
              }
              submitLabel={
                editingAppointment
                  ? 'Save Changes'
                  : 'Book Appointment'
              }
              onCancel={() => {
                setFormOpen(false)
                setEditingAppointment(
                  null,
                )
              }}
              onSubmit={async (
                values,
              ) => {
                try {
                  // --------------------------------
                  // UPDATE
                  // --------------------------------

                  if (
                    editingAppointment
                  ) {
                    await updateAppointment(
                      editingAppointment.id,
                      values,
                    )

                    toast.success(
                      'Appointment updated',
                    )
                  }

                  // --------------------------------
                  // CREATE
                  // --------------------------------

                  else {
                    await addAppointment(
                      values,
                    )

                    toast.success(
                      'Appointment requested',
                    )
                  }

                  setFormOpen(false)

                  setEditingAppointment(
                    null,
                  )

                  // Refresh semua data
                  // setelah berhasil.
                  await Promise.all([
                    fetchAppointments(),
                    loadEmployees(),
                    loadVisitors(),
                  ])
                } catch (error) {
                  console.error(
                    'Failed to save appointment:',
                    error,
                  )

                  toast.error(
                    'Gagal menyimpan appointment',
                  )
                }
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* ====================================
          DELETE CONFIRMATION
      ==================================== */}

      <AlertDialog
        open={
          !!deleteTarget
        }
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete appointment?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently remove
              the appointment for{' '}
              {deleteTarget?.visitorName}.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={async () => {
                if (!deleteTarget) {
                  return
                }

                try {
                  await deleteAppointment(
                    deleteTarget.id,
                  )

                  toast.success(
                    'Appointment deleted',
                  )

                  await fetchAppointments()
                } catch (error) {
                  console.error(
                    'Failed to delete appointment:',
                    error,
                  )

                  toast.error(
                    'Gagal menghapus appointment',
                  )
                }

                setDeleteTarget(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}