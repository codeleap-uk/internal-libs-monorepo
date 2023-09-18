import React from 'react'
import { View } from '@/components'
import { ComponentVariants, useDefaultComponentStyle } from '@codeleap/common'
import { StylesOf, ViewProps } from '@codeleap/web'
import { CenterWrapperStyles, CenterWrapperComposition } from '../app/stylesheets/CenterWrapper'

export type CenterWrapperProps = React.PropsWithChildren<{
  styles?: StylesOf<CenterWrapperComposition>
  innerProps?: ViewProps<'div'>
} & ComponentVariants<typeof CenterWrapperStyles>>

export const CenterWrapper = (props: CenterWrapperProps) => {
  const {
    children,
    variants = [],
    styles = {},
    responsiveVariants = {},
    innerProps = {},
  } = props

  const variantStyles = useDefaultComponentStyle<'u:CenterWrapper', typeof CenterWrapperStyles>('u:CenterWrapper', {
    variants,
    styles,
    responsiveVariants,
  })

  return (
    <View css={[variantStyles.wrapper]} {...props}>
      <View css={[variantStyles.innerWrapper]} {...innerProps}>
        {children}
      </View>
    </View>
  )
}
