import { onMount, throttle, useUnmount } from '../../utils'
import { AppSettings } from '../../config'
import { useCodeleapContext } from '../../styles'
import { PerformanceError } from './errors'

export type InspectRenderOptions = {
  noHooks?: boolean
  logMode?: 'raw' | 'summarized'
  throttleInterval?: number
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
    },
  ) => {
    const { logger } = useCodeleapContext()
    const { noHooks, logMode, throttleInterval } = options

    if (
      !settings?.PerformanceInspector.enable ||
      !settings?.Environment.IsDev
    ) {
      return
    }

    if (!noHooks) {
      onMount(() => {
        logger.log(`Mounted -> ${name}`)
      })
      useUnmount(() => {
        logger.log(`Unmounted -> ${name}`)
      })
    }

    if (logMode === 'raw') {
      logger.log(`Rendered -> ${name}`)
    }

    renderCounter[name] = renderCounter[name] ? renderCounter[name] + 1 : 1

    const maxRenders = settings?.PerformanceInspector?.maxRenders
    if (renderCounter[name] > maxRenders) {
      throw new PerformanceError('maxRenders', {
        name,
        throttleInterval,
        maxRenders,
      })
    }

    function logSummary() {
      const renders = renderCounter[name]
      if (renders <= 0) return

      logger.log(`Render summary -> ${name}: ${renders}`)
      renderCounter[name] = 0
    }

    throttle(logSummary, name, throttleInterval)
  }

  return { inspectRender }
}
