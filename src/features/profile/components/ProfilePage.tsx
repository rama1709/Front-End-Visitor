import { MailIcon, ShieldIcon, UserIcon } from 'lucide-react'
import { toast } from 'sonner'

import { useAuthStore } from '#/features/auth'
import { PageHeader } from '#/shared/components'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import { Avatar, AvatarFallback } from '#/shared/components/ui/avatar'
import { Label } from '#/shared/components/ui/label'
import { Input } from '#/shared/components/ui/input'
import { Button } from '#/shared/components/ui/button'
import { Separator } from '#/shared/components/ui/separator'

export function ProfilePage() {
  const user = useAuthStore((state) => state.user)

  const save = () => toast.success('Profile updated')

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Profile"
        description="View and manage your account information."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center gap-3 pt-2 text-center">
            <Avatar className="size-20">
              <AvatarFallback className="bg-primary/10 text-xl font-semibold text-primary">
                {user?.avatarInitials ?? 'GU'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-base font-semibold">
                {user?.name ?? 'Guest User'}
              </p>
              <p className="text-sm text-muted-foreground">
                {user?.role ?? 'Not signed in'}
              </p>
            </div>
            <Separator />
            <div className="flex w-full flex-col gap-2 text-left text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MailIcon className="size-4" />
                <span>{user?.email ?? '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <ShieldIcon className="size-4" />
                <span>{user?.department ?? '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserIcon className="size-4" />
                <span>{user?.id ?? '-'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Update your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>Full Name</Label>
                <Input defaultValue={user?.name ?? ''} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Email</Label>
                <Input defaultValue={user?.email ?? ''} type="email" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Role</Label>
                <Input defaultValue={user?.role ?? ''} disabled />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Department</Label>
                <Input defaultValue={user?.department ?? ''} disabled />
              </div>
            </div>
            <div>
              <Button onClick={save}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
