import {
  IconPlaceholder,
  TypeGuards,
  getNestedStylesByKey,
} from '@codeleap/common'
import { ActionIcon, Text, View } from '../../components'
import { DatePickerArrowProps, DatePickerHeaderComponent } from '../types'
import { format, getYear } from 'date-fns'

export const ArrowLabel: React.FC<DatePickerArrowProps> = ({
  name,
  direction,
  ...props
}) => {
  return (
    <ActionIcon
      name={name ?? (`chevron-${direction}` as IconPlaceholder)}
      debugName={'Calendar arrowLabel'}
      {...props}
    />
  )
}

export const Header = (props: DatePickerHeaderComponent) => {
  const {
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    decreaseYear,
    increaseYear,
    prevYearButtonDisabled,
    nextYearButtonDisabled,
    nextMonthButtonDisabled,
    setYearShow,
    styles,
    formatHeaderTitle,
  } = props

  const month = format(date, 'MMMM')
  const year = getYear(date)

  const title = TypeGuards.isFunction(formatHeaderTitle)
    ? formatHeaderTitle(date)
    : `${month} ${year}`

  const prevArrow = getNestedStylesByKey('prevButton', styles)
  const nextArrow = getNestedStylesByKey('nextButton', styles)

  return (
    <View style={styles.wrapper}>
      <View style={styles.buttonsWrapper}>
        <ArrowLabel
          direction='left'
          styles={prevArrow}
          onPress={decreaseYear}
          disabled={prevYearButtonDisabled}
        />
        <Text
          onPress={() => setYearShow((curr) => !curr)}
          style={styles.title}
          text={title}
        />
        <ArrowLabel
          direction='right'
          styles={nextArrow}
          onPress={increaseYear}
          disabled={nextYearButtonDisabled}
        />
      </View>
      <View style={styles.buttonsWrapper}>
        <ArrowLabel
          direction='left'
          styles={prevArrow}
          onPress={decreaseMonth}
          disabled={prevMonthButtonDisabled}
        />
        <ArrowLabel
          direction='right'
          styles={nextArrow}
          onPress={increaseMonth}
          disabled={nextMonthButtonDisabled}
        />
      </View>
    </View>
  )
}
