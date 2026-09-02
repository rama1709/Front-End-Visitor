import { faker } from '@faker-js/faker'

import type { Visitor, VisitorStatus, VisitorType } from '../types'
import { getEmployees } from '#/features/employees/api/mock-employees'

const PURPOSES = [
  'Business Meeting',
  'Job Interview',
  'Delivery',
  'Maintenance',
  'Client Visit',
  'Vendor Meeting',
  'Site Inspection',
  'Training Session',
  'Contract Signing',
  'Consultation',
]

const OPERATORS = [
  'Front Desk 1',
  'Front Desk 2',
  'Security Post A',
  'Lobby Kiosk',
]

function randomStatus(): VisitorStatus {
  return faker.helpers.weightedArrayElement<VisitorStatus>([
    { value: 'checked-out', weight: 5 },
    { value: 'checked-in', weight: 3 },
    { value: 'approved', weight: 2 },
    { value: 'pending', weight: 2 },
    { value: 'rejected', weight: 1 },
  ])
}

function makeVisitor(
  index: number,
  employees: ReturnType<typeof getEmployees>,
): Visitor {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const host = faker.helpers.arrayElement(employees)
  const status = randomStatus()
  const createdDate = faker.date.recent({ days: 45 })

  const hasCheckIn = status === 'checked-in' || status === 'checked-out'
  const hasCheckOut = status === 'checked-out'

  const checkInTime = hasCheckIn
    ? faker.date.soon({ days: 1, refDate: createdDate }).toISOString()
    : null
  const checkOutTime =
    hasCheckOut && checkInTime
      ? faker.date
          .soon({ days: 1, refDate: new Date(checkInTime) })
          .toISOString()
      : null

  return {
    id: faker.string.uuid(),
    visitorId: `VIS-${String(index + 1).padStart(5, '0')}`,
    fullName: `${firstName} ${lastName}`,
    company: faker.company.name(),
    phone: faker.phone.number({ style: 'international' }),
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    identityNumber: faker.string.numeric(16),
    avatarSeed: `${firstName}${lastName}${index}`,
    purpose: faker.helpers.arrayElement(PURPOSES),
    hostEmployeeId: host.id,
    hostEmployeeName: host.name,
    department: host.department,
    vehicleNumber: faker.datatype.boolean({ probability: 0.4 })
      ? faker.vehicle.vrm()
      : null,
    visitorType: faker.helpers.weightedArrayElement<VisitorType>([
      { value: 'guest', weight: 5 },
      { value: 'contractor', weight: 2 },
      { value: 'vendor', weight: 2 },
      { value: 'interview', weight: 2 },
      { value: 'vip', weight: 1 },
    ]),
    status,
    checkInTime,
    checkOutTime,
    operator: hasCheckIn ? faker.helpers.arrayElement(OPERATORS) : null,
    badgeReturned: hasCheckOut
      ? faker.datatype.boolean({ probability: 0.9 })
      : null,
    remarks:
      hasCheckOut && faker.datatype.boolean({ probability: 0.2 })
        ? faker.lorem.sentence()
        : null,
    createdDate: createdDate.toISOString(),
  }
}

export function generateVisitors(count: number): Visitor[] {
  faker.seed(1337)
  const employees = getEmployees()
  return Array.from({ length: count }, (_, index) =>
    makeVisitor(index, employees),
  )
}

let cachedVisitors: Visitor[] | null = null

export function getVisitors(): Visitor[] {
  if (!cachedVisitors) {
    cachedVisitors = generateVisitors(200)
  }
  return cachedVisitors
}

export { PURPOSES }
