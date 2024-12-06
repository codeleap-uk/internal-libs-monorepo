import * as FormTypes from './types'
import { TypeGuards } from '@codeleap/types'
import { deepGet, deepSet, deepMerge } from '@codeleap/utils'
import { usePartialState, useMemo } from '@codeleap/hooks'
import { FunctionType } from '../../types'
import { createRef, useCallback, useRef } from 'react'
import { useI18N } from '@codeleap/i18n'

export * as FormTypes from './types'

function testBrowser() {
  try {
    // @ts-ignore
    return typeof localStorage !== 'undefined'
  } catch {
    return false
  }
}

const isBrowser = testBrowser()

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
>(formParam: (() => Form) | Form, formConfig: FormTypes.UseFormConfig<Values> = {}) {

  const i18n = useI18N()

  const form = useMemo(() => {
    return TypeGuards.isFunction(formParam) ? formParam() : formParam
  }, [formParam, i18n?.locale])

  const config:FormTypes.UseFormConfig<Values> = {
    validateOn: 'change',
    ...formConfig,
  }

  const getInitialState = useCallback(() => {
    return deepMerge(form.defaultValue, config.initialState || {}) as Values
  }, [form.defaultValue, config.initialState])

  const getInitialErrors = useCallback(() => {
    const errors = Object.keys(form.staticFieldProps).map((key) => [key, ''])

    return Object.fromEntries(errors)
  }, [form.staticFieldProps])

  const [formValues, setFormValues] = usePartialState<Values>(getInitialState)
  const [fieldErrors, setFieldErrors] = usePartialState(getInitialErrors)
  // @ts-ignore
  function setFieldValue(...args: FieldPaths) {
    // @ts-ignore
    const transform = form?.staticFieldProps[args[0]]?.transformer || (x => x)
    // @ts-ignore
    const val = deepSet([args[0], transform(args[1])])

    if (shouldLog('setValue', config) || shouldLog(`setValue.${args[0]}`, config)) {
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
      const value = val !== undefined ? val : deepGet(field, formValues)
      // @ts-ignore
      const result = validate(
        value,
        formValues,
      )
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
    if (nextRef?.focus && nextRef?.isTextInput) {
      nextRef.focus?.()
    }
  }

  const registeredFields = useRef([])
  let registeredTextRefsOnThisRender = 0
  function register(field: FieldPaths[0], transformProps = (p) => p) {
    const nFields = registeredFields.current.length

    const { changeEventName, validate, type, componentProps, ...staticProps } =
    // @ts-ignore
    form.staticFieldProps[field as string]

    const dynamicProps: any = {
      value: deepGet(field, formValues),
    }

    if (type === 'number') {
      dynamicProps.value = Number.isNaN(dynamicProps.value) ? '' : String(dynamicProps.value)
      if (isBrowser) {
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

        // @ts-ignore
        setFieldValue(field, value)
      }
    }

    if (type === 'text' || type === 'number') {
      if (!isBrowser && !staticProps.multiline) {
        dynamicProps.returnKeyType = 'next'
      }

      const thisRefIdx = registeredTextRefsOnThisRender

      if (thisRefIdx >= inputRefs.current.length) {
        inputRefs.current.push(createRef())
      }
      dynamicProps.ref = inputRefs.current[thisRefIdx]
      registeredTextRefsOnThisRender++
      if (!isBrowser && !staticProps.multiline) {
        dynamicProps.onSubmitEditing = () => {
          const nextRef = thisRefIdx + 1
          if (inputRefs.current.length <= nextRef) return
          focus(nextRef)
        }
      }

    }

    registeredFields.current.push(type)

    const resolvedProps = {
      ...staticProps,
      ...dynamicProps,
      validate: (v) => {
        return validateField(field, true, v)
      },
    }

    const componentPropsConfig = TypeGuards.isFunction(componentProps) ? componentProps(resolvedProps) : (componentProps || {})

    const t = transformProps({
      ...resolvedProps,
      ...componentProps,
      ...componentPropsConfig,
    })

    return t
  }

  function getTransformedValue(): Values {
    return formValues as Values
  }

  async function onSubmit(cb: FunctionType<[Values], any>, e?: any) {
    if (e?.preventDefault) e.preventDefault()

    await cb(getTransformedValue())
  }

  function reset(states?: ('values'|'errors')[]) {
    const resetStates = states || ['values', 'errors']
    if (resetStates.includes('values')) {
      setFormValues(getInitialState())
    }
    if (resetStates.includes('errors')) {
      setFieldErrors(getInitialErrors())
    }
  }

  const setters = {} as FormTypes.FormSetters<Values>

  for (const fieldName in formValues) {
    // @ts-ignore
    setters[fieldName] = (value) => setFieldValue(fieldName, value)
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
    setters,
  }
}
