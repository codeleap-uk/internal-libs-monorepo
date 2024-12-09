import equals from 'deep-equal'
import React from 'react'
import { TypeGuards } from '@codeleap/types'

export const deepEqual = equals

type ArePropsEqualOptions<MergedObject> = {
  check: (keyof MergedObject)[]
  excludeKeys?: string[]
}

export function arePropsEqual<A, B>(
  previous: A,
  next: B,
  options: ArePropsEqualOptions<A & B>,
) {
  const { check, excludeKeys = [] } = options

  for (const c of check) {
    const nextItem = next[c as string]
    const prevItem = previous[c as string]

    for (const key of excludeKeys) {
      if (nextItem?.[key]) delete nextItem[key]
      if (prevItem?.[key]) delete prevItem[key]
    }

    const propsAreEqual = equals(nextItem, prevItem)

    if (!propsAreEqual) {
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

export function getRenderedComponent<P = any>(
  ComponentOrProps: React.ComponentType<P> | P | React.ReactNode | null | undefined,
  DefaultComponent: React.ComponentType<P>,
  props?: P,
): React.ReactNode {
  if (TypeGuards.isNil(ComponentOrProps) || Object.keys(ComponentOrProps).length === 0) {
    return null
  }

  if (TypeGuards.isFunction(ComponentOrProps)) {
    return <ComponentOrProps {...props} />
  }

  if (React.isValidElement(ComponentOrProps)) {
    return ComponentOrProps
  }

  const _props = ComponentOrProps as P

  return <DefaultComponent {...props} {..._props} />
}

export function memoize<P extends object>(ComponentToMemoize: React.FunctionComponent<P>): React.NamedExoticComponent<P> {
  return React.memo(ComponentToMemoize, () => true)
}

export function memoChecker<P>(prop: keyof P, prevProps: P, nextProps: P): boolean {
  const nextItem = nextProps[prop]
  const prevItem = prevProps[prop]

  return equals(nextItem, prevItem)
}

export function memoBy<P extends object>(
  ComponentToMemoize: React.FunctionComponent<P>,
  check: keyof P | Array<keyof P>
): React.NamedExoticComponent<P> {
  return React.memo(ComponentToMemoize, (prevProps, nextProps) => {
    const checks = Array.isArray(check) ? check : [check]
    return checks.every((key) => memoChecker(key, prevProps, nextProps))
  })
}
