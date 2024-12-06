import { obfuscate } from './obfuscate'
import { AppSettings } from '@codeleap/common'
import { FunctionType, AnyFunction } from '@codeleap/types'

export type AnalyticsObject = {
  name: string
  type: 'interaction' | 'event'
  data: any
}

type IAnalyticsArgs = {
  init(): any
  prepareData: () => any
  error?: (err: any) => any
} & Record<`on${Capitalize<AnalyticsObject['type']>}`, FunctionType<[AnalyticsObject], void>>

export class Analytics {

  constructor(private callers: IAnalyticsArgs, private settings: AppSettings) {
    this.callers.init()

  }

  private prepare() {
    const data = this.callers.prepareData()

    return data
  }

  obfuscate(data) {
    return obfuscate({
      object: data,
      keys: this?.settings?.Logger?.Obfuscate?.keys || [],
      values: this?.settings?.Logger?.Obfuscate?.values || [],
    })
  }

  event(name: string, data = {}) {
    this.handle(name, data, 'event', this.callers.onEvent)
  }

  interaction(name: string, data = {}) {
    this.handle(name, data, 'interaction', this.callers.onInteraction)

  }

  onError(cb) {
    this.callers.error = cb
  }

  private handle(name: string, data: any, type: AnalyticsObject['type'], fn: AnyFunction) {
    try {

      const obfuscated = this.obfuscate({
        ...data,
        ...this.prepare(),
      })

      fn({
        name,
        type,
        data: obfuscated,
      })
    } catch (e) {
      this.callers.error(e)
    }
  }
}
