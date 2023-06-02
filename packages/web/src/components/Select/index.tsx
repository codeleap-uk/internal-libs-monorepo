
import React, { useRef, forwardRef, useImperativeHandle } from 'react'
import { FormTypes, useValidate, useState, TypeGuards, onUpdate } from '@codeleap/common'
import _Select, { components, MenuListProps, MenuProps, MultiValueProps, NoticeProps } from 'react-select'
import Async from 'react-select/async'
import { useSelectStyles } from './styles'
import { LoadingIndicatorProps, PlaceholderProps, SelectProps, TCustomOption } from './types'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { Button } from '../Button'
import { Text } from '../Text'
import { View } from '../View'
import { ActivityIndicator } from '../ActivityIndicator'
import { CSSInterpolation } from '@emotion/css'
import { Icon } from '../Icon'

export * from './styles'
export * from './types'

const DefaultOption = (props: TCustomOption & { component: (props: TCustomOption) => JSX.Element }) => {
  const { isSelected, optionsStyles, label, selectedIcon, component = null, itemProps = {}, isFocused } = props

  const styles = optionsStyles({ isSelected, isFocused })

  let _Component = null

  if (TypeGuards.isNil(component)) {
    _Component = () => (
      <Button
        text={label}
        // @ts-ignore
        rightIcon={isSelected && selectedIcon}
        styles={{ wrapper: styles?.item, rightIcon: styles?.icon, text: styles?.text }}
        {...itemProps}
      />
    )
  } else {
    _Component = component
  }

  return (
    <components.Option {...props}>
      <_Component {...props} />
    </components.Option>
  )
}

const CustomMenu = (props: MenuProps & { Footer: () => JSX.Element }) => {
  const { Footer, children } = props

  return <>
    <components.Menu {...props}>
      {children}
      {!!Footer && <Footer />}
    </components.Menu>
  </>
}

const CustomMenuList = (props: MenuListProps & { defaultStyles: { wrapper: React.CSSProperties } }) => {
  const { children, defaultStyles } = props

  return (
    <components.MenuList {...props}>
      <View style={defaultStyles.wrapper}>
        {children}
      </View>
    </components.MenuList>
  )
}

const DefaultPlaceholder = (props: PlaceholderProps) => {
  const { text: TextPlaceholder, defaultStyles, icon } = props

  const _Text = () => {
    if (TypeGuards.isNil(TextPlaceholder)) return null

    if (TypeGuards.isString(TextPlaceholder)) {
      return <Text text={TextPlaceholder} css={[defaultStyles.text]} />
    } else {
      return <TextPlaceholder {...props} />
    }
  }

  return (
    <View css={[defaultStyles.wrapper]}>
      {icon ? <Icon name={icon as any} forceStyle={defaultStyles.icon} /> : null}
      <_Text />
    </View>
  )
}

const LoadingIndicator = (props: LoadingIndicatorProps) => {
  const { defaultStyles, size } = props

  return (
    <View css={[defaultStyles.wrapper]}>
      <ActivityIndicator size={size} />
    </View>
  )
}

const getMultiValue = (values: { label: string }[], separator: string, state: { searchable: boolean }) => {
  let value = ''
  const hasMulti = values?.length > 1

  values.forEach(({ label }, i) => {
    const isLast = values?.length - 1 === i
    const txt = (hasMulti && separator)
      ? label + (isLast && !state?.searchable ? '' : separator)
      : label

    value = value + txt
  })

  return value
}

const CustomMultiValue = (props: MultiValueProps & { defaultStyles: { text: CSSInterpolation }; separator: string }) => {
  const { selectProps, index, defaultStyles, separator } = props

  const searchable = selectProps?.isSearchable

  if (index !== 0 || selectProps.inputValue.length > 0) return null

  // @ts-ignore
  const text = getMultiValue(selectProps?.value, separator, { searchable })

  return <Text text={text} css={[defaultStyles.text]} />
}

