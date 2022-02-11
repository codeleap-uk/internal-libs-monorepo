import * as FormTypes from './types'
import { usePartialState, deepGet, deepSet } from '../../utils'
import { FunctionType } from '../../types'
import { useStyle } from '../../styles/StyleProvider'

export * as FormTypes from './types'

const SCOPE = 'useForm'

const shouldLog = (
  x: FormTypes.FormStep,
  config: FormTypes.UseFormConfig<any>,
) => {
  return (config.log || []).includes(x)
}

// TODO is would be helpful if the form could automatically skip to the next field on pressing return

export function useForm<
  Form extends FormTypes.CreateFormReturn<any>,
  FieldPaths extends FormTypes.PathsWithValues<
    FormTypes.FlattenFields<Form['config']>
  >,
  Values extends FormTypes.MapValues<Form['config']> = FormTypes.MapValues<
    Form['config']
  >
>(form: Form, config: FormTypes.UseFormConfig<Values>) {
  const [formValues, setFormValues] = usePartialState<Values>(
    config.initialState || form.defaultValue,
  )
  const { logger } = useStyle()
  const [fieldErrors, setFieldErrors] = usePartialState(() => {
    const errors = Object.keys(form.staticFieldProps).map((key) => [key, ''])

    return Object.fromEntries(errors)
  })
  // @ts-ignore
  function setFieldValue(...args: FieldPaths) {
    // @ts-ignore
    const val = deepSet(args)

    if (shouldLog('setValue', config)) {
      // @ts-ignore
      logger.log(
        // @ts-ignore
        `Set ${form.name}/${args[0]} to ${String(args[1])}`,
        '',
        SCOPE,
      )
    }
    setFormValues(val)
  }

  function validateField(field: FieldPaths[0], set = false, val?: any) {
    // @ts-ignore
    const { validate } = form.staticFieldProps[field as string]

    if (validate) {
      // @ts-ignore
      const result = validate(
        val !== undefined ? val : deepGet(field, formValues),
        formValues,
      )
      if (shouldLog('validate', config)) {
        logger.log(`Validation for ${form.name} ->`, result, SCOPE)
      }

      if (set) {
        setFieldErrors(() => ({
          [field]: result.valid ? '' : result.message,
        }))
      }

      return result
    }

    return {
      valid: true,
      message: '',
    }
  }

  function validateAll(set = false) {
    const errors = { ...fieldErrors }
    for (const [path] of Object.entries(form.staticFieldProps)) {
      const result = validateField(path)
      errors[path] = result.valid ? '' : result?.message
    }

    if (set) {
      setFieldErrors(errors)
    }
    return Object.values(errors).join('').length === 0
  }

  function register(field: FieldPaths[0]) {
    // @ts-ignore
    const { changeEventName, validate, ...staticProps } =
      form.staticFieldProps[field as string]

    const dynamicProps: any = {
      value: deepGet(field, formValues),
    }

    if (changeEventName) {
      dynamicProps[changeEventName] = (value) => {
        if (config.validateOn === 'change') {
          validateField(field, true, value)
        }
        // @ts-ignore
        setFieldValue(field, value)
      }
    }

    if (validate) {
      switch (config.validateOn) {
        case 'change':
          // dynamicProps.validate = () => validateField(field, true)
          dynamicProps.validate = fieldErrors[field]
          break
        case 'blur':
          dynamicProps.onBlur = () => {
            validateField(field, true)
          }
          dynamicProps.validate = fieldErrors[field]
          break
        case 'submit':
          dynamicProps.validate = fieldErrors[field]
          break
      }
    }

    return {
      ...staticProps,
      ...dynamicProps,
    }
  }

  function getTransformedValue(): Values {
    let out = {}
    switch (config.output) {
      default:
        out = formValues
        break
    }

    return out as Values
  }

  async function onSubmit(cb: FunctionType<[Values], any>, e?: any) {
    if (e?.preventDefault) e.preventDefault()

    if (config.validateOn === 'submit') {
      const valid = validateAll(true)
      if (!valid) return
    }

    await cb(getTransformedValue())
  }

  return {
    setFieldValue,
    values: formValues as Values,
    register,
    validateAll,
    validateField,
    onSubmit,
    fieldErrors,
    getTransformedValue,
    setFormValues,
    isValid: validateAll(),
  }
}
