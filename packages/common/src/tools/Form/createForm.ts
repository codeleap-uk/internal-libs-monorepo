import { defaultFieldValues } from './constants'
import * as Form from './types'
import * as yup from 'yup'
import { humanizeCamelCase } from '../../utils'
import { changeEventNames } from './constants'

function getDefaultValue(field: Partial<Form.FormField>) {
  switch (field.type) {
    case 'radio':
    case 'select':
      return field.options?.[0]?.value || ''
    default:
      return defaultFieldValues[field.type]
  }
}

function getValidator(validate: Form.Validator<any>): Form.ValidatorFunction {
  if (!validate) return undefined

  if (typeof validate === 'function') {
    return validate
  }

  const yupModel = validate as yup.StringSchema

  return (value) => {
    try {
      yupModel.validateSync(value)
      return { valid: true }
    } catch (e) {
      return { valid: false, message: e?.errors?.join(' ') || '' }
    }
  }
}

function buildInitialFormState<T extends Form.FieldsMap>(
  name: string,
  form: T,
  inside = [],
) {
  const state = {} as Form.MapValues<T>
  let props = {}
  let numberOfTextFields = 0
  for (const [k, value] of Object.entries(form)) {
    const { defaultValue, label, validate, type, ...fieldConfig } = value

    const key = k as keyof Form.MapValues<T>

    const fieldPathParts = [...inside, key]
    const fieldPath = fieldPathParts.join('.')

    let fieldValue = null
    if (type === 'text') numberOfTextFields += 1
    if (type === 'composite') {
      const { props: subFieldProps, state } = buildInitialFormState(
        name,
        value.fields,
        fieldPathParts,
      )
      fieldValue = state

      props = {
        ...props,
        ...subFieldProps,
      }
    } else {
      fieldValue =
        typeof defaultValue !== 'undefined'
          ? defaultValue
          : getDefaultValue(value)
    }

    const fieldProps: any = {
      id: `form-${name}:${fieldPath}`,
      label: label || humanizeCamelCase(k),
      changeEventName: changeEventNames[type],
      type,
      ...fieldConfig,
    }

    delete fieldProps.fields

    if (validate) fieldProps.validate = getValidator(validate)

    props[fieldPath] = fieldProps
    state[key] = fieldValue
  }

  return { state, props, numberOfTextFields }
}

export function createForm<T extends Form.FieldsMap>(
  name: string,
  formArgs: Form.FormConfig<T>,
): Form.CreateFormReturn<T> {
  const { state, props, numberOfTextFields } = buildInitialFormState(name, formArgs)

  return {
    config: formArgs as T,
    defaultValue: state,
    staticFieldProps: props,
    name,
    numberOfTextFields,
  }
}
