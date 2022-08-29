import * as FormTypes from './types'
import { usePartialState, deepGet, deepSet, deepMerge, TypeGuards } from '../../utils'
import { FunctionType } from '../../types'
import { useCodeleapContext } from '../../styles/StyleProvider'
import { createRef, useCallback, useRef } from 'react'
import { toMultipart } from '../Fetch/utils'

export * as FormTypes from './types'

const SCOPE = 'useForm'

const shouldLog = (
  x: FormTypes.FormStep,
  config: FormTypes.UseFormConfig<any>,
) => {
  return (config.log || []).includes(x)
}

export function useForm<
  Form extends FormTypes.CreateFormReturn<any>,
  FieldPaths extends FormTypes.PathsWithValues<
    FormTypes.FlattenFields<Form['config']>
  >,
  Values extends FormTypes.MapValues<Form['config']> = FormTypes.MapValues<
    Form['config']
  >
>(form: Form, config: FormTypes.UseFormConfig<Values>) {

  const getInitialState = useCallback(() => {
    return deepMerge(form.defaultValue, config.initialState || {}) as Values
  }, [form.defaultValue, config.initialState])

  const getInitialErrors = useCallback(() => {
    const errors = Object.keys(form.staticFieldProps).map((key) => [key, ''])

    return Object.fromEntries(errors)
  }, [form.staticFieldProps])

  const [formValues, setFormValues] = usePartialState<Values>(getInitialState)
  const { logger, Theme } = useCodeleapContext()
  const [fieldErrors, setFieldErrors] = usePartialState(getInitialErrors)
  // @ts-ignore
  function setFieldValue(...args: FieldPaths) {
    // @ts-ignore
    const transform = form?.staticFieldProps[args[0]]?.transformer || (x => x)
    // @ts-ignore
    const val = deepSet([args[0], transform(args[1])])

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

  function validateMultiple<T extends readonly FieldPaths[0][]>(fields: T, set = false) {
    // @ts-ignore
    const results = fields.map((field) => [field, validateField(field, set)])

    const overallValid = results.every(([, result]) => result.valid)

    const fieldResults = Object.fromEntries(results) as Record<T[number], ReturnType<FormTypes.ValidatorFunction>>

    return {
      valid: overallValid,
      results: fieldResults,
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

  const inputRefs = useRef([])

  function focus(idx:number) {
    // if (!(idx < inputRefs.current.length)) return
    const nextRef = inputRefs?.current?.[idx]?.current

    if (nextRef?.focus) {
      nextRef.focus?.()
    }
  }

  const registeredFields = useRef([])

  function register(field: FieldPaths[0]) {
    const nFields = registeredFields.current.length
    // @ts-ignore
    const { changeEventName, validate, type, ...staticProps } =
      form.staticFieldProps[field as string]

    const dynamicProps: any = {
      value: deepGet(field, formValues),
    }

    if (type === 'number') {
      dynamicProps.value = Number.isNaN(dynamicProps.value) ? '' : String(dynamicProps.value)
      if (Theme.IsBrowser) {
        dynamicProps.type = 'number'
      } else {
        dynamicProps.keyboardType = 'numeric'
      }
    }

    if (changeEventName) {
      dynamicProps[changeEventName] = (value) => {
        if (type === 'number') {
          value = Number(value)
          if (typeof staticProps.precision !== 'undefined') {
            value = Number(value.toFixed(staticProps.precision))
          }
        } else if (type === 'file') {
          value = TypeGuards.isArray(value) && !!value.length ? value[0] : null
        }
        if (config.validateOn === 'change') {
          validateField(field, true, value)
        }
        // @ts-ignore
        setFieldValue(field, value)
      }
    }

    if (type === 'text') {
      if (!Theme.IsBrowser) {
        dynamicProps.returnKeyType = 'next'
      }
      const nRegisteredTextRefs = inputRefs.current.length
      const thisRefIdx = nRegisteredTextRefs
      if (form.numberOfTextFields > nRegisteredTextRefs) {
        inputRefs.current.push(createRef())
      }

      dynamicProps.ref = inputRefs.current[thisRefIdx]

      dynamicProps.onSubmitEditing = () => {
        const nextRef = thisRefIdx + 1
        if (inputRefs.current.length <= nextRef) return
        focus(thisRefIdx + 1)
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
    // if(!)
    registeredFields.current.push(type)
    return {
      ...staticProps,
      ...dynamicProps,
    }
  }

  function getTransformedValue(): Values {
    let out = {}
    switch (config.output) {
      case 'multipart':
        let shouldSetNewFileValue = true
        const multipartData = Object.entries(formValues).reduce((acc, [key, value]) => {
          let newValue = { ...acc }

          if (form.staticFieldProps[key]?.type === 'file') {
            if (shouldSetNewFileValue) {
              newValue = {
                ...newValue,
                files: (Theme.IsBrowser ? value?.[0]?.file : value?.[0]?.preview) || null,
              }
              shouldSetNewFileValue = false
            }
          } else {
            newValue = {
              ...newValue,
              data: {
                ...newValue.data,
                [key]: value,
              },
            }
          }
          return newValue
        }, { files: null, data: {}})

        out = toMultipart({
          multipart: true,
          data: multipartData,
        })
        break
      default:
        out = formValues
        break
    }

    return out as any
  }

  async function onSubmit(cb: FunctionType<[Values], any>, e?: any) {
    if (e?.preventDefault) e.preventDefault()

    if (config.validateOn === 'submit') {
      const valid = validateAll(true)
      if (!valid) return
    }

    await cb(getTransformedValue())
  }

  function reset(args?: ('values'|'errors')[]) {
    const resetStates = args || ['values', 'errors']
    if (resetStates.includes('values')) {
      setFormValues(getInitialState())
    }
    if (resetStates.includes('errors')) {
      setFieldErrors(getInitialErrors())
    }
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
    reset,
    validateMultiple,
    isValid: validateAll(),
  }
}
