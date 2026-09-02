import { create } from 'zustand'

import {
  getAppointments,
  createAppointment,
  updateAppointment as updateAppointmentApi,
  deleteAppointment as deleteAppointmentApi,
} from '../api/appointments'

import type {
  Appointment,
  AppointmentFormValues,
} from '../types'

interface AppointmentState {
  appointments: Appointment[]

  loading: boolean

  error: string | null

  fetchAppointments: () => Promise<void>

  addAppointment: (
    values: AppointmentFormValues,
  ) => Promise<void>

  updateAppointment: (
    id: string,
    values: Partial<AppointmentFormValues>,
  ) => Promise<void>

  deleteAppointment: (
    id: string,
  ) => Promise<void>

  approveAppointment: (
    id: string,
  ) => Promise<void>

  rejectAppointment: (
    id: string,
  ) => Promise<void>

  completeAppointment: (
    id: string,
  ) => Promise<void>
}

export const useAppointmentStore =
  create<AppointmentState>((set, get) => ({
    appointments: [],

    loading: false,

    error: null,

    fetchAppointments: async () => {
      try {
        set({
          loading: true,
          error: null,
        })

        const appointments =
          await getAppointments()

        set({
          appointments,
          loading: false,
        })
      } catch (error) {
        set({
          loading: false,

          error:
            error instanceof Error
              ? error.message
              : 'Gagal mengambil appointments',
        })
      }
    },

    addAppointment: async (
      values,
    ) => {
      const appointment =
        await createAppointment(
          values,
        )

      set((state) => ({
        appointments: [
          appointment,
          ...state.appointments,
        ],
      }))
    },

    updateAppointment: async (
      id,
      values,
    ) => {
      await updateAppointmentApi(
        id,
        values,
      )

      const appointments =
        await getAppointments()

      set({
        appointments,
      })
    },

    deleteAppointment: async (
      id,
    ) => {
      await deleteAppointmentApi(
        id,
      )

      set((state) => ({
        appointments:
          state.appointments.filter(
            (appointment) =>
              appointment.id !== id,
          ),
      }))
    },

    approveAppointment: async (
      id,
    ) => {
      const appointment =
        get().appointments.find(
          (item) =>
            item.id === id,
        )

      if (!appointment) {
        throw new Error(
          'Appointment tidak ditemukan',
        )
      }

      await updateAppointmentApi(
        id,
        {
          visitorId:
            appointment.visitorId,

          hostEmployeeId:
            appointment.hostEmployeeId,

          meetingRoom:
            appointment.meetingRoom,

          visitDate:
            appointment.visitDate,

          visitTime:
            appointment.visitTime,

          durationMinutes:
            appointment.durationMinutes,

          purpose:
            appointment.purpose,

          status:
            'approved',
        },
      )

      const appointments =
        await getAppointments()

      set({
        appointments,
      })
    },

    rejectAppointment: async (
      id,
    ) => {
      const appointment =
        get().appointments.find(
          (item) =>
            item.id === id,
        )

      if (!appointment) {
        throw new Error(
          'Appointment tidak ditemukan',
        )
      }

      await updateAppointmentApi(
        id,
        {
          visitorId:
            appointment.visitorId,

          hostEmployeeId:
            appointment.hostEmployeeId,

          meetingRoom:
            appointment.meetingRoom,

          visitDate:
            appointment.visitDate,

          visitTime:
            appointment.visitTime,

          durationMinutes:
            appointment.durationMinutes,

          purpose:
            appointment.purpose,

          status:
            'rejected',
        },
      )

      const appointments =
        await getAppointments()

      set({
        appointments,
      })
    },

    completeAppointment: async (
      id,
    ) => {
      const appointment =
        get().appointments.find(
          (item) =>
            item.id === id,
        )

      if (!appointment) {
        throw new Error(
          'Appointment tidak ditemukan',
        )
      }

      await updateAppointmentApi(
        id,
        {
          visitorId:
            appointment.visitorId,

          hostEmployeeId:
            appointment.hostEmployeeId,

          meetingRoom:
            appointment.meetingRoom,

          visitDate:
            appointment.visitDate,

          visitTime:
            appointment.visitTime,

          durationMinutes:
            appointment.durationMinutes,

          purpose:
            appointment.purpose,

          status:
            'completed',
        },
      )

      const appointments =
        await getAppointments()

      set({
        appointments,
      })
    },
  }))