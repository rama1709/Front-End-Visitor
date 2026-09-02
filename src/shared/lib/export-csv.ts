export function exportToCsv<T extends object>(filename: string, rows: T[]) {
  if (rows.length === 0) return

  const headers = Object.keys(rows[0]) as (keyof T)[]
  const escape = (value: unknown) => {
    const str = value === null || value === undefined ? '' : String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers.map((header) => escape(row[header])).join(','),
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
