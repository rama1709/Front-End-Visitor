import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CheckCircle2Icon, ShieldCheckIcon } from 'lucide-react'
import { toast } from 'sonner'

import { VisitorRegisterForm } from './VisitorRegisterForm'
import type { VisitorRegisterFormValues } from '../types'

import { useAuthStore } from '#/features/auth/hooks/useAuthStore'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'

import { Button } from '#/shared/components/ui/button'
import ThemeToggle from '#/shared/components/ThemeToggle'

const API_URL = 'http://localhost:8080/api'

interface CreatedVisitor {
  id: number
  full_name: string
  email: string
  phone: string
  company: string
  host_employee_id?: number | null
  purpose?: string | null
}

interface VisitorRequestResponse {
  id: number
  visitor_id: number
  employee_id: number
  purpose: string
  status: string
  visit_date: string
}

function getToken(): string {
  const token = useAuthStore.getState().token

  if (!token) {
    throw new Error(
      'Authentication token tidak ditemukan. Silakan login sebagai admin terlebih dahulu.',
    )
  }

  return token
}

function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

/**
 * Mengubah tanggal dari form menjadi format RFC3339.
 *
 * Backend Go menggunakan time.Time,
 * sehingga jangan mengirim:
 *
 * 2026-08-14
 *
 * tetapi:
 *
 * 2026-08-14T00:00:00+07:00
 */
function makeVisitDate(date: string): string {
  return `${date}T00:00:00+07:00`
}

export function VisitorRegisterPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (
    values: VisitorRegisterFormValues,
  ) => {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)

    try {
      const token = getToken()

      /*
       * =====================================================
       * STEP 1
       * CREATE VISITOR
       * =====================================================
       */

      const visitorPayload = {
        full_name: values.fullName,
        email: values.email,
        phone: values.phone,
        company: values.company,

        host_employee_id:
          values.hostEmployeeId.trim() !== ''
            ? Number(values.hostEmployeeId)
            : null,

        purpose: values.purpose,

        // Register form belum memiliki visitor type,
        // jadi default sebagai guest.
        visitor_type: 'guest',

        vehicle_number: null,
      }

      console.log(
        'POST /api/visitors:',
        visitorPayload,
      )

      const visitorResponse = await fetch(
        `${API_URL}/visitors`,
        {
          method: 'POST',
          headers: {
            ...getHeaders(),
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(visitorPayload),
        },
      )

      if (!visitorResponse.ok) {
        const errorText =
          await visitorResponse.text()

        throw new Error(
          `Gagal membuat visitor: ${visitorResponse.status} ${errorText}`,
        )
      }

      const visitorData: CreatedVisitor =
        await visitorResponse.json()

      console.log(
        'Visitor berhasil dibuat:',
        visitorData,
      )

      /*
       * Pastikan backend mengembalikan ID visitor.
       */
      if (!visitorData.id) {
        throw new Error(
          'Visitor berhasil dibuat tetapi ID visitor tidak ditemukan.',
        )
      }

      /*
       * =====================================================
       * STEP 2
       * CREATE VISITOR REQUEST
       * =====================================================
       */

      const requestPayload = {
        visitor_id: visitorData.id,

        employee_id: Number(
          values.hostEmployeeId,
        ),

        purpose: values.purpose,

        /*
         * Backend Go menggunakan time.Time.
         * Jadi harus menggunakan RFC3339.
         */
        visit_date: makeVisitDate(
          values.visitDate,
        ),

        /*
         * Status dikosongkan karena database/backend
         * saat ini masih menerima status kosong.
         */
        status: '',
      }

      console.log(
        'POST /api/visitor-requests:',
        requestPayload,
      )

      const requestResponse = await fetch(
        `${API_URL}/visitor-requests`,
        {
          method: 'POST',
          headers: {
            ...getHeaders(),
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestPayload),
        },
      )

      if (!requestResponse.ok) {
        const errorText =
          await requestResponse.text()

        throw new Error(
          `Visitor berhasil dibuat, tetapi visitor request gagal: ${requestResponse.status} ${errorText}`,
        )
      }

      const requestData:
        | VisitorRequestResponse
        | { message: string } =
        await requestResponse.json()

      console.log(
        'Visitor request berhasil dibuat:',
        requestData,
      )

      /*
       * =====================================================
       * STEP 3
       * BERHASIL
       * =====================================================
       */

      toast.success(
        'Registration submitted successfully!',
      )

      setSubmitted(true)

    } catch (error) {
      console.error(
        'Visitor registration error:',
        error,
      )

      toast.error(
        error instanceof Error
          ? error.message
          : 'Gagal melakukan visitor registration.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-muted/30">

      {/* HEADER */}

      <header className="flex items-center justify-between px-4 py-4 sm:px-8">

        <div className="flex items-center gap-2">

          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheckIcon className="size-5" />
          </div>

          <div className="leading-tight">
            <p className="text-sm font-semibold">
              Visitor Management
            </p>

            <p className="text-xs text-muted-foreground">
              Northwind Tower
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <ThemeToggle />

          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link to="/login">
              Admin Login
            </Link>
          </Button>

        </div>

      </header>

      {/* MAIN */}

      <main className="flex flex-1 items-center justify-center px-4 pb-10">

        <div className="grid w-full max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-2">

          {/* LEFT CONTENT */}

          <div className="hidden flex-col gap-4 lg:flex">

            <p className="text-sm font-semibold text-primary">
              Welcome
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-balance">
              Fast, secure check-in for every guest
            </h1>

            <p className="max-w-md text-muted-foreground">
              Fill out the short form to register your visit.
              Front desk staff will confirm your appointment
              and print your badge when you arrive.
            </p>

          </div>

          {/* CARD */}

          <Card className="mx-auto w-full max-w-md shadow-lg">

            {submitted ? (

              <CardContent className="flex flex-col items-center gap-3 py-10 text-center">

                <CheckCircle2Icon className="size-12 text-primary" />

                <CardTitle>
                  Registration received
                </CardTitle>

                <CardDescription>
                  Thanks! Please take a seat — the front desk
                  will call you shortly to complete your
                  check-in.
                </CardDescription>

                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() =>
                    setSubmitted(false)
                  }
                >
                  Register another visitor
                </Button>

              </CardContent>

            ) : (

              <>

                <CardHeader>

                  <CardTitle>
                    Visitor Registration
                  </CardTitle>

                  <CardDescription>
                    Please fill in your details below.
                    It only takes a minute.
                  </CardDescription>

                </CardHeader>

                <CardContent>

                  <VisitorRegisterForm
                    onSubmit={handleSubmit}
                  />

                </CardContent>

              </>

            )}

          </Card>

        </div>

      </main>

    </div>
  )
}