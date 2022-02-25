import equals from 'deep-equal'
import { Logger } from '../tools/Logger'
import { LogFunctionArgs } from '../tools/Logger/types'

export const deepEqual = equals

type ArePropsEqualOptions<MergedObject> = {
  check: (keyof MergedObject)[]
  debug?: boolean
  excludeKeys?: string[]
}

export function arePropsEqual<A, B>(
  previous: A,
  next: B,
  options: ArePropsEqualOptions<A & B>,
) {
  const { check, excludeKeys = [], debug } = options
  for (const c of check) {
    const nextItem = next[c as string]
    const prevItem = previous[c as string]

    for (const key of excludeKeys) {
      if (nextItem?.[key]) delete nextItem[key]
      if (prevItem?.[key]) delete prevItem[key]
    }

    const propsAreEqual = equals(nextItem, prevItem)

    if (!propsAreEqual) {
      const logArgs: LogFunctionArgs = [
        'Props not equal',
        { item: c, nextItem, prevItem, previous, next, check },
        'arePropsEqual',
      ]
      if (debug) Logger.coloredLog('debug', logArgs, 'yellow')
      return false
    }
  }
  return true
}
