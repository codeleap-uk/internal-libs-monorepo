/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/react'
import { ComponentVariants, useComponentStyle, ViewStyles } from '@codeleap/common'
import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

export type ViewProps<T extends ElementType<any>> = ComponentVariants<typeof ViewStyles> & {
    component?:T
    children?:ReactNode
    css?:CSSObject
} & ComponentPropsWithoutRef<T>

export const View = <T extends ElementType = 'div'>(viewProps:ViewProps<T>) => {
  const { responsiveVariants = {}, variants = [], component = 'div', children, css, ...props } = viewProps
  const variantStyles = useComponentStyle('View', {
    rootElement: 'wrapper',
    responsiveVariants,
    variants,
  })
 
  const Component = component 
  return <Component {...props} css={{...variantStyles.wrapper, ...props.style, ...css}}>
    {children}
  </Component>
}   
