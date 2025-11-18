import { AnyRecord } from '@codeleap/types'
import { useRef, Children } from 'react'

const simpleHash = (str: string): string => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash).toString()
}

const normalizeProps = <P extends AnyRecord>(props: P, keys: Array<keyof P>): Partial<P> => {
  return keys.reduce((acc, key) => {
    if (key === 'children') {
      acc[key] = Children.map(props[key], (child) => typeof child === 'object' ? '[Component]' : child,
      )
    } else {
      acc[key] = props[key]
    }
    return acc
  }, {} as Partial<P>)
}

const normalizeDebugName = (debugName: string) => {
  return debugName.trim().replace(/\s+/g, '-').toLowerCase()
}

const generateComponentTestId = <P extends AnyRecord>(componentName: string, props: P, keys: Array<keyof P>) => {
  const hasDebugName = typeof props?.debugName === 'string'
  if (hasDebugName) return `${componentName}:${normalizeDebugName(props?.debugName)}`
  const extractedProps = normalizeProps(props, keys)
  return `${componentName}:${simpleHash(JSON.stringify(extractedProps))}`
}

/**
 * Hook that generates a stable test ID for a component based on its props.
 * Uses debugName if available, otherwise generates a hash from specified prop keys.
 *
 * @example
 * const testId = useComponentTestId(Button, props, ['label', 'variant'])
 * // Returns: "Button:debug-name" or "Button:123456"
 */
export const useComponentTestId = <P extends AnyRecord>(
  Component: any,
  props: P,
  keys: Array<keyof P>,
) => {
  const testIdRef = useRef(generateComponentTestId(Component.styleRegistryName, props, keys))
  return testIdRef.current
}
