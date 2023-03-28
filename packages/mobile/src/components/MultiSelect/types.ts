import {
  ComponentVariants,
  FormTypes,
  IconPlaceholder,
  PropsOf,
} from '@codeleap/common'
import { StylesOf } from '../../types/utility'
import { DrawerProps } from '../Drawer'
import { Icon } from '../Icon'
import { FlatListProps } from '../List'
import { Text } from '../Text'
import { TextInputProps } from '../TextInput'
import { Touchable } from '../Touchable'
import { MultiSelectComposition, MultiSelectPresets } from './styles'

export type MultiSelectRenderFNProps<T> = {
  styles: StylesOf<MultiSelectComposition>
  onPress: () => void
  isSelected?: boolean
  item: FormTypes.Options<T>[number]
  icon?: IconPlaceholder
  touchableProps?: Partial<PropsOf<typeof Touchable>>
  textProps?: Partial<PropsOf<typeof Text>>
  iconProps?: Partial<PropsOf<typeof Icon>>
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
    itemProps?: Partial<Pick<MultiSelectRenderFNProps<any>, 'iconProps'|'textProps'|'touchableProps'>>
  } & ComponentVariants<typeof MultiSelectPresets>

