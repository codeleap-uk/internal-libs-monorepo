import {
  ComponentVariants,
  FormTypes,
  IconPlaceholder,
  PropsOf,
} from '@codeleap/common'
import { StylesOf } from '../../types/utility'
import { GetKeyboardAwarePropsOptions } from '../../utils'
import { DrawerProps } from '../Drawer'
import { Icon } from '../Icon'
import { FlatListProps } from '../List'
import { Text } from '../Text'
import { TextInputProps } from '../TextInput'
import { Touchable } from '../Touchable'
import { SelectComposition, SelectPresets } from './styles'

export type SelectRenderFNProps<T> = {
  styles: StylesOf<SelectComposition>
  onPress: () => void
  isSelected?: boolean
  item: FormTypes.Options<T>[number]
  touchableProps?: Partial<PropsOf<typeof Touchable>>
  textProps?: Partial<PropsOf<typeof Text>>
  iconProps?: Partial<PropsOf<typeof Icon>>
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
    selectedIcon?: IconPlaceholder
    arrowIconName?: IconPlaceholder
    closeOnSelect?: boolean
    inputProps?: Partial<TextInputProps>
    listProps?: Partial<FlatListProps>
    clearable?: boolean
    clearIconName?: IconPlaceholder
    keyboardAware?: GetKeyboardAwarePropsOptions
    itemProps?: Partial<
      Pick<SelectRenderFNProps<any>, 'iconProps'|'textProps'|'touchableProps'
    >>
  } & ComponentVariants<typeof SelectPresets>

