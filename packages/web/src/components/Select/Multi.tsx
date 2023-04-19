import {
  onUpdate,
  optionalObject,
  StylesOf,
  TypeGuards,
  useBooleanToggle,
  useDefaultComponentStyle,
  useValidate,
} from '@codeleap/common'
import { useMemo } from 'react'
import { useClickOutside } from '../../lib/hooks'
import { MultiSelectProps } from './types'
import { SelectComposition, SelectParts, SelectPresets } from './styles'
import { InputWrapper, SelectItem } from './Custom'

export const MultiSelect: React.FC<MultiSelectProps<any>> = (
  selectProps,
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
  const variantStyles =  useDefaultComponentStyle<'u:Select', typeof SelectPresets>('u:Select', {
    styles,
    variants,
    responsiveVariants,
  }) as StylesOf<SelectComposition>

  const CurrentContent = renderCurrentlySelected || SelectItem
  const Item = renderItem || SelectItem

  const isValueEmpty = value === null || typeof value === 'undefined' || (TypeGuards.isArray(value) && !value.length)
  const currentOption = isValueEmpty
    ? { label: placeholder, value: null }
    : { label: value.map(o => optionLabelMap[o]).join(','), value: null }

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
      {options.map((item) => {
        const isSelected = value.includes(item.value)
        return (
          <Item
            value={item.value}
            label={item.label}
            inList
            onPress={() => {
              let newArr = [...value]
              if (value.includes(item.value)) {
                newArr = newArr.filter(x => x !== item.value)
              } else {
                newArr.push(item.value)
              }
              onValueChange(newArr)
            }}
            selected={isSelected}
            key={item.value}
            styles={{
              itemText: getStyles('itemText', {
                ...optionalObject(
                  isSelected,
                  variantStyles['itemText:selected'],
                  {},
                ),
              }),
              itemWrapper: getStyles('itemWrapper', {
                ...optionalObject(
                  isSelected,
                  variantStyles['itemWrapper:selected'],
                  {},
                ),
              }),
              buttonIcon: getStyles('buttonIcon', {
                ...optionalObject(
                  isSelected,
                  variantStyles['buttonIcon:selected'],
                  {},
                ),
              }),
            }}
          />
        )

      })}
    </InputWrapper>
  )
}
