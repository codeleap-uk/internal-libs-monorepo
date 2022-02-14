import {
  ComponentVariants,
  FormTypes,
  IconPlaceholder,
} from '@codeleap/common'
import { ReactElement } from 'react'
import { StylesOf } from '../../types/utility'
import { ButtonProps } from '../Button'
import { TextInputProps } from '../TextInput'
import { MobileSelectComposition, MobileSelectStyles } from './styles'
  
export type SelectRenderFNProps<T> = FormTypes.Options<T>[number] & {
  styles: StylesOf<MobileSelectComposition>;
  onPress: () => void;
  selected?: boolean;
};
  
export type SelectRenderFN<T> = (props: SelectRenderFNProps<T>) => JSX.Element;
  
export type CustomSelectProps<T> = {
    value: T;
    placeholder?: string;
    label?: string;
    options?: {label:string, value:T}[];
    onDropdownToggle?: (isOpen?: boolean) => void;
    onValueChange?: (value: T) => void;
    renderItem?: SelectRenderFN<T>;
    styles?: StylesOf<MobileSelectComposition>;
    style?: any
    arrowIconName?: IconPlaceholder
    scroll?: boolean
    closeOnSelect?: boolean
    footer?: ReactElement
    header?: ReactElement
    showLabelOnModal?: boolean
    modalCloseIconName?: IconPlaceholder
    showClose?: boolean
    modalLabel?: string
    closeButtonProps?: Partial<ButtonProps>
  } & ComponentVariants<typeof MobileSelectStyles> & TextInputProps;
  
