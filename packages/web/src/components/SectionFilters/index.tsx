/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Text, View, Touchable, Button } from '@codeleap/web'
import { TypeGuards, useBooleanToggle, useCallback, useDefaultComponentStyle, useMemo } from '@codeleap/common'
import { useConditionalState } from '@codeleap/common'
import { SectionFilterPresets } from './styles'
import { ItemOptionProps, ModalDataItemProps, OnPressOptionProps, OptionProps, SectionFiltersProps } from './types'

const ItemOption = (props: OptionProps) => {

  const {
    option,
    item,
    selectedItems,
    styles,
    onPress,
    canSelectMultiple,
  } = props

  const [itemHover, setItemHover] = useBooleanToggle(false)

  const isItemSelected = useMemo(() => {
    if (item?.options && selectedItems) {
      if (canSelectMultiple) {
        return TypeGuards.isArray(selectedItems[item?.id]) && selectedItems[item?.id].includes(option?.value)
      } else {
        return String(option?.value) === String(selectedItems[item?.id])
      }
    } else {
      return selectedItems[item?.id]
    }
  }, [item?.options, option?.value, selectedItems, item?.id, canSelectMultiple])

  const itemWrapperStyles = [styles.itemWrapper, isItemSelected && styles['itemWrapper:selected'], itemHover && styles['itemWrapper:hover']]
  const itemLabelStyles = [styles.itemLabel, isItemSelected && styles['itemLabel:selected'], itemHover && styles['itemLabel:selected']]

  return (
    <Touchable
      style={[itemWrapperStyles]}
      debugName={`Section Filters modal - on ${option?.label} press`}
      onPress={onPress}
      onHover={setItemHover}
    >
      {TypeGuards.isString(option.label) ? (
        <View variants={['flex', 'center']}>
          <Text
            style={itemLabelStyles}
            text={option?.label}
          />
        </View>
      ) : null}
    </Touchable>
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
    filterOnOptionPress = false,
  } = props

  const variantStyles = useDefaultComponentStyle<'u:SectionFilters', typeof SectionFilterPresets>(
    'u:SectionFilters',
    {
      responsiveVariants,
      variants,
      styles,
      rootElement: 'wrapper',
    },
  )

  const [_selectedItems, _setSelectedItems] = useConditionalState(props?.selectedItems, props?.setSelectedItems, { fallbackValue: {}})
  const [_draft, _setDraft] = useConditionalState(props?.draftItems, props?.setDraftItems, { fallbackValue: {}})

  const onPressOption = useCallback((params: OnPressOptionProps) => {

    const { item, option, canSelectMultiple, hasMultipleOptions } = params

    _setDraft((state) => {

      const items = { ...state }

      const multipleOptionsSelected = TypeGuards.isArray(state?.[item.id]) ? state[item.id] : []

      let isItemAlreadySelected = null

      if (canSelectMultiple) {
        isItemAlreadySelected = multipleOptionsSelected?.includes(option.value)
      } else {
        isItemAlreadySelected = Object.values(items)?.includes?.(option?.value)
      }

      if (isItemAlreadySelected) {
        if (hasMultipleOptions) {
          const newChosenOptions = items[item.id]?.filter?.(value => value !== option?.value)
          if (newChosenOptions?.length === 0) {
            delete items[item?.id]
          } else {
            items[item.id] = newChosenOptions
          }
        } else {
          delete items[option?.value]
        }
      } else {
        items[item.id] = canSelectMultiple ? [...multipleOptionsSelected, option.value] : option?.value
      }

      if (filterOnOptionPress) {
        _setSelectedItems(items)
      }

      return items
    })

    onSelectItem?.({ id: item?.id, option })

  }, [_draft, onSelectItem])

  const renderItem = useCallback((item: ModalDataItemProps) => {

    const {
      showDescriptionLabel = true,
    } = item

    const hasMultipleOptions = !!item?.options?.length
    const canSelectMultiple = item?.canSelectMultiple && hasMultipleOptions

    const Option = ({ option }: { option: ItemOptionProps}) => {

      if (TypeGuards.isNil(item?.id)) {
        return null
      }

      return (
        <ItemOption
          option={option}
          item={item}
          selectedItems={_draft}
          styles={variantStyles}
          onPress={() => onPressOption({ option, item, canSelectMultiple, hasMultipleOptions })}
          canSelectMultiple={canSelectMultiple}
        />
      )
    }

    return (
      <View variants={['column']}>
        {showDescriptionLabel ? <Text style={variantStyles.label} text={item?.label} /> : null}

        <View variants={['column']}>
          {item?.options?.length ? (
            item.options.map((option) => <Option option={option} />)
          ) : (
            <Option option={{ label: String(item.id), value: TypeGuards.isNil(item.label) ? item?.id : item?.label }} />
          )}
        </View>
      </View>
    )

  }, [_draft, variantStyles])

  const renderFooter = () => {

    if (TypeGuards.isFunction(renderFooterComponent)) {
      return renderFooterComponent({ onApply: onApplyItems, onClear: onClearItems })
    }

    const shouldDisableActions = Object.keys(_draft)?.length === 0 && Object.keys(_selectedItems)?.length === 0

    return (
      <View variants={['gap:1']}>
        <Button
          style={variantStyles.applyButton}
          text={'Filter'}
          debugName={`Section Filters Footer - Apply items`}
          onPress={onApplyItems}
          disabled={shouldDisableActions}
          {...applyFilterButtonProps}
        />
        <Button
          style={variantStyles.clearButton}
          text={'Clear'}
          debugName={`Section Filters Footer - Apply items`}
          onPress={onClearItems}
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
    props?.onApplyItems?.(_selectedItems as ModalDataItemProps[])
  }

  return (
    <View style={variantStyles.wrapper}>

      <View style={variantStyles.scroll}>
        {data && data.map((item) => renderItem(item))}
      </View>

      {renderFooter()}
    </View>
  )
}

export * from './styles'
