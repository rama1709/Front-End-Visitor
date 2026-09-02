import type * as React from 'react'

import type { ComboboxOption } from '#/shared/components/ui/combobox'
import { useFieldContext } from '#/shared/hooks/formContext'
import { Input } from '#/shared/components/ui/input'
import { Textarea } from '#/shared/components/ui/textarea'
import { Label } from '#/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/shared/components/ui/select'
import { Combobox } from '#/shared/components/ui/combobox'
import { cn } from '#/shared/lib/utils'

function FieldError() {
  const field = useFieldContext<unknown>()
  const errors = field.state.meta.errors

  if (!field.state.meta.isTouched || errors.length === 0) return null

  return (
    <p className="text-xs text-destructive">
      {errors
        .map((error) => (typeof error === 'string' ? error : error?.message))
        .join(', ')}
    </p>
  )
}

export function TextField({
  label,
  placeholder,
  type = 'text',
  description,
  className,
}: {
  label: string
  placeholder?: string
  type?: string
  description?: string
  className?: string
}) {
  const field = useFieldContext<string>()

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        placeholder={placeholder}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={
          field.state.meta.isTouched && field.state.meta.errors.length > 0
        }
      />
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      <FieldError />
    </div>
  )
}

export function TextAreaField({
  label,
  placeholder,
  rows = 3,
  className,
}: {
  label: string
  placeholder?: string
  rows?: number
  className?: string
}) {
  const field = useFieldContext<string>()

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={field.name}>{label}</Label>
      <Textarea
        id={field.name}
        name={field.name}
        rows={rows}
        placeholder={placeholder}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
      />
      <FieldError />
    </div>
  )
}

export function SelectField({
  label,
  options,
  placeholder = 'Select an option',
  className,
}: {
  label: string
  options: { label: string; value: string }[]
  placeholder?: string
  className?: string
}) {
  const field = useFieldContext<string>()

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={field.name}>{label}</Label>
      <Select
        value={field.state.value || undefined}
        onValueChange={(value) => field.handleChange(value)}
      >
        <SelectTrigger
          id={field.name}
          className="w-full"
          onBlur={field.handleBlur}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError />
    </div>
  )
}

export function ComboboxField({
  label,
  options,
  placeholder,
  searchPlaceholder,
  className,
}: {
  label: string
  options: ComboboxOption[]
  placeholder?: string
  searchPlaceholder?: string
  className?: string
}) {
  const field = useFieldContext<string>()

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={field.name}>{label}</Label>
      <Combobox
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
        options={options}
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
      />
      <FieldError />
    </div>
  )
}

export function SubmitButton({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={className}>{children}</div>
}
