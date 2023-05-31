
import React, { useRef } from 'react'
import { FormTypes, useValidate, useState, TypeGuards } from '@codeleap/common'
import _Select, { components, MenuListProps } from 'react-select'
import Async  from 'react-select/async'
import { useSelectStyles } from './styles'
import { SelectProps, TCustomOption } from './types'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { Button } from '../Button'

export * from './styles'
export * from './types'

const CustomOption = (props: TCustomOption) => {
  const { isSelected, optionsStyles, label } = props

  const styles = optionsStyles({ isSelected })

  return (
    <components.Option {...props}>
      <Button
        text={label}
        // @ts-ignore
        rightIcon={isSelected && 'checkmark'} 
        styles={{ wrapper: styles?.item, rightIcon: styles?.icon, text: styles?.text }} 
      />
    </components.Option>
  )
}

const CustomMenu = (props: MenuListProps & { Footer: () => JSX.Element }) => {
  const { Footer, children } = props

  return <>
    <components.MenuList {...props}>
      {children}
      {!!Footer && <Footer />}
    </components.MenuList>
  </>
}

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
    Option = CustomOption,
    Footer = null,
    ...otherProps
  } = selectProps

  const [selectedOption, setSelectedOption] = useState(value)

  const [_isFocused, setIsFocused] = useState(false)

  const isFocused = _isFocused || focused

  const validation = useValidate(value, validate)

  const isDisabled = !!inputBaseProps.disabled

  const hasError = !validation.isValid || _error
  const errorMessage = validation.message || _error

  const { reactSelectStyles, variantStyles, optionsStyles } = useSelectStyles(props, {
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
        components={{
          ...otherProps.components,
          MenuList: props => <CustomMenu {...props} Footer={Footer} />,
          Option: props => <Option {...props} focused={focused} error={!!hasError} disabled={isDisabled} optionsStyles={optionsStyles} />,
        }}
      />
    </InputBase>
  )
}
