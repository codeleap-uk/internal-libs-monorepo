import { StyleRecord } from '@codeleap/styles'
import { DatePickerProps, YearComponentProps } from '../types'
import { DatePickerComposition } from '../styles'
import { TypeGuards } from '@codeleap/types'
import { View } from '../../View'
import { Text } from '../../Text'
import { useInputBasePartialStyles } from '../../InputBase/useInputBasePartialStyles'

type Props = YearComponentProps & {
  styles: StyleRecord<DatePickerComposition>
  component: DatePickerProps['yearComponent']
}

export const YearContent = (props: Props) => {
  const { value, year, styles, component: Component } = props

  const isSelected = String(value)?.includes(year as string)

  const partialStyles = useInputBasePartialStyles(styles, ['yearWrapper', 'year'], {
    selected: isSelected,
  })

  if (TypeGuards.isFunction(Component)) {
    return (
      <Component
        {...props}
        value={value}
        selected={isSelected}
        styles={styles}
      />
    )
  }

  return (
    <View style={partialStyles?.yearWrapper}>
      <Text style={partialStyles?.year} text={year as string} />
    </View>
  )
}