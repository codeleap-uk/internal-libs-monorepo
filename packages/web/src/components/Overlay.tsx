import { ComponentVariants, OverlayComposition, OverlayStyles, StylesOf, useComponentStyle } from '@codeleap/common'
import { ComponentPropsWithoutRef } from 'react'
import { View } from './View'

export type OverlayProps = {
  visible?:boolean
  styles?: StylesOf<OverlayComposition>
} & ComponentVariants<typeof OverlayStyles> & ComponentPropsWithoutRef<'div'>

export const Overlay:React.FC<OverlayProps> = (overlayProps) => {
  const {responsiveVariants, variants, styles, ...props} = overlayProps
  const variantStyles = useComponentStyle('Overlay', {
    variants, responsiveVariants, styles,
  })
  return <View {...props} css={variantStyles.wrapper}/>
}
