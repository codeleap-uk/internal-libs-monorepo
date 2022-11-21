import {
  ComponentVariants,
  FormTypes,
  IconPlaceholder,
} from '@codeleap/common'
import { StylesOf } from '../../types/utility'
import { DrawerProps } from '../Drawer'
import { FlatListProps } from '../List'
import { TextInputProps } from '../TextInput'
import { MultiSelectComposition, MultiSelectStyles } from './styles'

export type MultiSelectRenderFNProps<T> = {
  styles: StylesOf<MultiSelectComposition>
  onPress: () => void
  isSelected?: boolean
  item: FormTypes.Options<T>[number]
  icon?: IconPlaceholder
}

export type MultiSelectRenderFN<T> = (props: MultiSelectRenderFNProps<T>) => JSX.Element

type MultiSelectDrawerProps = Omit<DrawerProps, 'variants' | 'styles'>

export type MultiSelectProps<T> = MultiSelectDrawerProps & {
    value: T[]
    placeholder?: FormTypes.Label
    label?: FormTypes.Label
    options?: FormTypes.Options<T>
    onValueChange?: (value: T[]) => void
    renderItem?: MultiSelectRenderFN<T>
    styles?: StylesOf<MultiSelectComposition>
    style?: any
    arrowIconName?: IconPlaceholder
    inputProps?: Partial<TextInputProps>
    selectedIcon?: IconPlaceholder
    hideInput?: boolean
    limit?: number
    listProps?: Partial<FlatListProps>
    clearable?: boolean
    clearIconName?: IconPlaceholder
    validate?: TextInputProps['validate']
  } & ComponentVariants<typeof MultiSelectStyles>

