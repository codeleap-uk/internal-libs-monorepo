import { Matcher } from '@codeleap/types'

export type AnalyticsObject = {
  name: string
  type: 'interaction' | 'event'
  data: any
}

export type AnalyticsFunctions = {
  onError: (err: any) => void
  onInteraction: (obj: AnalyticsObject) => void
  onEvent: (obj: AnalyticsObject) => void
}

export type AnalyticsOptions = {
  enabled: boolean
  obfuscateKeys: Matcher<'key'>[]
  obfuscateValues: Matcher<'value'>[]
  init: () => void
  prepareData: () => any
}