import { faker } from '@faker-js/faker'

import type { Employee, EmployeeStatus } from '../types'

export const DEPARTMENTS = [
  'Human Resources',
  'Finance',
  'Engineering',
  'Sales',
  'Marketing',
  'Operations',
  'Legal',
  'IT Support',
  'Customer Service',
  'Procurement',
] as const

const POSITIONS = [
  'Manager',
  'Senior Associate',
  'Coordinator',
  'Director',
  'Specialist',
  'Analyst',
  'Executive',
  'Supervisor',
  'Team Lead',
  'Officer',
]

function makeEmployee(index: number): Employee {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  const status = faker.helpers.weightedArrayElement<EmployeeStatus>([
    { value: 'active', weight: 8 },
    { value: 'on-leave', weight: 1 },
    { value: 'inactive', weight: 1 },
  ])

  return {
    id: faker.string.uuid(),
    employeeId: `EMP-${String(index + 1).padStart(4, '0')}`,
    name: `${firstName} ${lastName}`,
    department: faker.helpers.arrayElement(DEPARTMENTS),
    position: faker.helpers.arrayElement(POSITIONS),
    phone: faker.phone.number({ style: 'international' }),
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    avatarSeed: `${firstName}${lastName}${index}`,
    status,
    joinedDate: faker.date.past({ years: 6 }).toISOString(),
  }
}

export function generateEmployees(count: number): Employee[] {
  faker.seed(4200)
  return Array.from({ length: count }, (_, index) => makeEmployee(index))
}

let cachedEmployees: Employee[] | null = null

export function getEmployees(): Employee[] {
  if (!cachedEmployees) {
    cachedEmployees = generateEmployees(50)
  }
  return cachedEmployees
}
