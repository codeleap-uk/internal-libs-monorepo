import { ButtonComposition, ButtonProps } from '../Button'
import { StylesOf } from '@codeleap/types'
import { SectionFiltersComposition } from './styles'
import { StyledProp } from '@codeleap/styles'

export type ItemOptionProps = {
  label?: string | number
  value: string | number
  itemProps?: Omit<ButtonProps, 'debugName'>
}

export type OnPressOptionProps = {
  item: ItemProps
  option: ItemOptionProps
  canSelectMultiple: boolean
  hasMultipleOptions: boolean
}

export type ItemProps = {
  id: string | number
  label?: string | number
  canSelectMultiple?: boolean
  descriptionLabel?: string
  showDescriptionLabel?: boolean
  options?: ItemOptionProps[]
  itemProps?: Omit<ButtonProps, 'debugName'>
  selectedItemProps?: Omit<ButtonProps, 'debugName'>
}

export type onSelectItemProps = {
  id: ItemProps['id']
  option: ItemOptionProps
}

type ApplyFunction = (items?: ItemProps[]) => void
type ClearFunction = () => void

export type SectionFilterFooterProps = {
  onClear: ClearFunction
  onApply: ApplyFunction
  shouldDisableActions: boolean
}

type Item = Record<string, any> | Array<any>

export type SectionFiltersProps = {
  data?: ItemProps[]
  selectedItems?: Item
  setSelectedItems?: (value: Item) => void
  draftItems?: Item
  setDraftItems?: (value: Item) => void
  onSelectItem?: (item: onSelectItemProps) => void
  onClearItems?: ClearFunction
  onApplyItems?: ApplyFunction
  renderFooterComponent?: (props: SectionFilterFooterProps) => JSX.Element
  applyFilterButtonProps?: Omit<ButtonProps, 'debugName'>
  clearFilterButtonProps?: Omit<ButtonProps, 'debugName'>
  filterOnOptionPress?: boolean
  applyButtonText?: string
  clearButtonText?: string
  style?: StyledProp<SectionFiltersComposition>
}

export type OptionProps = {
  option: ItemOptionProps
  item: ItemProps
  styles: StylesOf<ButtonComposition>
  selectedItems: object
  onPress: () => void
  canSelectMultiple: boolean
}
