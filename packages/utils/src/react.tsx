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
  const _ComponentOrProps = ComponentOrProps as any
  const _DefaultComponent = DefaultComponent as any

  if (TypeGuards.isNil(ComponentOrProps) || Object.keys(ComponentOrProps).length === 0) {
    return null
  }

  if (TypeGuards.isFunction(ComponentOrProps)) {
    return <_ComponentOrProps {...props as unknown as P} />
  }

  if (React.isValidElement(ComponentOrProps)) {
    return ComponentOrProps
  }

  const _props = ComponentOrProps as unknown as P

  return <_DefaultComponent {...props as unknown as P} {..._props} />
}

/**
 * Memoizes a React functional component to prevent unnecessary re-renders.
 *
 * This function wraps a React functional component using `React.memo`, which provides 
 * a mechanism for memoizing the result of rendering the component. By default, it 
 * uses a comparison function that always returns `true`, indicating that the component
 * should not re-render, regardless of prop changes. This behavior essentially freezes 
 * the component's rendering until explicitly updated.
 *
 * @template P - The type of the component's props.
 * @param ComponentToMemoize - The React functional component to memoize.
 * @returns A memoized version of the input component (`React.NamedExoticComponent`).
 */
export function memoize<P extends object>(ComponentToMemoize: React.FunctionComponent<P>): React.NamedExoticComponent<P> {
  return React.memo(ComponentToMemoize, () => true)
}

/**
 * Checks whether a specific property in two sets of props is equal.
 *
 * This function compares the value of a given property (`prop`) between two objects 
 * (`prevProps` and `nextProps`) using a deep equality check (`equals`).
 *
 * @template P - The type of the props object.
 * @param prop - The key of the property to compare.
 * @param prevProps - The previous props object.
 * @param nextProps - The next props object.
 * @returns `true` if the values of the specified property are deeply equal; otherwise, `false`.
 */
export function memoChecker<P>(prop: keyof P, prevProps: P, nextProps: P): boolean {
  const nextItem = nextProps[prop]
  const prevItem = prevProps[prop]

  return equals(nextItem, prevItem)
}

/**
 * Memoizes a React functional component based on specific props.
 *
 * This function wraps a React functional component using `React.memo` with a custom comparison
 * function. The comparison function checks if the specified properties (passed as `check`) 
 * remain equal between renders. If all specified properties are equal, the component will not re-render.
 *
 * @template P - The type of the component's props.
 * @param ComponentToMemoize - The React functional component to memoize.
 * @param check - A single property key or an array of property keys to compare for memoization.
 * @returns A memoized version of the input component (`React.NamedExoticComponent`).
 *
 * @example
 * import React from 'react';
 * import { memoBy } from './utils';
 *
 * const MyComponent: React.FC<{ name: string; age: number }> = ({ name, age }) => {
 *   console.log('Rendering MyComponent...');
 *   return (
 *     <div>
 *       {name}, {age}
 *     </div>
 *   );
 * };
 *
 * // Memoize the component based on the `name` prop.
 * const MemoizedByName = memoBy(MyComponent, 'name');
 *
 * // Memoize the component based on both `name` and `age` props.
 * const MemoizedByNameAndAge = memoBy(MyComponent, ['name', 'age']);
 *
 * export { MemoizedByName, MemoizedByNameAndAge };
 *
 * // Usage in a parent component
 * <MemoizedByName name="Alice" age={25} />;
 * <MemoizedByNameAndAge name="Alice" age={25} />;
 */
export function memoBy<P extends object>(
  ComponentToMemoize: React.FunctionComponent<P>,
  check: keyof P | Array<keyof P>
): React.NamedExoticComponent<P> {
  return React.memo(ComponentToMemoize, (prevProps, nextProps) => {
    const checks = Array.isArray(check) ? check : [check]
    return checks.every((key) => memoChecker(key, prevProps, nextProps))
  })
}
