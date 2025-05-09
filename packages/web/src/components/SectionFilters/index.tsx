/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { useCallback, useMemo, useConditionalState } from '@codeleap/hooks'
import { TypeGuards } from '@codeleap/types'
import { ItemOptionProps, ItemProps, OnPressOptionProps, OptionProps, SectionFiltersProps, SectionFilterFooterProps } from './types'
import { View } from '../View'
import { Text } from '../Text'
import { Button } from '../Button'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, IJSX, StyledComponentProps, useCompositionStyles } from '@codeleap/styles'

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
      text={String(option?.label)}
      onPress={onPress}
      selected={isItemSelected}
      {...buttonProps}
      style={styles}
    />
  )
}

export const SectionFilters = (props: SectionFiltersProps) => {
  const {
    data,
    onSelectItem,
    renderFooterComponent,
    style,
    applyFilterButtonProps,
    clearFilterButtonProps,
    applyButtonText,
    clearButtonText,
    filterOnOptionPress,
  } = {
    ...SectionFilters.defaultProps,
    ...props,
  }

  const styles = useStylesFor(SectionFilters.styleRegistryName, style)

  const compositionStyles = useCompositionStyles(['itemOptionButton', 'clearButton', 'applyButton'], styles)

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
          styles={{ ...compositionStyles?.itemOptionButton }}
          onPress={() => onPressOption({ option, item, canSelectMultiple, hasMultipleOptions })}
          canSelectMultiple={canSelectMultiple}
        />
      )
    }

    return (
      <View style={styles.optionWrapper}>
        {showDescriptionLabel && description ? <Text style={styles.label} text={`${description}`} /> : null}
        <View style={styles.optionInnerWrapper}>
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

  }, [_draft, styles, compositionStyles?.itemOptionButton])

  const DefaultFooter = ({ onApply, onClear, shouldDisableActions }: SectionFilterFooterProps) => {
    return (
      <View style={styles.footerWrapper}>
        <Button
          text={applyButtonText}
          debugName={`Section Filters Footer - Apply items`}
          onPress={onApply}
          disabled={shouldDisableActions}
          {...applyFilterButtonProps}
          style={compositionStyles?.applyButton}
        />
        <Button
          text={clearButtonText}
          debugName={`Section Filters Footer - Apply items`}
          onPress={onClear}
          disabled={shouldDisableActions}
          {...clearFilterButtonProps}
          style={compositionStyles?.clearButton}
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

  if (!data?.length) {
    return null
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.innerWrapper}>
        {isEmpty ? null : data?.map((item) => renderItem(item))}
      </View>

      <Footer
        onApply={onApplyItems}
        onClear={onClearItems}
        shouldDisableActions={shouldDisableActions}
      />
    </View>
  )
}

SectionFilters.styleRegistryName = 'SectionFilters'

SectionFilters.elements = [
  'wrapper',
  'innerWrapper',
  'label',
  'optionWrapper',
  'optionInnerWrapper',
  'itemOptionButton',
  'footerWrapper',
  'applyButton',
  'clearButton',
]

SectionFilters.rootElement = 'wrapper'

SectionFilters.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return SectionFilters as (props: StyledComponentProps<SectionFiltersProps, typeof styles>) => IJSX
}

SectionFilters.defaultProps = {
  applyButtonText: 'Filter',
  clearButtonText: 'Clear',
  filterOnOptionPress: false,
}

WebStyleRegistry.registerComponent(SectionFilters)