const defaultFormatPlaceholderNoItems = (props: PlaceholderProps & { text: string }) => {
  return props.text + `"${props.selectProps.inputValue}"`
}

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  <T extends string | number = string, Multi extends boolean = false>
  (props: SelectProps<T, Multi>, inputRef: React.ForwardedRef<HTMLInputElement>) => {
  type Option = FormTypes.Option<T>

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
    options = [],
    value,
    loadOptions,
    multiple,
    focused,
    _error,
    renderItem: OptionComponent = null,
    FooterComponent = null,
    PlaceholderComponent = DefaultPlaceholder,
    PlaceholderNoItemsComponent = DefaultPlaceholder,
    LoadingIndicatorComponent = LoadingIndicator,
    noItemsText = 'No results for ',
    noItemsIcon = 'placeholderNoItems-select',
    placeholderText = 'Search items',
    placeholderIcon = 'placeholder-select',
    showDropdownIcon = true,
    placeholder = 'Select',
    clearable = false,
    formatPlaceholderNoItems = defaultFormatPlaceholderNoItems,
    closeOnSelect = !multiple,
    selectedIcon = 'checkmark',
    onLoadOptionsError,
    loadOptionsOnMount = options?.length === 0,
    searchable = false,
    separatorMultiValue = ', ',
    filterItems = null,
    itemProps = {},
    loadingIndicatorSize = 20,
    ...otherProps
  } = selectProps

  const innerInputRef = useRef<any>(null)
  const innerWrapperRef = useRef(null)

  const [selectedOption, setSelectedOption] = useState(value)

  const [_isFocused, setIsFocused] = useState(false)

  const [keyDownActive, setKeyDownActive] = useState(false)

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
    menuWrapperStyles,
  } = useSelectStyles(props, {
    error: !!hasError,
    focused: isFocused,
    disabled: isDisabled,
  })

  useImperativeHandle(inputRef, () => {
    return { 
      ...innerInputRef.current, 
      focus: () => {
        innerInputRef.current?.focus?.()
      }, 
    }
  }, [!!innerInputRef?.current?.focus])

  const onLoadOptions = async (inputValue, cb) => {
    if (!!loadOptions) {
      try {
        const _options = await loadOptions(inputValue).then((options) => {
          cb(options)
          return options
        })

        return _options
      } catch (err) {
        onLoadOptionsError?.(err)
      }

      return
    }
  }

  const handleChange = (opt: Multi extends true ? Option[] : Option) => {
    if (TypeGuards.isArray(opt)) {
      // @ts-ignore
      setSelectedOption(opt)
      // @ts-ignore
      onValueChange?.(opt?.map((o) => o?.value))
    } else {
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

  const _Placeholder = (props: NoticeProps) => {
    const hasInputValue = !!props.selectProps.inputValue
    const styles = placeholderStyles[hasInputValue ? 'noItems' : 'empty']
    const icon = hasInputValue ? noItemsIcon : placeholderIcon

    const placeholderProps = {
      ...props,
      ...componentProps,
      icon,
      defaultStyles: styles,
    }

    if (!hasInputValue) {
      return <PlaceholderComponent {...placeholderProps} text={placeholderText} />
    } else {
      const _Text = TypeGuards.isString(noItemsText) ? formatPlaceholderNoItems({ ...placeholderProps, text: noItemsText }) : noItemsText
      return <PlaceholderNoItemsComponent {...placeholderProps} text={_Text} />
    }
  }

  const _props = {
    ...(!filterItems ? {} : { filterOption: filterItems  })
  }

  onUpdate(() => {
    if (!_isFocused) {
      setKeyDownActive(false)
    }
  }, [_isFocused])

  const handleKeyDown = () => {
    setKeyDownActive(true)
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
          searchable && variantStyles['innerWrapper:searchable']
        ],
      }}
      innerWrapperProps={{
        ...(inputBaseProps.innerWrapperProps || {}),
        onClick: () => {
          innerInputRef.current?.focus?.()
        },
      }}
      innerWrapperRef={innerWrapperRef}
    >
      <SelectComponent
        openMenuOnFocus={true}
        hideSelectedOptions={false}
        tabSelectsValue={false}
        tabIndex={0}
        {...otherProps}
        {..._props}
        onKeyDown={isFocused ? handleKeyDown : null}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={handleChange}
        styles={reactSelectStyles}
        value={selectedOption as any}
        isMulti={multiple}
        options={options}
        loadOptions={onLoadOptions as any}
        defaultOptions={loadOptionsOnMount}
        ref={innerInputRef}
        closeMenuOnSelect={closeOnSelect}
        menuPortalTarget={innerWrapperRef.current}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isClearable={clearable}
        isSearchable={searchable}
        components={{
          LoadingIndicator: () => null,
          ...otherProps.components,
          MultiValueRemove: () => null,
          LoadingMessage: props => (
            <LoadingIndicatorComponent 
              {...props} 
              defaultStyles={loadingStyles} 
              size={loadingIndicatorSize} 
            />
          ),
          DropdownIndicator: props => showDropdownIcon ? <components.DropdownIndicator {...props} /> : null,
          NoOptionsMessage: props => <_Placeholder {...props} />,
          Menu: props => <CustomMenu {...props} Footer={FooterComponent} />,
          MenuList: props => <CustomMenuList {...props} defaultStyles={menuWrapperStyles} />,
          Option: props => (
            <DefaultOption 
              {...props} 
              {...componentProps} 
              itemProps={itemProps} 
              selectedIcon={selectedIcon}
              optionsStyles={optionsStyles} 
              component={OptionComponent}
              isFocused={props?.isFocused && keyDownActive}
            />
          ),
          MultiValue: props => (
            <CustomMultiValue 
              {...props} 
              separator={separatorMultiValue} 
              defaultStyles={inputMultiValueStyles} 
            />
          ),
        }}
      />
    </InputBase>
  )
})
