import { onMount, useUnmount } from '../../utils'
import { AppSettings } from '../../config'
import { useCodeleapContext } from '../../styles'
import { throttle } from 'lodash'
import { PerformancerErrors } from './errors'

export type InspectRenderOptions = {
  noHooks?: boolean
  logMode: 'raw' | 'summarized'
  throttleInterval: number
}

export function makePerformancer(settings: AppSettings) {
  const renderCounter: Record<string, number> = {}

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

    if (!settings?.Performancer.enable || !settings?.Environment.IsDev) return

    if (noHooks) {
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
    function logSummary() {
      const renders = renderCounter[name]
      const maxRenders = settings?.Performancer?.maxRenders
      if (renders >= maxRenders) {
        throw new PerformancerErrors('maxRenders', {
          name,
          throttleInterval,
          maxRenders,
        })
      }

      logger.log(`Render summary -> ${name}: ${renders}`)
      renderCounter[name] = 0
    }

    throttle(logSummary, throttleInterval)()
  }

  return { inspectRender }
}
