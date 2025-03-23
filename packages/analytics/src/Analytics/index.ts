import { AnyFunction, AnyRecord } from '@codeleap/types'
import { obfuscate } from '../obfuscate'
import { AnalyticsFunctions, AnalyticsObject, AnalyticsOptions } from './types'

export * from './types'

export class Analytics<Events extends AnyRecord> {
  private enabled: boolean

  private prepareAnalyticsData() {
    const data = this.options.prepareData()
    return data
  }

  private obfuscateAnalyticsData(data: any) {
    return obfuscate({
      object: data,
      keys: this.options.obfuscateKeys || [],
      values: this.options.obfuscateValues || [],
    })
  }

  constructor(
    private options: AnalyticsOptions,
    private functions: AnalyticsFunctions
  ) {
    this.enabled = options.enabled
    
    if (options.enabled) {
      this.options.init()
    }
  }

  event<T extends keyof Events>(name: T, data: Events[T] = {} as Events[T]) {
    this.handle(name, data, 'event', this.functions.onEvent)
  }

  interaction<T extends keyof Events>(name: T, data: Events[T] = {} as Events[T]) {
    this.handle(name, data, 'interaction', this.functions.onInteraction)
  }

  private handle(name: keyof Events, data: any, type: AnalyticsObject['type'], fn: AnyFunction) {
    if (!this.enabled) return

    try {
      const obfuscated = this.obfuscateAnalyticsData({
        ...data,
        ...this.prepareAnalyticsData(),
      })

      fn({
        name,
        type,
        data: obfuscated,
      })
    } catch (e) {
      this.functions.onError(e)
    }
  }
}