import { useIMask } from 'react-imask'
import { MaskedTextInputProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { TextInput } from '../TextInput'
import { maskPresets } from './mask'
import { useMemo, useCallback } from 'react'
import { TypeGuards } from '@codeleap/types'

export * from './types'

export const MaskedTextInput = (props: MaskedTextInputProps) => {
  const {
    maskType,
    maskOptions: customMaskOptions,
    onAccept,
    onComplete,
    unmask = false,
    onValueChange,
    value,
    ...textInputProps
  } = props

  const maskOptions = useMemo(() => {
    const preset = maskType ? maskPresets[maskType] : {}
    
    return {
      ...preset,
      ...customMaskOptions,
      unmask,
    }
  }, [maskType, customMaskOptions, unmask])

  const handleAccept = useCallback((value: string, maskRef: any, e?: InputEvent) => {
    onAccept?.(value, maskRef, e)
    onValueChange?.(value)
  }, [onAccept, onValueChange])

  const { ref: maskRef } = useIMask(maskOptions as any, {
    onAccept: handleAccept,
    onComplete,
  })

  const placeholder = textInputProps?.placeholder ?? (TypeGuards.isString(maskOptions?.mask) ? maskOptions?.mask : undefined)

  return (
    <TextInput
      {...textInputProps}
      placeholder={placeholder}
      ref={maskRef as any}
      value={value}
      onValueChange={onValueChange}
    />
  )
}

MaskedTextInput.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return MaskedTextInput as (props: StyledComponentProps<MaskedTextInputProps, typeof styles>) => IJSX
}
