import { throttle } from '@codeleap/utils'
import { useEffect } from 'react'
import { PerformanceError } from './errors'
import { appSettings } from '../Settings'
import { InspectRenderOptions } from './types'

export * from './types'

const renderCounter: Record<string, number> = {}

/**
  * inspectRender monitors how much time a component render per second.
  * Use logger.perf.inspectRender('ComponentName') inside a component to monitor it.
  * @param {string} name - Component name
  * @param {PerformanceInspector} options - Some options for the inspector
  * @returns
*/
export const inspectRender = (
  name: string,
  options: InspectRenderOptions = {
    noHooks: false,
    logMode: 'summarized',
    throttleInterval: 1000,
  },
) => {
  const config = appSettings.config.Logger.performanceInspector
  
  const blacklist = config.blacklist || []

  if (blacklist.some((item) => name.startsWith(item))) return

  const { noHooks, logMode, throttleInterval, maxRenders = config.maxRenders } = options

  if (!config.enable || !appSettings.config.Environment.IsDev) {
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

  renderCounter[name] = renderCounter[name] ? renderCounter[name] + 1 : 1
  const renders = renderCounter[name]

  if (renders > maxRenders) {
    renderCounter[name] = 0
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
    renderCounter[name] = 0
  }

  throttle(logSummary, name, throttleInterval)
}