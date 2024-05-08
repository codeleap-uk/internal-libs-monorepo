/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  closeModalIconProps?: Omit<PropsOf<typeof ActionIcon>, 'debugName'>
  filterButtonProps?: Omit<PropsOf<typeof Button>, 'debugName'>
  checkIconProps?: Omit<PropsOf<typeof Icon>, 'debugName' | 'name'>
} & Partial<ModalProps> & ComponentVariants<typeof SectionFilterPresets>

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
      return (TypeGuards.isArray(items) && items?.includes?.(option?.value))
    }
  }, [item?.options, option?.value, items, item?.options, item?.key, item?.selectMultiple])

  const itemWrapperStyles = [styles.itemWrapper, isItemSelected && styles['itemWrapper:selected'], itemHover && styles['itemWrapper:hover']]
  const itemLabelStyles = [styles.itemLabel, isItemSelected && styles['itemLabel:selected'], itemHover && styles['itemLabel:selected']]

  const displayCheckIcon = isItemSelected && shouldDisplayCheckIcon

  return (
    <Touchable
      style={[
        itemWrapperStyles,
        { marginBottom: isLastItem && shouldApplyBiggerSpacing ? 16 : itemWrapperStyles?.marginBottom },
      ]}
      debugName={`Section Filters modal - on ${option?.label} press`}
      onPress={onPress}
      // onHover={setItemHover}
    >
      {option.label ? (
        <View variants={['flex', 'center', (isItemSelected && shouldDisplayCheckIcon) && 'paddingLeft:2.5']}>
          <Text
            style={itemLabelStyles}
            text={option?.label}
          />
        </View>
      ) : null}
      {displayCheckIcon && (
        <Icon
          name='check'
          size={24}
          color={'white'}
          debugName={'Check icon - selected item'}
          {...checkIconProps}
        />
      )}
    </Touchable>
  )
}

export const SectionFilters = (props: SectionFiltersProps) => {

  const {
    data,
    title = 'Filters',
    onSelectItem,
    renderFooterComponent,
    shouldDisplayCheckIcon = true,
    responsiveVariants,
    variants,
    styles,
    closeModalIconProps,
    filterButtonProps,
    checkIconProps,
    ...modalProps
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

  console.log(variantStyles, 'variant styles')

  const [_selectedItems, _setSelectedItems] = useConditionalState(props?.selectedItems, props?.setSelectedItems, { fallbackValue: {}})
  const [_draft, _setDraft] = useConditionalState(props?.draftItems, props?.setDraftItems, { fallbackValue: {}})
  const [_visible, _toggle] = useConditionalState<boolean>(modalProps?.visible, modalProps?.toggle, { fallbackValue: false, hook: (init) => useBooleanToggle(init) })

  const isMobile = Theme.hooks.down('mid')

  const onPressItem = useCallback(({ item, option }: { option: ItemOptionProps; item: ModalDataItemProps }) => {

    const hasOptions = !!item?.options

    _setDraft((state) => {
      let items = { ...state }
      const currentSelectedItems = Array.isArray(state?.[item.key]) ? state[item.key] : []

      let isItemAlreadySelected = null
      let newItems = null

      if (item?.selectMultiple) {
        isItemAlreadySelected = currentSelectedItems?.includes(option.value)
      } else {
        isItemAlreadySelected = hasOptions ? (items && items[item.key] === option?.value) : Object.values(items)?.includes?.(option?.value)
      }

      if (isItemAlreadySelected) {
        newItems = currentSelectedItems.filter((val) => val !== option.value)
      } else {
        newItems = item.selectMultiple && hasOptions ? [...currentSelectedItems, option.value] : option?.value
      }

      const shouldRemoveItem = isItemAlreadySelected && (item.selectMultiple ? newItems.length === 0 : true)

      if (shouldRemoveItem) {
        if (hasOptions) {
          delete items[item.key]
        } else {
          items = Object.values(items)?.filter?.(item => item !== option?.label)
        }
      } else {
        items[item.key] = newItems
      }

      return hasOptions ? items : Object.values(items)
    })

    onSelectItem?.({ key: item.key, option })

  }, [_draft, onSelectItem])

  const renderItem = useCallback(({ item }: { item: ModalDataItemProps }) => {

    if (!item.options) {

      const option = {
        label: item.key,
        value: item.label,
      } as ItemOptionProps

      return (
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
      )
    }

    return (
      <View variants={['column']}>
        <Text style={variantStyles.label} text={item?.label} />
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

    const shouldDisable = (!Object.keys(_draft)?.length && !Object.keys(_selectedItems)?.length) || _draft?.length && _selectedItems?.length

    return (
      <Button
        style={variantStyles.footerButton}
        text={'Filter'}
        debugName={`Section Filters Footer - Apply items`}
        onPress={onApplyItems}
        disabled={shouldDisable}
        {...filterButtonProps}
      />
    )

  }

  const onClearItems = () => {
    _setDraft({})
    props?.onClearItems?.()
  }

  const onApplyItems = () => {
    _setSelectedItems(_draft)
    props?.onApplyItems?.(_selectedItems as ModalDataItemProps[])
    _toggle()
  }

  const closeIconVariants = closeModalIconProps?.hasOwnProperty('variants') ? closeModalIconProps?.variants : []

  return (
    <Modal
      debugName={`Section filters modal`}
      variants={[isMobile ? 'fullscreen' : 'centered', 'center', 'sectionFiltersModal']}
      showClose={false}
      scroll={false}
      {...modalProps}
      visible={_visible}
      toggle={_toggle}
    >
      <View style={variantStyles.wrapper}>
        <View style={variantStyles.headerWrapper}>
          <Text style={variantStyles.headerTitle} text={title} />
          <ActionIcon
            icon='x'
            debugName='Section filters modal - close modal icon on press'
            {...closeModalIconProps}
            variants={['sectionFiltersCloseModalIcon', ...closeIconVariants]}
            onPress={_toggle}
          />
        </View>

        <View style={variantStyles.scroll}>
          {data && data.map((item) => renderItem({ item }))}
        </View>

        {renderFooter()}
      </View>
    </Modal>
  )
}

export * from './styles'
