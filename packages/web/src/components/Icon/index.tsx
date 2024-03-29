/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/react'
import { CSSInterpolation } from '@emotion/css'
import {
  ComponentVariants,
  IconPlaceholder,
  IconStyles,
  useDefaultComponentStyle,
  useCodeleapContext,
} from '@codeleap/common'
import { View } from '../View'
import { ComponentCommonProps } from '../../types'

export * from './styles'

export type IconProps = ComponentCommonProps & {
  name: IconPlaceholder
  style?: React.CSSProperties
  size?: string | number
  color?: string
  renderEmptySpace?: boolean
  forceStyle?: CSSObject | CSSInterpolation | React.CSSProperties
  css?: CSSInterpolation | CSSInterpolation[]
} & ComponentVariants<typeof IconStyles>

const IconCP = ({ name, style, variants, renderEmptySpace, ...otherProps }:IconProps) => {
  const { Theme, logger } = useCodeleapContext()
  const Component = Theme?.icons?.[name]

  const variantStyles = useDefaultComponentStyle('Icon', {
    variants,
    styles: {
      icon: style,
    },
    rootElement: 'icon',
  })

  if (!name) {
    const iconStyle = variantStyles.icon
    return renderEmptySpace ? <View css={{
      height: iconStyle.size ?? iconStyle.height,
      width: iconStyle.size ?? iconStyle.width,
    }}/> : null
  }

  if (!Component) {
    logger.warn(
      `Icon: No icon found in theme for name "${name}".`,
      { props: { style, name, variants, variantStyles }},
      'Component',
    )
    return null
  }
  return <Component style={variantStyles.icon} {...otherProps}/>
}

export const Icon = IconCP as ((props: IconProps) => jsx.JSX.Element)
