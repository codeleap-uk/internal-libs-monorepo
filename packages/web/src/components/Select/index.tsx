import React, { useRef, forwardRef, useImperativeHandle } from 'react'
import { FormTypes, useValidate, useState, TypeGuards, onUpdate, useEffect } from '@codeleap/common'
import _Select, { components, MenuListProps, MenuProps, MultiValueProps, NoticeProps } from 'react-select'
import Async from 'react-select/async'
import { useSelectStyles } from './styles'
import { LoadingIndicatorProps, PlaceholderProps, SelectProps, TCustomOption } from './types'
import { InputBase, selectInputBaseProps } from '../InputBase'
import { Button, ButtonProps } from '../Button'
import { Text } from '../Text'
import { View } from '../View'
import { ActivityIndicator } from '../ActivityIndicator'
import { CSSInterpolation } from '@emotion/css'
import { Icon } from '../Icon'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps, StyledComponentWithProps } from '@codeleap/styles'

export * from './styles'
export * from './types'

const DefaultOption = (props: TCustomOption & { component: (props: TCustomOption) => JSX.Element }) => {
  const {
    isSelected,
    optionsStyles,
    label,
    selectedIcon,
    component = null,
    itemProps = {} as TCustomOption['itemProps'],
    isFocused,
    debugName,
  } = props

  const styles = optionsStyles({ isSelected, isFocused, baseStyles: (itemProps?.style ?? {}) })

  let _Component = null

  if (TypeGuards.isNil(component)) {
    _Component = () => (
      <Button
        text={label}
        // @ts-ignore
        rightIcon={isSelected && selectedIcon}
        debugName={debugName}
        {...itemProps}
        style={styles}
      />
    )
  } else {
    _Component = component
  }

  return (
    <components.Option {...props}>
      <_Component {...props} style={styles} />
    </components.Option>
  )
}

const CustomMenu = (props: MenuProps & { Footer: () => JSX.Element }) => {
  const { Footer, children } = props
  return <React.Fragment>
    <components.Menu {...props}>
      {children}
      {!!Footer && <Footer />}
    </components.Menu>
  </React.Fragment>
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
  const { text: TextPlaceholder, defaultStyles, icon: _IconPlaceholder, debugName } = props

  const _Text = () => {
    if (TypeGuards.isNil(TextPlaceholder)) return null

    if (TypeGuards.isString(TextPlaceholder)) {
      return <Text debugName={debugName} text={TextPlaceholder} style={defaultStyles.text} />
    } else if (React.isValidElement(TextPlaceholder)) {
      return TextPlaceholder as JSX.Element
    } else if (TypeGuards.isFunction(TextPlaceholder)) {
      return <TextPlaceholder {...props} />
    }
  }

  const _Image = () => {
    if (TypeGuards.isNil(_IconPlaceholder)) return null

    if (TypeGuards.isString(_IconPlaceholder)) {
      return <Icon debugName={debugName} name={_IconPlaceholder as AppIcon} forceStyle={defaultStyles.icon as React.CSSProperties} />
    } else if (React.isValidElement(_IconPlaceholder)) {
      // @ts-ignore
      return <View style={defaultStyles.icon}>
        {_IconPlaceholder}
      </View>
    } else if (TypeGuards.isFunction(_IconPlaceholder)) {
      return <_IconPlaceholder {...props} />
    }
  }

  return (
    <View style={defaultStyles.wrapper as React.CSSProperties}>
      <_Image />
      <_Text />
    </View>
  )
}

