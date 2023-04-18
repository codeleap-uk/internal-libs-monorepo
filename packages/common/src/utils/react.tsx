import equals from 'deep-equal'
import { LogFunctionArgs } from '../tools/Logger/types'
import React from 'react'
import * as TypeGuards from './typeGuards'

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


export function getRenderedComponent<P = any>(
  ComponentOrProps: React.FC<P> | P | React.ReactNode | null | undefined,  
  DefaultComponent: React.FC<P>, 
  props?: P
): React.ReactNode {
  if(TypeGuards.isNil(ComponentOrProps) || Object.keys(ComponentOrProps).length === 0 ) {
    return null
  }
  
  if (TypeGuards.isFunction(ComponentOrProps)) {
    return <ComponentOrProps {...props}/>
  }

  if(React.isValidElement(ComponentOrProps)) {
    return ComponentOrProps
  }

  const _props = ComponentOrProps as P


  return <DefaultComponent {...props} {..._props}/>
}