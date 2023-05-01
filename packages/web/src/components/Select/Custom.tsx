import {
  IconPlaceholder,
  onUpdate,
  optionalObject,
  StylesOf,
  useBooleanToggle,
  useDefaultComponentStyle,
  useValidate,
} from '@codeleap/common'
import { forwardRef, useMemo, useRef } from 'react'
import { InputLabel, FormError } from '../TextInput'
import { Icon } from '../Icon'
import { Touchable } from '../Touchable'
import { View } from '../View'
import { Text } from '../Text'
import { useClickOutside } from '../../lib/hooks'
import { CustomSelectProps } from './types'
import { SelectComposition, SelectParts, SelectPresets } from './styles'
import { SelectRenderFNProps } from '.'

export const SelectItem: React.FC<
  SelectRenderFNProps<any> & { iconName?: string }
> = ({ styles, iconName, onPress, label, icon, inList }) => {
  const showIcon = (!inList || !!icon)

  return (
    <Touchable
      onPress={onPress}
      css={inList ? [styles.itemWrapper] : [styles.buttonWrapper]}
    >
      {typeof label === 'string' ? (
        <Text text={label} css={inList ? styles.itemText : styles.buttonText} />
      ) : (
        label
      )}
      {showIcon && (
        <Icon
          name={icon || iconName as IconPlaceholder}
          style={styles.buttonIcon as any}
        />
      )}
    </Touchable>
  )
}

export const InputWrapper = forwardRef<any, any>((props, ref) => {
  const {
    styles,
    label,
    children,
    currentContent,
    open,

    error,
    ...wrapperProps
  } = props

  return (
    <View css={styles.wrapper} ref={ref} {...wrapperProps}>
      <InputLabel label={label} style={styles.label} />
      <View css={styles.inputWrapper} >
        {currentContent}

        <View css={styles.list}>{children}</View>
      </View>
      <FormError message={error.message} style={styles.error} />
    </View>
  )
})

export const CustomSelect: React.FC<CustomSelectProps<any>> = <
  T extends string | number = string
> (
    selectProps: CustomSelectProps<T>,
  ) => {

  const {
    options = [],
    value,
    onValueChange,
    renderCurrentlySelected,
    renderItem,
    placeholder,
    onDropdownToggle,
    variants,
    responsiveVariants,
    styles,
    validate,
    disabled,
    arrowIconName,
    autoClose = true,
    ...props
  } = selectProps

  const [isOpen, setOpen] = useBooleanToggle(false)
  const [isHovering, setHovering] = useBooleanToggle(false)

  const optionLabelMap = useMemo(() => {
    return Object.fromEntries(
      options.map(({ label, value }) => [value, label]),
    )
  }, [options])

  const wrapperRef = useClickOutside(
    () => {
      if (isOpen) {
        setOpen(false)
      }
    },
  )
  const variantStyles = useDefaultComponentStyle<'u:Select', typeof SelectPresets>('u:Select', {
    styles,
    variants,
    responsiveVariants,
  }) as StylesOf<SelectComposition>

  const CurrentContent = renderCurrentlySelected || SelectItem
  const Item = renderItem || SelectItem

  const isValueEmpty = value === null || typeof value === 'undefined'
  const currentOption = isValueEmpty
    ? { label: placeholder, value }
    : { label: optionLabelMap[value], value }

  onUpdate(() => {
    onDropdownToggle?.(isOpen)
  }, [isOpen])

  const { showError, error } = useValidate(value, validate)

  function getStyles(key: SelectParts, append = {}) {
    return {
      ...variantStyles[key],
      ...optionalObject(isOpen, variantStyles[`${key}:open`], {}),
      ...optionalObject(isHovering, variantStyles[`${key}:hover`], {}),
      ...optionalObject(showError, variantStyles[`${key}:error`], {}),
      ...optionalObject(disabled, variantStyles[`${key}:disabled`], {}),
      ...append,
    }
  }

  return (
    <InputWrapper
      currentContent={
        <CurrentContent
          {...currentOption}
          onPress={() => setOpen()}
          styles={{
            buttonIcon: getStyles('buttonIcon'),
            buttonText: getStyles('buttonText'),
            buttonWrapper: getStyles('buttonWrapper'),
          }}
          open={isOpen}
          iconName={arrowIconName || 'selectArrow'}
        />
      }
      error={error}
      styles={{
        wrapper: getStyles('wrapper'),
        label: getStyles('label'),
        inputWrapper: getStyles('inputWrapper'),
        list: getStyles('list'),
        error: getStyles('error'),
      }}
      // id={inputId}
      ref={wrapperRef}
      onHover={setHovering}
      {...props}
    >
      {options.map((item) => (
        <Item
          {...item}
          inList
          onPress={() => {
            if (autoClose) {
              setOpen(false)
            }
            onValueChange(item.value)
          }}
          selected={item.value === value}
          key={item.value}
          styles={{
            itemText: getStyles('itemText', {
              ...optionalObject(
                item.value === value,
                variantStyles['itemText:selected'],
                {},
              ),
            }),
            itemWrapper: getStyles('itemWrapper', {
              ...optionalObject(
                item.value === value,
                variantStyles['itemWrapper:selected'],
                {},
              ),
            }),
            buttonIcon: getStyles('buttonIcon', {
              ...optionalObject(
                item.value === value,
                variantStyles['buttonIcon:selected'],
                {},
              ),
            }),
          }}
        />
      ))}
    </InputWrapper>
  )
}

