import React, { createContext, useContext, useMemo, useState } from 'react'
import { AppTheme, EnhancedTheme } from './types'
import {
  CommonVariantObject,
  DefaultVariantBuilder,
  DefaultVariants,
  DEFAULT_VARIANTS,
  FromVariantsBuilder,
  VariantProvider,
} from './variants'

import { AnyFunction, ComponentVariants, FunctionType, NestedKeys, StylesOf } from '../types/utility'
import { silentLogger } from '../constants'
import { deepMerge, onMount, onUpdate } from '../utils'
import { StyleContextProps, StyleContextValue } from './types'

export const StyleContext = createContext(
  {} as StyleContextValue<Record<string, DefaultVariantBuilder>>,
)

function useWindowSize() {
  const window = global?.window || { process: null }
  const isBrowser = !window?.process
  const [size, setSize] = useState([0, 0])

  onMount(() => {
    if (isBrowser) {
      // @ts-ignore
      setSize([window.innerWidth, window.innerWidth])
    }
  })

  function handleResize() {
    if (isBrowser) {
      // @ts-ignore
      setSize([window.innerWidth, window.innerHeight])
    }
  }

  onUpdate(() => {
    if (isBrowser) {
      // @ts-ignore
      window.addEventListener('resize', handleResize)
      return () => {
        // @ts-ignore
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  return {
    width: size[0],
    height: size[1],
  }
}

export const StyleProvider = <
  S extends Readonly<Record<string, DefaultVariantBuilder>>,
  V extends VariantProvider<any, AppTheme>
>({
    children,
    variantProvider,
    variants,
    logger,
    settings,
  }: StyleContextProps<S, V>) => {
  const [theme, setTheme] = useState(variantProvider.theme.theme)

  onMount(() => {
    variantProvider.onColorSchemeChange((t) => {
      setTheme(t.theme as string)
    })
  })

  return (
    <StyleContext.Provider
      value={{
        Theme: variantProvider.theme,
        currentTheme: theme,
        ComponentVariants: variants,
        provider: variantProvider,
        logger: logger || silentLogger,
        Settings: settings,
      }}
    >
      {children}
    </StyleContext.Provider>
  )
}

export function useCodeleapContext() {
  return useContext(StyleContext)
}

type ComponentNameArg = keyof DEFAULT_VARIANTS
type useDefaultComponentStyleProps<
  ComponentName extends ComponentNameArg,
  C extends CommonVariantObject<any> = DefaultVariants[ComponentName],
  Comp extends NestedKeys<
    FromVariantsBuilder<any, DEFAULT_VARIANTS[ComponentName]>
  > = NestedKeys<FromVariantsBuilder<any, DEFAULT_VARIANTS[ComponentName]>>
> = ComponentVariants<C> & {
  rootElement?: Comp
  styles?: StylesOf<Comp> | StylesOf<Comp>[]
  transform?: AnyFunction
}

const getTransformedStyles = (styles, transform) => {
  if (!transform) return styles

  if (Array.isArray(styles)) {
    return styles.reduce((acc, style) => {
      return deepMerge(acc, getTransformedStyles(style, transform))
    }, {})
  }

  return Object.fromEntries(
    Object.entries(styles || {}).map(([key, value]) => [key, transform(value)]),
  )
}

export function useDefaultComponentStyle<
  K extends ComponentNameArg | `u:${string}`,
  S extends DefaultVariantBuilder<any>
>(
  componentName: K,
  props: useDefaultComponentStyleProps<
    K extends keyof DEFAULT_VARIANTS ? K : any
  >,
): K extends ComponentNameArg
  ? Record<NestedKeys<FromVariantsBuilder<any, DEFAULT_VARIANTS[K]>>, any>
  : Record<NestedKeys<FromVariantsBuilder<any, S>>, any> {
  const windowSize = useWindowSize()
  const {
    ComponentVariants: CV,
    provider,
    currentTheme,
  } = useCodeleapContext() || {}
  try {
    const styles = getTransformedStyles(props.styles, props.transform)

    let name = componentName as string

    if (componentName.startsWith('u:')) {
      name = componentName.replace('u:', '')
    }

    const v = CV?.[name]
    if (!v) {
      throw new Error(
        `Could not read context stylesheets for ${name}. Ensure it's being passed to <StyleProvider /> in the variants  prop.`,
      )
    }

    const stylesheet = useMemo(() => {
      return provider.getStyles(
        v,
        {
          // @ts-ignore
          variants: props.variants || [],
          // @ts-ignore
          responsiveVariants: props.responsiveVariants || {},
          rootElement: props.rootElement,
          // @ts-ignore
          styles,
          size: windowSize,
        },
        currentTheme as string,
      )
    }, [
      ...(props.variants ?? []),
      windowSize.height,
      windowSize.width,
      styles,
      props.rootElement,
      componentName,
    ])
    return stylesheet as any
  } catch (e) {
    throw new Error('useDefaultComponentStyle with args ' + arguments + e)
  }
}

export function useComponentStyle<
  T extends FunctionType<[EnhancedTheme<any>], any>
>(styler: T): ReturnType<T> {
  const { currentTheme, provider } = useCodeleapContext()
  try {
    const styles = useMemo(
      () => styler(provider.withColorScheme(currentTheme as string)),
      [currentTheme],
    )

    return styles
  } catch (e) {
    throw new Error(`useComponentStyle with args ${arguments} ${e}`)
  }
}
