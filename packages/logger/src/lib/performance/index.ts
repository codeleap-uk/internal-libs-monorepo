import { throttle } from '@codeleap/utils'
import { useEffect } from 'react'
import { PerformanceError } from './errors'
import { InspectRenderOptions } from './types'
import { LoggerConfig } from '../../types'

export * from './types'

export class PerformanceService {
  renderCounter: Record<string, number> = {}

  constructor(private config: LoggerConfig) { }

  /**
  * inspectRender monitors how much time a component render per second.
  * Use logger.perf.inspectRender('ComponentName') inside a component to monitor it.
  * @param {string} name - Component name
  * @param {PerformanceInspector} options - Some options for the inspector
  * @returns
  */
  inspectRender = (
    name: string,
    options: InspectRenderOptions = {
      noHooks: false,
      logMode: 'summarized',
      throttleInterval: 1000,
    },
  ) => {
    const config = this.config.Logger.performanceInspector

    const blacklist = config.blacklist || []

    if (blacklist.some((item) => name.startsWith(item))) return

    const { noHooks, logMode, throttleInterval, maxRenders = config.maxRenders } = options

    if (!config.enabled || !this.config.Environment.IsDev) {
      return
    }

    if (!noHooks) {
      useEffect(() => {
        console.log(`[PerformanceInspector] Mounted -> ${name}`)

        return () => {
          console.log(`[PerformanceInspector] Unmounted -> ${name}`)
        }
      })
    }

    this.renderCounter[name] = this.renderCounter[name] ? this.renderCounter[name] + 1 : 1
    
    const renders = this.renderCounter[name]

    if (renders > maxRenders) {
      this.renderCounter[name] = 0

      throw new PerformanceError('maxRenders', {
        name,
        throttleInterval,
        maxRenders,
      })
    }

    if (logMode === 'raw') {
      console.log(`[PerformanceInspector] Rendered -> ${name}: ${renders}`)
      return
    }

    function logSummary() {
      if (renders <= 0) return

      console.log(`[PerformanceInspector] Render summary -> ${name}: ${renders}`)
      this.renderCounter[name] = 0
    }

    throttle(logSummary, name, throttleInterval)
  }
}