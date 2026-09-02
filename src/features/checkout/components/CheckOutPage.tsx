import { useMemo, useState } from 'react'
import { LogOutIcon, SearchIcon, UserRoundIcon } from 'lucide-react'
import { toast } from 'sonner'

import type { Visitor } from '#/features/visitors'
import { PageHeader } from '#/shared/components'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import { Input } from '#/shared/components/ui/input'
import { Button } from '#/shared/components/ui/button'
import { Textarea } from '#/shared/components/ui/textarea'
import { Label } from '#/shared/components/ui/label'
import { Checkbox } from '#/shared/components/ui/checkbox'
import { Avatar, AvatarFallback } from '#/shared/components/ui/avatar'
import { Separator } from '#/shared/components/ui/separator'
import { StatusBadge } from '#/shared/components/StatusBadge'
import { useVisitorStore } from '#/features/visitors'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function CheckOutPage() {
  const visitors = useVisitorStore((state) => state.visitors)
  const checkOutVisitor = useVisitorStore((state) => state.checkOutVisitor)

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Visitor | null>(null)
  const [badgeReturned, setBadgeReturned] = useState(true)
  const [remarks, setRemarks] = useState('')

  const checkedInVisitors = useMemo(
    () => visitors.filter((v) => v.status === 'checked-in'),
    [visitors],
  )

  const results = useMemo(() => {
    if (!query.trim()) return checkedInVisitors.slice(0, 8)
    const lower = query.toLowerCase()
    return checkedInVisitors.filter(
      (visitor) =>
        visitor.fullName.toLowerCase().includes(lower) ||
        visitor.visitorId.toLowerCase().includes(lower),
    )
  }, [checkedInVisitors, query])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Check Out"
        description="Look up a checked-in visitor and record their departure."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Find Checked-In Visitor</CardTitle>
            <CardDescription>
              Currently {checkedInVisitors.length} on premises
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name or visitor ID..."
                className="pl-8"
              />
            </div>
            <div className="flex flex-col divide-y rounded-lg border">
              {results.length === 0 && (
                <p className="p-4 text-center text-sm text-muted-foreground">
                  No checked-in visitors found.
                </p>
              )}
              {results.map((visitor) => (
                <button
                  key={visitor.id}
                  type="button"
                  onClick={() => {
                    setSelected(visitor)
                    setBadgeReturned(true)
                    setRemarks('')
                  }}
                  className="flex items-center justify-between gap-3 p-3 text-left transition hover:bg-accent/50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                        {initials(visitor.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <p className="font-medium">{visitor.fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        {visitor.company} · {visitor.visitorId}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={visitor.status} />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Check-Out Details</CardTitle>
            <CardDescription>
              Confirm badge return and add remarks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selected ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
                <UserRoundIcon className="size-10" />
                <p className="text-sm">Select a visitor to check out.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                      {initials(selected.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selected.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {selected.company}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="badge-returned"
                    checked={badgeReturned}
                    onCheckedChange={(value) => setBadgeReturned(!!value)}
                  />
                  <Label htmlFor="badge-returned" className="cursor-pointer">
                    Visitor badge returned
                  </Label>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="remarks">Remarks (optional)</Label>
                  <Textarea
                    id="remarks"
                    rows={3}
                    placeholder="Any notes about this visit..."
                    value={remarks}
                    onChange={(event) => setRemarks(event.target.value)}
                  />
                </div>

                <Button
                  size="lg"
                  onClick={() => {
                    checkOutVisitor(selected.id, { badgeReturned, remarks })
                    toast.success(
                      `${selected.fullName} checked out successfully`,
                    )
                    setSelected(null)
                    setRemarks('')
                  }}
                >
                  <LogOutIcon />
                  Confirm Check-Out
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
