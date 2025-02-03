import { AnyRecord } from '@codeleap/types'
import { deepMerge } from '@codeleap/utils'
import { createPathConfigForStaticNavigation } from '@react-navigation/native'

type TreeStack = Parameters<typeof createPathConfigForStaticNavigation>[0]

/**
 * Extracts screen options from a static navigation tree, consolidating default, group, 
 * and individual screen options into a single object. Supports nested navigators.
 */
export function staticNavigationExtractOptions(stack: TreeStack) {
  const { config } = stack

  // @ts-ignore
  const defaultOptions = config.screenOptions

  let result = {}

  function extractScreens(screens: TreeStack['config'], groupKey: string | null, groupOptions: AnyRecord) {
    let screenResults = {}

    for (const screenKey in screens) {
      const screen = screens[screenKey]

      const key = groupKey ? `${groupKey}.${screenKey}` : screenKey

      const isComponentInstance = typeof screen !== 'object'

      const defaultScreenOptions = deepMerge(defaultOptions, groupOptions)

      if (isComponentInstance) {
        screenResults[key] = defaultScreenOptions
        continue
      }

      const screenOptions = deepMerge(defaultScreenOptions, screen.options)

      const isNavigationInstance = !!screen?.screen?.config?.screens

      if (isNavigationInstance) {
        screenResults = deepMerge(
          screenResults,
          extractScreens(screen?.screen?.config?.screens, null, screenOptions)
        )
        continue
      }

      screenResults[key] = screenOptions
    }

    return screenResults
  }

  for (const groupKey in config.groups) {
    const group = config.groups[groupKey]

    // @ts-ignore
    const groupOptions = group.screenOptions

    result = deepMerge(result, extractScreens(group.screens, null, groupOptions))
  }

  return result
}