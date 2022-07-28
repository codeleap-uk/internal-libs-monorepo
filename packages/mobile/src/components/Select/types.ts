import {
  ComponentVariants,
  FormTypes,
  IconPlaceholder,
} from '@codeleap/common'
import { StylesOf } from '../../types/utility'
import { DrawerProps } from '../Drawer'
import { FlatListProps } from '../List'
import { TextInputProps } from '../TextInput'
import { SelectComposition, SelectStyles } from './styles'

export type SelectRenderFNProps<T> = & {
  styles: StylesOf<SelectComposition>
  onPress: () => void
  isSelected?: boolean
  item: FormTypes.Options<T>[number]
}

export type SelectRenderFN<T> = (props: SelectRenderFNProps<T>) => JSX.Element

type SelectDrawerProps = Omit<DrawerProps, 'variants' | 'styles'>

export type CustomSelectProps<T> = SelectDrawerProps & {
    value: T
    placeholder?: FormTypes.Label
    label?: FormTypes.Label
    options?: FormTypes.Options<T>
    onValueChange?: (value: T) => void
    renderItem?: SelectRenderFN<T>
    styles?: StylesOf<SelectComposition>
    style?: any
    hideInput?: boolean

    arrowIconName?: IconPlaceholder
    closeOnSelect?: boolean
    inputProps?: Partial<TextInputProps>
    listProps?: Partial<FlatListProps>
  } & ComponentVariants<typeof SelectStyles>

