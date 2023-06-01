
import React, { useRef } from 'react'
import { FormTypes, useValidate, useState, TypeGuards, onMount } from '@codeleap/common'
import _Select, { components, MenuListProps, MenuProps, MultiValueProps } from 'react-select'
import Async  from 'react-select/async'
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
  const { isSelected, optionsStyles, label, selectedIcon, component = null } = props

  let _Component = null

  if (TypeGuards.isNil(component)) {
    _Component = () => (
      <Button
        text={label}
        // @ts-ignore
        rightIcon={isSelected && selectedIcon} 
        styles={{ wrapper: styles?.item, rightIcon: styles?.icon, text: styles?.text }} 
      />
    )
  } else {
    _Component = component
  }

  const styles = optionsStyles({ isSelected })

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
    if (!TextPlaceholder) return null

    if (TypeGuards.isString(TextPlaceholder)) {
      return <Text text={TextPlaceholder} css={[defaultStyles.text]} />
    } else {
      return <TextPlaceholder {...props} />
    }
  }

  return (
    <View css={[defaultStyles.wrapper]}>
      {icon ? <Icon name={icon as any} style={defaultStyles.icon} /> : null}
      <_Text />
    </View>
  )
}

const LoadingIndicator = (props: LoadingIndicatorProps) => {
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

  // @ts-ignore
  const text = getMultiValue(selectProps?.value)

  return <Text text={text} css={[defaultStyles.text]} />
}

const _formatPlaceholderNoItems = (props: PlaceholderProps & { text: string }) => {
  return props.text + `"${props.selectProps.inputValue}"`
}

const defaultFilterFunction = (search: string, options: FormTypes.Options<any>) => {
  return options.filter((option) => {
    if(TypeGuards.isString(option?.label)){
      return option?.label?.toLowerCase()?.includes(search?.toLowerCase())
    }

    return option?.label === search
  })
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
    formatPlaceholderNoItems = _formatPlaceholderNoItems,
    closeOnSelect = !multiple,
    selectedIcon = 'checkmark',
    onLoadOptionsError,
    loadOptionsOnMount = options?.length === 0,
    filterItems = defaultFilterFunction,
    defaultOptions = options,
    searchable = false,
    ...otherProps
  } = selectProps

  const [selectedOption, setSelectedOption] = useState(value)

  const [_isFocused, setIsFocused] = useState(false)

  const [loading, setLoading] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState(defaultOptions)

  const isFocused = _isFocused || focused

  const validation = useValidate(value, validate)

  const isDisabled = !!inputBaseProps.disabled

  const hasError = !validation.isValid || _error
  const errorMessage = validation.message || _error

  async function load(){
    setLoading(true)

    try{
      const _options = await loadOptions('')

      setFilteredOptions(_options)
    } catch(err) {
      onLoadOptionsError(err)
    }

    setLoading(false)
  }

  onMount(() => {
    if(loadOptionsOnMount && !!loadOptions){
      load()
    }
  })

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

  const onLoadOptions = async (inputValue, cb) => {
    if (!!loadOptions) {
      setLoading(true)

      try {
        const _options = await loadOptions(inputValue).then((options) => {
          cb(options)
          return options
        })

        return _options
      } catch(err) {
        onLoadOptionsError?.(err)
      }

      setTimeout(() => {
        setLoading(false)
      }, 0)

      return
    }

    const _opts = filterItems(inputValue, options)

    setFilteredOptions(_opts)
    cb(_opts)
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
          searchable && variantStyles['innerWrapper:searchable']
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
        options={options ?? filteredOptions}
        loadOptions={onLoadOptions as any}
        defaultOptions={loadOptionsOnMount}
        ref={innerInputRef}
        openMenuOnFocus={true}
        closeMenuOnSelect={closeOnSelect}
        menuPortalTarget={innerWrapperRef.current}
        hideSelectedOptions={false}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isClearable={clearable}
        isSearchable={searchable}
        isLoading={loading}
        components={{
          LoadingIndicator: () => null,
          LoadingMessage: props => <LoadingIndicatorComponent {...props} defaultStyles={loadingStyles} />,
          ...otherProps.components,
          MultiValueRemove: () => null,
          DropdownIndicator: props => showDropdownIcon ? <components.DropdownIndicator {...props} /> : null,
          NoOptionsMessage: props => {
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
          },
          Menu: props => <CustomMenu {...props} Footer={FooterComponent} />,
          MenuList: props => <CustomMenuList {...props} defaultStyles={menuWrapperStyles} />,
          Option: props => <DefaultOption {...props} {...componentProps} selectedIcon={selectedIcon} optionsStyles={optionsStyles} component={OptionComponent} />,
          MultiValue: props => <CustomMultiValue {...props} defaultStyles={inputMultiValueStyles} />,
        }}
      />
    </InputBase>
  )
}
