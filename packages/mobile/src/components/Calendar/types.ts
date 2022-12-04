import { FilterKeys } from '@codeleap/common'
import { Paths } from '@codeleap/common/dist/types/pathMapping'
import { TextStyle, ViewStyle } from 'react-native'

type CalendarTheme = {
    timelineContainer?: object
    contentStyle?: ViewStyle
    event?: object
    eventTitle?: object
    eventSummary?: object
    eventTimes?: object
    line?: object
    verticalLine?: object
    nowIndicatorLine?: object
    nowIndicatorKnob?: object
    timeLabel?: object
    todayTextColor?: string
    calendarBackground?: string
    indicatorColor?: string
    textSectionTitleColor?: string
    textSectionTitleDisabledColor?: string
    dayTextColor?: string
    selectedDayTextColor?: string
    monthTextColor?: string
    selectedDayBackgroundColor?: string
    arrowColor?: string
    textDisabledColor?: string
    textInactiveColor?: string
    backgroundColor?: string; //TODO: remove in V2
    dotColor?: string
    selectedDotColor?: string
    disabledArrowColor?: string
    textDayFontFamily?: TextStyle['fontFamily']
    textMonthFontFamily?: TextStyle['fontFamily']
    textDayHeaderFontFamily?: TextStyle['fontFamily']
    textDayFontWeight?: TextStyle['fontWeight']
    textMonthFontWeight?: TextStyle['fontWeight']
    textDayHeaderFontWeight?: TextStyle['fontWeight']
    textDayFontSize?: number
    textMonthFontSize?: number
    textDayHeaderFontSize?: number
    agendaDayTextColor?: string
    agendaDayNumColor?: string
    agendaTodayColor?: string
    agendaKnobColor?: string
    todayButtonFontFamily?: TextStyle['fontFamily']
    todayButtonFontWeight?: TextStyle['fontWeight']
    todayButtonFontSize?: number
    textDayStyle?: TextStyle
    dotStyle?: object
    arrowStyle?: ViewStyle
    todayBackgroundColor?: string
    disabledDotColor?: string
    inactiveDotColor?: string
    todayDotColor?: string
    todayButtonTextColor?: string
    todayButtonPosition?: string
    arrowHeight?: number
    arrowWidth?: number
    weekVerticalMargin?: number
    stylesheet?: {
      calendar?: {
        main?: object
        header?: object
      }
      day?: {
        basic?: object
        period?: object
      }
      dot?: object
      marking?: object
      'calendar-list'?: {
        main?: object
      }
      agenda?: {
        main?: object
        list?: object
      }
      expandable?: {
        main?: object
      }
    }
  }

type FlatStyleKeys = 'dot' | 'marking'

type StyleSheetKeys = Exclude<keyof CalendarTheme['stylesheet'], FlatStyleKeys>

type ThemeObjPrimitiveKeys = FilterKeys<CalendarTheme, string|number>

type ThemeObjCompositionKeys = Exclude<keyof CalendarTheme, ThemeObjPrimitiveKeys | 'stylesheet'>

type StyleSheetObjKeys = Exclude<Paths<CalendarTheme['stylesheet']>, StyleSheetKeys>

export type CalendarStyleGen<TCSS = any> = {
    theme?: Partial<{
        [P in ThemeObjPrimitiveKeys]: CalendarTheme[P]
    }>
} & Partial<Record<StyleSheetObjKeys | 'wrapper' | ThemeObjCompositionKeys, TCSS>>

export type CalendarComposition = keyof CalendarStyleGen
export type TCalendarStyles = CalendarStyleGen<any>
