import { TextInput } from '../../components'
import { DatePickerProps } from '../types'

export const OuterInput: DatePickerProps['outerInputComponent'] = ({ hideInput, onChange, value, ...props }) => {
  if (hideInput) {
    return null
  }

  return (
    <TextInput
      debugName='DatePicker - OuterInputComponent'
      {...props}
      value={value}
      onChangeText={onChange}
    />
  )
}
