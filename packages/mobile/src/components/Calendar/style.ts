import { createDefaultVariantFactory } from '@codeleap/common'
import { TCalendarStyles, CalendarComposition } from './types'

const createCalendarStyle = createDefaultVariantFactory<CalendarComposition, TCalendarStyles>()

export const CalendarStyles = {
  default: createCalendarStyle((theme) => ({
    theme: {
      backgroundColor: '#0000',
      calendarBackground: '#0000',
      textSectionTitleColor: theme.colors.textH,
      textSectionTitleDisabledColor: theme.colors.disabled,
      selectedDayBackgroundColor: theme.colors.primary,
      selectedDayTextColor: theme.colors.white,
      todayTextColor: theme.colors.textH,
      dayTextColor: theme.colors.textP,
      textDisabledColor: theme.colors.disabled,
      dotColor: theme.colors.primary,
      selectedDotColor: theme.colors.primary,
      arrowColor: theme.colors.primary,
      disabledArrowColor: theme.colors.disabled,
      monthTextColor: theme.colors.textH,
      indicatorColor: theme.colors.backgroundSecondary,
      textDayFontFamily: theme.typography.base.fontFamily,
      textMonthFontFamily: theme.typography.base.fontFamily,
      textDayHeaderFontFamily: theme.typography.base.fontFamily,
      textDayFontWeight: '400',
      textMonthFontWeight: 'bold',
      textDayHeaderFontWeight: '400',
      textDayFontSize: 16,
      textMonthFontSize: 22,
      textDayHeaderFontSize: 15,
    },
  })),
}
