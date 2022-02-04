import React, { createContext, useContext } from 'react'
import { AppTheme, DefaultVariants, DEFAULT_VARIANTS, VariantProvider } from '.'
import { AnyFunction, ComponentVariants, StylesOf } from '..'
import { StyleContextProps, StyleContextValue } from './types'
import { Logger } from '../tools/Logger'
export const StyleContext = createContext({} as StyleContextValue<DefaultVariants>)
const silentLogger = new Logger({
  Logger: {
    Level: 'silent',
  },
})
export const StyleProvider = 
<S extends DefaultVariants, 
V extends VariantProvider<any, AppTheme>
>({ children, variantProvider, variants, logger, settings }:StyleContextProps<S, V>) => {

  return (
    <StyleContext.Provider
      value={{
        Theme: variantProvider.theme,
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

export function useStyle() {
  return useContext(StyleContext)
}

type UseComponentStyleProps<
  ComponentName extends keyof DEFAULT_VARIANTS,
  C extends DefaultVariants[ComponentName] = DefaultVariants[ComponentName]
> = ComponentVariants<C> &   {
  rootElement?: keyof C[keyof C]
  styles?: StylesOf
  transform?:AnyFunction
}

export function useComponentStyle< K extends keyof DEFAULT_VARIANTS >(componentName:K, props: UseComponentStyleProps<K>) {
  const { ComponentVariants: CV, provider } = useStyle()
  const styles = props?.transform ? 
    Object.fromEntries(
      Object.entries(props?.styles||{}).map( ([key, value]) => [key, props.transform(value)]),
    ) : props.styles
  return provider.getStyles(CV[componentName], {
    variants: props.variants || [],
    responsiveVariants: props.responsiveVariants || {},
    rootElement: props.rootElement,
    styles,
  })
} 

