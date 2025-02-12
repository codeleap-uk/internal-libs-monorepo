import { useRef } from 'react'
import { View, TextInput, StatusBar } from 'react-native'
import { useWrappingScrollable } from '../../modules/scroll'
import { Field, IFieldRef, fields, useField } from '@codeleap/form'

export function useInputBase(
  field: Field<string|number, any, any>, 
  params: Partial<IFieldRef<string | number>>, 
  deps: any[] = []
) {
  const wrapperRef = useRef<View>()

  const innerInputRef = useRef<TextInput>(null)

  const scrollable = useWrappingScrollable()

  const fieldHandle = useField(field, [
    {
      blur() {
        innerInputRef.current.blur()
      },
      focus() {
        innerInputRef.current.focus()
      },
      getValue() {
        return innerInputRef.current.state as string
      },
      scrollIntoView() {
        return new Promise((resolve, reject) => {
          wrapperRef.current.measure(
            (x, y, width, height, pageX, pageY) => {
              const target = pageY - StatusBar.currentHeight - 16

              const unsub = scrollable.current.subscribe('onMomentumScrollEnd', e => {
                const diff = Math.abs(e.nativeEvent.contentOffset.y - target)

                resolve()
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
  ], fields.text)

  const validation = fieldHandle.validation

  return {
    fieldHandle,
    validation,
    wrapperRef,
    innerInputRef,
    scrollable,
  }
}