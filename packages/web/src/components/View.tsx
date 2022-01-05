/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/react'
import { ComponentVariants, useComponentStyle, ViewStyles } from '@codeleap/common'
import { ComponentPropsWithRef, ElementType, forwardRef, ReactElement, ReactNode, Ref } from 'react'

export type ViewProps<T extends ElementType<any>> = ComponentVariants<typeof ViewStyles> & {
    component?:T
    children?:ReactNode
    css?:CSSObject
} & ComponentPropsWithRef<T>

export const ViewCP = forwardRef<any, ViewProps<any>>((viewProps:ViewProps<any>, ref) => {
  const { responsiveVariants = {}, variants = [], component: Component = 'div', children,   ...props } = viewProps
  const variantStyles = useComponentStyle('View', {
    responsiveVariants,
    variants,
  })
 


 
  return <Component  css={variantStyles.wrapper} {...props} ref={ref}> 
    {children}
  </Component>
})  

export const View = ViewCP as <T extends ElementType, P extends  ViewProps<T> = ViewProps<T>>(props:P) => ReactElement
