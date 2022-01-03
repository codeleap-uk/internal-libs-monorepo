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
  const { responsiveVariants = {}, variants = [], component = 'div', children,   ...props } = viewProps
  const variantStyles = useComponentStyle('View', {
    responsiveVariants,
    variants,
  })
 
  const Component = component 

 
  return <Component  css={variantStyles.wrapper} {...props}>
    {children}
  </Component>
}   
