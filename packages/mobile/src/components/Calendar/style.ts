import { createDefaultVariantFactory, includePresets } from '@codeleap/common'
import { TCalendarStyles, CalendarComposition } from './types'

const createCalendarStyle = createDefaultVariantFactory<CalendarComposition, TCalendarStyles>()

export const CalendarPresets = includePresets((style) => createCalendarStyle(() => ({ theme: style })))
