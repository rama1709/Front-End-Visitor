import { useState } from 'react'
import type * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  ShieldCheckIcon,
} from 'lucide-react'
import { toast } from 'sonner'

import { useAuthStore } from '../hooks/useAuthStore'
import { getDemoAccounts } from '../api/mock-auth'
import { registerFCM } from '#/lib/fcm'

import { Alert, AlertDescription } from '#/shared/components/ui/alert'
import { Button } from '#/shared/components/ui/button'
import { Input } from '#/shared/components/ui/input'
import { Label } from '#/shared/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import ThemeToggle from '#/shared/components/ThemeToggle'

export function LoginPage() {
  const navigate = useNavigate()

  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const demoAccounts = getDemoAccounts()

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setError(null)

    // Validasi input
    if (!email.trim() || !password) {
      setError('Please enter both email and password.')
      return
    }

    // Login ke backend
    const result = await login({
      email: email.trim(),
      password,
    })

    if (!result.success) {
      setError(result.message ?? 'Unable to sign in.')
      return
    }

toast.success('Signed in successfully')

// ===================================
// REGISTER FCM TOKEN
// ===================================
try {
  const sessionString = localStorage.getItem("vms-auth");

  if (!sessionString) {
    console.warn("Session tidak ditemukan");
  } else {
    const session = JSON.parse(sessionString);

    console.log("SESSION:", session);

    // Ambil user dari Zustand
    const user = session.state.user;

    // Cari ID dengan beberapa kemungkinan nama field
    const employeeId = Number(
      user.id ??
      user.employee_id ??
      user.employeeId ??
      0
    );

    const jwt = session.state.token;

    console.log("EMPLOYEE ID:", employeeId);

    if (employeeId > 0 && jwt) {
      await registerFCM(employeeId, jwt);
      console.log("✅ registerFCM berhasil");
    } else {
      console.error("Employee ID tidak ditemukan", user);
    }
  }
} catch (err) {
  console.error("FCM ERROR:", err);
}

// Masuk dashboard
navigate({ to: '/dashboard' })
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex w-full max-w-sm flex-col gap-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheckIcon className="size-5" />
          </div>

          <div>
            <p className="text-lg font-semibold">
              Visitor Management
            </p>

            <p className="text-sm text-muted-foreground">
              Northwind Tower Front Desk Console
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>

            <CardDescription>
              Enter your credentials to access the dashboard.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Error */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setError(null)
                  }}
                  disabled={isLoading}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">
                  Password
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setError(null)
                    }}
                    disabled={isLoading}
                    className="pr-9"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="size-4" />
                    ) : (
                      <EyeIcon className="size-4" />
                    )}

                    <span className="sr-only">
                      Toggle password visibility
                    </span>
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="mt-1 w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-5 rounded-md border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
              <p className="mb-1 font-medium text-foreground">
                Demo accounts
              </p>

              {demoAccounts.map((account) => (
                <p key={account.email}>
                  {account.email} / {account.password}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}