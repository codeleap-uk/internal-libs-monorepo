import { useMemo, useRef } from 'react'
import { View, TextInput } from 'react-native'
import { useWrappingScrollable } from '../../modules/scroll'
import { Field, IFieldRef, fields, useField } from '@codeleap/form'
import { AnyRecord, TypeGuards } from '@codeleap/types'

export function useInputBase<V,  T extends Field<V, any, any, unknown> = Field<V, any, any, unknown>>(
  field: T,
  defaultField: (options?: AnyRecord) => T = fields.text as () => T,
  internalState: { value: V; onValueChange: (value: V) => void },
  params: Partial<IFieldRef<V>> = {}, 
  deps: any[] = []
) {
  const { value, onValueChange } = internalState

  const hasInternalState = useMemo(() => TypeGuards.isFunction(onValueChange) && !TypeGuards.isNil(value), [])

  const wrapperRef = useRef<View>(null)

  const innerInputRef = useRef<TextInput>(null)

  const scrollable = useWrappingScrollable()

  const fieldHandle = hasInternalState ? {} as Partial<ReturnType<typeof useField>> : useField<V, T>(field as T, [
    {
      blur() {
        innerInputRef.current.blur()
      },
      focus() {
        innerInputRef.current.focus()
      },
      getValue() {
        return innerInputRef.current.state as V
      },
      scrollIntoView() {
        return field.measurePosition(wrapperRef).then((measureResult) => {
          field.scrollTo(scrollable, measureResult)
        })
      },
      ...params,
    },
    deps
  ] as unknown as Parameters<T['use']>, defaultField)

  const validation = fieldHandle?.validation

  return {
    fieldHandle,
    validation,
    wrapperRef,
    innerInputRef,
    scrollable,
    inputValue: (hasInternalState ? value : fieldHandle?.value) as V,
    onInputValueChange: hasInternalState ? onValueChange : fieldHandle?.setValue,
  }
}