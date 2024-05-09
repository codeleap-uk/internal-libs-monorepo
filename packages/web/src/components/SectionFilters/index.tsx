/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Text, View, Touchable, Button, ActionIcon, Icon, ModalProps } from '@codeleap/web'
import { AnyFunction, ComponentVariants, PropsOf, TypeGuards, useBooleanToggle, useCallback, useCodeleapContext, useDefaultComponentStyle, useMemo, useState } from '@codeleap/common'
import { useConditionalState } from '@codeleap/common'
import { SectionFiltersComposition, SectionFilterPresets } from './styles'

type ItemOptionProps = {
  label?: string
  value: string | number
}

type OnPressItemProps = {
  option: ItemOptionProps
  item: ModalDataItemProps
}

export type ModalDataItemProps = {
  id?: string | number
  label?: string
  selectMultiple?: boolean
  options?: ItemOptionProps[]
  showDescriptionLabel?: boolean
}

type onSelectItemProps = {
   id: ModalDataItemProps['id']
   option: ItemOptionProps
}

type FooterComponentProps = {
  onClear: AnyFunction
  onApply: AnyFunction
}

export type SectionFiltersProps = {
  data?: ModalDataItemProps[]
  selectedItems?: Object | Array<any>
  setSelectedItems?: AnyFunction
  draftItems?: Object | Array<any>
  setDraftItems?: AnyFunction
  onSelectItem?: (item: onSelectItemProps) => any
  onClearItems?: () => any
  onApplyItems?: (items?: ModalDataItemProps[]) => any
  renderFooterComponent?: (props: FooterComponentProps) => any
  filterButtonProps?: Omit<PropsOf<typeof Button>, 'debugName'>
} & ComponentVariants<typeof SectionFilterPresets>

type OptionProps = {
  option: ItemOptionProps
  item: ModalDataItemProps
  styles: Record<SectionFiltersComposition, any>
  items: object
  onPress: () => void
  isLastItem: boolean
  shouldApplyBiggerSpacing: boolean
}

const ItemOption = (props: OptionProps) => {

  const {
    option,
    item,
    items,
    styles,
    onPress,
    isLastItem,
    shouldApplyBiggerSpacing,
  } = props

  const [itemHover, setItemHover] = useBooleanToggle(false)

  const isItemSelected = useMemo(() => {
    if (item?.options && items) {
      if (item?.selectMultiple) {
        return TypeGuards.isArray(items[item?.id]) && items[item?.id].includes(option?.value)
      } else {
        return String(option?.value) === String(items[item?.id])
      }
    } else {
      return items[option?.label]
    }
  }, [item?.options, option?.value, items, item?.options, item?.id, item?.selectMultiple])

  const itemWrapperStyles = [styles.itemWrapper, isItemSelected && styles['itemWrapper:selected'], itemHover && styles['itemWrapper:hover']]
  const itemLabelStyles = [styles.itemLabel, isItemSelected && styles['itemLabel:selected'], itemHover && styles['itemLabel:selected']]

  return (
    <Touchable
      style={[
        itemWrapperStyles,
        { marginBottom: isLastItem && shouldApplyBiggerSpacing ? 16 : itemWrapperStyles?.marginBottom },
      ]}
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
    filterButtonProps,
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

  const onPressItem = useCallback((params: OnPressItemProps) => {

    const { item, option } = params

    const hasOptions = !!item?.options
    const canSelectMultiple = item?.selectMultiple && hasOptions

    _setDraft((state) => {

      const items = { ...state }

      const multipleOptionsSelected = TypeGuards.isArray(state?.[item.id]) ? state[item.id] : []

      let isItemAlreadySelected = null

      if (canSelectMultiple) {
        isItemAlreadySelected = multipleOptionsSelected?.includes(option.value)
      } else {
        isItemAlreadySelected = hasOptions && !TypeGuards.isNil(items) ? items[item.id] === option?.value : Object.values(items)?.includes?.(option?.value)
      }

      if (isItemAlreadySelected) {
        if (hasOptions) {
          items[item.id] = items[item.id]?.filter?.(value => value !== option?.label)
        } else {
          delete items[option?.label]
        }
      } else {
        items[item.id] = canSelectMultiple ? [...multipleOptionsSelected, option.value] : option?.value
      }

      return items
    })

    onSelectItem?.({ id: item.id, option })

  }, [_draft, onSelectItem])

  const renderItem = useCallback((item: ModalDataItemProps) => {

    const {
      showDescriptionLabel = true,
    } = item

    const Option = (option) => {
      return (
        <ItemOption
          option={option}
          item={item}
          items={_draft}
          styles={variantStyles}
          onPress={() => onPressItem({ option, item })}
          isLastItem={false}
          shouldApplyBiggerSpacing={false}
        />
      )
    }

    if (!item.options) {

      const option = {
        label: item.id,
        value: item.label,
      } as ItemOptionProps

      return (
        <>
          {showDescriptionLabel ? <Text style={variantStyles.label} text={item?.label} /> : null}
          <ItemOption
            option={option}
            item={item}
            items={_draft}
            styles={variantStyles}
            onPress={() => onPressItem({ option, item })}
            isLastItem={false}
            shouldApplyBiggerSpacing={false}
          />
        </>
      )
    }

    return (
      <View variants={['column']}>
        {showDescriptionLabel ? <Text style={variantStyles.label} text={item?.label} /> : null}
        <View variants={['column']}>
          {item?.options?.map?.((option, index) => (
            <ItemOption
              option={option}
              item={item}
              items={_draft}
              styles={variantStyles}
              onPress={() => onPressItem({ item, option })}
              isLastItem={item?.options?.length - 1 === index}
              shouldApplyBiggerSpacing={item?.options?.length > 1}
            />
          ))}
        </View>
      </View>
    )

  }, [_draft, variantStyles])

  const renderFooter = () => {

    if (TypeGuards.isFunction(renderFooterComponent)) {
      return renderFooterComponent({ onApply: onApplyItems, onClear: onClearItems })
    }

    const shouldDisable = Object.keys(_draft)?.length === 0 && Object.keys(_selectedItems)?.length === 0

    return (
      <View variants={['gap:1']}>
        <Button
          style={variantStyles.applyButton}
          text={'Filter'}
          debugName={`Section Filters Footer - Apply items`}
          onPress={onApplyItems}
          disabled={shouldDisable}
          {...filterButtonProps}
        />
        <Button
          style={variantStyles.clearButton}
          text={'Clear'}
          debugName={`Section Filters Footer - Apply items`}
          onPress={onClearItems}
          disabled={shouldDisable}
          {...filterButtonProps}
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
