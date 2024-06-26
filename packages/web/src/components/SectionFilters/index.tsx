/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { TypeGuards, getNestedStylesByKey, useCallback, useDefaultComponentStyle, useMemo, useConditionalState } from '@codeleap/common'
import { SectionFilterPresets } from './styles'
import { ItemOptionProps, ItemProps, OnPressOptionProps, OptionProps, SectionFiltersProps, SectionFilterFooterProps, onSelectItemProps } from './types'
import { View } from '../View'
import { Text } from '../Text'
import { Button } from '../Button'

export * from './styles'
export * from './types'

const ItemOption = (props: OptionProps) => {

  const {
    option,
    item,
    selectedItems,
    styles,
    onPress,
    canSelectMultiple,
  } = props

  let buttonProps = {
    ...item?.itemProps,
    ...option?.itemProps,
  }

  const isItemSelected = useMemo(() => {
    if (item?.options && selectedItems) {
      if (canSelectMultiple) {
        return TypeGuards.isArray(selectedItems[item?.id]) && selectedItems[item?.id]?.find?.((item) => JSON.stringify(item) === JSON.stringify(option))
      } else {
        return JSON.stringify(option) === JSON.stringify(selectedItems[item?.id])
      }
    } else {
      return selectedItems[item?.id]
    }
  }, [item?.options, option, selectedItems, item?.id, canSelectMultiple])

  if (isItemSelected) {
    buttonProps = {
      ...buttonProps,
      ...item?.selectedItemProps,
    }
  }

  return (
    <Button
      debugName='Item option'
      text={option?.label}
      onPress={onPress}
      selected={isItemSelected}
      styles={styles}
      {...buttonProps}
    />
  )
}

export const SectionFilters = (props: SectionFiltersProps) => {

  const {
    data,
    onSelectItem,
    renderFooterComponent,
    responsiveVariants,
    variants,
    styles,
    applyFilterButtonProps,
    clearFilterButtonProps,
    applyButtonText,
    clearButtonText,
    filterOnOptionPress,
  } = {
    ...SectionFilters.defaultProps,
    ...props,
  }

  const variantStyles = useDefaultComponentStyle<'u:SectionFilters', typeof SectionFilterPresets>(
    'u:SectionFilters',
    {
      responsiveVariants,
      variants,
      styles,
      rootElement: 'wrapper',
    },
  )

  const applyButtonStyles = getNestedStylesByKey('applyButton', variantStyles)
  const clearButtonStyles = getNestedStylesByKey('clearButton', variantStyles)
  const itemOptionButtonStyles = getNestedStylesByKey('itemOptionButton', variantStyles)

  const [_selectedItems, _setSelectedItems] = useConditionalState(props?.selectedItems, props?.setSelectedItems, { initialValue: {}})
  const [_draft, _setDraft] = useConditionalState(props?.draftItems, props?.setDraftItems, { initialValue: {}})

  const isEmpty = data?.length <= 0
  const shouldDisableActions = Object.keys(_draft)?.length === 0 && Object.keys(_selectedItems)?.length === 0

  const onPressOption = useCallback((params: OnPressOptionProps) => {

    const { item, option, canSelectMultiple, hasMultipleOptions } = params

    _setDraft((state) => {

      const items = { ...state }

      const multipleOptionsSelected = TypeGuards.isArray(state?.[item.id]) ? state[item.id] : []

      let isItemAlreadySelected = null

      if (canSelectMultiple) {
        isItemAlreadySelected = multipleOptionsSelected?.find((item) => JSON.stringify(item) === JSON.stringify(option))
      } else {
        isItemAlreadySelected = JSON.stringify(items[item?.id]) === JSON.stringify(option)
      }

      if (isItemAlreadySelected) {
        if (hasMultipleOptions) {
          const newChosenOptions = items[item.id]?.filter?.(value => JSON.stringify(value) !== JSON.stringify(option))
          if (newChosenOptions?.length === 0) {
            delete items[item?.id]
          } else {
            items[item.id] = newChosenOptions
          }
        } else {
          delete items[item?.id]
        }
      } else {
        items[item.id] = canSelectMultiple ? [...multipleOptionsSelected, option] : option
      }

      if (filterOnOptionPress) {
        _setSelectedItems(items)
      }

      return items
    })

    onSelectItem?.({ id: item?.id, option })

  }, [_draft, onSelectItem])

  const renderItem = useCallback((item: ItemProps) => {

    const {
      showDescriptionLabel = true,
    } = item

    const hasMultipleOptions = !!item?.options?.length
    const canSelectMultiple = item?.canSelectMultiple && hasMultipleOptions

    const description = TypeGuards.isString(item?.descriptionLabel) ? item?.descriptionLabel : item?.label

    const Option = ({ option }: { option: ItemOptionProps}) => {

      if (TypeGuards.isNil(item?.id)) {
        return null
      }

      return (
        <ItemOption
          option={option}
          item={item}
          selectedItems={_draft}
          styles={itemOptionButtonStyles}
          onPress={() => onPressOption({ option, item, canSelectMultiple, hasMultipleOptions })}
          canSelectMultiple={canSelectMultiple}
        />
      )
    }

    return (
      <View style={variantStyles.optionWrapper}>
        {showDescriptionLabel ? <Text style={variantStyles.label} text={description} /> : null}
        <View style={variantStyles.optionInnerWrapper}>
          {hasMultipleOptions ? (
            item?.options?.map?.((option) => <Option option={option} />)
          ) : (
            <Option
              option={{
                label: TypeGuards.isNil(item?.label) ? String(item?.id) : item?.label,
                value: TypeGuards.isNil(item?.label) ? item?.id : item?.label,
              }}
            />
          )}
        </View>
      </View>
    )

  }, [_draft, variantStyles, itemOptionButtonStyles])

  const DefaultFooter = ({ onApply, onClear, shouldDisableActions }: SectionFilterFooterProps) => {
    return (
      <View style={variantStyles.footerWrapper}>
        <Button
          styles={applyButtonStyles}
          text={applyButtonText}
          debugName={`Section Filters Footer - Apply items`}
          onPress={onApply}
          disabled={shouldDisableActions}
          {...applyFilterButtonProps}
        />
        <Button
          styles={clearButtonStyles}
          text={clearButtonText}
          debugName={`Section Filters Footer - Apply items`}
          onPress={onClear}
          disabled={shouldDisableActions}
          {...clearFilterButtonProps}
        />
      </View>
    )
  }

  const onClearItems = () => {
    _setDraft({})
    _setSelectedItems({})
    props?.onClearItems?.()
  }

  const onApplyItems = () => {
    _setSelectedItems(_draft)
    props?.onApplyItems?.(_selectedItems as ItemProps[])
  }

  const Footer = renderFooterComponent || DefaultFooter

  return (
    <View style={variantStyles.wrapper}>
      <View style={variantStyles.innerWrapper}>
        {isEmpty ? null : data.map((item) => renderItem(item))}
      </View>

      <Footer
        onApply={onApplyItems}
        onClear={onClearItems}
        shouldDisableActions={shouldDisableActions}
      />
    </View>
  )
}

SectionFilters.defaultProps = {
  applyButtonText: 'Filter',
  clearButtonText: 'Clear',
  filterOnOptionPress: false,
}
