import { IconPlaceholder, getNestedStylesByKey } from '@codeleap/common'
import { ActionIcon, Text, View } from '../../components'
import { DatePickerArrowProps, DatePickerProps } from '../types'
import { format, getYear } from 'date-fns'
import { get } from 'js-cookie'

export const ArrowLabel: React.FC<DatePickerArrowProps> = ({
  name,
  direction,
  ...props
}) => {
  return (
    <ActionIcon
      name={name ?? `chevron-${direction}` as IconPlaceholder}
      debugName={'Calendar arrowLabel'}
      {...props}
    />
  )
}

export const Header: DatePickerProps['headerComponent'] = (props) => {
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
  } = props

  const month = format(date, 'MMMM')
  const year = getYear(date)

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
          text={`${month} ${year}`}
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
