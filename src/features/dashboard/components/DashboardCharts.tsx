import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
} from 'recharts'

import type { ChartConfig } from '#/shared/components/ui/chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '#/shared/components/ui/chart'

const lineConfig: ChartConfig = {
  visitors: { label: 'Visitors', color: 'var(--chart-1)' },
}

const barConfig: ChartConfig = {
  count: { label: 'Visitors', color: 'var(--chart-2)' },
}

const PIE_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--muted-foreground)',
]

export function VisitorsPerDayChart({
  data,
}: {
  data: { day: string; visitors: number }[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors per Day</CardTitle>
        <CardDescription>Last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={lineConfig} className="h-56 w-full">
          <LineChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="visitors"
              stroke="var(--color-visitors)"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function VisitorsByDepartmentChart({
  data,
}: {
  data: { department: string; count: number }[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors by Department</CardTitle>
        <CardDescription>Top hosting departments</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={barConfig} className="h-56 w-full">
          <BarChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="department"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={56}
              fontSize={11}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function VisitorsByPurposeChart({
  data,
}: {
  data: { purpose: string; count: number }[]
}) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: PIE_COLORS[index % PIE_COLORS.length],
  }))

  const purposeConfig: ChartConfig = data.reduce((acc, item, index) => {
    acc[item.purpose] = {
      label: item.purpose,
      color: PIE_COLORS[index % PIE_COLORS.length],
    }
    return acc
  }, {} as ChartConfig)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors by Purpose</CardTitle>
        <CardDescription>Distribution of visit reasons</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={purposeConfig}
          className="mx-auto h-56 w-full max-w-xs"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="purpose" />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="purpose"
              innerRadius={45}
              outerRadius={80}
              strokeWidth={2}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
