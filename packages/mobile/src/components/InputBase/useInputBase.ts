import { useRef } from 'react'
import { View, TextInput, StatusBar } from 'react-native'
import { useWrappingScrollable } from '../../modules/scroll'
import { Field, IFieldRef, fields, useField } from '@codeleap/form'
import { AnyRecord } from '@codeleap/types'

export function useInputBase<V,  T extends Field<V, any, any, unknown> = Field<V, any, any, unknown>>(
  field: T,
  defaultField: (options: AnyRecord) => T = fields.text as () => T,
  customState: [V, (value: V) => void] | [] = [],
  params: Partial<IFieldRef<V>> = {}, 
  deps: any[] = []
) {
  const hasState = customState?.length === 2

  const wrapperRef = useRef<View>()

  const innerInputRef = useRef<TextInput>(null)

  const scrollable = useWrappingScrollable()

  const fieldHandle = useField<V, T>(field as T, [
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
        return new Promise((resolve, reject) => {
          wrapperRef.current.measure(
            (x, y, width, height, pageX, pageY) => {
              const target = pageY - StatusBar.currentHeight - 16

              const unsub = scrollable.current.subscribe('onMomentumScrollEnd', e => {
                resolve(null)
                unsub()
              })

              scrollable.current.scrollTo({
                y: target,
                animated: true
              })
            }
          )
        })
      },
      ...params,
    },
    deps
  ] as unknown as Parameters<T['use']>, () => defaultField(hasState ? {
    state: {
      get: () => customState[0],
      set: (val: V) => customState[1](val),
      value: customState[0],
      listen: () => {},
    },
    validate: () => ({ isValid: true })
  } : {}))

  const validation = fieldHandle.validation

  return {
    fieldHandle,
    validation,
    wrapperRef,
    innerInputRef,
    scrollable,
  }
}