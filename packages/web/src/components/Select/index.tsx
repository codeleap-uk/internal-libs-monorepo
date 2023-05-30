
import React, { useRef } from 'react'
import { FormTypes, useValidate, useState, TypeGuards } from '@codeleap/common'
import _Select from 'react-select'
import Async  from 'react-select/async'
import { useSelectStyles } from './styles'
import { SelectProps } from './types'
import { InputBase, selectInputBaseProps } from '../InputBase'

export * from './styles'
export * from './types'

export const Select = <T extends string|number = string, Multi extends boolean = false>(props: SelectProps<T, Multi>) => {
  type Option = FormTypes.Option<T>

  const innerInputRef = useRef<any>(null)
  const innerWrapperRef = useRef(null)

  const {
    inputBaseProps,
    others: selectProps,
  } = selectInputBaseProps(props)

  const {
    variants, 
    validate, 
    styles, 
    debugName,
    onValueChange, 
    options, 
    value,
    loadOptions,
    multiple,
    focused,
    _error,
    ...otherProps
  } = selectProps

  const [selectedOption, setSelectedOption] = useState(value)

  const [_isFocused, setIsFocused] = useState(false)

  const isFocused = _isFocused || focused

  const validation = useValidate(value, validate)

  const isDisabled = !!inputBaseProps.disabled

  const hasError = !validation.isValid || _error
  const errorMessage = validation.message || _error

  const { reactSelectStyles, variantStyles } = useSelectStyles(props, {
    error: !!hasError,
    focused: isFocused,
    disabled: isDisabled,
  })

  const onLoadOptions = (inputValue, cb) => {
    if(!loadOptions) return []
    
    loadOptions(inputValue).then((options) => {
      cb(options)
    })
  }

  const handleChange = (opt: Multi extends true ? Option[] : Option)   => {
    if(TypeGuards.isArray(opt)){
      // @ts-ignore
      setSelectedOption(opt)
      // @ts-ignore
      onValueChange?.(opt.map((o) => o.value))
    }else{
      // @ts-ignore
      setSelectedOption(opt)
      // @ts-ignore
      onValueChange?.(opt.value)
    }
  }

  const handleBlur: SelectProps['onBlur'] = React.useCallback((e) => {
    validation?.onInputBlurred()
    setIsFocused(false)
    props?.onBlur?.(e)
  }, [validation?.onInputBlurred, props?.onBlur])

  const handleFocus: SelectProps['onFocus'] = React.useCallback((e) => {
    validation?.onInputFocused()
    setIsFocused(true)
    props?.onFocus?.(e)
  }, [validation?.onInputFocused, props?.onFocus])

  const SelectComponent = !!loadOptions ? Async : _Select

  return (
    <InputBase
      {...inputBaseProps}
      debugName={debugName}
      error={hasError ? errorMessage : null}
      focused={isFocused}
      styles={{
        ...variantStyles,
        innerWrapper: [
          variantStyles.innerWrapper,
        ],
      }}
      innerWrapperProps={{
        ...(inputBaseProps.innerWrapperProps  || {}),
        onClick: () => {
          innerInputRef.current?.focus?.()
        },
      }}
      innerWrapperRef={innerWrapperRef}
    >
      <SelectComponent
        {...otherProps}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={handleChange}
        styles={reactSelectStyles}
        value={selectedOption as any}
        isMulti={multiple}
        options={options}
        loadOptions={onLoadOptions as any}
        ref={innerInputRef}
        openMenuOnFocus={true}
        menuPortalTarget={innerWrapperRef.current}
      />
    </InputBase>
  )
}
