import { throttle } from '@codeleap/utils'
import { useEffect } from 'react'
import { AppSettings } from '@codeleap/types'
import { PerformanceError } from './errors'

export type InspectRenderOptions = {
  noHooks?: boolean
  logMode?: 'raw' | 'summarized'
  throttleInterval?: number
  maxRenders?: number
}

export type PerformanceInspector = {
  inspectRender: (name: string, options?: InspectRenderOptions) => void
}

const renderCounter: Record<string, number> = {}

export function makePerformanceInspector(settings: AppSettings) {
  /**
   * inspectRender monitors how much time a component render per second.
   * Use perf.inspectRender('ComponentName') inside a component to monitor it.
   * @param {string} name - Component name
   * @param {PerformanceInspector} options - Some options for the inspector
   * @returns
   */
  const inspectRender = (
    name: string,
    options: InspectRenderOptions = {
      noHooks: false,
      logMode: 'summarized',
      throttleInterval: 1000,
      maxRenders: settings?.PerformanceInspector.maxRenders,
    },
  ) => {
    const blacklist = settings?.PerformanceInspector.blacklist || []
    if (blacklist.some((item) => name.startsWith(item))) return

    const { noHooks, logMode, throttleInterval, maxRenders } = options

    if (
      !settings?.PerformanceInspector.enable ||
      !settings?.Environment.IsDev
    ) {
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

  return { inspectRender }
}
