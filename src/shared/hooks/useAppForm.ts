import { createFormHook } from '@tanstack/react-form'

import { fieldContext, formContext } from '#/shared/hooks/formContext'
import {
  ComboboxField,
  SelectField,
  TextAreaField,
  TextField,
} from '#/shared/components/form/fields'

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextAreaField,
    SelectField,
    ComboboxField,
  },
  formComponents: {},
})
