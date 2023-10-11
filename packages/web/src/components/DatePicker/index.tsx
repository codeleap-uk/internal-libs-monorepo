import { useDefaultComponentStyle } from '@codeleap/common'
import { DatePickerPresets } from './styles'
import { DatePickerProps } from './types'
import _DatePicker from 'react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'

export * from './styles'
export * from './types'

export function DatePicker(props: DatePickerProps) {
  const {
    date,
    onDateChange,
    variants = [],
    responsiveVariants = {},
    styles = {},
  } = props

  const variantStyles = useDefaultComponentStyle<
    'u:DatePicker',
    typeof DatePickerPresets
  >('u:DatePicker', {
    variants,
    responsiveVariants,
    styles,
  })

  return (
    <_DatePicker
      style={variantStyles.wrapper}
      selected={date}
      onChange={onDateChange}
      {...props}
    />
  )
}
