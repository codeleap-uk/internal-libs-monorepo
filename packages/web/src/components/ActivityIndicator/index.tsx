import { View } from '../View'
import { CSSObject, keyframes } from '@emotion/react'
import {
  useDefaultComponentStyle,
  ComponentVariants,
  ActivityIndicatorStyles,
  ActivityIndicatorComposition,
  TypeGuards,
} from '@codeleap/common'
import { StylesOf } from '../../types/utility'
import { ActivityIndicatorPresets } from './styles'

export * from './styles'

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to { 
    transform: rotate(360deg);
  }
`

export type ActivityIndicatorProps = {
  animating?: boolean
  hidesWhenStopped?: boolean
  styles?: StylesOf<ActivityIndicatorComposition>
  css?: CSSObject
  size?: number
  style: React.CSSProperties
} & ComponentVariants<typeof ActivityIndicatorStyles>

export const ActivityIndicator: React.FC<ActivityIndicatorProps> = (props) => {
  const {
    animating = true,
    hidesWhenStopped = true,
    variants,
    responsiveVariants,
    styles,
    size = null,
    style,
    ...viewProps
  } = props

  const variantStyles = useDefaultComponentStyle<'u:ActivityIndicator', typeof ActivityIndicatorPresets>(
    'u:ActivityIndicator',
    {
      styles,
      responsiveVariants,
      variants,
    }
  )

  const _size = TypeGuards.isNumber(size) && {
    height: size,
    width: size,
    borderWidth: size * 0.25,
  }

  return (
    <View
      {...viewProps}
      css={[
        variantStyles.wrapper,
        style,
        (!animating && hidesWhenStopped) && { visibility: 'hidden' },
        _size,
      ]}
    >
      <View css={{ ...variantStyles.circle, ...variantStyles.backCircle }} />
      <View
        css={{
          ...variantStyles.circle,
          ...variantStyles.frontCircle,
          animation: `${spin} 1s infinite`,
          animationPlayState: animating ? 'running' : 'paused',
        }}
      />
    </View>
  )
}
