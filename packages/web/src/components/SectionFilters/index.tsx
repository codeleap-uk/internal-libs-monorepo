/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { Modal, Text, View, Touchable, Button, ActionIcon, Icon, ModalProps } from '@codeleap/web'
import { AnyFunction, ComponentVariants, PropsOf, TypeGuards, useBooleanToggle, useCallback, useCodeleapContext, useDefaultComponentStyle, useMemo, useState } from '@codeleap/common'
import { useConditionalState } from '@codeleap/common'
import { SectionFiltersComposition, SectionFilterPresets } from './styles'

type ItemOptionProps = {
  label?: string
  value: string | number
}

export type ModalDataItemProps = {
  key?: string | number
  label?: string
  selectMultiple?: boolean
  options?: ItemOptionProps[]
  showLabel?: boolean
}

type onSelectItemProps = {
   key: ModalDataItemProps['key']
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
  shouldDisplayCheckIcon?: boolean
  onSelectItem?: (item: onSelectItemProps) => any
  onClearItems?: () => any
  onApplyItems?: (items?: ModalDataItemProps[]) => any
  renderFooterComponent?: (props: FooterComponentProps) => any
  filterButtonProps?: Omit<PropsOf<typeof Button>, 'debugName'>
  checkIconProps?: Omit<PropsOf<typeof Icon>, 'debugName' | 'name'>
} & ComponentVariants<typeof SectionFilterPresets>

type OptionProps = {
  option: ItemOptionProps
  item: ModalDataItemProps
  styles: Record<SectionFiltersComposition, any>
  items: object
  onPress: () => void
  isLastItem: boolean
  shouldApplyBiggerSpacing: boolean
  shouldDisplayCheckIcon: boolean
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
    shouldDisplayCheckIcon,
    ...checkIconProps
  } = props

  const [itemHover, setItemHover] = useBooleanToggle(false)

  const isItemSelected = useMemo(() => {
    if (item?.options && items) {
      if (item?.selectMultiple) {
        return TypeGuards.isArray(items[item?.key]) && items[item?.key].includes(option?.value)
      } else {
        return String(option?.value) === String(items[item?.key])
      }
    } else {
      return items[option?.label]
    }
  }, [item?.options, option?.value, items, item?.options, item?.key, item?.selectMultiple])

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
    shouldDisplayCheckIcon = true,
    responsiveVariants,
    variants,
    styles,
    filterButtonProps,
    checkIconProps,
  } = props

  const { Theme } = useCodeleapContext()

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

  const onPressItem = useCallback(({ item, option }: { option: ItemOptionProps; item: ModalDataItemProps}) => {

    const hasOptions = !!item?.options

    _setDraft((state) => {

      const items = { ...state }

      const currentSelectedItems = Array.isArray(state?.[item.key]) ? state[item.key] : []

      let isItemAlreadySelected = null
      let newItems = null

      if (item?.selectMultiple) {
        isItemAlreadySelected = currentSelectedItems?.includes(option.value)
      } else {
        isItemAlreadySelected = hasOptions ? (!TypeGuards.isNil(items) && items[item.key] === option?.value) : Object.values(items)?.includes?.(option?.value)
      }

      newItems = item.selectMultiple && hasOptions ? [...currentSelectedItems, option.value] : option?.value

      const shouldRemoveItem = isItemAlreadySelected && (item.selectMultiple ? newItems.length === 0 : true)

      if (shouldRemoveItem) {
        if (hasOptions) {
          delete items[item.key]
        } else {
          delete items[option?.label]
        }
      } else {
        items[item.key] = newItems
      }

      return items
    })

    onSelectItem?.({ key: item.key, option })

  }, [_draft, onSelectItem])

  const renderItem = useCallback(({ item }: { item: ModalDataItemProps}) => {

    const {
      showLabel = true,
    } = item

    if (!item.options) {

      const option = {
        label: item.key,
        value: item.label,
      } as ItemOptionProps

      return (
        <>
          {showLabel ? <Text style={variantStyles.label} text={item?.label} /> : null}
          <ItemOption
            option={option}
            item={item}
            items={_draft}
            styles={variantStyles}
            onPress={() => onPressItem({ option, item })}
            isLastItem={false}
            shouldApplyBiggerSpacing={false}
            shouldDisplayCheckIcon={shouldDisplayCheckIcon}
            {...checkIconProps}
          />
        </>
      )
    }

    return (
      <View variants={['column']}>
        {showLabel ? <Text style={variantStyles.label} text={item?.label} /> : null}
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
              shouldDisplayCheckIcon={shouldDisplayCheckIcon}
              {...checkIconProps}
            />
          ))}
        </View>
      </View>
    )

  }, [_draft, variantStyles, shouldDisplayCheckIcon, checkIconProps])

  const renderFooter = () => {

    if (TypeGuards.isFunction(renderFooterComponent)) {
      return renderFooterComponent({ onApply: onApplyItems, onClear: onClearItems })
    }

    const shouldDisable = false

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
    props?.onClearItems?.()
  }

  const onApplyItems = () => {
    _setSelectedItems(_draft)
    props?.onApplyItems?.(_selectedItems as ModalDataItemProps[])
  }

  return (
    <View style={variantStyles.wrapper}>

      <View style={variantStyles.scroll}>
        {data && data.map((item) => renderItem({ item }))}
      </View>

      {renderFooter()}
    </View>
  )
}

export * from './styles'
