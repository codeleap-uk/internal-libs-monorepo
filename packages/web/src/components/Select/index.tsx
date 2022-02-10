import { CustomSelect } from './Custom'
import { NativeSelect, NativeSelectProps } from './Native'
import { CustomSelectProps } from './types'

export type SelectProps<T extends string | number = string> =
  | ({
      type?: 'native';
    } & NativeSelectProps)
  | ({
      type?: never;
    } & CustomSelectProps<T>);

export * from './types'
export * from './styles'

export const Select = <T extends string | number = string>(
  props: SelectProps<T>,
) => {
  if (props.type === 'native') {
    return <NativeSelect {...props} />
  }

  return <CustomSelect {...props} />
}
