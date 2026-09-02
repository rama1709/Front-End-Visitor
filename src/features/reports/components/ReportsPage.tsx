import { useMemo } from 'react'
import { DownloadIcon, FileSpreadsheetIcon, FileTextIcon } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { toast } from 'sonner'

import { useReportsData } from '../hooks/useReportsData'
import type { ChartConfig } from '#/shared/components/ui/chart'
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
import { Button } from '#/shared/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/shared/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/shared/components/ui/dropdown-menu'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '#/shared/components/ui/chart'
import { exportToCsv } from '#/shared/lib/export-csv'
import { useSearchStore } from '#/shared/hooks/useSearchStore'

const chartConfig: ChartConfig = {
  count: { label: 'Visitors', color: 'var(--chart-1)' },
}

function TrendChart({ data }: { data: { label: string; count: number }[] }) {
  return (
    <ChartContainer config={chartConfig} className="h-64 w-full">
      <BarChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

export function ReportsPage() {
  const data = useReportsData()
  const searchQuery = useSearchStore((state) => state.query)

  const filteredFrequentVisitors = useMemo(() => {
    const term = searchQuery.trim().toLowerCase()
    if (!term) return data.frequentVisitors
    return data.frequentVisitors.filter((row) =>
      [row.name, row.company].some((field) =>
        field?.toLowerCase().includes(term),
      ),
    )
  }, [data.frequentVisitors, searchQuery])

  const filteredByDepartment = useMemo(() => {
    const term = searchQuery.trim().toLowerCase()
    if (!term) return data.byDepartment
    return data.byDepartment.filter((row) =>
      row.department.toLowerCase().includes(term),
    )
  }, [data.byDepartment, searchQuery])

  const handleExport = (format: 'PDF' | 'Excel' | 'CSV') => {
    if (format === 'CSV') {
      exportToCsv('visitor-report', data.frequentVisitors)
      toast.success('Report exported as CSV')
    } else {
      toast.success(`Report export as ${format} started (demo)`)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports"
        description="Analyze visitor trends across time, departments, and types."
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <DownloadIcon />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('PDF')}>
                <FileTextIcon /> Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('Excel')}>
                <FileSpreadsheetIcon /> Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('CSV')}>
                <FileTextIcon /> Export as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Visitors (All Time)</CardDescription>
            <CardTitle className="text-2xl">
              {data.totalVisitors.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Visitors This Month</CardDescription>
            <CardTitle className="text-2xl">
              {data.thisMonthTotal.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="department">Department</TabsTrigger>
          <TabsTrigger value="type">Visitor Type</TabsTrigger>
          <TabsTrigger value="frequent">Frequent Visitors</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Daily Visitor Report</CardTitle>
              <CardDescription>Last 14 days</CardDescription>
            </CardHeader>
            <CardContent>
              <TrendChart data={data.daily} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Visitor Report</CardTitle>
              <CardDescription>Last 8 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <TrendChart data={data.weekly} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Visitor Report</CardTitle>
              <CardDescription>Last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <TrendChart data={data.monthly} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="department">
          <Card>
            <CardHeader>
              <CardTitle>Visitors by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Visitors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredByDepartment.map((row) => (
                    <TableRow key={row.department}>
                      <TableCell>{row.department}</TableCell>
                      <TableCell className="text-right font-medium">
                        {row.count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="type">
          <Card>
            <CardHeader>
              <CardTitle>Visitors by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visitor Type</TableHead>
                    <TableHead className="text-right">Visitors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.byType.map((row) => (
                    <TableRow key={row.type}>
                      <TableCell className="capitalize">{row.type}</TableCell>
                      <TableCell className="text-right font-medium">
                        {row.count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frequent">
          <Card>
            <CardHeader>
              <CardTitle>Most Frequent Visitors</CardTitle>
              <CardDescription>Top 10 repeat visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visitor</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead className="text-right">Visits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFrequentVisitors.map((row) => (
                    <TableRow key={`${row.name}-${row.company}`}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.company}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {row.count}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
