import { TextInput } from '../../components'
import { DatePickerProps } from '../types'

export const OuterInput: DatePickerProps['outerInputComponent'] = ({ valueLabel, focused, hideInput, ...props }) => {
  if (hideInput) {
    return null
  }

  return (
    <TextInput
      validate={!focused && props?.validate}
      debugName='DatePicker - OuterInputComponent'
      masking={{
        type: 'custom',
        options: {
          mask: 'xx/xx/xxxx',
          placeholder: props.placeholder,
          formatChars: {
            x: '[0123456789]',
          },
          maskChar: '',
        },
      }}
      {...props}
    />
  )
}
