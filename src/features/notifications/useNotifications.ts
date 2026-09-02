import { useEffect, useState } from 'react'
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore'

import { db } from '#/lib/firebase'

export interface NotificationItem {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: Date | null
}

export function useNotifications() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>([])

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    const notificationsRef =
      collection(db, 'notifications')

    const unsubscribe = onSnapshot(
      notificationsRef,
      (snapshot) => {
        const data: NotificationItem[] =
          snapshot.docs.map((docSnapshot) => {
            const raw = docSnapshot.data()

            return {
              id: docSnapshot.id,
              title:
                typeof raw.title === 'string'
                  ? raw.title
                  : 'Notification',
              message:
                typeof raw.message === 'string'
                  ? raw.message
                  : '',
              read:
                typeof raw.read === 'boolean'
                  ? raw.read
                  : false,
              createdAt:
                raw.createdAt?.toDate?.() ?? null,
            }
          })

        data.sort((a, b) => {
          const aTime =
            a.createdAt?.getTime() ?? 0

          const bTime =
            b.createdAt?.getTime() ?? 0

          return bTime - aTime
        })

        setNotifications(data)
        setIsLoading(false)
        setError(null)
      },
      (snapshotError) => {
        console.error(
          'Notification listener error:',
          snapshotError,
        )

        setError(
          'Gagal memuat notifications.',
        )

        setIsLoading(false)
      },
    )

    return () => {
      unsubscribe()
    }
  }, [])

  const markAsRead = async (
    notificationId: string,
  ) => {
    try {
      const notificationRef = doc(
        db,
        'notifications',
        notificationId,
      )

      await updateDoc(notificationRef, {
        read: true,
      })
    } catch (error) {
      console.error(
        'Failed to mark notification as read:',
        error,
      )
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications =
        notifications.filter(
          (notification) =>
            notification.read === false,
        )

      await Promise.all(
        unreadNotifications.map(
          (notification) =>
            updateDoc(
              doc(
                db,
                'notifications',
                notification.id,
              ),
              {
                read: true,
              },
            ),
        ),
      )
    } catch (error) {
      console.error(
        'Failed to mark all notifications as read:',
        error,
      )
    }
  }

  const unreadCount =
    notifications.filter(
      (notification) =>
        notification.read === false,
    ).length

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
  }
}