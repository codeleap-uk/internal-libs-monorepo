import {
  ComponentVariants,
  FormTypes,
  IconPlaceholder,
} from '@codeleap/common'
import { StylesOf } from '../../types/utility'
import { SelectComposition, SelectStyles } from './styles'

export type SelectRenderFNProps<T> = CustomSelectProps<T>['options'][number] & {
  styles: StylesOf<SelectComposition>
  onPress: () => void
  selected?: boolean
  inList?: boolean
  open?: boolean
}

export type SelectRenderFN<T> = (props: SelectRenderFNProps<T>) => JSX.Element

export type CustomSelectProps<T = any> = {
  value: T
  placeholder?: string
  label?: FormTypes.Label
  options?: {value: T; label?: FormTypes.Label ; icon?: IconPlaceholder}[]
  onDropdownToggle?: (isOpen?: boolean) => void
  onValueChange?: (value: T) => void
  renderItem?: SelectRenderFN<T>
  renderCurrentlySelected?: SelectRenderFN<T>
  styles?: StylesOf<SelectComposition>
  disabled?: boolean
  validate?: FormTypes.ValidatorWithoutForm<any[]>
  arrowIconName?: IconPlaceholder
  autoClose?: boolean
} & ComponentVariants<typeof SelectStyles>