const LoadingIndicator = (props: LoadingIndicatorProps) => {
  const { defaultStyles, debugName } = props

  return (
    <View style={defaultStyles.wrapper}>
      <ActivityIndicator debugName={debugName} />
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

  return <Text text={text} style={defaultStyles.text} />
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
    } = selectInputBaseProps({
      ...Select.defaultProps,
      ...props,
    })

    const {
      validate,
      style,
      debugName,
      onValueChange,
      options,
      value,
      loadOptions,
      multiple,
      limit = null,
      loadInitialValue,
      focused,
      _error,
      renderItem: OptionComponent = null,
      FooterComponent = null,
      PlaceholderComponent,
      PlaceholderNoItemsComponent,
      LoadingIndicatorComponent,
      noItemsText,
      noItemsIcon,
      placeholderText,
      placeholderIcon,
      showDropdownIcon,
      placeholder,
      clearable,
      formatPlaceholderNoItems,
      closeOnSelect = !multiple,
      selectedIcon,
      onLoadOptionsError,
      loadOptionsOnMount = options?.length === 0,
      searchable,
      separatorMultiValue,
      filterItems = null,
      itemProps = {},
      loadingIndicatorSize,
      selectedOption: _selectedOption,
      setSelectedOption: _setSelectedOption,
      loadingMessage,
      selectRef = null,
      ...otherProps
    } = selectProps

    const _innerInputRef = useRef<any>(null)
    const innerInputRef = selectRef || _innerInputRef
    const innerWrapperRef = useRef(null)

    const hasSelectedOptionState = !TypeGuards.isNil(_selectedOption) && TypeGuards.isFunction(_setSelectedOption)

    const initialValue = (loadInitialValue && !TypeGuards.isNil(options))
      ? options?.find((option) => option?.value === value)
      : value

    const [selectedOption, setSelectedOption] = hasSelectedOptionState ? [_selectedOption, _setSelectedOption] : useState(initialValue ?? value)

    useEffect(() => {
      if (loadInitialValue && !selectedOption && !!initialValue) {
        setSelectedOption(initialValue)
      }
    }, [!!initialValue])

    const [_isFocused, setIsFocused] = useState(false)
    const [loadedOptions, setLoadedOptions] = useState(false)
    const [keyDownActive, setKeyDownActive] = useState(false)

    const isFocused = _isFocused || focused

    // @ts-ignore
    const validation = useValidate(value, validate)

    const isDisabled = !!inputBaseProps.disabled

    const hasError = !validation.isValid || _error
    const errorMessage = validation.message || _error

    const {
      reactSelectStyles,
      styles,
      optionsStyles,
      placeholderStyles,
      loadingStyles,
      inputMultiValueStyles,
      menuWrapperStyles,
      // @ts-expect-error @verify
    } = useSelectStyles({ ...props, styleRegistryName: Select.styleRegistryName }, {
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

          if (loadInitialValue && !TypeGuards.isNil(_options) && !loadedOptions) {
            const _initialValue = _options?.find?.((option) => option?.value === value)
            if (!!_initialValue) setSelectedOption(_initialValue)
          }

          setLoadedOptions(true)

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
        if (TypeGuards.isNumber(limit) && opt?.length > limit && opt?.length > selectedOption?.length) {
          return
        }
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
      styles,
      debugName: debugName,
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
      ...(!filterItems ? {} : { filterOption: filterItems }),
    }

    onUpdate(() => {
      if (!_isFocused) {
        setKeyDownActive(false)
      }
    }, [_isFocused])

    const handleKeyDown = () => {
      setKeyDownActive(true)
    }

    const MenuComponent = React.useCallback((props) => {
      return <CustomMenu {...props} Footer={FooterComponent} />
    }, [FooterComponent])

    const MenuListComponent = React.useCallback((props) => {
      return <CustomMenuList {...props} defaultStyles={menuWrapperStyles} />
    }, [])

    return (
      <InputBase
        {...inputBaseProps}
        debugName={debugName}
        error={hasError ? errorMessage : null}
        focused={isFocused}
        style={{
          ...styles,
          innerWrapper: [
            styles.innerWrapper,
            searchable && styles['innerWrapper:searchable'],
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
          backspaceRemovesValue={true}
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
          placeholder={(loadOptionsOnMount && !loadedOptions) ? loadingMessage : placeholder}
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
                debugName={debugName}
              />
            ),
            DropdownIndicator: props => showDropdownIcon ? <components.DropdownIndicator {...props} /> : null,
            NoOptionsMessage: props => <_Placeholder {...props} />,
            Menu: MenuComponent,
            MenuList: MenuListComponent,
            Option: props => (
              <DefaultOption
                {...props}
                {...componentProps}
                itemProps={itemProps as ButtonProps}
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
 }) as StyledComponentWithProps<SelectProps>

Select.styleRegistryName = 'Select'

Select.elements = [
  ...InputBase.elements,
  'item',
  'listPortal',
  'listHeader',
  'listWrapper',
  'list',
  'inputContainer',
  'input',
  'placeholder',
  'value',
  'valueMultiple',
  'valueWrapper',
  'clearIcon',
  'dropdownIcon',
]

Select.rootElement = 'wrapper'

Select.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Select as (props: StyledComponentProps<SelectProps, typeof styles>) => IJSX
}

Select.defaultProps = {
  PlaceholderComponent: DefaultPlaceholder,
  PlaceholderNoItemsComponent: DefaultPlaceholder,
  LoadingIndicatorComponent: LoadingIndicator,
  noItemsText: 'No results for ',
  noItemsIcon: 'placeholderNoItems-select',
  placeholderText: 'Search items',
  placeholderIcon: 'placeholder-select',
  showDropdownIcon: true,
  placeholder: 'Select',
  clearable: false,
  formatPlaceholderNoItems: defaultFormatPlaceholderNoItems,
  selectedIcon: 'check',
  searchable: false,
  separatorMultiValue: ', ',
  itemProps: {} as ButtonProps,
  loadingIndicatorSize: 20,
  options: [],
  loadInitialValue: false,
  loadingMessage: 'loading...',
} as Partial<SelectProps>

WebStyleRegistry.registerComponent(Select)
