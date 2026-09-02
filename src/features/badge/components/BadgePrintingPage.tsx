import { useMemo, useState } from 'react'
import { PrinterIcon, SearchIcon } from 'lucide-react'

import { VisitorBadgeCard } from './VisitorBadgeCard'
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
import { Avatar, AvatarFallback } from '#/shared/components/ui/avatar'
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

export function BadgePrintingPage() {
  const visitors = useVisitorStore((state) => state.visitors)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Visitor | null>(null)

  const eligible = useMemo(
    () =>
      visitors.filter(
        (v) => v.status === 'checked-in' || v.status === 'checked-out',
      ),
    [visitors],
  )

  const results = useMemo(() => {
    if (!query.trim()) return eligible.slice(0, 10)
    const lower = query.toLowerCase()
    return eligible.filter(
      (visitor) =>
        visitor.fullName.toLowerCase().includes(lower) ||
        visitor.visitorId.toLowerCase().includes(lower),
    )
  }, [eligible, query])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Badge Printing"
        description="Reprint or preview visitor badges for checked-in guests."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Select Visitor</CardTitle>
            <CardDescription>
              Choose a visitor to preview or print their badge.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search visitors..."
                className="pl-8"
              />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {results.map((visitor) => (
                <button
                  key={visitor.id}
                  type="button"
                  onClick={() => setSelected(visitor)}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3 text-left transition hover:bg-accent/50 data-[active=true]:border-primary"
                  data-active={selected?.id === visitor.id}
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
                        {visitor.visitorId}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={visitor.status} />
                </button>
              ))}
              {results.length === 0 && (
                <p className="col-span-full p-4 text-center text-sm text-muted-foreground">
                  No visitors found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          {selected ? (
            <>
              <VisitorBadgeCard visitor={selected} />
              <Button className="w-full" onClick={() => window.print()}>
                <PrinterIcon />
                Print Badge
              </Button>
            </>
          ) : (
            <div className="flex h-full min-h-64 items-center justify-center rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Select a visitor to preview their badge.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
