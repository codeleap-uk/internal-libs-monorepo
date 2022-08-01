import equals from 'deep-equal'
import { LogFunctionArgs } from '../tools/Logger/types'
import React from 'react'

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
      if (debug) console.log(...logArgs)
      return false
    }
  }
  return true
}

export const flattenChildren = (children, flat = []) => {
  flat = [...flat, ...React.Children.toArray(children)]

  if (children.props && children.props.children) {
    return flattenChildren(children.props.children, flat)
  }

  return flat
}

export const simplifyChildren = children => {
  const flat = flattenChildren(children)

  return flat.map(
    ({
      key,
      ref,
      type,
      props: {
        children,
        ...props
      },
    }) => ({
      key, ref, type, props,
    }),
  )
}
