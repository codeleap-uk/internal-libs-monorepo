
import React, { useRef } from 'react'
import { FormTypes, useValidate, useState, TypeGuards } from '@codeleap/common'
import _Select, { components, MenuListProps, MultiValueProps, NoticeProps } from 'react-select'
import Async  from 'react-select/async'
import { useSelectStyles } from './styles'
import { PlaceholderProps, SelectProps, TCustomOption } from './types'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { Button } from '../Button'
import { Text } from '../Text'
import { View } from '../View'
import { ActivityIndicator } from '../ActivityIndicator'
import { CSSInterpolation } from '@emotion/css'

export * from './styles'
export * from './types'

const DefaultOption = (props: TCustomOption) => {
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

const DefaultPlaceholder = (props: PlaceholderProps) => {
  const { text, defaultStyles } = props

  return (
    <View css={[defaultStyles.wrapper]}>
      <Text text={text} css={[defaultStyles.text]} />
    </View>
  )
}

const LoadingIndicator = (props: NoticeProps & { defaultStyles: { wrapper: CSSInterpolation } }) => {
  const { defaultStyles } = props
  
  return (
    <View css={[defaultStyles.wrapper]}>
      <ActivityIndicator />
    </View>
  )
}

const separator = ', '

const getMultiValue = (values: { label: string }[]) => {
  let value = ''
  const hasMulti = values?.length > 1

  values.forEach(({ label }) => {
    const txt = hasMulti ? label + separator : label

    value = value + txt
  })

  return value
}

const CustomMultiValue = (props: MultiValueProps & { defaultStyles: { text: CSSInterpolation } }) => {
  const { selectProps, index, defaultStyles } = props

  if (index !== 0 || selectProps.inputValue.length > 0) return null

  const text = getMultiValue(selectProps?.value)

  return <Text text={text} css={[defaultStyles.text]} />
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
    Option = DefaultOption,
    Footer = null,
    Placeholder = DefaultPlaceholder,
    noItemsText = 'No items',
    ...otherProps
  } = selectProps

  const [selectedOption, setSelectedOption] = useState(value)

  const [_isFocused, setIsFocused] = useState(false)

  const isFocused = _isFocused || focused

  const validation = useValidate(value, validate)

  const isDisabled = !!inputBaseProps.disabled

  const hasError = !validation.isValid || _error
  const errorMessage = validation.message || _error

  const { 
    reactSelectStyles, 
    variantStyles, 
    optionsStyles,
    placeholderStyles,
    loadingStyles,
    inputMultiValueStyles,
  } = useSelectStyles(props, {
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

  const handleChange = (opt: Multi extends true ? Option[] : Option) => {
    if(TypeGuards.isArray(opt)){
      // @ts-ignore
      setSelectedOption(opt)
      // @ts-ignore
      onValueChange?.(opt?.map((o) => o?.value))
    }else{
      // @ts-ignore
      setSelectedOption(opt)
      // @ts-ignore
      onValueChange?.(opt?.value)
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

  const componentProps = {
    focused: isFocused, 
    error: !!hasError, 
    disabled: isDisabled,
    variantStyles,
  }

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
        closeMenuOnSelect={false}
        menuPortalTarget={innerWrapperRef.current}
        hideSelectedOptions={false}
        isClearable
        components={{
          LoadingIndicator: () => null,
          LoadingMessage: props => <LoadingIndicator {...props} defaultStyles={loadingStyles} />,
          ...otherProps.components,
          MultiValueRemove: () => null,
          NoOptionsMessage: props => <Placeholder {...props} {...componentProps} text={noItemsText} defaultStyles={placeholderStyles} />,
          MenuList: props => <CustomMenu {...props} Footer={Footer} />,
          Option: props => <Option {...props} {...componentProps} optionsStyles={optionsStyles} />,
          MultiValue: props => <CustomMultiValue {...props} defaultStyles={inputMultiValueStyles} />,
        }}
      />
    </InputBase>
  )
}
