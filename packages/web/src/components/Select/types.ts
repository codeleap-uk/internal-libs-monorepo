import {
  ComponentVariants,
  FormTypes,
  IconPlaceholder,
} from '@codeleap/common'
import { StylesOf } from '../../types/utility'
import { WebSelectComposition, WebSelectStyles } from './styles'

export type SelectRenderFNProps<T> = FormTypes.Options<T>[number] & {
  styles: StylesOf<WebSelectComposition>;
  onPress: () => void;
  selected?: boolean;
  inList?: boolean;
  open?: boolean;
};

export type SelectRenderFN<T> = (props: SelectRenderFNProps<T>) => JSX.Element;

export type CustomSelectProps<T> = {
  value: T;
  placeholder?: string;
  label?: FormTypes.Label;
  options?: FormTypes.Options<T>;
  onDropdownToggle?: (isOpen?: boolean) => void;
  onValueChange?: (value: T) => void;
  renderItem?: SelectRenderFN<T>;
  renderCurrentlySelected?: SelectRenderFN<T>;
  styles?: StylesOf<WebSelectComposition>;
  disabled?: boolean;
  validate?: FormTypes.ValidatorFunctionWithoutForm<any> | string;
  arrowIconName?: IconPlaceholder;
} & ComponentVariants<typeof WebSelectStyles>;
