import { useState } from 'react'

import { CheckInSearchPanel } from './CheckInSearchPanel'
import { CheckInConfirmPanel } from './CheckInConfirmPanel'
import type { Visitor } from '#/features/visitors'
import { VisitorBadgeCard } from '#/features/badge/components/VisitorBadgeCard'
import { PageHeader } from '#/shared/components'

export function CheckInPage() {
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null)
  const [checkedInVisitor, setCheckedInVisitor] = useState<Visitor | null>(null)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Check In"
        description="Find a visitor and process their arrival at the front desk."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CheckInSearchPanel
            onSelectVisitor={(visitor) => {
              setSelectedVisitor(visitor)
              setCheckedInVisitor(null)
            }}
          />
        </div>
        <div className="lg:col-span-1">
          <CheckInConfirmPanel
            visitor={selectedVisitor}
            onCheckedIn={(visitor) => setCheckedInVisitor(visitor)}
          />
        </div>
        <div className="lg:col-span-1">
          {checkedInVisitor ? (
            <VisitorBadgeCard visitor={checkedInVisitor} />
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Badge preview will appear here after check-in.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
