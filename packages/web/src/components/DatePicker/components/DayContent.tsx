import dayjs from 'dayjs';
import { DayComponentProps, DatePickerProps } from '../types'
import { TypeGuards } from '@codeleap/types'
import { DatePickerComposition } from '../styles'
import { View } from '../../View'
import { Text } from '../../Text'
import { useInputBasePartialStyles } from '../../InputBase/useInputBasePartialStyles';
import { StyleRecord } from '@codeleap/styles'

type Props = DayComponentProps & {
  minDate: DatePickerProps['minDate']
  maxDate: DatePickerProps['maxDate']
  styles: StyleRecord<DatePickerComposition>
  component: DatePickerProps['dayComponent']
}

export const DayContent = (props: Props) => {
  const { value, date: providedDate, minDate, maxDate, styles, component: Component, day } = props

  const date = dayjs(providedDate).format('DD MMM YYYY');
  const dateValue = value ? dayjs(value).format('DD MMM YYYY') : ''

  const isSelected = date === dateValue

  const isDisabled = [
    dayjs(providedDate).isBefore(dayjs(minDate)),
    dayjs(providedDate).isAfter(dayjs(maxDate))
  ].some(Boolean)

  const partialStyles = useInputBasePartialStyles(styles, ['dayWrapper', 'day'], {
    selected: isSelected,
    disabled: !isSelected && isDisabled,
  })

  if (TypeGuards.isFunction(Component)) {
    return (
      <Component
        {...props}
        value={value}
        disabled={isDisabled}
        selected={isSelected}
        styles={styles}
      />
    )
  }

  return (
    <View style={partialStyles?.dayWrapper}>
      <Text style={partialStyles?.day} text={String(day)} />
    </View>
  )
}