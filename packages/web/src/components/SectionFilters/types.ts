import { Button } from '@codeleap/web'
import { AnyFunction, ComponentVariants, PropsOf } from '@codeleap/common'
import { SectionFiltersComposition, SectionFilterPresets } from './styles'

export type ItemOptionProps = {
    label?: string
    value: string | number
}

export type OnPressOptionProps = {
    item: ModalDataItemProps
    option: ItemOptionProps
    canSelectMultiple: boolean
    hasMultipleOptions: boolean
}

export type ModalDataItemProps = {
    id: string | number
    label?: string
    canSelectMultiple?: boolean
    showDescriptionLabel?: boolean
    options?: ItemOptionProps[]
}

type onSelectItemProps = {
    id: ModalDataItemProps['id']
    option: ItemOptionProps
}

type FooterComponentProps = {
    onClear: SectionFiltersProps['onClearItems']
    onApply: SectionFiltersProps['onApplyItems']
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
    applyFilterButtonProps?: Omit<PropsOf<typeof Button>, 'debugName'>
    clearFilterButtonProps?: Omit<PropsOf<typeof Button>, 'debugName'>
    filterOnOptionPress?: boolean
  } & ComponentVariants<typeof SectionFilterPresets>

export type OptionProps = {
    option: ItemOptionProps
    item: ModalDataItemProps
    styles: Record<SectionFiltersComposition, any>
    selectedItems: object
    onPress: () => void
    canSelectMultiple: boolean
}
