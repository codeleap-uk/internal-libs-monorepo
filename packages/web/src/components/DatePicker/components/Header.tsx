import { TypeGuards } from '@codeleap/types'
import { ActionIcon, Text, View } from '../../components'
import { DatePickerArrowProps, DatePickerHeaderComponent } from '../types'
import { AppIcon, useCompositionStyles } from '@codeleap/styles'
import dayjs from 'dayjs'

export const ArrowLabel = ({ name, direction, ...props }: DatePickerArrowProps) => {
  return (
    <ActionIcon
      name={name ?? (`chevron-${direction}` as AppIcon)}
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

  const month = dayjs(date).format('MMMM')
  const year = dayjs(date).year()

  const title = TypeGuards.isFunction(formatHeaderTitle)
    ? formatHeaderTitle(date)
    : `${month} ${year}`

  const compositionStyles = useCompositionStyles(['prevButton', 'nextButton'], styles)

  return (
    <View style={styles.wrapper}>
      <View style={styles.buttonsWrapper}>
        <ArrowLabel
          direction='left'
          style={compositionStyles.prevButton}
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
          style={compositionStyles.nextButton}
          onPress={increaseYear}
          disabled={nextYearButtonDisabled}
        />
      </View>
      <View style={styles.buttonsWrapper}>
        <ArrowLabel
          direction='left'
          style={compositionStyles.prevButton}
          onPress={decreaseMonth}
          disabled={prevMonthButtonDisabled}
        />
        <ArrowLabel
          direction='right'
          style={compositionStyles.nextButton}
          onPress={increaseMonth}
          disabled={nextMonthButtonDisabled}
        />
      </View>
    </View>
  )
}
