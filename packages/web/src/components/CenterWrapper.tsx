import React from 'react'
import { View } from './View'
import { StylesOf } from '../types/utility'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  CenterWrapperComposition,
  CenterWrapperStyles,
} from '@codeleap/common'

export type CenterWrapperProps = {
  styles?: StylesOf<CenterWrapperComposition>;
} & ComponentVariants<typeof CenterWrapperStyles>;

export const CenterWrapper: React.FC<CenterWrapperProps> = (props) => {
  const {
    styles: propStyles = {},
    children,
    variants,
    styles,
    responsiveVariants,
  } = props

  const variantStyles = useDefaultComponentStyle('CenterWrapper', {
    variants,
    styles,
    responsiveVariants,
  })

  return (
    <View css={[variantStyles.wrapper, propStyles.wrapper]}>
      <View css={[variantStyles.innerWrapper, propStyles.innerWrapper]}>
        {children}
      </View>
    </View>
  )
}
