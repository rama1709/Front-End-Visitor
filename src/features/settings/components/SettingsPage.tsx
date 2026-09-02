import { useState } from 'react'
import { toast } from 'sonner'

import { PageHeader } from '#/shared/components'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '#/shared/components/ui/tabs'
import { Input } from '#/shared/components/ui/input'
import { Label } from '#/shared/components/ui/label'
import { Textarea } from '#/shared/components/ui/textarea'
import { Button } from '#/shared/components/ui/button'
import { Switch } from '#/shared/components/ui/switch'
import { Separator } from '#/shared/components/ui/separator'
import { Avatar, AvatarFallback } from '#/shared/components/ui/avatar'

function SettingsField({
  label,
  description,
  children,
  className,
}: {
  label: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <Label>{label}</Label>
      {children}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

function ToggleRow({
  title,
  description,
  defaultChecked = true,
}: {
  title: string
  description: string
  defaultChecked?: boolean
}) {
  const [checked, setChecked] = useState(defaultChecked)
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={setChecked} />
    </div>
  )
}

export function SettingsPage() {
  const save = () => toast.success('Settings saved')

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Configure company details, policies, and system preferences."
      />

      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="hours">Working Hours</TabsTrigger>
          <TabsTrigger value="policies">Visitor Policies</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="badge">Badge Template</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Basic details shown across the visitor system.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="size-16 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary/10 text-lg font-semibold text-primary">
                    NW
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Upload Logo
                  </Button>
                  <p className="mt-1 text-xs text-muted-foreground">
                    PNG or SVG, up to 2MB
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SettingsField label="Company Name">
                  <Input defaultValue="Northwind Tower Co." />
                </SettingsField>
                <SettingsField label="Support Email">
                  <Input defaultValue="frontdesk@northwind.co" type="email" />
                </SettingsField>
                <SettingsField label="Phone">
                  <Input defaultValue="+1 (555) 200-4000" />
                </SettingsField>
                <SettingsField label="Website">
                  <Input defaultValue="https://northwind.co" />
                </SettingsField>
              </div>
              <SettingsField label="Address">
                <Textarea
                  rows={2}
                  defaultValue="1 Northwind Plaza, Suite 500, Metropolis"
                />
              </SettingsField>
              <div>
                <Button onClick={save}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Working Hours</CardTitle>
              <CardDescription>
                Define when visitors can be checked in.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col divide-y">
              {['Monday–Friday', 'Saturday', 'Sunday'].map((day) => (
                <div
                  key={day}
                  className="flex items-center justify-between gap-4 py-3"
                >
                  <p className="text-sm font-medium">{day}</p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      defaultValue={day === 'Sunday' ? '' : '08:00'}
                      className="w-28"
                      disabled={day === 'Sunday'}
                    />
                    <span className="text-sm text-muted-foreground">to</span>
                    <Input
                      type="time"
                      defaultValue={
                        day === 'Sunday'
                          ? ''
                          : day === 'Saturday'
                            ? '13:00'
                            : '18:00'
                      }
                      className="w-28"
                      disabled={day === 'Sunday'}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <Button onClick={save}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Policies</CardTitle>
              <CardDescription>
                Rules applied during visitor registration and check-in.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col divide-y">
              <ToggleRow
                title="Require ID verification"
                description="Visitors must upload a valid ID before check-in."
              />
              <ToggleRow
                title="Require host approval"
                description="New visitors must be approved by their host before arrival."
              />
              <ToggleRow
                title="Require photo capture"
                description="Capture a visitor photo at the front desk."
              />
              <ToggleRow
                title="Auto check-out"
                description="Automatically check out visitors after 8 hours."
                defaultChecked={false}
              />
              <div className="pt-4">
                <Button onClick={save}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Choose what alerts hosts and admins receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col divide-y">
              <ToggleRow
                title="Notify host on visitor arrival"
                description="Send an email/notification when a guest checks in."
              />
              <ToggleRow
                title="Notify admin on pending approvals"
                description="Alert administrators of visitors awaiting approval."
              />
              <ToggleRow
                title="Daily summary report"
                description="Send a daily digest of visitor activity."
                defaultChecked={false}
              />
              <div className="pt-4">
                <Button onClick={save}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="badge">
          <Card>
            <CardHeader>
              <CardTitle>Badge Template</CardTitle>
              <CardDescription>
                Customize the fields printed on visitor badges.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col divide-y">
              <ToggleRow
                title="Show visitor photo"
                description="Display captured photo on badge."
              />
              <ToggleRow
                title="Show host name"
                description="Display the host employee's name."
              />
              <ToggleRow
                title="Show QR code"
                description="Include a scannable QR code for exit validation."
              />
              <ToggleRow
                title="Show company name"
                description="Display the visitor's company on the badge."
              />
              <Separator className="my-2" />
              <SettingsField label="Badge Footer Text" className="pt-3">
                <Input defaultValue="Please wear this badge visibly at all times on premises." />
              </SettingsField>
              <div className="pt-4">
                <Button onClick={save}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
