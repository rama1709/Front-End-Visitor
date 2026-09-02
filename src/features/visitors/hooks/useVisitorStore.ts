import { create } from 'zustand'

import {
  createVisitorApi,
  deleteVisitorApi,
  getVisitorsFromApi,
  updateVisitorApi,
} from '../api/visitors-api'

import type {
  Visitor,
  VisitorFormValues,
} from '../types'

interface VisitorState {
  visitors: Visitor[]
  isLoading: boolean
  error: string | null

  loadVisitors: () => Promise<void>

  addVisitor: (
    values: VisitorFormValues,
  ) => Promise<Visitor>

  updateVisitor: (
    id: string,
    values: Partial<VisitorFormValues>,
  ) => Promise<void>

  deleteVisitor: (
    id: string,
  ) => Promise<void>

  deleteVisitors: (
    ids: string[],
  ) => Promise<void>

  approveVisitor: (
    id: string,
  ) => void

  rejectVisitor: (
    id: string,
  ) => void

  checkInVisitor: (
    id: string,
    operator: string,
  ) => void

  checkOutVisitor: (
    id: string,
    payload: {
      badgeReturned: boolean
      remarks: string
    },
  ) => void
}

export const useVisitorStore =
  create<VisitorState>((set) => ({
    // =====================================================
    // INITIAL STATE
    // =====================================================

    visitors: [],

    isLoading: false,

    error: null,


    // =====================================================
    // LOAD VISITORS
    // =====================================================

    loadVisitors: async () => {
      set({
        isLoading: true,
        error: null,
      })

      try {
        const visitors =
          await getVisitorsFromApi()

        set({
          visitors,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        console.error(
          'Failed to load visitors:',
          error,
        )

        set({
          visitors: [],
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to load visitors',
        })
      }
    },


    // =====================================================
    // ADD VISITOR
    // =====================================================

    addVisitor: async (values) => {
      try {
        const visitor =
          await createVisitorApi(values)

        set((state) => ({
          visitors: [
            visitor,
            ...state.visitors,
          ],
          error: null,
        }))

        return visitor
      } catch (error) {
        console.error(
          'Failed to add visitor:',
          error,
        )

        throw error
      }
    },


    // =====================================================
    // UPDATE VISITOR
    // =====================================================

    updateVisitor: async (
      id,
      values,
    ) => {
      try {
        const visitor =
          await updateVisitorApi(
            id,
            values,
          )

        set((state) => ({
          visitors:
            state.visitors.map(
              (item) =>
                item.id === id
                  ? visitor
                  : item,
            ),
          error: null,
        }))
      } catch (error) {
        console.error(
          'Failed to update visitor:',
          error,
        )

        throw error
      }
    },


    // =====================================================
    // DELETE ONE VISITOR
    // =====================================================

    deleteVisitor: async (id) => {
      try {
        await deleteVisitorApi(id)

        set((state) => ({
          visitors:
            state.visitors.filter(
              (visitor) =>
                visitor.id !== id,
            ),
          error: null,
        }))
      } catch (error) {
        console.error(
          'Failed to delete visitor:',
          error,
        )

        throw error
      }
    },


    // =====================================================
    // DELETE MULTIPLE VISITORS
    // =====================================================

    deleteVisitors: async (ids) => {
      if (ids.length === 0) {
        return
      }

      try {
        await Promise.all(
          ids.map((id) =>
            deleteVisitorApi(id),
          ),
        )

        const idSet =
          new Set(ids)

        set((state) => ({
          visitors:
            state.visitors.filter(
              (visitor) =>
                !idSet.has(
                  visitor.id,
                ),
            ),
          error: null,
        }))
      } catch (error) {
        console.error(
          'Failed to delete visitors:',
          error,
        )

        throw error
      }
    },


    // =====================================================
    // APPROVE VISITOR
    // =====================================================

    approveVisitor: (id) => {
      set((state) => ({
        visitors:
          state.visitors.map(
            (visitor) =>
              visitor.id === id
                ? {
                    ...visitor,
                    status:
                      'approved',
                  }
                : visitor,
          ),
      }))
    },


    // =====================================================
    // REJECT VISITOR
    // =====================================================

    rejectVisitor: (id) => {
      set((state) => ({
        visitors:
          state.visitors.map(
            (visitor) =>
              visitor.id === id
                ? {
                    ...visitor,
                    status:
                      'rejected',
                  }
                : visitor,
          ),
      }))
    },


    // =====================================================
    // CHECK IN
    // =====================================================

    checkInVisitor: (
      id,
      operator,
    ) => {
      set((state) => ({
        visitors:
          state.visitors.map(
            (visitor) =>
              visitor.id === id
                ? {
                    ...visitor,

                    status:
                      'checked-in',

                    checkInTime:
                      new Date().toISOString(),

                    operator,
                  }
                : visitor,
          ),
      }))
    },


    // =====================================================
    // CHECK OUT
    // =====================================================

    checkOutVisitor: (
      id,
      payload,
    ) => {
      set((state) => ({
        visitors:
          state.visitors.map(
            (visitor) =>
              visitor.id === id
                ? {
                    ...visitor,

                    status:
                      'checked-out',

                    checkOutTime:
                      new Date().toISOString(),

                    badgeReturned:
                      payload.badgeReturned,

                    remarks:
                      payload.remarks ||
                      visitor.remarks,
                  }
                : visitor,
          ),
      }))
    },
  }))